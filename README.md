# SIGMA Society website (Next.js + TypeScript + Supabase)

## Setup
1. Install Node.js 18+ from nodejs.org.
2. Open this folder in VS Code → Terminal → New Terminal.
3. `npm install`
4. Create a project at supabase.com. In SQL Editor, paste and run `supabase/schema.sql`.
5. Copy `.env.local.example` to `.env.local` and fill in Project URL + anon key (Project Settings → API).
6. Supabase → Authentication → Users → Add user (email + password). This is your admin login.
   Turn OFF "Allow new users to sign up" (Authentication → Sign In / Providers) so only you have admin access.
7. `npm run dev` → open http://localhost:3000

## Customize
- Logo: replace `public/logo.svg` (or change the path in `lib/config.ts`).
- Text, goals, 13 officers, adviser: `lib/config.ts`. Officer photos: put files in `public/officers/`.
- Color: `--maroon` in `app/globals.css` (Pantone 202 C ≈ #862633).
- Events: open the Events page → Admin → sign in → add/edit/delete.

## Deploy
Push to GitHub, import on vercel.com, add the two env variables.
