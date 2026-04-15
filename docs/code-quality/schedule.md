# sonarftweb — Implementation Schedule

**Started:** July 2025  
**Status legend:** ⬜ Pending | 🔄 In Progress | ✅ Done

---

## Quick Wins (Day 1–2)

| # | Task | Status | Notes |
|---|---|---|---|
| Q1 | Add `npm test` step to `cloudbuild.yaml` | ✅ | Added `npm ci`, `npm audit --audit-level=high`, and `CI=true npm test` steps before Docker build |
| Q2 | Fix `App.test.js` smoke test | ⬜ | |
| Q3 | Mock `netlify-identity-widget` in `setupTests.js` | ⬜ | |
| Q4 | Upgrade `axios` to latest | ⬜ | |
| Q5 | Upgrade `react-router-dom` to latest | ⬜ | |
| Q6 | Upgrade Node.js in `Dockerfile` from 14 to 20 | ⬜ | |
| Q7 | Remove `socket.io-client` from `package.json` | ⬜ | |
| Q8 | Remove CDN `<script>` from `public/index.html` | ⬜ | |
| Q9 | Set `GENERATE_SOURCEMAP=false` in build script | ⬜ | |
| Q10 | Move URLs to environment variables | ⬜ | |
| Q11 | Delete 13 dead files/symbols | ⬜ | |
| Q12 | Remove all 38 `console.log` statements | ⬜ | |
| Q13 | Fix `key={index}` → stable keys in `Bots.js` | ⬜ | |
| Q14 | Fix `Terciary` typo in CSS | ⬜ | |

---

## Sprint 1 — Security Track

| # | Task | Status | Notes |
|---|---|---|---|
| S1 | Add `Authorization: Bearer` header to all sonarft API calls | ⬜ | |
| S2 | Pass auth token on WebSocket connect URL | ⬜ | |
| S3 | Add Content Security Policy meta tag | ⬜ | |
| S4 | Add `.env.production` with HTTPS/WSS URLs | ⬜ | |

---

## Sprint 1 — WebSocket Track

| # | Task | Status | Notes |
|---|---|---|---|
| W1 | Fix WebSocket memory leak (`shouldReconnect` ref) | ⬜ | |
| W2 | Add `onerror` handler + expose `wsError` state | ⬜ | |
| W3 | Add connection status badge to `Bots.js` | ⬜ | |
| W4 | Exponential backoff reconnect | ⬜ | |

---

## Sprint 1 — UX Track

| # | Task | Status | Notes |
|---|---|---|---|
| U1 | Action feedback on Parameters + Indicators save | ⬜ | |
| U2 | Confirmation dialog before bot removal | ⬜ | |
| U3 | Fix table overflow (`overflow-x: auto`) | ⬜ | |
| U4 | Error state in `Bots.js` fetch | ⬜ | |
| U5 | Add try/catch to `getBotIds`, `getOrders`, `getTrades` | ⬜ | |

---

## Sprint 1 — Testing Track

| # | Task | Status | Notes |
|---|---|---|---|
| T1 | Tests for `utils/api.js` | ⬜ | |
| T2 | Tests for `utils/helpers.js` | ⬜ | |
| T3 | Tests for `useWebSocket.jsx` | ⬜ | |
| T4 | Create `src/mocks/fixtures.js` | ⬜ | |

---

## Month 2 — Architecture & Quality

| # | Task | Status | Notes |
|---|---|---|---|
| M1 | Extract shared `PrivateRoute` component | ⬜ | |
| M2 | Refactor `Parameters` + `Indicators` to functional + shared hook | ⬜ | |
| M3 | Split `Bots.js` into hook + sub-components | ⬜ | |
| M4 | Add `ErrorBoundary` around `<Crypto>` page | ⬜ | |
| M5 | Code splitting with `React.lazy` + `Suspense` | ⬜ | |
| M6 | Cap log array at 500 entries | ⬜ | |
| M7 | Replace sequential fetches with `Promise.all` | ⬜ | |
| M8 | Memoize `AuthContext` value | ⬜ | |
| M9 | Tests for `Parameters` + `Indicators` | ⬜ | |
| M10 | Tests for `Bots.js` | ⬜ | |
| M11 | Tests for `Crypto.js` | ⬜ | |
| M12 | Install `jest-axe` + accessibility tests | ⬜ | |
| M13 | Add PropTypes to all components | ⬜ | |
| M14 | Remove inline styles | ⬜ | |
| M15 | Add ESLint `no-console` rule + enforce in CI | ⬜ | |

---

## Month 3–6 — Long-term

| # | Task | Status | Notes |
|---|---|---|---|
| L1 | Structured JSON WebSocket protocol | ⬜ | Requires sonarft backend coordination |
| L2 | Data visualization with Recharts | ⬜ | |
| L3 | Bot status indicator (running/stopped/error) | ⬜ | |
| L4 | Paper vs live trading mode toggle | ⬜ | |
| L5 | MSW integration tests | ⬜ | |
| L6 | TypeScript migration (start with `utils/`) | ⬜ | |
| L7 | Vite migration from CRA | ⬜ | |
| L8 | Performance monitoring (`reportWebVitals`) | ⬜ | |
| L9 | Idle session timeout | ⬜ | |
| L10 | Tooltips on indicators/parameters | ⬜ | |
