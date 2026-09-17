# Chat Dashboard — Frontend (Phase 1)

This is Phase 1 of the Online Chat Dashboard plan: the React + TypeScript
frontend, built against **mock data** so it can be tested before the
backend, database, and real-time layer exist.

## What's included

- **Register / Login** pages (split-screen layout), with mock accounts
  persisted to `localStorage` so the flow feels real across refreshes.
- **Protected dashboard route** — you're redirected to `/login` if you're
  not "logged in".
- **Sidebar**: searchable list of mock users with online/offline status
  and last-seen time.
- **Chat window**: message history, day dividers, a composer that appends
  new messages to local state instantly.
- Design tokens (color/type/spacing) centralized in `src/index.css`.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL. Register a new account (any email/password
works — it's stored locally, not sent anywhere), and you'll land on the
dashboard with 5 mock users to click through and message.

## What's mocked vs. real

| Piece | Status |
|---|---|
| UI, routing, components | Real |
| Register/login flow | Mocked (`localStorage`, no hashing) — see `src/context/AuthContext.tsx` |
| Users & message history | Static mock data — see `src/data/mockData.ts` |
| Sending a message | Updates local React state only, no server |
| Online/offline status | Hardcoded per mock user |

## Where this plugs into the rest of the plan

- `src/types/index.ts` mirrors the planned Mongoose schemas (`users`,
  `messages`), so swapping mock data for real API responses later should
  need minimal type changes.
- `AuthContext`'s `login`/`register`/`logout` functions are the seam where
  Phase 4 will swap in real calls to `/api/auth/login` and
  `/api/auth/register`, storing a JWT instead of a plain session object.
- `DashboardPage`'s `handleSend` is the seam where Phase 5 will emit over
  a Socket.IO connection instead of writing to local state, and where
  incoming messages will be pushed in rather than fetched.

## Next step

Phase 2: scaffold the Node.js + Express + TypeScript backend and the
`/api/auth/*`, `/api/users`, `/api/messages/:userId` routes described in
the project summary.
