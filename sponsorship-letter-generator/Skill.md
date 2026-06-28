# Skill.md

## Objective

Build and maintain a reliable Sponsorship Letter Generator MVP with clean boundaries between UI, API, and AI services.

## Engineering Standards

- Keep frontend and backend fully typed with TypeScript.
- Validate all incoming API payloads.
- Never send raw HTML from websites directly to AI; always preprocess first.
- Return predictable JSON responses for success and failure cases.
- Track token usage for every AI call and show total usage to users.

## Quality Checklist

- Health check endpoint works.
- Main analysis endpoint returns valid JSON.
- UI handles loading, success, and error states.
- Generated letter can be exported from UI.
- No API key is hardcoded in source files.
