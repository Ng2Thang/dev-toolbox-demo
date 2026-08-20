# Dev Toolbox utility tests

Dev Toolbox utilities operate on developer-supplied values. Tests should demonstrate a reliable tool contract without asserting incidental presentation.

## Every applicable utility

Cover the valid result, malformed input, and a boundary or normalization rule that changes the result. Use canonical examples that make expected output easy to inspect. Preserve the exact result type and data format promised by the requirement; avoid weakening an assertion to a truthy value.

Do not log or embed real tokens, credentials, private URLs, or production payloads in fixtures. Use clearly synthetic data.

## By tool behavior

| Utility behavior | Prioritized cases |
| --- | --- |
| Transformation or formatter | Valid transformation, whitespace/normalization, malformed input, idempotence when promised |
| Decoder or inspector | Valid encoded sample, invalid structure/encoding, missing optional content, safe error message without exposing input unnecessarily |
| Generator | Output count bounds, format/validity, uniqueness when required, deterministic mock of randomness or time |
| Converter | Accepted units, epoch/negative/boundary values when supported, invalid numeric input, timezone-independent assertions |
| Text utility | Empty input, Unicode/line-ending handling when relevant, documented counting or separator rules |
| Browser API integration | Unsupported or denied capability, success path, and cleanup/restoration of global mocks |

## UI-derived cases

Treat the approved screen as evidence of controls and states: initial/empty state, field labels, action enablement, primary action result, validation/error state, copy/download/save action, and accessible feedback. Test only state changes that matter to the tool contract. Layout, colors, visual hierarchy, and decorative icons remain manual Stitch review concerns unless the requirement makes them semantic.

## Dev Toolbox boundaries

Keep the pure utility algorithm testable without React, `fetch`, or browser globals. Test browser interaction in the client component; test a route/schema only when the feature intentionally crosses a server boundary. A local-only tool should not gain API or persistence tests solely because another tool has them.
