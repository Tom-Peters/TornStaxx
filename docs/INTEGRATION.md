# TornStaxx 4.1.0 · module integration contract

Hub source: [TornStaxx.user.js](../TornStaxx.user.js). Author: IamEEKY.

## Runtime flow

1. Install TornStaxx. It mounts one `#staxx-hub-root`, removes `#staxx-fallback-root` if present and emits `staxx:ping`.
2. Each installed module registers via `staxx:register` (both on startup and on `staxx:ping`).
3. Hub shows a known entry as **not running** until the registration arrives, then uses actual module-supplied actions, notices and summaries.
4. `staxx:open` with `{id,section?,alertId?}` opens the appropriate module, while `staxx:closeall` closes overlaps. Modules report `staxx:panel` with `{id,open}`.
5. If the hub is absent, the compact fallback lists actively registered modules and delegates `staxx:open`; it must not claim to provide a live cross-tool dashboard.

Stable IDs intentionally remain `profit`, `war`, `happy` and `company` even after the UI names change. Do not migrate local storage keys merely to rename a tool.

## Standard messages

- `staxx:register`: `{id,label,icon,desc,sections?:[{id,label}],trendMetric?,freshnessMs?}`
- `staxx:summary`: `{id,headline,metrics:[{label,value}],updated}`
- `staxx:actions`: `{id,items:[{id,title,detail,status,priority,dueAt?,reviewMinutes?}],updated}`
- `staxx:notice`: `{id,count,level,summary,alerts:[{id,title,detail}]}`
- `staxx:activity`: `{id,events:[{id,at,title,detail,section,source}]}`
- `staxx:visit`: `{id,section}` only for actual user-triggered navigation
- `staxx:diagnostics-request` / `staxx:diagnostics`: state only, never secret values
- `staxx:refresh-request`, `staxx:mode`, `staxx:find`, `staxx:time-budget-request` / `staxx:time-budget`

Only `source: 'api'` verified log events may be described as verified Torn events; observations and local records use the separate provenance labels. Unknown metrics remain unknown. Stale advice must be clearly marked stale, and modelled results must not be shown as realised money/stat gains.

## Module ownership

| ID | Display label | Data/feature ownership |
|---|---|---|
| profit | Profit-TornStaxx | Item markets, trading ledger, stocks, income and prices |
| war | War-TornStaxx | Ranked war histories, rosters, manual spies, FF and orders |
| happy | Training-TornStaxx | Gym optimisation, verified gains, drugs, overdose and recovery |
| company | Company-TornStaxx | Employees, training, wage advice, payments and growth |

Hub deals only with context-level presentation and local preferences. API credentials remain protected in the respective module's existing key workflow; never send credentials over CustomEvents. Never submit Torn mutations, post faction orders, or turn user-directed field prefill into an automatic purchase.

## War-TornStaxx v0.2.1 compatibility bridge

The War module retains the normal `staxx:register` and `staxx:open` CustomEvents. A secondary same-origin `window.postMessage` route transmits **only** `{__tornstaxxBridge:'tornstaxx-war-v1',kind:'register',id:'war'}` for registration, and a restricted `{kind:'open',id:'war',section,alertId}` on user action. The hub requires the current window, same origin, exact bridge name, fixed ID and known operation before acting. These messages contain no credentials or private Torn data.

The War startup probe writes a short-lived `tornstaxx-war-runtime-v1` localStorage marker with module version, page pathname, observation timestamp and startup phase. The hub accepts the marker only for the same page and no older than 90 seconds. It is an injection diagnostic, not game-data evidence. Missing storage must not prevent normal registration. If the hub receives neither a module registration nor a current marker, it reports that the script was not seen executing; an enabled Torn PDA toggle alone is insufficient.

## War-TornStaxx 0.2.3 visual-open confirmation

The War loader no longer announces `staxx:register` until its main UI has mounted. The main module reports `staxx:panel` after making its panel visible, not before. It exposes `#warstaxx-dom-open`, a hidden HTML button inside its own panel root; the hub invokes its native DOM `.click()` only on an explicit user open request and only when the panel has not already appeared through DOM events. The native click works across some Torn PDA isolated script contexts. It never writes Torn game state. After 1100 ms the hub checks that `#warstaxx-root` is visible and contains `.ws-panel`, otherwise it shows a precise startup/visibility diagnostic. Module caches are normalised non-destructively; no API keys or gameplay data are passed through the DOM bridge.

## Cross-context injection evidence (hub 4.0.4, War 0.2.4)

War creates a hidden `#tornstaxx-war-execution-probe` element during the loader stage and sets `data-id`, `data-version`, `data-phase` and `data-observed`; the full app updates its phase to `ready` or `error` at startup. The element carries no credentials, player data, spy values, or API responses. Unlike per-script JS globals or storage, the element is accessible to independent userscript worlds sharing the same Torn DOM.

TornStaxx's `warDomEvidence()` checks the probe, complete panel markup, and native open control. A missing `staxx:register` event no longer prevents opening an existing War panel. A missing UI after a user-initiated open gives a detailed **detected version / phase / probe / panel / opener** status. If none exists, the script has not left detectable evidence in the current page; check Torn PDA injection and installation rather than assuming there is a panel-render bug. Existing key storage and gameplay data remain untouched.

## Smart-quote parser safeguard

Torn PDA can encounter a pre-execution parser failure if a curly apostrophe is converted into a straight ASCII apostrophe inside a single-quoted JavaScript string. War 0.2.4 contained this exact hazard and failed a reproduction with `SyntaxError: Unexpected identifier 'actual'`. War 0.2.5 eliminates the two strings and uses ASCII source with Unicode escapes for display glyphs. All five active scripts must pass automated source parsing before and after simulated quote normalization. This is separate from event delivery and panel rendering. See `SUITE-AUDIT-2026-11-04.md`.

## War-TornStaxx 0.2.6 own-faction identification

War automatically resolves its own faction ID via official Torn API v2 `GET /key/info` (`user.faction_id`) using the module's user-owned key. If unavailable, it tries `GET /user/faction` then `GET /user/profile`. This is a specialist War data task: the standalone TornStaxx hub never obtains, stores or forwards the Torn API key.

Auto mode is the default even for upgraded settings without an existing mode flag; successful identification is saved locally with source and verification timestamp, and periodically rechecked while the page is visible. A manual fallback can be selected in War settings. A verified faction change invalidates transient live own/opponent rosters and current war context, while preserving local manual records and historical reports. All game actions remain player-controlled.


## In-game guidance (Hub 4.1.0 / Training 0.33.0 / Company 1.30.0)

Native guidance ownership: Training mounts `#staxx-training-tip` on gym/items/points and on home during a hold; Company mounts `#tch-company-owed` and employee strips. The hub skips its own matching page card while these are present. All guidance honors `staxx-hub-context-v1` for the hub and Training; Company retains its existing native staff integration. Cards stay in document flow and never intercept native scrolling or game submissions.

Training owns ranked-war verification using official `GET /faction/wars` (nullable `wars.ranked`, numeric start and nullable end). No credentials or response payload are sent to the hub. During a hold it replaces actions with `war-hold`, publishes zero due notices, and labels its summary Paused. A scheduled war becomes active at its start; failed or malformed checks never clear a known hold. An expired all-clear suppresses advice after ten minutes. Successful war-end confirmation rebuilds live planning inputs before resuming. Faction-less players are verified via `GET /user/faction`.

The new native employee disclosure opens explanation in place. Its full-details button retains the existing module route. The hub's page-card dismissal is session-only and resets when the action content changes.
