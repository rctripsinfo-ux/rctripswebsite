/***********************************************************************
 * LEAD SYNC HOOKS  (mailer project – add as the LAST file, after leads.gs)
 *
 * Apps Script uses the last definition of a function name, so this file
 * routes the old WeeklyFeedback / FeedbackSync entry points to leads.gs.
 * Without it, the CRM "SENT" hook and the weekly email still write the
 * old V10 "Lead Key" rows into the rebuilt "Leads" tab.
 ***********************************************************************/

// Employee "Lead Status" dropdown, with the Meta stages added.
LS.STATUS_OPTIONS = [
  "Not Contacted", "Contacted", "No Response", "Follow-up", "Interested",
  "Qualified", "Quotation Shared", "Unqualified", "Not Interested", "Converted"
];

// CRM.gs calls this right after a lead is SENT.
function syncWlfLeadRowRealtime_(row) {
  return lsSyncMasterRow_(row, true);
}

// Weekly feedback email: leads are already in the employee sheet.
function createWlfOnlineFeedbackExcel_(salesperson) {
  return lsGetWorkbookForWeeklyEmail_(salesperson);
}

function getWlfPermanentFeedbackFileFast_(salesperson) {
  try {
    const book = lsGetWorkbookForWeeklyEmail_(salesperson);
    return { id: book.id, url: book.url };
  } catch (err) {
    console.error("Workbook lookup failed for " + salesperson + ": " + err.message);
    return null;
  }
}

function addWlfLatestAttachmentV9_(mail, salesperson) {
  const book = lsGetWorkbookForWeeklyEmail_(salesperson);
  mail.attachments = [getWlfLatestWorkbookAttachmentV9_(book.id, salesperson)];
  return mail;
}

// leads.gs owns the employee sheets now.
function upsertWlfLiveLeadV9_(lead) {
  return false;
}

// Old pollers: no-ops in case one of their triggers is still installed.
function syncRecentSentLeadsV10_() {}
function syncAllSentLeadsToEmployeeSheetsV9_() {}
function runFeedbackSyncPoll() {}
function autoRepairWlfFeedbackWorkbooks_() {}


/***********************************************************************
 * One-time cleanup: All Leads rows 2.. have TRUE/FALSE checkbox leftovers
 * in the Lead Sync columns. A "FALSE" Lead ID blocks step1 from giving the
 * row a real RCT- ID. Run before step1_PrepareMaster().
 ***********************************************************************/
function step1b_ClearCheckboxLeftovers() {
  const lock = lsLock_();
  if (!lock.tryLock(30000)) throw new Error("Another Lead Sync step is still running.");

  try {
    const sheet = lsMaster_().getSheetByName(LS.LEADS_SHEET);
    const map = lsMasterCols_(sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]);
    const n = sheet.getLastRow() - 1;
    if (n < 1) return;

    let cleared = 0;
    Object.keys(LS.H).forEach(function (key) {
      const range = sheet.getRange(2, map[key], n, 1);
      const values = range.getValues();
      let changed = false;
      values.forEach(function (r) {
        if (r[0] === true || r[0] === false) {
          r[0] = "";
          cleared++;
          changed = true;
        }
      });
      if (changed) range.setValues(values);
    });

    Logger.log("CHECKBOX LEFTOVERS CLEARED | Cells: " + cleared + " | Now run step1_PrepareMaster().");
  } finally {
    lock.releaseLock();
  }
}
