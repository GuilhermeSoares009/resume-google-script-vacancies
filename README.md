# Resume CV Automation

Apps Script system that personalizes resumes based on job descriptions with a human-in-the-loop review step.

## How It Works
1) A job description is submitted (Google Form or manual trigger).
2) The input is validated and sanitized.
3) The job data is parsed and structured.
4) Gemini generates a structured personalization payload.
5) A template is selected and placeholders are rendered into a new document.
6) The result is stored in Drive and logged for analytics.
7) A notification is sent with the output link and match score.

## Architecture
- Orchestration: `src/Main.gs`
- Controllers: `src/controllers/`
- Services: `src/services/` (Parser, Gemini client, Renderer, Drive, Notifications)
- Models: `src/models/`
- Utilities: `src/utils/` (logging, validation, rate limiting, cache)
- Config: `src/config/`
- Tests: `tests/`
- Docs: `docs/`

## Configuration
All secrets and environment values must be stored in Apps Script Properties Service.
Required keys:
- `GEMINI_API_KEY`
- `TEMPLATE_FILE_ID` (Google Docs file ID, not DOCX)
- `OUTPUT_FOLDER_ID`
- `TRACKING_SHEET_ID`
- `NOTIFICATION_EMAIL`

Optional keys (with defaults):
- `GEMINI_MODEL` (default: `gemini-2.5-flash`)
- `GEMINI_MAX_TOKENS` (default: `8000`)
- `GEMINI_TEMPERATURE` (default: `0.3`)
- `BASE_RESUME_TEXT` (default: empty)

Model notes:
- Use a model name without the `models/` prefix (e.g. `gemini-2.5-flash`, `gemini-2.5-pro`).
- This project uses the `v1` Gemini endpoint.

## Local Setup
See `docs/SETUP.md` for clasp setup and deployment steps.


## Usage
- Main entrypoint: `onFormSubmit(e)` in `src/Main.gs`
- For manual runs: call `processJobApplication(formData)`

## Quality Gates
- Input validation before any external call
- Rate limiting and retries for Gemini API
- Output validation with fallbacks
- No automatic sending without human review

## Security
- Never hardcode secrets in the repository
- Sanitize inputs to avoid prompt injection
- Avoid storing PII in logs

## Docs
- `PLANEJAMENTO.md`
- `docs/SETUP.md`
