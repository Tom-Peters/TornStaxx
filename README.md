# TornStaxx · Unified Torn Command Centre

**TornStaxx** is the fifth Torn PDA script, and the dedicated shared user interface for four specialist tools. **Author: IamEEKY.**

## Install into Torn PDA

**Core hub (install this first):**

https://raw.githubusercontent.com/Tom-Peters/TornStaxx/main/TornStaxx.user.js

**Modules (install individually in Torn PDA → Scripts → Add Script → Remote URL):**

| Display name | Current repository (rename later) | Existing permanent installation URL |
| --- | --- | --- |
| Profit-TornStaxx | Torn-ProfitStaxx | https://raw.githubusercontent.com/Tom-Peters/Torn-ProfitStaxx/main/ProfitStaxx.user.js |
| War-TornStaxx | Torn-WarStaxx | https://raw.githubusercontent.com/Tom-Peters/Torn-WarStaxx/main/WarStaxx.user.js |
| Training-TornStaxx | Torn-Happy-Jump-Helper | https://raw.githubusercontent.com/Tom-Peters/Torn-Happy-Jump-Helper/main/Torn-Happy-Jump-Helper-preview.user.js |
| Company-TornStaxx | Torn-Company-Helper | https://raw.githubusercontent.com/Tom-Peters/Torn-Company-Helper/main/Torn-Company-Helper.user.js |

Use the **raw.githubusercontent.com** URL, not a GitHub file webpage. Keep the scripts **enabled** for both `www.torn.com` and `torn.com`; use end-of-document injection. Reload Torn after updating. The Training preview intentionally replaces only the preview; the independently pinned stable Happy Jump installer is not modified.

**Versions at initial split:** hub 4.0.0; Profit 1.23.0; War 0.2.0; Training 0.32.0 preview; Company 1.26.0.

## Architecture

- **TornStaxx** owns the single S launcher, Today, Dashboard, Activity, Find, Alerts, tool navigation, action prioritisation, session fit, diagnostics, local reminder state, usage shortcuts and safe contextual assistance.
- **Four specialist modules** own their data access, bounded foreground API polling, existing player-facing panels, business models, personal local records, read-only recommendation engines and the `staxx:*` event adapters.
- The hub is deliberately **API-key-free**: it requests no extra Torn scopes and performs **zero** Torn gameplay operations.
- Each module is self-contained (no external `@require`); a tiny emergency launcher works when the dedicated hub has not loaded. Once TornStaxx loads, that launcher disappears and the main hub takes over.
- The UI never claims a missing module is running. `staxx:register` is the only positive runtime registration signal. The hub does not invent historical prices, travel activity, battle stats, gains or income.
- Hub and modules communicate with local DOM CustomEvents; no cloud account, telemetry or remote shared key store.

See [Integration contract](docs/INTEGRATION.md) and [Migration notes](docs/MIGRATION.md).

## Important behaviour

TornStaxx is read-only with respect to gameplay. Source-specific deep links and explicit user-initiated field preparation are allowed; clicking purchase/train/attack/withdraw always stays with the player. UI data and locally recorded history stay on the device and can be stale when Torn PDA is closed. No background server is created.

## Development

`npm test` checks the installer structure, module registry and expected event contract. CI also executes `node --check TornStaxx.user.js`. These are **source/build** checks, not live Torn PDA device verification.

Repository names can be changed later; the userscript `@namespace`, `@updateURL` and `@downloadURL` values must not change until a redirect/migration is verified.
