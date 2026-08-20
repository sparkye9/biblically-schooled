# biblically-schooled

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_f0jya7CepFlaoYoMzRN4RurTPTly)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Real accounts (one-time setup)

The app now requires signing in, with one shared login per household, and your
data lives in a real Postgres database instead of just one browser's local
storage. Two one-time steps in the Vercel dashboard:

1. **Attach a database** — Project → Storage → Create Database → Postgres.
   Vercel automatically injects the connection env vars on the next deploy;
   nothing to copy by hand.
2. **Set an auth secret** — Project → Settings → Environment Variables →
   `AUTH_SECRET`. Generate one with `npx auth secret`, or:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

After redeploying, visit `/setup` once to create the email + password for
each household, then sign in at `/login`. See `.env.example` for details.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
