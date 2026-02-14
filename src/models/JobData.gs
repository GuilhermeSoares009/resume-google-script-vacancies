function createJobData(rawText, metadata, sourceUrl) {
  const meta = metadata || {};
  return {
    id: Utilities.getUuid(),
    rawText: rawText || "",
    metadata: {
      company: meta.company || "",
      position: meta.position || "",
      location: meta.location || "",
      seniority: meta.seniority || "",
      employmentType: meta.employmentType || "",
      language: meta.language || "",
      requiredSkills: meta.requiredSkills || [],
      niceToHave: meta.niceToHave || [],
      atsDetected: Boolean(meta.atsDetected),
      salaryMin: meta.salaryMin || null,
      salaryMax: meta.salaryMax || null
    },
    sourceUrl: sourceUrl || "",
    createdAt: new Date().toISOString()
  };
}
