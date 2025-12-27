# Deploy to GitHub & Host Online

## Quick Deploy (2 minutes)

### Step 1: Create GitHub Repo

Go to: https://github.com/new

- **Repository name:** `webtest`
- **Visibility:** Public (or Private)
- **Don't** initialize with README (we already have files)
- Click "Create repository"

### Step 2: Push to GitHub

Copy these commands and run them:

```bash
cd /home/userland/3d-print-platform

# Add GitHub remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/webtest.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Hosting Options

### ❌ GitHub Pages Won't Work

**Why:** Next.js needs a Node.js server to run. GitHub Pages only hosts static HTML files.

### ✅ Use Vercel (FREE & Easy - 2 minutes)

Vercel is made by the Next.js team - perfect for this project.

**Steps:**

1. Go to: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Import your `webtest` repository
4. Click "Deploy"
5. Done! Your site is live at: `https://webtest-xyz.vercel.app`

**Cost:** $0 (Free forever for hobby projects)

---

## Alternative: Static Export (GitHub Pages Compatible)

If you REALLY want GitHub Pages, you can export a static version (but it won't have any dynamic features):

### 1. Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static export
  images: {
    unoptimized: true  // Required for static export
  }
}

module.exports = nextConfig
```

### 2. Build static site:

```bash
npm run build
```

### 3. Deploy to GitHub Pages:

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d out"

# Deploy
npm run deploy
```

### ⚠️ Limitations of Static Export:
- No server-side features
- No API routes
- No dynamic data
- Basically just the demo UI

---

## Recommended: Vercel Deployment

Here's exactly what to do:

### 1. Push to GitHub (see Step 2 above)

### 2. Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: webtest
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### 3. Add Environment Variables (if using Supabase):

In Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Done!

Your site is live at: `https://webtest.vercel.app`

---

## Quick Comparison

| Platform | Cost | Works with Next.js | Setup Time |
|----------|------|-------------------|------------|
| **GitHub Pages** | Free | ❌ No (static only) | 5 min |
| **Vercel** | Free | ✅ Yes (perfect) | 2 min |
| **Netlify** | Free | ✅ Yes | 3 min |
| **Railway** | $5/mo | ✅ Yes | 3 min |

---

## What I Recommend:

1. **Push to GitHub** ✅ (for version control)
2. **Deploy to Vercel** ✅ (for hosting)

**Result:**
- Code on GitHub: https://github.com/YOUR-USERNAME/webtest
- Live site on Vercel: https://webtest.vercel.app
- Total time: 5 minutes
- Total cost: $0

---

## Need Help?

Run these commands in order:

```bash
# 1. Make sure you're in project directory
cd /home/userland/3d-print-platform

# 2. Check current status
git status

# 3. Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/webtest.git

# 4. Push to GitHub
git push -u origin main

# 5. Deploy to Vercel
npx vercel --prod
```

Done! 🚀
