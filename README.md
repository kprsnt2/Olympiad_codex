# Olympi

A joyful, grade-wise SOF Olympiad preparation portal for IMO, ISO, IEO and IGKO learners. The first experience focuses on small daily wins: a grade selector, personalised subject paths, practice sparks, a short mock question and Coach Nova.

## Stack

- Next.js 15 + React 19 + TypeScript
- Responsive CSS-first visual system (no component-library dependency)
- A server-side AI coach route using the OpenAI Responses API, with Gemini as automatic backup

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. To use Coach Nova with a live model, add at least one provider key to `.env.local`:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6-luna

# Optional automatic fallback
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

All keys stay in the server route; none are exposed to the browser. Without keys, Nova returns a useful built-in starter plan so the interface remains testable.

## Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel, select **Add New → Project**, import `kprsnt2/Olympiad_codex`, and keep the auto-detected **Next.js** preset.
3. Add `OPENAI_API_KEY` and optionally `GEMINI_API_KEY` in **Project Settings → Environment Variables**. Add the model variables only if you need to override the defaults.
4. Click **Deploy**. Every later Git push will create a preview deployment; pushes to the production branch deploy to production.

Vercel uses `npm run build` and the standard Next.js output automatically—no custom build or output settings are needed.
