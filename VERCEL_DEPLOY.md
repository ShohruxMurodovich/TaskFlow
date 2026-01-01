# Quick Vercel Deployment

## Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

## Step 2: Deploy Frontend
```bash
cd frontend
vercel deploy --prod
```

When prompted:
- Login/create account (use GitHub)
- Accept defaults (just press Enter)
- Project will deploy in ~2 minutes

## Step 3: Configure Environment
After deploy, go to: https://vercel.com/dashboard

1. Find your project → Settings → Environment Variables
2. Add:
   ```
   NUXT_PUBLIC_API_BASE = https://taskflow-production-f7db.up.railway.app/api
   ```
3. Redeploy from dashboard

## Step 4: Update Backend CORS
In Railway Backend → Variables:
```
CLIENT_URL = https://your-frontend-url.vercel.app
```

**Done!** Your app will be fully deployed in under 5 minutes.

**Alternatively, connect GitHub:**
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repo
4. Set Root Directory: `frontend`
5. Add environment variable
6. Deploy

This is THE fastest and most reliable way to deploy Nuxt 3.
