function onFormSubmit(e) {
  const formData = e && e.namedValues ? e.namedValues : {};
  return processJobApplication(formData);
}

function processJobApplication(formData) {
  return {
    status: "not_implemented",
    received_at: new Date().toISOString(),
    form_data: formData
  };
}
