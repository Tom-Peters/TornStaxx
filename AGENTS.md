# AGENTS.md — TornStaxx

- Public author attribution: **IamEEKY** only; the existing GitHub owner namespace is an allowed URL path, not an author field.
- Canonical standalone hub runtime: `TornStaxx.user.js`. No copy of this 98 KB UI belongs inside specialist module installers.
- Every module uses the event protocol in `docs/INTEGRATION.md`; keep legacy IDs `profit`, `war`, `happy`, `company` for stored preferences, action IDs and deep links.
- Source of truth for suite-wide UI/integration changes: this repository. Update documentation and run the hub tests when changing shared events. Maintain existing per-repo rules for domain engines.
- Hub must never request Torn API keys, carry remote user data or automatically execute gameplay changes. It reads only module events and strictly bounded local preferences, snapshots and activity.
- Preserve one S launcher, truthful running-vs-known states, native mobile scroll, alert routing, Find, Today, Dashboard, Activity, session preference, changes and diagnostics.
- Do not introduce remote script `@require` or silent remote code loading. Keep fallback behaviour working for module-only users.
- Pinned stable Happy Jump installer is a rollback and must not be edited during the Training preview migration.
