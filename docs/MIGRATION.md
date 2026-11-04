# Moving from embedded StaxxHub to TornStaxx

The four specialist installers previously included approximately 98 KB of copied StaxxHub UI code each. In the 2026-11-04 v4 migration they retain their entire original domain logic and replace that large UI bundle with a compact fallback launcher.

## Safe upgrade order

1. Install the standalone `TornStaxx.user.js` into Torn PDA and enable it.
2. Update ProfitStaxx / WarStaxx / Company Helper, and update the **Happy Jump preview** (not the pinned stable fallback).
3. Reload Torn. You should see **one S launcher** with four tools. The Tools view distinguishes **Running** from **Not running**.
4. Check each module's settings and its existing API key permissions. No key should need to be moved into the hub.
5. If a module appears **Not running**, confirm that module's userscript is enabled, matches the current Torn URL, uses end-of-document injection, and did not fail at startup. Its own mini launcher is available when the hub script is missing.

Current repository names and direct raw URLs are deliberately retained. After renaming a repository, GitHub may redirect browser links but Torn PDA's updater may or may not follow the new path reliably. Do not remove an old installer path before testing an explicit new update URL and a compatibility redirect.

## What changed — and what did not

**Changed:** central UI now installs once; module code is about 95 KB smaller; public display names are unified.

**Unchanged:** previous account data/localStorage, API key flows and permissions, transactions and training evidence, stockless businesses, overdose safeguards, war observation and ranking limits, alert identifiers and existing URLs. The pinned stable Happy Jump build remains separate.
