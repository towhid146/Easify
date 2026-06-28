# agents.md

## Agent Roles

### Product Agent

- Defines user flow from input to generated letter.
- Prioritizes MVP features and rollout order.

### Backend Agent

- Maintains extraction, analysis, and route logic.
- Owns request validation, error handling, and API stability.

### Frontend Agent

- Builds form, results views, and export actions.
- Ensures responsive UX and clear progress states.

### QA Agent

- Verifies API and UI integration.
- Tests success, timeout, and invalid-input paths.

## Team Workflow

1. Start with API contract agreement.
2. Implement backend services with types first.
3. Integrate frontend with strict type-safe API client.
4. Run smoke tests before deployment.
