function onFormSubmit(e) {
  const formData = normalizeFormData(e);
  Logger.log(JSON.stringify({
    hasEvent: Boolean(e),
    hasNamedValues: Boolean(e && e.namedValues),
    hasResponse: Boolean(e && e.response),
    formData: formData
  }));
  return processJobApplication(formData);
}

function normalizeFormData(e) {
  if (e && e.namedValues) {
    return e.namedValues;
  }

  if (e && e.response && typeof e.response.getItemResponses === "function") {
    const responses = e.response.getItemResponses();
    const mapped = {};
    for (let i = 0; i < responses.length; i += 1) {
      const item = responses[i].getItem();
      const title = item ? item.getTitle() : "";
      if (title) {
        mapped[title] = [String(responses[i].getResponse() || "")];
      }
    }
    return mapped;
  }

  return {};
}

function processJobApplication(formData) {
  try {
    Logger.log("process_job_application_start");
    const jobText = resolveJobText(formData);
    Logger.log("job_text_length:" + String(jobText || "").length);
    const sourceUrl = resolveField(formData, ["URL", "Link", "Source"]);
    const parseResult = parseJobDescription(jobText, sourceUrl);
    Logger.log("parse_result_ok:" + String(parseResult && parseResult.ok));
    if (parseResult && !parseResult.ok && parseResult.reason) {
      Logger.log("parse_result_reason:" + String(parseResult.reason));
    }

    if (!parseResult.ok) {
      return {
        status: "rejected",
        reason: parseResult.reason
      };
    }

    const config = getConfig();
    Logger.log("gemini_request_start");
    const rawGemini = generatePersonalization(parseResult.jobData, config.baseResumeText);
    Logger.log("gemini_request_done");
    Logger.log(JSON.stringify(rawGemini));
    let content = mapGeminiResponse(rawGemini);
    content = filterTemplateFieldsByJobText(content, parseResult.jobData.rawText || "");
    Logger.log(JSON.stringify(content));
    const warnings = [];

    if (content.matchScore < CONSTANTS.DEFAULT_MATCH_THRESHOLD) {
      warnings.push("low_match_score");
    }

    const cvMeta = {
      templateUsed: "default",
      company: parseResult.jobData.metadata.company,
      position: parseResult.jobData.metadata.position
    };

    const cvData = createPersonalizedCV(parseResult.jobData.id, content, cvMeta);
    const output = renderResume(cvData, config.templateFileId, config.outputFolderId);
    cvData.metadata.driveFileId = output.fileId;
    cvData.metadata.driveFileUrl = output.fileUrl;
    cvData.metadata.warnings = warnings;

    const result = {
      status: "ok",
      job_id: parseResult.jobData.id,
      cv_id: cvData.cvId,
      match_score: cvData.matchScore,
      output_url: output.fileUrl,
      review_required: true,
      warnings: warnings
    };

    notifySuccess(config, {
      company: parseResult.jobData.metadata.company,
      position: parseResult.jobData.metadata.position,
      outputUrl: output.fileUrl,
      matchScore: cvData.matchScore
    });

    trackApplication(config, parseResult.jobData, cvData);

    return result;
  } catch (error) {
    Logger.log(String(error && error.stack ? error.stack : error));
    return handleError(error, { action: "process_job_application" });
  }
}

function filterTemplateFieldsByJobText(content, jobText) {
  const text = String(jobText || "").toLowerCase();
  const updated = Object.assign({}, content);

  const fields = [
    "primaryBackendStack",
    "containerTech",
    "cloudStack",
    "testStack",
    "cacheTech",
    "secondaryBackendStack",
    "databaseStack",
    "frontendStack",
    "freelanceStack",
    "legacyBackendStack",
    "legacyDatabases",
    "techStackCommaSeparated"
  ];

  fields.forEach(function (field) {
    updated[field] = filterListByText(updated[field], text);
  });

  return updated;
}

function filterListByText(value, text) {
  if (!value) {
    return "";
  }

  const raw = Array.isArray(value) ? value.join(", ") : String(value);
  const parts = raw.split(",").map(function (item) {
    return item.trim();
  }).filter(function (item) {
    return item.length > 0;
  });

  const filtered = parts.filter(function (item) {
    const token = item.toLowerCase();
    const base = token.split(" ")[0];
    return text.indexOf(token) >= 0 || (base && text.indexOf(base) >= 0);
  });

  return filtered.join(", ");
}

function mapGeminiResponse(raw) {
  const response = raw || {};
  return {
    matchScore: Number(String(response.match_score || 0).replace("%", "")) || 0,
    professionalSummary: response.professional_summary || "",
    topSkills: Array.isArray(response.top_skills)
      ? response.top_skills
      : (response.top_skills && typeof response.top_skills === "object"
          ? Object.keys(response.top_skills).reduce(function (acc, key) {
              return acc.concat(response.top_skills[key] || []);
            }, [])
          : []),
    experiences: response.experiences || [],
    projects: response.projects || [],
    atsKeywords: response.ats_keywords || [],
    primaryBackendStack: response.primary_backend_stack || "",
    containerTech: response.container_tech || "",
    cloudStack: response.cloud_stack || "",
    testStack: response.test_stack || "",
    cacheTech: response.cache_tech || "",
    secondaryBackendStack: response.secondary_backend_stack || "",
    databaseStack: response.database_stack || "",
    frontendStack: response.frontend_stack || "",
    freelanceStack: response.freelance_stack || "",
    legacyBackendStack: response.legacy_backend_stack || "",
    legacyDatabases: response.legacy_databases || "",
    techStackCommaSeparated: response.tech_stack_comma_separated || ""
  };
}

function resolveJobText(formData) {
  if (!formData) {
    return "";
  }

  const keys = ["Job Description", "Descricao da vaga", "Descrição da vaga", "Vaga", "Job"];
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (formData[key] && formData[key][0]) {
      return String(formData[key][0]);
    }
  }

  return formData.jobDescription || formData.job_description || "";
}

function resolveField(formData, keys) {
  if (!formData) {
    return "";
  }

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (formData[key] && formData[key][0]) {
      return String(formData[key][0]);
    }
  }

  return "";
}
