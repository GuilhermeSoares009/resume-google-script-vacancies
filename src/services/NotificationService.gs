function notifySuccess(config, result) {
  if (!config || !config.notifyOnSuccess) {
    return;
  }

  const subject = "Resume Ready: " + (result.company || "Unknown") + " - " + (result.position || "Role");
  const lines = [
    "Your resume draft is ready.",
    "Output: " + (result.outputUrl || ""),
    "Match score: " + String(result.matchScore || ""),
    "Review required: yes"
  ];

  GmailApp.sendEmail(config.notificationEmail, subject, lines.join("\n"));
}
