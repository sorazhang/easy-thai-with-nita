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
sessions/{sessionId}                 ← shared, readable by anyone logged in (no personal data), writable only by TEACHER_EMAIL
entries/{uid}/{entryId}               ← a student's own journal entries; readable/creatable only by that uid, otherwise
                                         editable only by TEACHER_EMAIL (annotations/review) — the teacher's app load
                                         reads the whole entries/ root, a student's load reads only entries/{their uid}
assignments/{assignmentId}            ← shared CONTENT only (sentences etc, no personal data), writable only by TEACHER_EMAIL
assignmentSubmissions/{uid}/{assignmentId}
                                       ← one student's answers/annotations for one assignment; readable/writable by
                                         that uid or TEACHER_EMAIL — merged back onto its assignment's .submissions
                                         in memory by loadData() so the rest of the app doesn't need to know about the split
users/{uid}/
  cards: []                          ← student's personal vocab cards (private, owner-only)
  sessions/entries/cards             ← legacy per-user shape from before the shared-collection split; read once as a
                                         migration fallback, still owner-only
```
`entries` and `assignmentSubmissions` are split per-uid specifically so a student's read request can be scoped to
just their own subtree — another student's journal or assignment answers are never sent to their browser at all,
not merely hidden by the UI. `sessions`/`assignments` hold no personal data, so they stay readable by anyone
logged in. See `database.rules.json` for the actual rules.

## Key constants
- `TEACHER_EMAIL` (in `js/firebase.js`) — set to Kru Nita's email so she gets the teacher role on login
- `SEED` (in `js/data.js`) — hardcoded class session data (Nita's lessons, visible to all users)

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
