function generatePersonalization(jobData, baseResume) {
  const config = getConfig();
  const payload = buildGeminiPayload(jobData, baseResume, config);
  const url = "https://generativelanguage.googleapis.com/v1/models/" + config.geminiModel + ":generateContent?key=" + config.geminiApiKey;

  const response = retryWithBackoff(function () {
    return withRateLimit("gemini", function () {
      return UrlFetchApp.fetch(url, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });
    });
  });

  const status = response.getResponseCode();
  const body = response.getContentText();
  if (status < 200 || status >= 300) {
    throw new Error("Gemini API error: " + status + " " + body);
  }

  return parseGeminiResponse(body);
}

function buildGeminiPayload(jobData, baseResume, config) {
  const jobText = jobData && jobData.rawText ? jobData.rawText : "";
  const resumeText = baseResume || "";
  const prompt = [
    "You are a technical recruiter.",
    "Analyze the job description and return a JSON with resume adaptations.",
    "Job description:",
    jobText,
    "Base resume:",
    resumeText,
    "Return JSON only (no markdown, no code fences) with fields: match_score, professional_summary, top_skills, experiences, projects, ats_keywords"
  ].join("\n");

  return {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: config.geminiTemperature,
      maxOutputTokens: config.geminiMaxTokens
    }
  };
}

function parseGeminiResponse(responseText) {
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (error) {
    throw new Error("Invalid Gemini response JSON");
  }

  const text = extractGeminiText(data);
  if (!text) {
    throw new Error("Gemini response missing content");
  }

  return safeParseJson(text);
}

function extractGeminiText(data) {
  if (!data || !data.candidates || !data.candidates.length) {
    return "";
  }

  const parts = data.candidates[0].content && data.candidates[0].content.parts;
  if (!parts || !parts.length) {
    return "";
  }

  return parts.map(function (part) {
    return part.text || "";
  }).join("\n");
}

function safeParseJson(text) {
  const cleaned = String(text || "")
    .replace(/```json/gi, "```")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const jsonText = start >= 0 && end >= 0 ? cleaned.slice(start, end + 1) : cleaned;

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON payload");
  }
}
