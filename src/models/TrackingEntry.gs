function createTrackingEntry(jobData, cvData) {
  const job = jobData || {};
  const cv = cvData || {};
  return {
    trackingId: Utilities.getUuid(),
    jobId: job.id || "",
    cvId: cv.cvId || "",
    applicationDate: new Date().toISOString(),
    company: job.metadata && job.metadata.company ? job.metadata.company : "",
    position: job.metadata && job.metadata.position ? job.metadata.position : "",
    matchScore: Number(cv.matchScore || 0),
    status: "pending",
    statusUpdatedAt: new Date().toISOString(),
    responseReceived: "waiting",
    daysToResponse: null,
    feedback: {
      rejectionReason: "",
      interviewRounds: null,
      offerDetails: ""
    },
    notes: ""
  };
}
