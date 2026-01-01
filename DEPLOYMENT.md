# 🚀 Deployment Guide: Railway.app

This guide assumes you have pushed your code to GitHub (which you just did!).

## Step 1: Create a Railway Account & Project
1. Go to [Railway.app](https://railway.app/) and sign up (login with GitHub recommended).
2. Click **"New Project"** → **"Deploy from GitHub repo"**.
3. Select your repository: `TaskFlow`.
4. Click **"Deploy Now"**.

> **Note:** Initially, the deployment might fail or create a single service. We need to configure it as two separate services (One project, two services).

## Step 2: Configure the Backend Service

1. Click on the card for your repository (it might be trying to build the root).
2. Go to **Settings** → **Root Directory**.
3. Change it to `/backend`.
4. Go to **Variables** tab and add:
   - `MONGODB_URI`: Your production MongoDB connection string (from Atlas).
   - `JWT_SECRET`: A strong random string.
   - `JWT_EXPIRE`: `7d`
   - `PORT`: `5000` (Railway will override this internally, but good to have).
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://<your-frontend-domain>.up.railway.app` (You'll get this URL in Step 3, come back and update it later).

5. Railway should restart the build automatically. If not, click **Deployments** → **Redeploy**.
6. Once deployed, go to **Settings** → **Networking**.
7. Click **Generate Domain**. Copy this URL (e.g., `taskflow-production.up.railway.app`). This is your `API_URL`.

## Step 3: Configure the Frontend Service

1. In the same Railway project view, click **"+ New"** (top right) → **GitHub Repo**.
2. Select `TaskFlow` again. This creates a second service card.
3. Click the new card.
4. Go to **Settings** → **Root Directory**.
5. Change it to `/frontend`.
6. Go to **Variables** tab and add:
   - `NUXT_PUBLIC_API_BASE`: `https://<your-backend-domain>.up.railway.app/api`
     *(Paste the Backend URL you generated in Step 2, and append `/api`)*.

7. Railway will build the frontend.
8. Go to **Settings** → **Networking**.
9. Click **Generate Domain**.
10. **Done!** Click this URL to open your live app.

## Step 4: Final Connection (CORS)

1. Go back to your **Backend Service** variables.
2. Update `CLIENT_URL` to match your **Frontend Domain** (e.g., `https://taskflow-frontend.up.railway.app`).
3. This ensures standard CORS security works correctly.

## ✅ Summary of Variables

### Backend Variables
| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | `somelongsecret...` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://your-frontend.up.railway.app` |

### Frontend Variables
| Variable | Value |
|----------|-------|
| `NUXT_PUBLIC_API_BASE` | `https://your-backend.up.railway.app/api` |

---

Enjoy your deployed Task Management System! 🚀
