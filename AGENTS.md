# AGENTS.md — TornStaxx

- Public author attribution: **IamEEKY** only; the existing GitHub owner namespace is an allowed URL path, not an author field.
- Canonical standalone hub runtime: `TornStaxx.user.js`. No copy of this 98 KB UI belongs inside specialist module installers.
- Every module uses the event protocol in `docs/INTEGRATION.md`; keep legacy IDs `profit`, `war`, `happy`, `company` for stored preferences, action IDs and deep links.
- Source of truth for suite-wide UI/integration changes: this repository. Update documentation and run the hub tests when changing shared events. Maintain existing per-repo rules for domain engines.
- Hub must never request Torn API keys, carry remote user data or automatically execute gameplay changes. It reads only module events and strictly bounded local preferences, snapshots and activity.
- Preserve one S launcher, truthful running-vs-known states, native mobile scroll, alert routing, Find, Today, Dashboard, Activity, session preference, changes and diagnostics.
- Do not introduce remote script `@require` or silent remote code loading. Keep fallback behaviour working for module-only users.
- Training-TornStaxx production installer is `Torn-Happy-Jump-Helper.user.js`; all future Training updates go there. Preview is frozen, and old stable is archived separately.

- **Torn PDA quote-normalization safety:** never commit U+2018/U+2019/U+201C/U+201D in any of the five live userscript sources. All five repositories have `pda-quote-safety` tests; run the parser both before and after simulated smart-to-straight quote replacement. In War, use ASCII-only source and JS Unicode escapes for UI glyphs. The 2026-11-04 War 0.2.4 typo was reproducibly fatal before startup; see `docs/SUITE-AUDIT-2026-11-04.md`.
