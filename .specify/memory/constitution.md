# Resume CV Automation Constitution

## Core Principles

### 1. Human Review Gate (Non-Negotiable)
All generated resumes MUST require human review before any sending or sharing.
If quality checks fail, the system MUST degrade to a safe, basic output.

### 2. Apps Script First
Design for Apps Script limits (execution time, quotas, and services).
Prefer built-in Google services over external dependencies.

### 3. Security and Privacy by Default
Secrets MUST live in Properties Service, never in the repo.
Inputs MUST be sanitized before LLM calls, and logs MUST avoid PII.

### 4. Reliability and Fallbacks
External calls MUST have retries and backoff.
Failures MUST be logged and surfaced with clear user feedback.

### 5. Small, Reversible Changes
Prefer atomic, low-risk updates. Avoid refactors outside scope.
Every change MUST be traceable to a spec, plan, or task.

## Technical Constraints

- Runtime: single execution MUST complete within Apps Script limits.
- Quotas: enforce rate limiting for Gemini and Google services.
- Storage: Drive + Sheets for artifacts, Properties Service for config.
- Entry points: Form trigger and manual invocation only.

## Workflow and Quality Gates

- New features follow Spec -> Plan -> Tasks -> Implement.
- For critical logic, add tests or manual QA steps.
- Documentation updates are required when behavior changes.

## Governance

This constitution is the source of truth for delivery standards.
Amendments require an explicit change request and version bump.

**Version**: 1.0.0 | **Ratified**: 2026-02-14 | **Last Amended**: 2026-02-14
