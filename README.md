# YN Amazon Deploy Tech Prep — Site

Multimodal interview prep app for Yusif. Authenticated via Firebase + GitHub OAuth (reuses the `yusif-dashboard` Firebase project for auth only — no database writes).

## Local test
```bash
cd /Users/kfs/2026_Projects/YussifJobProject/interviews/amazon-prep/site
python3 -m http.server 8765
# open http://localhost:8765
```

`localhost` is a default-authorized Firebase domain, so the GitHub sign-in popup works locally.

## Deploy to GitHub Pages

```bash
cd /Users/kfs/2026_Projects/YussifJobProject/interviews/amazon-prep/site
git init -b main
git add .
git commit -m "Initial deploy of YN prep site"
git remote add origin https://github.com/AgileToWin/yusif-amazon-prep.git
git push -u origin main
```

Then in the GitHub repo settings:
1. **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main`, folder `/ (root)`
4. **Save**

URL: `https://agiletowin.github.io/yusif-amazon-prep/`

## Allowlist

Hardcoded in `app.js`:

```js
const ALLOWLIST = {
  yusif:   ['MYNazir', 'naziryusif8', 'naziryusif8@gmail.com'],
  partner: ['AgileToWin', 'SeaDevelopers', 'kingfifisaxon@proton.me'],
};
```

Any GitHub account NOT in the allowlist sees an "Access denied" screen with their username displayed. Sign-out from that screen returns to the login.

## Tracks

- **Tech Drill** — 12 fundamentals questions
- **Round 1 · Friendly** — 9 LP questions in friendly tone
- **Round 2 · Mixed** — 8 LP questions, mixed register
- **Round 3 · Bar Raiser** — 10 LP questions, hostile probing

Question content lives in `questions.json` (replaceable without code change).

## Features

- **Sign in with GitHub** (Firebase Auth + GitHub provider)
- **Voice STT** (Web Speech API) + **Audio recording** (MediaRecorder) start together when you hit Speak; transcript appends to textarea, audio is replayable
- **TTS** (SpeechSynthesis) with **acronym pre-processor** (OTDR → "O.T.D.R.", PuTTY → "putty") and **voice picker** in settings drawer
- **Friendly / Skeptical tone** preset (rate + pitch tuning)
- **Self-score** widget — 5 chips × 6 rubric dimensions
- **Session log** in localStorage, exportable as JSON from the settings drawer

## Takedown (after 2026-06-03 interview)

- Disable GitHub Pages in repo settings, OR delete the repo
- Optionally remove `agiletowin.github.io` from Firebase authorized domains
