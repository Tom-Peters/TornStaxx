# TornStaxx 4.0 · module integration contract

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
