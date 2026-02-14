function getConfig() {
  return {
    geminiApiKey: getRequiredProperty("GEMINI_API_KEY"),
    geminiModel: getOptionalProperty("GEMINI_MODEL", "gemini-1.5-pro-latest"),
    geminiMaxTokens: Number(getOptionalProperty("GEMINI_MAX_TOKENS", "8000")),
    geminiTemperature: Number(getOptionalProperty("GEMINI_TEMPERATURE", "0.3")),
    templateFileId: getRequiredProperty("TEMPLATE_FILE_ID"),
    outputFolderId: getRequiredProperty("OUTPUT_FOLDER_ID"),
    baseResumeText: getOptionalProperty("BASE_RESUME_TEXT", "")
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
