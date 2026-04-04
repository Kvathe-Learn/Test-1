# ContentForge — AI Content Studio

AI-powered content generation platform for Instagram & TikTok creators.

## Tech Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (custom dark theme)
- **Prisma ORM** + PostgreSQL (Supabase)
- **OpenAI API** (GPT-4.1 for text, GPT Image 1.5 for images)
- **NextAuth.js** (credentials auth)
- **Vercel** (hosting, auto-deploy)

## Features
- 🎯 **Content Studio** — Generate captions, hashtags, hooks, and scripts
- 🖼️ **Image Studio** — Create professional images with GPT Image 1.5
- 📚 **Content Library** — Save, organize, and manage all content
- 📝 **Templates** — Reusable prompt templates for consistency
- 🎨 **Brand Kit** — Define colors, voice, audience for personalized AI
- 📱 **Multi-platform** — Optimized for Instagram + TikTok

## Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd contentforge
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```
DATABASE_URL=your-supabase-pooled-url
DIRECT_URL=your-supabase-direct-url
NEXTAUTH_SECRET=generate-with-crypto
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-key
```

### 3. Database
```bash
npm run db:push    # Push schema to Supabase
npm run db:seed    # Seed initial data
```

### 4. Run
```bash
npm run dev
```

### Default Login
- Email: `admin@contentforge.app`
- Password: `admin123`

## Deployment (Vercel)
The build script automatically runs `prisma db push` on every deploy:
```json
"build": "npx prisma generate && npx prisma db push --skip-generate && next build"
```

Set all environment variables in Vercel → Settings → Environment Variables.
