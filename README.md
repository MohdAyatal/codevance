# ⚡ Codevance

> Your path from beginner to AI Engineer — AI-powered learning platform with live code execution, adaptive quizzes, energy system, and certifications.

![Stack](https://img.shields.io/badge/Stack-Next.js%2016%20%2B%20Supabase%20%2B%20Claude%20AI-6366F1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🌐 Live
**[codevance.io](https://codevance.io)** — deploy and update this link

---

## What is Codevance?

Codevance is a full-stack SaaS learning platform where students complete structured lessons across **8 tracks**, get tested with **AI-generated adaptive quizzes** powered by Claude, and earn certificates. It has a full freemium model with energy system, time-locked modules, and dual payment support (Razorpay + Stripe).

---

## ✨ Features

### Free Tier
- 3 AI questions per module
- First 2 modules per track
- 5 energy (refills 1/hour)
- ₹49 per certificate

### Pro (₹249/mo or ₹2499 lifetime)
- 10 adaptive AI questions per module
- All 8 tracks + all modules unlocked
- 10 energy slots
- AI adjusts difficulty to your level
- Free certificates
- Leaderboard

### Platform Features
- ⚡ Energy system — 1 energy per lesson/quiz, refills 1/hour
- 🕐 Time-locked modules — 1 hour wait between modules (free users)
- 🤖 Claude API — unique questions every session, adapts to your score history
- 💳 Razorpay — UPI, cards, wallets (India)
- 💳 Stripe — international cards
- 🏆 Track certificates — free for Pro, ₹49 for free users
- 💻 Monaco Editor — VS Code engine, runs Python in browser via Pyodide

---

## 📚 Curriculum — 8 Tracks, 20+ Lessons

| Track | Lessons | Topics |
|---|---|---|
| 🐍 Python | 6 | Variables, Lists, Functions, Dicts, OOP, File I/O |
| ☕ Java | 3 | Basics, OOP, Collections & DSA |
| 🗄️ SQL | 3 | SELECT/WHERE, JOINs, CTEs & Window Functions |
| 📊 Data Science | 3 | NumPy, Pandas, EDA |
| 🧠 Machine Learning | 3 | Fundamentals, Regression, Neural Networks |
| 🔧 Data Engineering | 2 | ETL Pipelines, Data Warehousing |
| 🤖 AI Engineering | 3 | LLM APIs, RAG, AI Agents |
| 🌐 Web & APIs | 2 | FastAPI, Deploying ML Models |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Database:** Supabase (PostgreSQL + RLS)
- **Auth:** Supabase Auth (Magic Link + Google OAuth)
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`)
- **Payments:** Razorpay (India) + Stripe (International)
- **Code Editor:** Monaco Editor
- **Python Runtime:** Pyodide (WebAssembly)
- **Deployment:** Vercel

---

## 🏗️ Project Structure

```
codevance/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── dashboard/page.tsx            # Student dashboard
│   ├── learn/[lessonId]/page.tsx     # Lesson: theory + code + quiz
│   ├── pricing/page.tsx              # Pricing + payment
│   └── api/
│       ├── generate-question/        # Claude adaptive questions
│       ├── submit-answer/            # Save quiz attempts
│       ├── progress/                 # Lesson progress
│       ├── energy/                   # Energy system
│       ├── certificate/              # Issue certificates
│       └── payment/
│           ├── razorpay/             # Create Razorpay order
│           ├── razorpay-verify/      # Verify + activate
│           ├── stripe/               # Stripe checkout
│           └── stripe-webhook/       # Stripe events
├── lib/
│   ├── supabase.ts
│   ├── curriculum.ts                 # All 20+ lessons
│   ├── claude.ts                     # Claude API helpers
│   ├── premium.ts                    # Plans, energy, config
│   └── premium-context.tsx           # React context
├── components/
│   └── EnergyBar.tsx
└── supabase/
    └── schema.sql                    # Full DB + RLS
```

---

## ⚡ Getting Started

### 1. Clone & install
```bash
git clone https://github.com/MohdAyatal/codevance.git
cd codevance
npm install --legacy-peer-deps
```

### 2. Supabase setup
1. New project at [supabase.com](https://supabase.com)
2. SQL Editor → paste `supabase/schema.sql` → Run
3. Auth → Providers → enable Google
4. Settings → API → copy URL, anon key, service_role key

### 3. Razorpay setup
1. Sign up at [razorpay.com](https://razorpay.com)
2. Dashboard → API Keys → copy Key ID + Secret
3. For live payments: complete KYC

### 4. Stripe setup
1. Sign up at [stripe.com](https://stripe.com)
2. Create 2 products: Pro Monthly (₹249) + Pro Lifetime (₹2499)
3. Copy price IDs from each product

### 5. Environment variables
```bash
cp .env.example .env.local
```
Fill in all values in `.env.local`

### 6. Run locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### 7. Deploy to Vercel
```bash
npm i -g vercel
vercel
```
Add all env vars in Vercel dashboard → Deploy.

---

## 🔒 Privacy & Security

- Keep your repo **private** on GitHub: `gh repo create codevance --private --push`
- Never commit `.env.local` — it's in `.gitignore`
- All user data protected by Supabase Row Level Security (RLS)
- Payments verified server-side (never trust client)

---

## 🗺️ Roadmap
- [ ] Leaderboard
- [ ] PDF certificate download
- [ ] More tracks: React, DevOps, LLM Fine-tuning
- [ ] Admin dashboard
- [ ] AI code review (Claude reviews your submission)
- [ ] Mobile app

---

## 👤 Author

**Mohd Ayatal** — B.Tech ECE, Bundelkhand University
- GitHub: [@MohdAyatal](https://github.com/MohdAyatal)
- LinkedIn: [mohd-ayatal](https://linkedin.com/in/mohd-ayatal-4aa217384)

---

## 📄 License
MIT
