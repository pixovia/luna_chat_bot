# Pixovia Luna Bot — Cloudflare Worker

An AI-powered multi-character chatroom bot that runs on Cloudflare Workers. It reads new messages from your Supabase chatroom and replies automatically using Groq AI, triggered every 8 minutes via a Cron Trigger.

---

## Characters

| Name | Personality |
|------|-------------|
| Luna 💕 | Playful & seductive |
| Mia 🔥 | Dominant & sassy |
| Alex 😈 | Flirty bisexual |
| Sophie 🥰 | Shy but lewd |
| Jake 🍆 | Direct & eager |

---

## Database

This worker connects to a Supabase database. The full database schema (tables, columns, types) is available at:

**[https://github.com/pixovia/database](https://github.com/pixovia/database)**

Set up your database following that repo before deploying this worker.

---

## Deploy to Cloudflare (No CLI Required)

### 1. Fork or download this repo

Get the source code onto your machine.

### 2. Create a Cloudflare Worker

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create**
3. Choose **Create Worker**
4. Give it a name (e.g. `pixovia-luna-bot`) and click **Deploy**

### 3. Upload the source code

1. After creating the worker, click **Edit Code**
2. You'll see an online editor — paste the contents of `src/index.js` there
3. Click **Deploy**

> The worker uses `@supabase/supabase-js` and `groq-sdk` as npm dependencies. Cloudflare's editor supports npm packages natively — no build step needed.

### 4. Add Secrets

Go to your worker → **Settings** → **Variables and Secrets** → **Add Secret**

Add these three secrets one by one:

| Secret Name | Value |
|---|---|
| `GROQ_API_KEY` | Your Groq API key from [https://console.groq.com](https://console.groq.com) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (from Project Settings → API) |

These are stored encrypted by Cloudflare and injected into the worker at runtime as `env.GROQ_API_KEY`, `env.SUPABASE_URL`, and `env.SUPABASE_SERVICE_ROLE_KEY`.

### 5. Set up the Cron Trigger

Go to your worker → **Settings** → **Triggers** → **Cron Triggers** → **Add Cron Trigger**

Enter a cron expression. Recommended: every 8 minutes:

```
*/8 * * * *
```

This will call the `scheduled()` function automatically on that interval.

---

## How It Works

1. Cron fires every 8 minutes
2. Worker fetches the timestamp of the last AI message
3. Fetches all new real user messages posted after that
4. For each new message, there's a 45% chance a random AI character replies
5. Groq generates a short, in-character reply using recent chat context
6. Reply (and optionally a media link) is inserted back into the `chatroom_messages` table

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for LLM inference |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (bypasses RLS) |

---

## Tech Stack

- [Cloudflare Workers](https://workers.cloudflare.com/) — serverless runtime
- [Groq](https://groq.com/) — fast LLM inference (`llama-3.1-8b-instant`)
- [Supabase](https://supabase.com/) — PostgreSQL database + realtime
