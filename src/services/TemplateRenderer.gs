function renderResume(personalizedCV, templateId, outputFolderId) {
  const templateFile = DriveApp.getFileById(templateId);
  const copy = templateFile.makeCopy(buildOutputName(personalizedCV), DriveApp.getFolderById(outputFolderId));
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  replacePlaceholder(body, "{{RESUME_PROFESSIONAL}}", personalizedCV.content.professionalSummary || "");
  replacePlaceholder(body, "{{TOP_SKILLS_SECTION}}", (personalizedCV.content.topSkills || []).join(", "));

  doc.saveAndClose();

  return {
    fileId: copy.getId(),
    fileUrl: copy.getUrl()
  };
}

function replacePlaceholder(body, placeholder, value) {
  body.replaceText(placeholder, value || "");
}

function buildOutputName(personalizedCV) {
  const meta = personalizedCV && personalizedCV.metadata ? personalizedCV.metadata : {};
  const company = meta.company || "Company";
  const position = meta.position || "Role";
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  return "CV_" + company + "_" + position + "_" + date + ".docx";
}
