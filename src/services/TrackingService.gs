function trackApplication(config, jobData, cvData) {
  const sheet = openTrackingSheet(config.trackingSheetId);
  const entry = createTrackingEntry(jobData, cvData);
  appendTrackingRow(sheet, entry);
  return entry;
}

function openTrackingSheet(sheetId) {
  const file = SpreadsheetApp.openById(sheetId);
  return file.getSheets()[0];
}

function appendTrackingRow(sheet, entry) {
  const row = [
    entry.applicationDate,
    entry.company,
    entry.position,
    entry.matchScore,
    entry.status,
    entry.cvId,
    entry.jobId
  ];

  sheet.appendRow(row);
}
