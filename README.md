# SignalZ

**What the internet is talking about.**

SignalZ is a social content-sharing platform with a trading card game (TCG) aesthetic. Users post content — headlines, images, videos, and links — that appear as collectible-style cards across different community walls. The platform aggregates user posts alongside live news feeds into a dynamic, three-panel layout.

## What It Does

- **Post Creation** — Users create posts with headlines, captions, images, videos, tags, and call-to-action links. Each post is displayed as a stylized card with a unique background, animated icon, and auto-generated display name.
- **Multiple Walls** — Content is organized into separate walls (Main, Alt, Zetsu), each acting as its own feed.
- **Engagement** — Users can like and comment on posts. Comment bars cascade across cards when there are multiple comments, and like counts update in real time.
- **Link Sharing** — Users can submit social media links (YouTube, TikTok, etc.) that get embedded directly into post cards.
- **Live News Panel** — An integrated news feed pulls from RSS sources and displays alongside user content.
- **Session Identity** — Each visitor gets an anonymous session with a randomly generated display name, animated icon, and background theme — no sign-up required.

## Tech Stack

- **React 18 + TypeScript** — Frontend UI
- **Vite** — Build tooling and dev server
- **Supabase** — Database, storage, and real-time backend
- **Netlify Functions** — Serverless API endpoints
- **Netlify** — Hosting and deployment
