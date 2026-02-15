function parseJobDescription(rawText, sourceUrl) {
  const validation = validateJobInput(rawText);
  if (!validation.valid) {
    return {
      ok: false,
      reason: validation.reason,
      jobData: null,
      warnings: []
    };
  }

  const sanitized = sanitizeInput(rawText);
  const metadata = extractMetadata(sanitized);
  metadata.language = detectLanguage(sanitized);

  const jobData = createJobData(sanitized, metadata, sourceUrl);

  return {
    ok: true,
    reason: "ok",
    jobData: jobData,
    warnings: []
  };
}

function detectLanguage(text) {
  if (!LanguageApp || typeof LanguageApp.detectLanguage !== "function") {
    return "pt-BR";
  }

  try {
    const detected = LanguageApp.detectLanguage(text || "");
    if (CONSTANTS.SUPPORTED_LANGUAGES.indexOf(detected) >= 0) {
      return detected;
    }
  } catch (error) {
    logWarn("language_detect_failed", { message: String(error) });
  }

  return "pt-BR";
}

function extractMetadata(text) {
  const meta = {
    company: extractField(text, ["Empresa", "Company"]) || "",
    position: extractField(text, ["Cargo", "Position", "Role"]) || "",
    location: extractField(text, ["Local", "Location"]) || "",
    seniority: extractField(text, ["Senioridade", "Seniority", "Level"]) || "",
    employmentType: extractField(text, ["Tipo", "Employment", "Contract"]) || "",
    requiredSkills: [],
    niceToHave: [],
    atsDetected: false,
    salaryMin: null,
    salaryMax: null
  };

  return meta;
}

function extractField(text, labels) {
  if (!text) {
    return "";
  }

  for (let i = 0; i < labels.length; i += 1) {
    const label = labels[i];
    const regex = new RegExp(label + "\\s*[:\-]\\s*(.+)", "i");
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].split("\n")[0].trim();
    }
  }

  return "";
}
