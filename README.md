# 3D Print Showcase Platform

A modern platform for showcasing and discovering 3D prints, built with Next.js, Supabase, and Three.js.

## ✅ What's Done

- ✅ Next.js 15 project structure
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ Supabase client configured
- ✅ Three.js 3D viewer component
- ✅ Core components (PrintCard, UploadForm, UpvoteButton)
- ✅ Git repository initialized

## 📝 Next Steps

### 1. Set Up Supabase (10 minutes)

1. Go to https://supabase.com
2. Click "Start your project" → Sign up/Login
3. Click "New Project"
4. Fill in:
   - **Name:** `3d-print-platform`
   - **Database Password:** (generate strong password, save it!)
   - **Region:** Choose closest to you
   - **Pricing:** Free
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

### 2. Get API Keys

1. In Supabase dashboard → Settings → API
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

### 3. Create Environment File

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database

1. In Supabase dashboard → SQL Editor → New Query
2. Copy the entire contents of `database-schema.sql`
3. Paste into editor
4. Click "Run"
5. You should see "Success. No rows returned" ✅

### 5. Set Up Storage Buckets

1. In Supabase dashboard → Storage → New bucket
2. Create bucket named `models`:
   - Name: `models`
   - Public: ✅ Yes
3. Create bucket named `images`:
   - Name: `images`
   - Public: ✅ Yes

4. For each bucket → Policies → New Policy → Custom:

**For viewing files (SELECT):**
```sql
bucket_id = 'models' OR bucket_id = 'images'
```
Check: SELECT, Target: public

**For uploading files (INSERT):**
```sql
(bucket_id = 'models' OR bucket_id = 'images') AND auth.role() = 'authenticated'
```
Check: INSERT, Target: authenticated

### 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 🎉

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 + React 18 + TypeScript
- **Backend:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **3D Viewer:** Three.js + React Three Fiber
- **UI:** Tailwind CSS
- **Hosting:** Vercel (when ready to deploy)

## 📁 Project Structure

```
3d-print-platform/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ModelViewer.tsx   # 3D model viewer
│   │   ├── PrintCard.tsx     # Gallery item
│   │   ├── UploadForm.tsx    # Upload form
│   │   └── UpvoteButton.tsx  # Upvote functionality
│   └── lib/
│       └── supabase.ts       # Supabase client
├── database-schema.sql       # Database setup
├── .env.local.example        # Environment template
└── .env.local                # Your keys (don't commit!)
```

## 🚀 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Three.js Docs](https://threejs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎯 Roadmap

- [ ] Complete Supabase setup
- [ ] Build gallery page
- [ ] Create print detail page with 3D viewer
- [ ] Add upload functionality
- [ ] Add authentication
- [ ] Add comments system
- [ ] Deploy to Vercel

---

Ready to continue? Follow the "Next Steps" above to set up Supabase!
