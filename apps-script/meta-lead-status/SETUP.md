# Meta Lead Status Sync – Setup

Flow: Employee "Leads" sheet → All Leads (leads.gs) → leisure leads meta ads (Master Leads + form tabs) → Meta Conversions API.

## A. mailer project (Marketing Leads)

1. New file `LeadSyncHooks.gs` (must be the last file in the list) – paste `LeadSyncHooks.gs`.
2. Run in order: `step1b_ClearCheckboxLeftovers` → `step1_PrepareMaster` → `step2_BuildSyncAudit` (wait for "AUDIT COMPLETE") → `step3_ApplyFeedbackToAllLeads` → `step4_VerifyNoLoss` (check "LS Needs Review") → `step5_RebuildEmployeeSheets` (wait for "REBUILD COMPLETE") → `step6_EnableLiveSync`.

## B. leisure leads meta ads project

1. New file `MetaStatusSync.gs` – paste `MetaStatusSync.gs`.
2. In the existing Meta Master file, inside `buildMetaSalesNotes_`, right after `const rawQuestion = ...;` add:
   ```js
   if (/^rc_/i.test(rawQuestion)) continue;
   ```
3. Project Settings → Script Properties: `META_DATASET_ID`, `META_ACCESS_TOKEN`, and for testing `META_TEST_EVENT_CODE`.
4. Run `previewMetaStatusSync` (read-only, check log) → `setupMetaStatusSync`.
5. Check Events Manager → Test events. When OK, delete `META_TEST_EVENT_CODE`.

## Status → Meta stage

| Lead Status | Meta event |
|---|---|
| Qualified, Interested, Quotation Shared | Qualified |
| Unqualified, Not Interested, anything with "cancel"/"junk"/"fake"/"wrong number" | Unqualified |
| Converted, Booked | Converted |
| Not Contacted, Contacted, Follow-up, No Response | nothing sent |

Edit `MSS_STAGE_RULES` to change this.
