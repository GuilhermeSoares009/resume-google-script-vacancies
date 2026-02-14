function validateJobInput(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { valid: false, reason: "missing_text" };
  }

  const trimmed = rawText.trim();
  if (trimmed.length < 100) {
    return { valid: false, reason: "too_short" };
  }

  if (trimmed.length > CONSTANTS.MAX_JOB_TEXT_LENGTH) {
    return { valid: false, reason: "too_long" };
  }

  return { valid: true, reason: "ok" };
}

function sanitizeInput(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return "";
  }

  let text = rawText;
  text = text.replace(/<script[^>]*>.*?<\/script>/gi, "");
  text = text.replace(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi, "[EMAIL]");
  text = text.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "[PHONE]");

  if (text.length > CONSTANTS.MAX_JOB_TEXT_LENGTH) {
    text = text.substring(0, CONSTANTS.MAX_JOB_TEXT_LENGTH);
  }

  return text.trim();
}
