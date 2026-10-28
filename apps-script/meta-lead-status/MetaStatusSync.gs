/***********************************************************************
 * RED CARPET TOURS – META LEAD STATUS SYNC
 * (Marketing Leads › All Leads  →  leisure leads meta ads  →  Meta CAPI)
 *
 * Add this as a NEW file "MetaStatusSync.gs" in the Apps Script project of
 * the "leisure leads meta ads" spreadsheet (the project that already has
 * the META ADS LEADS → MASTER LEADS code). It re-uses helpers from that
 * file: META_MASTER, normalizeIndianPhone_, getMetaSourceColumns_.
 *
 * FLOW
 *   Employee sheet "Leads" tab (Lead Status + Feedback / Remarks)
 *     → leads.gs live sync (mailer project) → All Leads
 *     → THIS FILE, every 15 minutes:
 *         1) Master Leads: Lead Status | Feedback Remark | Sales Person
 *         2) Every Meta form tab: lead_status + rc_remark + rc_sales_person
 *         3) Meta Conversions API: Qualified / Unqualified / Converted
 *
 * The lead is matched by the last 10 digits of its phone number.
 * Each Meta stage is sent only ONCE per Meta lead ("Meta Stages Sent").
 *
 * SCRIPT PROPERTIES (Project Settings → Script Properties)
 *   META_DATASET_ID        Dataset (pixel) ID from Events Manager
 *   META_ACCESS_TOKEN      Conversions API access token of that dataset
 *   META_TEST_EVENT_CODE   Optional. While set, events go to Events Manager
 *                          → Test events only and are NOT marked as sent.
 *
 * RUN
 *   previewMetaStatusSync()   read-only check, writes nothing, sends nothing
 *   setupMetaStatusSync()     once: adds columns + 15-minute trigger + first run
 *   syncMetaLeadStatusNow()   manual run (same as the trigger)
 *   stopMetaStatusSync()      removes the trigger
 ***********************************************************************/

const MSS = {
  MARKETING_ID: "1QjKyTNqDB2ywD_9KHxSgyGuHconPLjQVHTtb8_piWZA",
  ALL_LEADS_SHEET: "All Leads",

  GRAPH_VERSION: "v24.0",
  HANDLER: "syncMetaLeadStatusNow",
  EVERY_MINUTES: 15,
  MAX_RUN_MS: 270000,
  CAPI_BATCH: 200,
  TEST_MODE_MAX_EVENTS: 5,

  // Meta rejects events older than 7 days, so older status changes are
  // sent with the current time.
  MAX_EVENT_AGE_DAYS: 6,

  // Master Leads block owned by this file. P/Q hold the refresh control,
  // so the block starts at R.
  MASTER_FIRST_COL: 18,
  MASTER_HEADERS: [
    "Lead Status",
    "Feedback Remark",
    "Sales Person",
    "Status Synced At",
    "Meta Stages Sent",
    "Meta Sync Note"
  ],

  // Added at the end of every Meta form tab. The "rc_" prefix keeps them
  // out of the Notes column (see the buildMetaSalesNotes_ patch).
  FORM_REMARK_HEADER: "rc_remark",
  FORM_AGENT_HEADER: "rc_sales_person",
  FORM_STATUS_HEADER: "lead_status",

  LEAD_EVENT_SOURCE: "RC Trips Lead Sheets"
};

/*
 * Lead Status (employee dropdown or free text) → Meta stage.
 * Checked top to bottom; the first rule with a matching word wins.
 * "unqualified" / "not interested" are checked before "qualified" /
 * "interested" on purpose. Statuses that match nothing (Not Contacted,
 * Contacted, Follow-up, No Response) send no Meta event.
 */
const MSS_STAGE_RULES = [
  {
    stage: "Converted",
    words: ["converted", "booked", "booking done", "booking confirmed"]
  },
  {
    stage: "Unqualified",
    words: [
      "unqualified", "not interested", "not intrested", "cancel",
      "junk", "fake", "wrong number", "invalid", "not reachable"
    ]
  },
  {
    stage: "Qualified",
    words: ["qualified", "interested", "intrested", "quotation shared"]
  }
];

// Master Leads data columns (0-based) from META_MASTER.HEADERS.
const MSS_M = { DATE: 0, CONTACT: 3, EMAIL: 4, SOURCE: 9, META_ID: 10 };
// Positions inside the owned block.
const MSS_B = { STATUS: 0, REMARK: 1, AGENT: 2, SYNCED: 3, SENT: 4, NOTE: 5 };


/***********************************************************************
 * SETUP / CONTROLS
 ***********************************************************************/

function setupMetaStatusSync() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  mssMasterBlock_(ss.getSheetByName(META_MASTER.MASTER_SHEET), true);

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === MSS.HANDLER) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger(MSS.HANDLER).timeBased().everyMinutes(MSS.EVERY_MINUTES).create();

  Logger.log("Meta status sync installed. Runs every " + MSS.EVERY_MINUTES + " minutes.");
  syncMetaLeadStatusNow();
}

function stopMetaStatusSync() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === MSS.HANDLER) ScriptApp.deleteTrigger(t);
  });
  Logger.log("Meta status sync trigger removed.");
}

function previewMetaStatusSync() {
  return mssRun_(true);
}

function syncMetaLeadStatusNow() {
  return mssRun_(false);
}


/***********************************************************************
 * MAIN RUN
 ***********************************************************************/

function mssRun_(dryRun) {
  // Document lock: the Meta import (syncMetaLeadsNow) uses the script lock,
  // so the two jobs never block each other.
  const lock = LockService.getDocumentLock();
  if (!lock.tryLock(5000)) {
    Logger.log("Meta status sync is already running.");
    return null;
  }

  const started = Date.now();

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const master = ss.getSheetByName(META_MASTER.MASTER_SHEET);
    if (!master) throw new Error('Sheet "' + META_MASTER.MASTER_SHEET + '" not found.');

    const statuses = mssReadAllLeadStatuses_();
    const lastRow = master.getLastRow();
    const n = lastRow - 1;
    if (n < 1) return null;

    const firstCol = mssMasterBlock_(master, !dryRun);
    const base = master.getRange(2, 1, n, META_MASTER.HEADERS.length).getValues();
    const block = firstCol
      ? master.getRange(2, firstCol, n, MSS.MASTER_HEADERS.length).getValues()
      : base.map(function () { return ["", "", "", "", "", ""]; });

    const stats = {
      masterRows: n, matched: 0, changed: 0, withStage: 0,
      stageCounts: {}, events: 0, sent: 0, failed: 0
    };
    const formUpdates = {};
    const events = [];
    const now = new Date();

    base.forEach(function (r, i) {
      const phone = normalizeIndianPhone_(r[MSS_M.CONTACT]);
      const rec = phone ? statuses[phone] : null;
      if (!rec) return;
      stats.matched++;

      const b = block[i];
      if (
        String(b[MSS_B.STATUS]) !== rec.status ||
        String(b[MSS_B.REMARK]) !== rec.remark ||
        String(b[MSS_B.AGENT]) !== rec.agent
      ) {
        b[MSS_B.STATUS] = rec.status;
        b[MSS_B.REMARK] = rec.remark;
        b[MSS_B.AGENT] = rec.agent;
        b[MSS_B.SYNCED] = now;
        stats.changed++;
      }

      const metaId = mssLeadId_(r[MSS_M.META_ID]);
      const source = String(r[MSS_M.SOURCE] || "").trim();
      if (metaId && source) {
        formUpdates[source] = formUpdates[source] || {};
        formUpdates[source][metaId] = rec;
      }

      const stage = mssStage_(rec.status);
      if (!stage) return;
      stats.withStage++;
      stats.stageCounts[stage] = (stats.stageCounts[stage] || 0) + 1;

      if (!metaId) {
        b[MSS_B.NOTE] = "No Meta Lead ID – stage not sent";
        return;
      }
      const sent = String(b[MSS_B.SENT] || "").split("|").filter(Boolean);
      if (sent.indexOf(stage) !== -1) return;

      events.push({
        i: i,
        stage: stage,
        metaId: metaId,
        phone: phone,
        email: String(r[MSS_M.EMAIL] || "").trim().toLowerCase(),
        time: mssEventTime_(rec.updated)
      });
    });

    stats.events = events.length;

    if (dryRun) {
      Logger.log(
        "PREVIEW | All Leads phones with status: " + Object.keys(statuses).length +
        " | Master rows: " + stats.masterRows +
        " | Matched: " + stats.matched +
        " | Would update: " + stats.changed +
        " | With a Meta stage: " + stats.withStage + " " + JSON.stringify(stats.stageCounts) +
        " | Meta events waiting: " + stats.events +
        " | Form tabs touched: " + Object.keys(formUpdates).length
      );
      return stats;
    }

    // 1) Meta Conversions API
    mssSendEvents_(events, started);
    events.forEach(function (e) {
      const b = block[e.i];
      if (e.ok) {
        const sent = String(b[MSS_B.SENT] || "").split("|").filter(Boolean);
        if (sent.indexOf(e.stage) === -1) sent.push(e.stage);
        b[MSS_B.SENT] = sent.join("|");
        stats.sent++;
      } else if (e.note && !e.test) {
        stats.failed++;
      }
      if (e.note) b[MSS_B.NOTE] = e.note;
    });

    // 2) Master Leads block — only when no row moved while we were working.
    const idsNow = master.getRange(2, META_MASTER.HEADERS.length - 4, n, 1).getValues();
    const shifted = idsNow.some(function (r, i) {
      return String(r[0]) !== String(base[i][MSS_M.META_ID]);
    });
    if (shifted) {
      Logger.log("Master Leads rows moved during the run (sort/insert). Writing skipped; next run retries.");
    } else {
      master.getRange(2, firstCol, n, MSS.MASTER_HEADERS.length).setValues(block);
      master.getRange(2, firstCol + MSS_B.SYNCED, n, 1).setNumberFormat("dd-mmm-yyyy hh:mm AM/PM");
    }

    // 3) Meta form tabs
    let formRows = 0;
    Object.keys(formUpdates).forEach(function (name) {
      if (Date.now() - started > MSS.MAX_RUN_MS) return;
      try {
        formRows += mssWriteFormTab_(ss.getSheetByName(name), formUpdates[name]);
      } catch (err) {
        console.error("Form tab " + name + " failed: " + err.message);
      }
    });

    SpreadsheetApp.flush();
    Logger.log(
      "META STATUS SYNC | Matched: " + stats.matched +
      " | Master rows updated: " + (shifted ? 0 : stats.changed) +
      " | Form tab rows updated: " + formRows +
      " | Meta events: " + stats.events +
      " | Sent: " + stats.sent +
      " | Failed: " + stats.failed
    );
    return stats;

  } finally {
    lock.releaseLock();
  }
}


/***********************************************************************
 * ALL LEADS (Marketing Leads) → status by phone
 ***********************************************************************/

function mssReadAllLeadStatuses_() {
  const sheet = SpreadsheetApp.openById(MSS.MARKETING_ID).getSheetByName(MSS.ALL_LEADS_SHEET);
  if (!sheet) throw new Error('Sheet "' + MSS.ALL_LEADS_SHEET + '" not found in Marketing Leads.');

  const values = sheet.getDataRange().getValues();
  const head = values[0].map(mssNorm_);
  const find = function (name) { return head.indexOf(mssNorm_(name)); };
  const c = {
    contact: find("Contact"),
    status: find("Lead Status"),
    remark: find("Feedback Remark"),
    agent: find("Sales Agent"),
    updated: find("Feedback Updated At")
  };
  if (c.contact < 0 || c.status < 0) {
    throw new Error('All Leads needs "Contact" and "Lead Status" columns.');
  }

  // One record per phone. When the same phone appears more than once,
  // the most recently updated status wins.
  const byPhone = {};
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const phone = normalizeIndianPhone_(row[c.contact]);
    const status = mssClean_(row[c.status]);
    const remark = c.remark < 0 ? "" : mssClean_(row[c.remark]);
    if (!phone || (!status && !remark)) continue;

    const updatedRaw = c.updated < 0 ? null : row[c.updated];
    const rec = {
      status: status,
      remark: remark,
      agent: c.agent < 0 ? "" : mssClean_(row[c.agent]),
      updated: updatedRaw instanceof Date && !isNaN(updatedRaw.getTime()) ? updatedRaw : null,
      row: i
    };

    const prev = byPhone[phone];
    const recTime = rec.updated ? rec.updated.getTime() : 0;
    const prevTime = prev && prev.updated ? prev.updated.getTime() : 0;
    if (!prev || recTime > prevTime || (recTime === prevTime && (rec.status || !prev.status))) {
      byPhone[phone] = rec;
    }
  }
  return byPhone;
}


/***********************************************************************
 * MASTER LEADS BLOCK
 ***********************************************************************/

function mssMasterBlock_(sheet, create) {
  if (!sheet) throw new Error('Sheet "' + META_MASTER.MASTER_SHEET + '" not found.');

  const width = MSS.MASTER_HEADERS.length;
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const head = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0].map(mssNorm_);
  let first = head.indexOf(mssNorm_(MSS.MASTER_HEADERS[0])) + 1;

  if (first) {
    const actual = sheet.getRange(1, first, 1, width).getDisplayValues()[0].map(mssNorm_);
    const expected = MSS.MASTER_HEADERS.map(mssNorm_);
    if (actual.join("|") !== expected.join("|")) {
      throw new Error("Master Leads columns from " + first + " are not " + MSS.MASTER_HEADERS.join(", ") + ".");
    }
    return first;
  }
  if (!create) return 0;

  first = Math.max(MSS.MASTER_FIRST_COL, sheet.getLastColumn() + 1);
  const needed = first + width - 1;
  if (sheet.getMaxColumns() < needed) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), needed - sheet.getMaxColumns());
  }
  sheet.getRange(1, first, 1, width)
    .setValues([MSS.MASTER_HEADERS])
    .setBackground("#217346").setFontColor("#ffffff")
    .setFontWeight("bold").setHorizontalAlignment("center").setWrap(true);
  [160, 300, 170, 170, 170, 260].forEach(function (w, k) {
    sheet.setColumnWidth(first + k, w);
  });
  Logger.log("Master Leads | Status columns added from column " + first + ".");
  return first;
}


/***********************************************************************
 * META FORM TABS
 ***********************************************************************/

function mssWriteFormTab_(sheet, updates) {
  if (!sheet || sheet.getLastRow() < 2) return 0;

  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  const cols = getMetaSourceColumns_(headers);
  if (!cols.ID) return 0;

  const statusCol = cols.LEAD_STATUS || mssEnsureHeader_(sheet, MSS.FORM_STATUS_HEADER);
  const remarkCol = mssEnsureHeader_(sheet, MSS.FORM_REMARK_HEADER);
  const agentCol = mssEnsureHeader_(sheet, MSS.FORM_AGENT_HEADER);

  const n = sheet.getLastRow() - 1;
  const ids = sheet.getRange(2, cols.ID, n, 1).getDisplayValues();
  const status = sheet.getRange(2, statusCol, n, 1).getValues();
  const remark = sheet.getRange(2, remarkCol, n, 1).getValues();
  const agent = sheet.getRange(2, agentCol, n, 1).getValues();

  let changed = 0;
  ids.forEach(function (r, i) {
    const rec = updates[mssLeadId_(r[0])];
    if (!rec) return;
    // Keep Meta's original value (e.g. CREATED) until an employee sets a status.
    const newStatus = rec.status || String(status[i][0]);
    if (
      String(status[i][0]) === newStatus &&
      String(remark[i][0]) === rec.remark &&
      String(agent[i][0]) === rec.agent
    ) {
      return;
    }
    status[i][0] = newStatus;
    remark[i][0] = rec.remark;
    agent[i][0] = rec.agent;
    changed++;
  });

  if (changed) {
    sheet.getRange(2, statusCol, n, 1).setValues(status);
    sheet.getRange(2, remarkCol, n, 1).setValues(remark);
    sheet.getRange(2, agentCol, n, 1).setValues(agent);
  }
  return changed;
}

function mssEnsureHeader_(sheet, header) {
  const lastCol = sheet.getLastColumn();
  const head = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0].map(mssNorm_);
  const pos = head.indexOf(mssNorm_(header));
  if (pos !== -1) return pos + 1;

  const col = lastCol + 1;
  if (sheet.getMaxColumns() < col) sheet.insertColumnsAfter(sheet.getMaxColumns(), 1);
  sheet.getRange(1, col).setValue(header);
  return col;
}


/***********************************************************************
 * META CONVERSIONS API
 ***********************************************************************/

function mssSendEvents_(events, started) {
  if (!events.length) return;

  const props = PropertiesService.getScriptProperties();
  const dataset = String(props.getProperty("META_DATASET_ID") || "").trim();
  const token = String(props.getProperty("META_ACCESS_TOKEN") || "").trim();
  const testCode = String(props.getProperty("META_TEST_EVENT_CODE") || "").trim();

  if (!dataset || !token) {
    Logger.log("META_DATASET_ID / META_ACCESS_TOKEN not set – " + events.length + " Meta event(s) waiting.");
    events.forEach(function (e) { e.note = "Waiting: Meta dataset/token not set"; });
    return;
  }

  const list = testCode ? events.slice(0, MSS.TEST_MODE_MAX_EVENTS) : events;

  for (let k = 0; k < list.length; k += MSS.CAPI_BATCH) {
    if (Date.now() - started > MSS.MAX_RUN_MS) break;
    const batch = list.slice(k, k + MSS.CAPI_BATCH);
    const result = mssPost_(dataset, token, testCode, batch);

    if (result.ok) {
      mssMarkResult_(batch, true, testCode, "");
      continue;
    }

    // One bad lead can fail the whole batch, so retry one by one.
    batch.forEach(function (e) {
      if (Date.now() - started > MSS.MAX_RUN_MS) return;
      const single = mssPost_(dataset, token, testCode, [e]);
      mssMarkResult_([e], single.ok, testCode, single.error);
    });
  }
}

function mssMarkResult_(batch, ok, testCode, error) {
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd-MMM-yyyy HH:mm");
  batch.forEach(function (e) {
    if (ok && testCode) {
      // Test events are not real; keep them unsent so the real send happens later.
      e.test = true;
      e.note = "TEST OK " + e.stage + " " + stamp;
    } else if (ok) {
      e.ok = true;
      e.note = "Sent " + e.stage + " " + stamp;
    } else {
      e.note = "Meta error " + stamp + ": " + String(error || "").slice(0, 200);
    }
  });
}

function mssPost_(dataset, token, testCode, batch) {
  const body = {
    data: batch.map(function (e) {
      const userData = {
        // Meta lead IDs are longer than JavaScript can hold as a number,
        // so a placeholder is swapped for the raw digits below.
        lead_id: "__LEADID_" + e.metaId + "__",
        ph: [mssSha256_("91" + e.phone)]
      };
      if (e.email && e.email.indexOf("@") > 0) userData.em = [mssSha256_(e.email)];
      return {
        event_name: e.stage,
        event_time: e.time,
        action_source: "system_generated",
        user_data: userData,
        custom_data: {
          event_source: "crm",
          lead_event_source: MSS.LEAD_EVENT_SOURCE
        }
      };
    })
  };
  if (testCode) body.test_event_code = testCode;

  const payload = JSON.stringify(body).replace(/"__LEADID_(\d+)__"/g, "$1");
  const url = "https://graph.facebook.com/" + MSS.GRAPH_VERSION + "/" +
    encodeURIComponent(dataset) + "/events?access_token=" + encodeURIComponent(token);

  try {
    const response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: payload,
      muteHttpExceptions: true
    });
    const code = response.getResponseCode();
    if (code === 200) return { ok: true };

    let message = response.getContentText();
    try {
      const err = JSON.parse(message).error || {};
      message = (err.error_user_msg || err.message || message);
    } catch (ignore) {}
    return { ok: false, error: "HTTP " + code + " " + message };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}


/***********************************************************************
 * HELPERS
 ***********************************************************************/

function mssStage_(status) {
  const text = mssNorm_(status);
  if (!text) return "";
  for (let r = 0; r < MSS_STAGE_RULES.length; r++) {
    const rule = MSS_STAGE_RULES[r];
    for (let w = 0; w < rule.words.length; w++) {
      if (text.indexOf(mssNorm_(rule.words[w])) !== -1) return rule.stage;
    }
  }
  return "";
}

function mssEventTime_(updated) {
  const now = Math.floor(Date.now() / 1000);
  if (!updated) return now;
  const t = Math.floor(updated.getTime() / 1000);
  if (t > now || now - t > MSS.MAX_EVENT_AGE_DAYS * 86400) return now;
  return t;
}

// "l:1234567890123456" → "1234567890123456"
function mssLeadId_(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 8 ? digits : "";
}

// Removes checkbox leftovers (TRUE / FALSE) and trims text.
function mssClean_(value) {
  if (value === true || value === false) return "";
  const text = String(value == null ? "" : value).trim();
  return /^(true|false)$/i.test(text) ? "" : text;
}

function mssNorm_(value) {
  return String(value == null ? "" : value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function mssSha256_(text) {
  return Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(text).trim().toLowerCase(),
    Utilities.Charset.UTF_8
  ).map(function (b) {
    return ("0" + ((b + 256) % 256).toString(16)).slice(-2);
  }).join("");
}
