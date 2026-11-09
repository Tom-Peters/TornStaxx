## 4.1.0 - In-game guidance

Context guidance now works on touch devices in a normal content block, without inserting into native headings. One fresh relevant action is shown, with an expandable explanation and session dismissal. Native Training and Company guidance takes precedence to prevent duplication. Home and faction pages now have context routes. No API keys or remote reads are added to the hub.

Validation: automated regression and parser checks; live Torn PDA validation remains a device check.

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

**War connection repair:** TornStaxx **4.0.1** and War-TornStaxx **0.2.1** use an additional same-origin, identity-only runtime bridge with a short-lived local startup marker. Update both from the same permanent URLs above. No API keys, player data or gameplay actions cross this bridge. If War still reports Not running and no marker is found, Torn PDA did not execute the new module on that page.

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

## War panel launch repair — hub 4.0.3 / War 0.2.3

War-TornStaxx now distinguishes a loader that started from a UI that actually finished mounting. It also exposes a hidden DOM-native open control that the hub can click when ordinary cross-script events fail in Torn PDA. This does not create another floating button or perform gameplay actions. If all launch methods fail, the hub explains whether it observed only the loader, a startup error, or a ready module without a visible panel. Update both scripts using the existing raw URLs and reload Torn. Existing local records and API-key settings are preserved. CI cannot substitute for verification in the Android WebView.

## War injection diagnosis — TornStaxx v4.0.4 / War-TornStaxx v0.2.4

The original error wrongly referred to War v0.2.1 even in later hub releases; that text was stale and did **not** prove the user's installed version. The hub now detects `#tornstaxx-war-execution-probe` and `#warstaxx-root` directly across userscript contexts, in addition to regular CustomEvent registration and the earlier runtime marker. If War's DOM exists but inter-script registration fails, it can use the already-tested native DOM opener to display the module. If War's loader is injected but the panel is missing, the hub reports **probe / panel / DOM opener** states and the latest module version and phase. If all three are absent, the hub explains that Torn PDA's script-manager running indicator does not establish successful in-page execution. No API keys, player details or gameplay write actions pass through this diagnostic bridge.
