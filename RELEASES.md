# Release log

Every safe state of the deployed site is tagged with a semver version. If a later commit breaks something, we roll back to the most recent good tag in one command.

---

## v1.0.0 — Yusif lockdown release (2026-05-31)

**Tag:** `v1.0.0`
**Commit:** `38906d8`
**Date:** 2026-05-31

The stable feature-frozen state for Yusif's Amazon Network Deploy Tech interview on Wed 2026-06-03. **Feature lockdown is in effect** from this release through Wed evening — only bug fixes ship, no new features.

### What's included

- AI coach loop — grade · trim · humanize · stronger · Bar Raiser probes · synthesize Bulletproof Answer
- Bulletproof Answer (tuned on this date — less aggressive cutting, conversational rhythm, preserves substance over length)
- Story Bank with per-version save:
  - 💾 button on the main coach feedback panel (saves original answer)
  - 💾 button on every coach chat message (saves trim, punchier, humanity, stronger, etc.)
  - 💾 button on Trim Tape (saves trimmed/punchier version)
  - Color-coded badges per saved take (original · trim · punchier · humanity · stronger · bulletproof)
- Home screen — Confidence Score · LP Mastery (now labelled "Leadership Principle Mastery") · Streak · Daily Mission · Countdown ribbon
- Voice — OpenAI Echo default with graceful fallback to Apple Enhanced voices when OpenAI is unavailable
- Audio overlap fix (CR3) — rapid "Hear it" clicks no longer stack
- Boastfulness slider (0–5, default 3) — calibrates AI rewrite tone
- Curve balls integrated into every round at fixed mid-session positions (R1: 2, R2: 2, R3: 3)
- Closing questions at the end of every R1/R2/R3 session (each round = complete interview slot)
- Trim Tape side-by-side original vs trimmed view
- Mode toggle (Training/Calm) with kill switch on all gamification surfaces
- "LP" labels expanded to "Leadership Principle" in candidate-facing UI (rubric column kept compact)
- 3-column drill layout with sticky sidebars (Progress left, Quick Anchors right)
- 5 Quick Anchor cards: The hook · Story DNA · Story sources · Hard rules · Gap reframes · Why you (the 0.1%)
- Multimodal: Web Speech STT + OpenAI/Browser TTS (with acronym pre-processor) + MediaRecorder audio playback

---

## Rollback procedure

If a later commit breaks something during lockdown, restore the deployed site to `v1.0.0` in one command (run from this `site/` directory):

```bash
git reset --hard v1.0.0
git push --force origin main
```

GitHub Pages will rebuild from the rolled-back state in ~60 seconds. The user-facing site will be exactly as it was at `v1.0.0`.

**Important:** This is a destructive force-push. All commits after `v1.0.0` will be removed from the remote `main` branch. Their content is preserved in the local reflog (`git reflog`) for ~30 days if you need to recover something.

### Safer alternative (preserves history)

If you want to revert just one specific commit without nuking everything after `v1.0.0`:

```bash
git revert <commit-sha>
git push origin main
```

This creates a new commit that undoes the bad one, leaving history intact.

---

## Going-forward versioning policy

- **v1.0.0** — current lockdown release
- **v1.0.1, v1.0.2, …** — bug fixes shipped during lockdown (each safe-after-test commit gets a tag)
- **v1.1.0, v1.2.0, …** — minor feature releases (post-lockdown, before v2.0)
- **v2.0.0** — first major release after the interview (Phase A Round Recap + queued CRs)

Every commit that ships to production during lockdown should be tagged immediately after pushing, with a one-line message describing what changed. That way if v1.0.4 breaks something we can roll back to v1.0.3 without losing the intermediate fixes.

### Tagging a new release

```bash
# After pushing a commit you've verified is safe
git tag -a v1.0.X -m "v1.0.X — one-line description of what this fixes"
git push origin v1.0.X
```

### Listing all releases

```bash
git tag -l "v*" | sort -V
```

### Viewing a release's details

```bash
git show v1.0.0
```
