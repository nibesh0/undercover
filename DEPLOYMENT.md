# Deployment Instructions for Render

## Quick Start Guide

### 1. Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `https://github.com/nibesh0/undercover`
4. Configure:
   - **Name**: `undercover-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT app:app`
   - **Instance Type**: Free
5. Add Environment Variables:
   - `PYTHON_VERSION`: `3.12`
   - `SECRET_KEY`: (generate a random string)
   - `CORS_ORIGINS`: `*` (update after frontend deployment)
   - `FLASK_ENV`: `production`
6. Click **"Create Web Service"**
7. **Copy the backend URL** (e.g., `https://undercover-backend.onrender.com`)

### 2. Deploy Frontend on Vercel (Recommended)

Vercel is better for Next.js apps:

1. Go to [Vercel](https://vercel.com)
2. Click "Import Project"
3. Import from GitHub: `https://github.com/nibesh0/undercover`
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
5. Add Environment Variable:
   - `NEXT_PUBLIC_BACKEND_URL`: (your backend URL from step 1)
6. Click "Deploy"
7. Copy your frontend URL

### 3. Update Backend CORS

After frontend deployment:

1. Go back to Render backend settings
2. Update `CORS_ORIGINS` environment variable:
   - Value: `https://your-frontend-url.vercel.app`
3. Redeploy backend

### 4. Test Your Deployment

1. Visit your frontend URL
2. Create a game and test multiplayer functionality

---

## Alternative: Deploy Frontend on Render

If you prefer to keep everything on Render:

1. Click **"New +"** → **"Static Site"**
2. Connect repository
3. Configure:
   - **Name**: `undercover-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build && npm run export`
   - **Publish Directory**: `out`
4. Add environment variable:
   - `NEXT_PUBLIC_BACKEND_URL`: (your backend URL)

**Note**: Static site deployment on Render free tier is limited. Vercel is recommended for Next.js.

---

## Important Notes

### Free Tier Limitations
- Backend sleeps after 15 minutes of inactivity on Render free tier
- First request takes 30-60 seconds to wake up
- WebSocket connections may drop after sleep

### Environment Variables Checklist

**Backend (Render):**
- ✅ `PYTHON_VERSION`
- ✅ `SECRET_KEY`
- ✅ `CORS_ORIGINS`
- ✅ `FLASK_ENV`

**Frontend (Vercel/Render):**
- ✅ `NEXT_PUBLIC_BACKEND_URL`

---

For detailed documentation, see `deployment_guide.md`.
