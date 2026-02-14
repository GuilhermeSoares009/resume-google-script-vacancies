function getRateLimiterConfig() {
  return {
    requestsPerMinute: 10,
    tokensPerMinute: 25000,
    maxRetries: 3,
    backoffBaseMs: 2000
  };
}

function withRateLimit(key, fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const props = PropertiesService.getScriptProperties();
    const now = Date.now();
    const windowMs = 60000;
    const windowKey = key + ":window_start";
    const countKey = key + ":count";

    const windowStart = Number(props.getProperty(windowKey) || 0);
    const count = Number(props.getProperty(countKey) || 0);

    if (!windowStart || now - windowStart >= windowMs) {
      props.setProperty(windowKey, String(now));
      props.setProperty(countKey, "1");
      return fn();
    }

    const config = getRateLimiterConfig();
    if (count >= config.requestsPerMinute) {
      const waitMs = windowMs - (now - windowStart);
      Utilities.sleep(Math.max(100, waitMs));
      props.setProperty(windowKey, String(Date.now()));
      props.setProperty(countKey, "1");
      return fn();
    }

    props.setProperty(countKey, String(count + 1));
    return fn();
  } finally {
    lock.releaseLock();
  }
}

function retryWithBackoff(fn, retries, baseMs) {
  const config = getRateLimiterConfig();
  const maxRetries = typeof retries === "number" ? retries : config.maxRetries;
  const baseDelay = typeof baseMs === "number" ? baseMs : config.backoffBaseMs;

  let attempt = 0;
  while (true) {
    try {
      return fn(attempt);
    } catch (error) {
      attempt += 1;
      if (attempt > maxRetries) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      Utilities.sleep(delay);
    }
  }
}
