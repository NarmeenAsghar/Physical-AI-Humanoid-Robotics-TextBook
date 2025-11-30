# Hugging Face Spaces Deployment Guide

Complete guide for deploying the Physical AI Chatbot API to Hugging Face Spaces.

## Why Hugging Face Spaces?

- ✅ **100% Free** - No credit card required
- ✅ **Public demos** - Perfect for hackathons and showcasing
- ✅ **Easy deployment** - Git-based workflow
- ✅ **Built-in CI/CD** - Auto-deploys on push
- ✅ **Community** - ML/AI focused platform

## Prerequisites

- Hugging Face account (free): https://huggingface.co/join
- Git installed locally
- Gemini API Key: https://aistudio.google.com/app/apikey
- Qdrant Cloud instance: https://cloud.qdrant.io

## Step 1: Create Hugging Face Account

1. Go to https://huggingface.co/join
2. Sign up with email or GitHub
3. Verify your email
4. ✅ No credit card needed!

## Step 2: Create a New Space

1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Configure:
   - **Owner**: Your username
   - **Space name**: `physical-ai-chatbot-api`
   - **License**: MIT
   - **Select SDK**: **Docker**
   - **Space hardware**: **CPU basic** (free)
   - **Visibility**: **Public** (for hackathon demos)
4. Click **"Create Space"**

## Step 3: Prepare Your Repository

### Files needed (already created):
- ✅ `app.py` - Entry point for Hugging Face
- ✅ `requirements.txt` - Python dependencies
- ✅ `Dockerfile` - Container configuration
- ✅ `README_HF.md` - Space README with metadata
- ✅ `src/` - Your FastAPI application code

### Rename README for Hugging Face:

In your terminal:
```bash
cd "E:\Q4 extension\Hackathon 2k25\add-hackathon-2k25\api"

# Backup original README
mv README.md README_LOCAL.md

# Use Hugging Face README
cp README_HF.md README.md
```

## Step 4: Push Code to Hugging Face

Hugging Face Spaces uses Git for deployment.

### Get your Space's Git URL:

After creating the Space, you'll see:
```
git clone https://huggingface.co/spaces/YOUR_USERNAME/physical-ai-chatbot-api
```

### Deploy using Git:

```bash
cd "E:\Q4 extension\Hackathon 2k25\add-hackathon-2k25"

# Add Hugging Face as a remote (replace YOUR_USERNAME)
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/physical-ai-chatbot-api

# Push only the api folder to Hugging Face
git subtree push --prefix api hf main
```

**Alternative: Push entire repo:**
```bash
# If you want to push the entire repo
git push hf backend-deployment:main
```

## Step 5: Configure Secrets (Environment Variables)

In your Hugging Face Space:

1. Go to your Space page
2. Click **"Settings"** (top right)
3. Scroll to **"Repository secrets"**
4. Add these secrets:

```
GEMINI_API_KEY = your_gemini_api_key_here
QDRANT_URL = https://xxxxx.cloud.qdrant.io:6333
QDRANT_API_KEY = your_qdrant_api_key_here
CORS_ORIGINS = https://naimalarain13.github.io,http://localhost:3000
```

### Where to get credentials:

#### 1. Gemini API Key
- Go to: https://aistudio.google.com/app/apikey
- Click **"Create API Key"**
- Copy the key

#### 2. Qdrant Cloud
- Go to: https://cloud.qdrant.io
- Create a cluster (free tier, 1GB)
- Copy **Cluster URL** and **API Key**

## Step 6: Wait for Build

1. Hugging Face will automatically detect your push
2. Build starts automatically (takes 3-5 minutes)
3. Watch build logs in the **"Logs"** tab
4. Status changes from "Building" → "Running"

### Build Success Indicators:
```
✅ Container built successfully
✅ Application startup complete
✅ Uvicorn running on http://0.0.0.0:7860
```

## Step 7: Test Your Deployment

Your Space will be live at:
```
https://huggingface.co/spaces/YOUR_USERNAME/physical-ai-chatbot-api
```

### Test Health Endpoint:

```bash
curl https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### Test Chat Endpoint:

```bash
curl -X POST https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is embodied intelligence?",
    "conversation_history": []
  }'
```

### Interactive API Docs:

Visit:
```
https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/docs
```

## Step 8: Index Your Content

After deployment succeeds, index the textbook content:

```bash
cd api

# Update .env with production Qdrant credentials
export QDRANT_URL="https://xxxxx.cloud.qdrant.io:6333"
export QDRANT_API_KEY="your_key"
export GEMINI_API_KEY="your_key"

# Run indexing script
python scripts/index_content.py
```

This uploads all textbook content to your Qdrant Cloud instance.

## Step 9: Update Frontend

Update `docs/docusaurus.config.ts`:

```typescript
customFields: {
  chatbotApiUrl: 'https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/api',
},
```

Then rebuild and deploy frontend:
```bash
cd docs
npm run build
npm run deploy
```

## Step 10: Test End-to-End

1. Open your deployed site: `https://naimalarain13.github.io/physical-ai-and-humaniod-robotics/`
2. Open any lesson page
3. Select text → Click "💬 Ask about this"
4. Verify chatbot responds with textbook content

## Troubleshooting

### Build Fails

**Error: "No module named 'src'"**
- Solution: Ensure `src/` directory structure is correct
- Check that `app.py` imports: `from src.main import app`

**Error: "requirements.txt not found"**
- Solution: Ensure `requirements.txt` is in the same directory as `Dockerfile`

**Error: Python version mismatch**
- Solution: Dockerfile uses Python 3.11 - matches your local setup

### Space Runs But API Fails

**Check logs:**
1. Go to your Space → **"Logs"** tab
2. Look for startup errors

**Common issues:**
- Missing environment secrets (GEMINI_API_KEY, QDRANT_URL, QDRANT_API_KEY)
- CORS configuration - add your frontend URL to CORS_ORIGINS

### CORS Errors

**Error: "Access to fetch blocked by CORS policy"**

Solution: Add frontend URL to `CORS_ORIGINS` secret:
```
CORS_ORIGINS=https://naimalarain13.github.io,http://localhost:3000
```

Then restart the Space (Settings → Factory reboot)

### Slow Responses

On the free tier:
- ⏰ Spaces may hibernate after 48h of inactivity
- First request after hibernation takes ~30 seconds
- This is normal for free tier

To keep alive (not recommended for free tier):
- Upgrade to persistent hardware (costs money)

## Space Configuration

### Hardware Options:

- **CPU basic** (Free): 2 vCPU, 16GB RAM
- **CPU upgrade** ($0.03/hour): 8 vCPU, 32GB RAM
- **GPU T4** ($0.60/hour): For ML inference

For this chatbot, **CPU basic (free)** is sufficient.

### Space Settings:

- **Visibility**: Public (free) or Private (requires payment)
- **Sleep time**: Free tier sleeps after 48h inactivity
- **Gradio vs Docker**: We use Docker SDK

## Updating Your Space

To deploy updates:

```bash
# Make changes to your code
git add .
git commit -m "Update: your changes"

# Push to Hugging Face
git subtree push --prefix api hf main
```

Hugging Face automatically rebuilds and redeploys.

## Monitoring

### View Logs:
Space page → **"Logs"** tab

### Check Status:
Space page → Shows "Running" or "Building"

### View Metrics:
Space page → **"Settings"** → Usage stats

## Cost: $0

- ✅ Hugging Face Spaces CPU basic: **Free**
- ✅ Gemini 1.5 Flash: **Free** (15 req/min)
- ✅ Qdrant Cloud free tier: **Free** (1GB)
- ✅ Qdrant FastEmbed: **Free** (local)

**Total: $0/month** 🎉

## Your Deployment URLs

After deployment:

- **API Base**: `https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space`
- **Health**: `https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/api/health`
- **Chat**: `https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/api/chat`
- **Docs**: `https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/docs`
- **Space Page**: `https://huggingface.co/spaces/YOUR_USERNAME/physical-ai-chatbot-api`

## Next Steps

After successful deployment:

1. ✅ Copy your Space URL
2. ✅ Index textbook content to Qdrant
3. ✅ Update frontend config with API URL
4. ✅ Deploy frontend to GitHub Pages
5. ✅ Test end-to-end flow
6. ✅ Share your Space for feedback!

## Resources

- **Hugging Face Spaces Docs**: https://huggingface.co/docs/hub/spaces
- **Docker Spaces Guide**: https://huggingface.co/docs/hub/spaces-sdks-docker
- **FastAPI on Spaces**: https://huggingface.co/docs/hub/spaces-sdks-docker-fastapi
- **Community Forum**: https://discuss.huggingface.co/

## Support

Need help?
- Check Space logs first
- Visit HF community forum
- Open issue in GitHub repo

---

**Happy deploying! 🚀**
