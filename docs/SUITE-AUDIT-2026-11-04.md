# TornStaxx five-script compatibility audit - 2026-11-04

## Finding and verified failure reproduction

War-TornStaxx 0.2.4 contained two curly apostrophes (U+2019) inside single-quoted JavaScript strings in the Strategy / Activity prose. The original downloaded source compiled, but replacing typographic apostrophes with straight ASCII quotes, as can happen during userscript transfer/injection, produced **SyntaxError: Unexpected identifier 'actual'**. Because this is a parse error, none of the War IIFEs, registration hooks, startup markers or in-app diagnostics could execute. This is a confirmed *parsing failure mode* of the old code, not direct proof of what any particular Android device did.

War-TornStaxx **0.2.5** rewrites the affected sentences without apostrophes and converts all remaining non-ASCII source glyphs to JavaScript Unicode escapes. Runtime display symbols are preserved. Its distributed source is now ASCII-only.

## Audited active entrypoints

| Module | Repository | Entry point | Audited version | Smart quotes | Raw/normalised parse | Runtime effect |
| --- | --- | --- | --- | --- | --- | --- |
| TornStaxx hub | TornStaxx | TornStaxx.user.js | 4.0.5 | None | Pass / Pass | Sole shared launcher |
| War-TornStaxx | Torn-WarStaxx | WarStaxx.user.js | **0.2.5** | Fixed; zero remaining | Pass / Pass | Old parse failure corrected |
| Profit-TornStaxx | Torn-ProfitStaxx | ProfitStaxx.user.js | 1.23.0 | None | Pass / Pass | Unchanged |
| Training-TornStaxx | Torn-Happy-Jump-Helper | Torn-Happy-Jump-Helper-preview.user.js | 0.32.0 | None | Pass / Pass | Preview unchanged; stable rollback untouched |
| Company-TornStaxx | Torn-Company-Helper | Torn-Company-Helper.user.js | 1.26.0 | None | Pass / Pass | Unchanged |

All five verified source entrypoints begin with valid Userscript metadata, match both `https://www.torn.com/*` and `https://torn.com/*`, and specify `@run-at document-end`. The four modules retain `staxx:register`, `staxx:open` and `staxx:panel` integrations, and the hub retains one central launcher. Source inspection found no mutation-capable PDA request method in these five active files. Automated tests validate syntax and source-level contracts, not live game API permissions or actual Torn PDA rendering.

## Prevent recurrence

- All five repositories now include a `pda-quote-safety` automated test checking source metadata, rejecting U+2018/U+2019/U+201C/U+201D, parsing the original source, then parsing it again after simulating conversion to straight quotes.
- War has an extra CI requirement for ASCII-only source and checks the two previously affected sentences.
- The suite development standard (`Torn-ProfitStaxx/docs/TORN-SUITE-STANDARD.md` v2026.11.04.2) mandates the tests.
- TornStaxx's original generic War error referenced an outdated v0.2.1; v4.0.5 now asks for v0.2.5 explicitly and explains its parser repair.

## Additional maintenance observation

Company-TornStaxx 1.26.0 has no explicit `@updateURL` or `@downloadURL` metadata. This is **not an identified cause** of the War startup failure; the original source and CI pass. It is a candidate for a separate Company release so Torn PDA can identify its permanent updater path consistently. Do not change its working runtime or the pinned Training stable installer merely to complete this fix.

## Deployment verification on Android

Update the War script from `https://raw.githubusercontent.com/Tom-Peters/Torn-WarStaxx/main/WarStaxx.user.js` and inspect the installed metadata: it must show `// @version      0.2.5`. Confirm that the TornStaxx hub has `// @version      4.0.5`, enable both, use End injection and fully reload the Torn page. If the old alert is still displayed, the installed hub or War source has not actually refreshed; verify the versions in the script editor before troubleshooting registration. If both current versions are active and War remains absent, collect the new hub's probe/panel/opener diagnostic details. Never share an API key.

GitHub Actions successful checks verify these repository builds; a real Torn PDA WebView runtime test remains necessary to confirm visibility.
