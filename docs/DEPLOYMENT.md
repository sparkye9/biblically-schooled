# Deployment

The app is a Next.js 16 app with no server database — all family data lives in
the browser (localStorage + IndexedDB for uploaded files).

## Today's setup
The repository is connected to Vercel through v0: **every merge to `main`
deploys to production automatically**. Pushes to other branches (like this
redesign branch) get a Vercel *preview* URL, which does not affect production.

## Releasing this redesign (needs your approval)
1. Open the preview deployment for the branch and walk through Today, Print My
   Week, and kid view on your phone.
2. Before merging, on each device you use: **Settings → Backup → Download
   backup** in the current app (extra safety; the new app also keeps the old
   data key untouched).
3. Merge the pull request into `main`. Vercel builds and deploys.
4. Open the app on each device. You'll see "Welcome to the new Biblically
   Schooled" with your children, books, notes, and finished lessons carried
   over. Check "Our place" on This Week.

## Rolling back
Revert the merge commit on `main`. The previous app reads its original
`biblically-schooled-v5` data, which the new app never modifies.

## Local development
```bash
npm ci            # or pnpm install (both lockfiles are kept in sync)
npm run dev       # http://localhost:3000
npm run typecheck
npm test          # unit tests
npm run test:e2e  # builds, then runs browser tests (Playwright + Chromium)
```
The build now fails on type errors (the old `ignoreBuildErrors` setting was removed).
