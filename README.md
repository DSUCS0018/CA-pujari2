# Florix — Trading Education Site (Shobha Pujari)

## Project Summary
- **Description:** A Next.js (App Router) TypeScript website built as a trading-education site for "Shobha Pujari" — a Chartered Accountant and trading educator. It provides pages for courses, webinars, community, contact, and more, plus a collection of UI components and utilities.
- **Key pages:** home, about, community, contact, courses, webinars (located under the `app/` folder).
- **Main features:** responsive UI, Tailwind CSS, Radix UI components, Vercel analytics, and a number of reusable React UI components in the `components/` and `components/ui/` folders.

## Tech stack
- **Framework:** Next.js (app router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI primitives:** Radix UI, custom components in `components/ui/`
- **Other libs:** `react`, `react-dom`, `lucide-react`, `framer-motion` (present in code), `react-hook-form`, `zod`, and others listed in `package.json`.

## Quick Start (recommended)
Prerequisites:
- Node.js (v18+ recommended)
- pnpm (preferred; a `pnpm-lock.yaml` file is present). You can also use `npm` or `yarn`, but `pnpm` is recommended.

Install dependencies:

Windows PowerShell:
```powershell
pnpm install
```

Start development server:
```powershell
pnpm dev
```

Build for production:
```powershell
pnpm build
pnpm start
```

If you prefer npm:
```powershell
npm install
npm run dev
```

## Useful scripts (from `package.json`)
- **dev:** `next dev` — run development server
- **build:** `next build` — build production assets
- **start:** `next start` — run built production app
- **lint:** `eslint .`

## Important: unresolved merge conflicts
Some files in the repository contain unresolved Git merge conflict markers and must be fixed before installing or running the app. Examples include:
- [package.json](package.json)
- [app/layout.tsx](app/layout.tsx)
- [app/page.tsx](app/page.tsx)

If you see `<<<<<<<`, `=======`, or `>>>>>>>` in files, do the following to find all conflicted files:
```powershell
git diff --name-only --diff-filter=U
```

To quickly accept your current branch version (ours) for a specific file:
```powershell
git checkout --ours -- <path-to-file>
git add <path-to-file>
```

Or to accept the incoming change (theirs):
```powershell
git checkout --theirs -- <path-to-file>
git add <path-to-file>
```

After resolving all conflicts and adding the files:
```powershell
git commit -m "Resolve merge conflicts"
```

Note: `package.json` must be valid JSON before you run `pnpm install`.

## Where to look in the code
- App entry and pages: [app/](app)
- Global styles: [app/globals.css](app/globals.css) and [styles/globals.css](styles/globals.css)
- Main layout: [app/layout.tsx](app/layout.tsx)
- Main home page: [app/page.tsx](app/page.tsx)
- Reusable components: [components/](components) and [components/ui/](components/ui)
- Configs: [next.config.mjs](next.config.mjs), [tsconfig.json](tsconfig.json)
- Package manifest: [package.json](package.json)

## Notes & next steps
- Resolve merge conflicts in `package.json`, `app/layout.tsx`, and `app/page.tsx` before installing.
- After installing, run `pnpm dev` to start development at http://localhost:3000.
- If you want, I can resolve the merge markers (I can show the conflict regions and suggest which side to keep), or generate a cleaned `package.json` for you to review.

---
Created by an automated repository scan to summarize the project and provide run instructions.

## Supabase Backend: quick setup

Follow these steps to add Supabase for auth and database storage:

1. Create a Supabase project at https://app.supabase.com and note the project URL and keys.
2. In your project settings copy the `anon` public key and the `service_role` key.
3. Create a `.env.local` file in the project root (don't commit this file) and set values from `.env.local.example`.

Example `.env.local` values:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

4. Install the Supabase client locally:

```powershell
pnpm add @supabase/supabase-js
```

5. Use the provided `lib/supabaseClient.ts` to access Supabase from the browser and to create a server client for trusted operations.

6. Create your DB schema using the Supabase SQL editor or migrations. Example minimal SQL for a `profiles` table:

```sql
create table profiles (
	id uuid primary key default auth.uid(),
	email text unique,
	full_name text,
	role text default 'student',
	created_at timestamptz default now()
);
```

7. For auth flows use Supabase client methods (`signUp`, `signInWithPassword`, `signOut`) in client components. For server-side protected routes, validate the session on the server using the service role key or Supabase auth helpers.

8. After setup, run the dev server:

```powershell
pnpm dev
```

If you want, I can: add server API routes, migrate an initial schema file, update `context/AuthContext.tsx` to use Supabase, and replace `utils/requireAuth.ts` to validate Supabase sessions. Tell me which of these you'd like next.
