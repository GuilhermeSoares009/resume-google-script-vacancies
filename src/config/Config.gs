function getConfig() {
  return {
    geminiApiKey: getRequiredProperty("GEMINI_API_KEY"),
    geminiModel: getOptionalProperty("GEMINI_MODEL", "gemini-2.5-flash"),
    geminiMaxTokens: Number(getOptionalProperty("GEMINI_MAX_TOKENS", "8000")),
    geminiTemperature: Number(getOptionalProperty("GEMINI_TEMPERATURE", "0.3")),
    templateFileId: getRequiredProperty("TEMPLATE_FILE_ID"),
    outputFolderId: getRequiredProperty("OUTPUT_FOLDER_ID"),
    baseResumeText: getOptionalProperty("BASE_RESUME_TEXT", ""),
    notificationEmail: getRequiredProperty("NOTIFICATION_EMAIL"),
    notifyOnSuccess: getOptionalProperty("NOTIFICATION_ON_SUCCESS", "true") === "true",
    trackingSheetId: getRequiredProperty("TRACKING_SHEET_ID")
  };
}

function getRequiredProperty(key) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) {
    throw new Error("Missing required property: " + key);
  }
  return value;
}

function getOptionalProperty(key, fallback) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  return value ? value : fallback;
}
