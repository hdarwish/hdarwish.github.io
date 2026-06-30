# T212 Paper-Trading Safety Harness — Design & Threat Model
Card: t_932391ac
Author: Builder (bld-93239-t212safe)
Date: 2026-06-30

---

## 1. Purpose

Build the smallest safe harness that:
- Lets a human (Hafs) review AI-generated trade proposals before any real order.
- Simulates paper trades with full audit trails.
- Provably cannot submit a live order without an explicit approval token + separate card.
- Never touches T212 live order endpoints in tests or default runtime.

This is NOT an autonomous trading system. It is a proposal + paper-sim layer.

---

## 2. Architecture

```
Market Data (mock / future: T212 read-only feed)
        │
        ▼
  harness.py  ──── risk_policy.yaml ──► Policy check
        │                                    │
        │           PASS                     │ FAIL → reject + audit
        ▼                                    │
  Paper Ledger (in-memory / JSON)  ◄─────────┘
        │
        ▼
  audit.jsonl  (append-only, every event)
        │
        ▼
  Human review (Hafs approves/rejects proposal)
        │
        ▼  (only if APPROVED + separate card)
  Live Order Gate ─── kill switch check ──► BLOCKED by default
```

### Components

| File | Role |
|------|------|
| `harness.py` | CLI entry point; paper-trade + live-block modes |
| `risk_policy.yaml` | Declarative policy: max sizes, allowed instruments, no CFD/leverage |
| `audit_schema.sql` | Schema for durable audit DB (SQLite-compatible) |
| `audit.jsonl` | Append-only audit log (generated at runtime) |

---

## 3. Kill Switch Design

One env var controls everything:

```
T212_LIVE_ENABLED=false   # default — no live writes possible
T212_LIVE_ENABLED=true    # still requires T212_APPROVAL_TOKEN per order
```

Even with `T212_LIVE_ENABLED=true`, the harness checks for a per-order approval token.
Live execution endpoint is **not implemented** — it exits with an explicit error.
There is no code path that calls `api.trading212.com/api/v0/equity/orders`.

---

## 4. Threat Model

| Threat | Mitigation |
|--------|-----------|
| Agent submits live order autonomously | Kill switch env var + no live endpoint code |
| Policy bypassed via instrument alias | Allowlist check on canonical ticker only |
| Position size limit circumvented | Per-order AND cumulative daily notional check in policy |
| Audit log tampered or bypassed | Audit write happens before any simulated execution |
| API key leaked in logs | No live API key is accepted or printed anywhere |
| CFD/leveraged instrument slips through | Explicit `cfds_allowed: false` + instrument name check |
| Human approval forged | Token must be set in env by Hafs manually per order |
| Test accidentally calls live endpoint | No live endpoint URL in codebase; integration tests mock only |

---

## 5. Explicit Non-Goals

- No autonomous real-money trading.
- No ASTS (American Shared Hospital Services) buy/sell recommendation.
- No live broker order placement.
- No leverage, CFDs, or options.
- No T212 API key required to run this harness.
- No investment advice; paper trade outputs carry educational-only disclaimer.

---

## 6. Future Live-Trade Gate (requires separate card + Hafs approval)

If Hafs decides to enable supervised live trading later:
1. New card required with explicit scope.
2. Hafs must provide T212 API key to harness via env (never committed).
3. Each order requires a signed approval token in env before submission.
4. Audit trail must be reviewed before the trading session starts.
5. Maximum position and daily notional remain in force.

---

## 7. Compliance Note

If outputs are used for content or affiliate purposes:
> Educational purposes only. Not financial advice. Capital at risk.
> Past paper-trade performance does not predict future real returns.
> No specific stock picks or buy/sell recommendations are made.
