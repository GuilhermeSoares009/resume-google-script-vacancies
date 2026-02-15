function renderResume(personalizedCV, templateId, outputFolderId) {
  const templateFile = DriveApp.getFileById(templateId);
  const copy = templateFile.makeCopy(buildOutputName(personalizedCV), DriveApp.getFolderById(outputFolderId));
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  const variables = buildTemplateVariables(personalizedCV);
  Object.keys(variables).forEach(function (key) {
    replacePlaceholder(body, "{{" + key + "}}", variables[key]);
  });

  doc.saveAndClose();

  return {
    fileId: copy.getId(),
    fileUrl: copy.getUrl()
  };
}

function buildTemplateVariables(personalizedCV) {
  const content = personalizedCV && personalizedCV.content ? personalizedCV.content : {};
  const props = PropertiesService.getScriptProperties();

  return {
    RESUME_PROFESSIONAL: content.professionalSummary || "",
    TOP_SKILLS_SECTION: (content.topSkills || []).join(", "),
    PRIMARY_BACKEND_STACK: content.primaryBackendStack || props.getProperty("PRIMARY_BACKEND_STACK") || "",
    CONTAINER_TECH: content.containerTech || props.getProperty("CONTAINER_TECH") || "",
    CLOUD_STACK: content.cloudStack || props.getProperty("CLOUD_STACK") || "",
    CURRENT_LEVEL: props.getProperty("CURRENT_LEVEL") || "",
    LEVEL: props.getProperty("LEVEL") || props.getProperty("CURRENT_LEVEL") || "",
    TEST_STACK: content.testStack || props.getProperty("TEST_STACK") || "",
    CACHE_TECH: content.cacheTech || props.getProperty("CACHE_TECH") || "",
    SECONDARY_BACKEND_STACK: content.secondaryBackendStack || props.getProperty("SECONDARY_BACKEND_STACK") || "",
    DATABASE_STACK: content.databaseStack || props.getProperty("DATABASE_STACK") || "",
    FRONTEND_STACK: content.frontendStack || props.getProperty("FRONTEND_STACK") || "",
    FREELANCE_STACK: content.freelanceStack || props.getProperty("FREELANCE_STACK") || "",
    LEGACY_BACKEND_STACK: content.legacyBackendStack || props.getProperty("LEGACY_BACKEND_STACK") || "",
    LEGACY_DATABASES: content.legacyDatabases || props.getProperty("LEGACY_DATABASES") || "",
    BACKEND_SKILLS: props.getProperty("BACKEND_SKILLS") || "",
    AI_SKILLS: props.getProperty("AI_SKILLS") || "",
    AUTOMATION_SKILLS: props.getProperty("AUTOMATION_SKILLS") || "",
    DATA_SKILLS: props.getProperty("DATA_SKILLS") || "",
    INFRA_SKILLS: props.getProperty("INFRA_SKILLS") || "",
    ARCHITECTURE_SKILLS: props.getProperty("ARCHITECTURE_SKILLS") || "",
    TEST_SKILLS: props.getProperty("TEST_SKILLS") || "",
    VERSIONING_SKILLS: props.getProperty("VERSIONING_SKILLS") || "",
    TECH_STACK_COMMA_SEPARATED: content.techStackCommaSeparated || props.getProperty("TECH_STACK_COMMA_SEPARATED") || ""
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
