# Render Deployment Guide

Complete guide for deploying the Physical AI Chatbot API to Render.

## Prerequisites

- GitHub repository with the code pushed
- Render account (free): https://render.com
- Gemini API Key: https://aistudio.google.com/app/apikey
- Qdrant Cloud instance: https://cloud.qdrant.io

## Step 1: Prepare Repository

Ensure these files are in your `api/` directory:
- ✅ `requirements.txt` (created)
- ✅ `render.yaml` (created)
- ✅ `src/main.py` (existing)
- ✅ `.env.example` (for reference)

**Commit and push to GitHub:**

```bash
cd /mnt/e/Q4\ extension/Hackathon\ 2k25/add-hackathon-2k25
git add api/requirements.txt api/render.yaml
git commit -m "Add Render deployment configuration"
git push origin main
```

## Step 2: Create Render Web Service

### Option A: Using render.yaml (Recommended)

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Click **"Apply"**

### Option B: Manual Setup

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `physical-ai-chatbot-api`
   - **Region**: Choose closest to you
   - **Root Directory**: `api`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`

## Step 3: Configure Environment Variables

In Render Dashboard → Your Service → **Environment**:

Add these environment variables:

```env
GEMINI_API_KEY=<your_gemini_api_key>
QDRANT_URL=https://<your-instance>.cloud.qdrant.io:6333
QDRANT_API_KEY=<your_qdrant_api_key>
CORS_ORIGINS=https://naimalarain13.github.io,http://localhost:3000
PYTHON_VERSION=3.11.0
```

### Where to get credentials:

#### 1. Gemini API Key
- Go to: https://aistudio.google.com/app/apikey
- Click **"Create API Key"**
- Copy the key

#### 2. Qdrant Cloud
- Go to: https://cloud.qdrant.io
- Create a cluster (free tier)
- Get **Cluster URL** and **API Key** from dashboard

## Step 4: Index Your Content

**After deployment succeeds**, you need to index the textbook content:

### Option 1: Run indexing script locally (points to production Qdrant)

```bash
cd api

# Make sure .env has production Qdrant credentials
python scripts/index_content.py
```

### Option 2: Trigger indexing via API (if you add an endpoint)

```bash
curl -X POST https://your-app.onrender.com/api/index \
  -H "Authorization: Bearer <your-admin-token>"
```

## Step 5: Test Deployment

### Test Health Endpoint

```bash
curl https://your-app.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### Test Chat Endpoint

```bash
curl -X POST https://your-app.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is embodied intelligence?",
    "conversation_history": []
  }'
```

Expected: Streaming response with textbook content

## Step 6: Update Frontend Configuration

Update `docs/docusaurus.config.ts`:

```typescript
customFields: {
  chatbotApiUrl: 'https://your-app.onrender.com/api',
},
```

Then rebuild and deploy frontend:

```bash
cd docs
npm run build
npm run deploy  # If using GitHub Pages
```

## Troubleshooting

### Build Fails

**Error: Python version not found**
- Solution: Add `PYTHON_VERSION=3.11.0` to environment variables

**Error: Package installation fails**
- Solution: Check `requirements.txt` syntax
- Try: `pip install -r requirements.txt` locally first

### Deployment Succeeds But Returns 502

**Check Render Logs:**
1. Dashboard → Your Service → **Logs**
2. Look for errors in startup

**Common issues:**
- Missing environment variables (GEMINI_API_KEY, QDRANT_URL, QDRANT_API_KEY)
- Port not set correctly (Render sets `$PORT` automatically)
- Import errors in Python code

### CORS Errors

**Error: "Access to fetch blocked by CORS policy"**

Solution: Update CORS_ORIGINS in Render environment:
```
CORS_ORIGINS=https://naimalarain13.github.io,http://localhost:3000
```

### Free Tier Limitations

- ⏰ **Spin down after 15 minutes of inactivity**
  - First request after spin-down takes ~30 seconds (cold start)
  - Keep-alive services not allowed on free tier

- 📦 **Build minutes**: 500 minutes/month
- 🌐 **Bandwidth**: 100 GB/month
- 💾 **Disk**: Temporary (ephemeral)

## Monitoring

### View Logs

Dashboard → Your Service → **Logs**

Watch for:
- ✅ `Application startup complete`
- ✅ `Uvicorn running on http://0.0.0.0:XXXX`
- ❌ Any error messages

### Health Checks

Render automatically pings `/api/health` every 30 seconds.

If health check fails 3 times, service is marked unhealthy.

## Deployment URL

Your API will be available at:
```
https://physical-ai-chatbot-api.onrender.com
```

Or custom domain if configured.

## Next Steps

After successful deployment:

1. ✅ Index textbook content to Qdrant
2. ✅ Test all chatbot features
3. ✅ Update frontend API URL
4. ✅ Deploy frontend to GitHub Pages
5. ✅ Test end-to-end flow

## Cost: $0

- Render Free Tier: $0/month
- Gemini API (Free tier): $0 for 15 requests/minute
- Qdrant Cloud (Free tier): $0 for 1GB storage
- **Total: $0/month**

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Status Page: https://status.render.com
