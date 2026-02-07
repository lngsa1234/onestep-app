# ♡ Relationship Reflection

A bilingual (English/中文) relationship health assessment tool that helps women recognize patterns of narcissistic abuse. Built with React + Supabase.

## Features

- **22 research-informed questions** across 11 behavioral pattern categories
- **Bilingual support** — full English and Chinese translations
- **Anonymous data collection** — no personal info collected
- **Admin dashboard** at `/dashboard` with aggregate analytics:
  - Concern level distribution (pie chart)
  - Average scores by category (bar chart)
  - Responses over time
  - Recent responses table
- **Warm, supportive tone** with safety resources

---

## Quick Setup (15 minutes)

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Once your project is ready, go to **SQL Editor**
3. Copy and paste the contents of `supabase-setup.sql` and click **Run**
4. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### 2. Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and paste your Supabase credentials
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...

# Start dev server
npm run dev
```

Open `http://localhost:5173` — the assessment app  
Open `http://localhost:5173/dashboard` — the admin dashboard

### 3. Deploy to Vercel (Free)

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. Click Deploy

Your app will be live at `https://your-project.vercel.app`

---

## Project Structure

```
relationship-app/
├── index.html
├── package.json
├── vite.config.js
├── supabase-setup.sql          # Run this in Supabase SQL Editor
├── .env.example                # Template for env vars
└── src/
    ├── main.jsx                # Router setup
    ├── App.jsx                 # Main assessment app
    ├── lib/
    │   ├── supabase.js         # Supabase client & data functions
    │   └── data.js             # Questions, translations, helpers
    └── components/
        └── Dashboard.jsx       # Admin analytics dashboard
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Assessment (public, user-facing) |
| `/dashboard` | Aggregate analytics (admin) |

## Data Schema

Each anonymous response stores:

| Field | Type | Description |
|-------|------|-------------|
| `language` | text | "en" or "zh" |
| `answers` | jsonb | `{1: 3, 2: 2, ...}` question responses |
| `total_score` | integer | Sum of all answers |
| `max_score` | integer | 88 (22 questions × 4) |
| `score_pct` | numeric | 0.0 to 1.0 |
| `category_scores` | jsonb | `{gaslighting: 3.5, ...}` per-category averages |
| `created_at` | timestamp | Auto-generated |

## Customization

- **Add questions**: Edit `questionsData` in `src/lib/data.js`
- **Change colors**: Edit `freqColors` and `resultColors` in `src/lib/data.js`
- **Update translations**: Edit `translations` object in `src/lib/data.js`
- **Scoring thresholds**: Edit `getResultKey()` in `src/lib/data.js`

## Security Notes

- No personal data is collected — responses are fully anonymous
- RLS (Row Level Security) is enabled on the Supabase table
- For production, consider restricting dashboard reads to authenticated users (see comments in `supabase-setup.sql`)
# onestep-app
