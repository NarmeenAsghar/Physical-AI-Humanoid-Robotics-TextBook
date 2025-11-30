# Hugging Face Spaces - Quick Deployment Checklist

## ✅ Files Created (Ready to Deploy)

- [x] `app.py` - Hugging Face entry point
- [x] `requirements.txt` - Python dependencies
- [x] `Dockerfile` - Container configuration
- [x] `README_HF.md` - Space README with metadata
- [x] `src/` - FastAPI application code

## 🚀 Deployment Steps

### 1. Create Hugging Face Account (2 min)
- [ ] Go to https://huggingface.co/join
- [ ] Sign up (NO credit card needed!)
- [ ] Verify email

### 2. Create New Space (2 min)
- [ ] Go to https://huggingface.co/spaces
- [ ] Click **"Create new Space"**
- [ ] Name: `physical-ai-chatbot-api`
- [ ] SDK: **Docker**
- [ ] Hardware: **CPU basic** (free)
- [ ] Visibility: **Public**
- [ ] Click **"Create Space"**

### 3. Prepare README (1 min)
```bash
cd "E:\Q4 extension\Hackathon 2k25\add-hackathon-2k25\api"

# Backup original README
mv README.md README_LOCAL.md

# Use Hugging Face README
cp README_HF.md README.md
```

### 4. Push to Hugging Face (3 min)
```bash
cd "E:\Q4 extension\Hackathon 2k25\add-hackathon-2k25"

# Add Hugging Face remote (replace YOUR_USERNAME)
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/physical-ai-chatbot-api

# Commit all deployment files
git add api/app.py api/Dockerfile api/README.md api/requirements.txt
git commit -m "Add Hugging Face Spaces deployment configuration"

# Push only api folder
git subtree push --prefix api hf main
```

### 5. Configure Secrets (2 min)
In your Space → **Settings** → **Repository secrets**:

- [ ] `GEMINI_API_KEY` = Get from https://aistudio.google.com/app/apikey
- [ ] `QDRANT_URL` = `https://xxxxx.cloud.qdrant.io:6333`
- [ ] `QDRANT_API_KEY` = Your Qdrant API key
- [ ] `CORS_ORIGINS` = `https://naimalarain13.github.io,http://localhost:3000`

### 6. Wait for Build (3-5 min)
- [ ] Watch **"Logs"** tab
- [ ] Wait for: `✅ Application startup complete`
- [ ] Status shows: **"Running"**

### 7. Test Deployment (1 min)
```bash
# Replace YOUR_USERNAME with your HF username
curl https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/api/health
```

Expected: `{"status": "healthy", "version": "1.0.0"}`

### 8. Index Content (2 min)
```bash
cd api

# Set production credentials
export QDRANT_URL="https://xxxxx.cloud.qdrant.io:6333"
export QDRANT_API_KEY="your_key"
export GEMINI_API_KEY="your_key"

# Run indexing
python scripts/index_content.py
```

### 9. Update Frontend (1 min)
Edit `docs/docusaurus.config.ts`:
```typescript
customFields: {
  chatbotApiUrl: 'https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/api',
},
```

### 10. Deploy Frontend (2 min)
```bash
cd docs
npm run build
npm run deploy
```

### 11. Test End-to-End (1 min)
- [ ] Open: `https://naimalarain13.github.io/physical-ai-and-humaniod-robotics/`
- [ ] Select text on any lesson
- [ ] Click "💬 Ask about this"
- [ ] Verify chatbot responds

## 🎯 Total Time: ~20 minutes

## 📝 Your URLs

After deployment:

- **Space URL**: `https://huggingface.co/spaces/YOUR_USERNAME/physical-ai-chatbot-api`
- **API URL**: `https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space`
- **Health**: `https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/api/health`
- **Docs**: `https://YOUR_USERNAME-physical-ai-chatbot-api.hf.space/docs`

## ⚠️ Common Issues

**Build fails:**
- Check logs for Python/dependency errors
- Verify Dockerfile syntax
- Ensure `src/` directory structure is correct

**API returns 500:**
- Check if secrets are set correctly
- View logs for startup errors

**CORS errors:**
- Verify `CORS_ORIGINS` includes your frontend URL
- Restart Space after updating secrets

## 💰 Cost: $0

Everything is completely free:
- Hugging Face Spaces (CPU basic): Free
- Gemini API (free tier): Free
- Qdrant Cloud (1GB): Free

## 🆘 Need Help?

- Read full guide: `HUGGINGFACE_DEPLOYMENT.md`
- HF Docs: https://huggingface.co/docs/hub/spaces
- HF Forum: https://discuss.huggingface.co/

---

**Ready to deploy? Start with Step 1! 🚀**
