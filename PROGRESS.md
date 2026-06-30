# Progress: T212 Paper-Trading Safety Harness
Card: t_932391ac
Branch: bld-93239-t212safe
Started: 2026-06-30T15:40Z

## Checklist
- [x] Read card and Architect routing decision
- [x] Create DESIGN.md (design + threat model)
- [x] Create risk_policy.yaml (policy config)
- [x] Create audit_schema.sql (audit log schema)
- [x] Create harness.py (dry-run harness)
- [x] Run paper-trade proof (capture output)
- [x] Run live-submit-block proof (capture output)
- [x] Compute SHA256 of all artifacts
- [x] Commit and push to branch

## Artifacts

| File | SHA256 |
|------|--------|
| t212-harness/DESIGN.md | `9e10b0e3fc7f6811c87b66f0945640dfcbe43b66cc4cf49ece28b72326175be0` |
| t212-harness/risk_policy.yaml | `599f7766a835e91986f59decc1337ca511242c815fdb7f9d1d3ea390ea855c9a` |
| t212-harness/audit_schema.sql | `9b03620984d350a0deba21cae589a01817c84320248a67b7607e06034e66d58c` |
| t212-harness/harness.py | `a3f5ed22a805319b1bdcdce277063fab3d500a0b110c56933838183ba1e2017e` |
| t212-harness/audit.jsonl | `be75ce299695e615965af956eb4ee430f570c28f911606e1704b60db15030380` |

## Paper Trade Proof

```
============================================================
PAPER TRADE SIMULATED (no real order placed)
============================================================
  Instrument : AMZN
  Side       : BUY
  Qty        : 2.0
  Mock price : $185.50
  Notional   : $371.00
  Thesis     : Amazon AWS growth story; diversified revenue; paper-only exploration
  Sources    : mock-data,public-filings
  Audit log  : …/t212-harness/audit.jsonl
  Live mode  : DISABLED (kill switch active)

EDUCATIONAL PURPOSES ONLY. Not financial advice. Capital at risk.
No stock picks or buy/sell recommendations.
```

## Live-Submit Block Proof

```
============================================================
LIVE ORDER BLOCKED
============================================================
  REASON: T212_LIVE_ENABLED is not set to 'true' (kill switch active)
  REASON: T212_APPROVAL_TOKEN not set (per-order Hafs approval required)
  REASON: Live order execution is not implemented in this harness —
          a separate approved card is required for any real broker integration

  Audit log  : …/t212-harness/audit.jsonl
exit_code=1
```

## No Secrets / No Live Endpoints Statement
- No Trading 212 API key, secret, or credential is present anywhere in this codebase.
- No HTTP call to `api.trading212.com` or any live broker endpoint is made by this harness.
- The harness uses mock price data only; no live market data feed is connected.
- Live order submission requires `T212_LIVE_ENABLED=true` + `T212_APPROVAL_TOKEN` env vars
  set manually by Hafs, AND even then the execution stub exits with an explicit block.

## Acceptance Criteria Self-Check

- [x] AC1: Short design + threat model exists — `t212-harness/DESIGN.md` committed
- [x] AC2: Dry-run harness proves attempted live submit is blocked by default — `live-order` exits 1 with 3 explicit block reasons; audit log records `LIVE_ORDER_BLOCKED`
- [x] AC3: Paper trade simulation works on harmless example — `paper-trade AMZN BUY 2 $185.50` succeeds; audit log records `PAPER_TRADE` with full thesis/source/mode fields
- [x] AC4: No Trading 212 live API keys/secrets printed or required — confirmed; no credentials in any file
- [x] AC5: Risk policy file exists — `t212-harness/risk_policy.yaml` with max position, max daily notional, allowed instruments, no CFD/leverage/options
- [x] AC6: Audit trail — every event writes JSON to `audit.jsonl` with thesis, size, risk, timestamp, data sources, paper/blocked mode
- [x] AC7: Kill switch — single env var `T212_LIVE_ENABLED` disables all broker write paths (default: false)
- [x] AC8: Compliance copy — educational-only footer in harness output and DESIGN.md
- [x] AC9: No autonomous real-money trading — confirmed; no live endpoint code exists
- [x] AC10: No ASTS buy/sell recommendation — confirmed absent
- [x] AC11: No leverage/CFDs/options — policy enforced in risk_policy.yaml and harness check

## Notes
- Architect explicitly said: no new app/repo needed; deliver artifacts + proof on this card
- Per Architect routing (2026-06-30 14:09): DONE condition is artifact proof, not a PR
- `audit.jsonl` is committed with both proof events (paper trade + live block)
