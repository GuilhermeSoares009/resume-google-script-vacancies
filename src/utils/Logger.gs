function logInfo(event, metadata) {
  writeLog("INFO", event, metadata);
}

function logWarn(event, metadata) {
  writeLog("WARN", event, metadata);
}

function logError(event, metadata) {
  writeLog("ERROR", event, metadata);
}

function writeLog(level, event, metadata) {
  const payload = {
    timestamp: new Date().toISOString(),
    level: level,
    event: event,
    metadata: metadata || {}
  };

  Logger.log(JSON.stringify(payload));
}
