# Easy Thai With Nita — Project Context

## What this is
A PWA (Progressive Web App) for Kru Nita's Thai language classes in Hua Hin.
Live site: https://easythaiwithnita.online
GitHub repo: https://github.com/sorazhang/easy-thai-with-nita

## Tech stack
- Single HTML file PWA (`index.html`) — no build step, no framework
- Firebase Authentication (email/password)
- Firebase Realtime Database (user data storage)
- Deployed on Vercel (auto-deploys on push to `main`)

## Firebase setup
- Project: `easy-thai-with-nita`
- Auth: Email/Password enabled
- Database: Realtime Database (Asia Southeast 1 region)
- Database URL: `https://easy-thai-with-nita-default-rtdb.asia-southeast1.firebasedatabase.app`
- Authorized domain: `easythaiwithnita.online`
- Security rules live in `database.rules.json` (repo root) — Firebase's Realtime Database has no CLI/CI deploy set up for this project, so after editing that file it must be pasted manually into Firebase console → Realtime Database → Rules → Publish.

## Data structure (Realtime Database)
```
sessions/{sessionId}       ← shared: Kru Nita's class sessions (SEED data merged in), writable only by TEACHER_EMAIL
entries/{entryId}          ← shared: every student's journal entries, tagged with uid + author name;
                              creatable by the entry's own uid, editable only by TEACHER_EMAIL (for annotations/review)
assignments/{assignmentId}
  submissions/{uid}        ← writable by that uid (their own answers) or TEACHER_EMAIL (review/comment)
users/{uid}/
  cards: []                ← student's personal vocab cards (private, owner-only)
  sessions/entries/cards   ← legacy per-user shape from before the shared-collection split; read once as a
                              migration fallback, still owner-only
```
Each shared collection is stored keyed by record id, not as one array — a single edit only ever touches its
own record, which is what makes the per-record security rules above possible.

## Key constants in index.html
- `TEACHER_EMAIL` — set this to Kru Nita's email so she gets the teacher role on login
- `SEED` — hardcoded class session data (Nita's lessons, visible to all users)

## Roles
- **Student**: default role for any logged-in user
- **Teacher (Kru Nita)**: auto-assigned when logged-in email matches `TEACHER_EMAIL`

## Features built so far
- Welcome screen with photo carousel (5 café photos)
- Email/password login + sign-up + forgot password
- Class session log (Nita's notes per session)
- Vocabulary cards per session with "+ Add to Vocab" button
- Personal vocab deck with flashcard study mode (romanization shown on front)
- Journal entries
- Dark/light theme toggle
- PWA installable (manifest + icons)

## Assets
- `images/nita/` — 5 class photos (IMG-20260712-WA0006 to WA0010)
- `icons/` — icon-192.png, icon-512.png
- `manifest.json` — PWA manifest

## Deployment
- Vercel project: `easy-thai-with-nita`
- Branch: `main` (auto-deploys on every push)
- No Root Directory override needed (index.html is at repo root)

## Development workflow
- Edit `index.html` directly (all CSS, HTML, JS in one file)
- Commit and push to `main` → Vercel auto-deploys in ~30 seconds
