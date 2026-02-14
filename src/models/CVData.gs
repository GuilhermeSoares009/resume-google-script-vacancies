function createPersonalizedCV(jobId, content, metadata) {
  const meta = metadata || {};
  const body = content || {};
  return {
    jobId: jobId || "",
    cvId: Utilities.getUuid(),
    matchScore: Number(body.matchScore || 0),
    content: {
      professionalSummary: body.professionalSummary || "",
      topSkills: body.topSkills || [],
      experiences: body.experiences || [],
      projects: body.projects || [],
      atsKeywords: body.atsKeywords || []
    },
    metadata: {
      templateUsed: meta.templateUsed || "",
      processingTimeMs: Number(meta.processingTimeMs || 0),
      geminiModel: meta.geminiModel || "",
      tokensUsed: Number(meta.tokensUsed || 0),
      driveFileId: meta.driveFileId || "",
      driveFileUrl: meta.driveFileUrl || "",
      warnings: meta.warnings || []
    },
    createdAt: new Date().toISOString()
  };
}
