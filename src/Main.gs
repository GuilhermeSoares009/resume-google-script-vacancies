function onFormSubmit(e) {
  const formData = e && e.namedValues ? e.namedValues : {};
  return processJobApplication(formData);
}

function processJobApplication(formData) {
  try {
    const jobText = resolveJobText(formData);
    const sourceUrl = resolveField(formData, ["URL", "Link", "Source"]);
    const parseResult = parseJobDescription(jobText, sourceUrl);

    if (!parseResult.ok) {
      return {
        status: "rejected",
        reason: parseResult.reason
      };
    }

    const config = getConfig();
    const rawGemini = generatePersonalization(parseResult.jobData, config.baseResumeText);
    const content = mapGeminiResponse(rawGemini);
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

    return {
      status: "ok",
      job_id: parseResult.jobData.id,
      cv_id: cvData.cvId,
      match_score: cvData.matchScore,
      output_url: output.fileUrl,
      review_required: true,
      warnings: warnings
    };
  } catch (error) {
    return handleError(error, { action: "process_job_application" });
  }
}

function mapGeminiResponse(raw) {
  const response = raw || {};
  return {
    matchScore: Number(response.match_score || 0),
    professionalSummary: response.professional_summary || "",
    topSkills: response.top_skills || [],
    experiences: response.experiences || [],
    projects: response.projects || [],
    atsKeywords: response.ats_keywords || []
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
