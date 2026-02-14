function handleError(error, context) {
  const info = {
    message: error && error.message ? error.message : String(error),
    stack: error && error.stack ? error.stack : "",
    context: context || {}
  };

  logError("app_error", info);
  return {
    status: "error",
    message: "An error occurred while processing the request.",
    details: info.message
  };
}
