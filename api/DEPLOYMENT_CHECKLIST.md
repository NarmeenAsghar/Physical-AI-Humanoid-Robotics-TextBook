# Render Deployment Checklist

Quick checklist for deploying to Render.

## Pre-Deployment ✓

- [ ] **Code pushed to GitHub**
  ```bash
  git add api/requirements.txt api/render.yaml api/RENDER_DEPLOYMENT.md
  git commit -m "Add Render deployment configuration"
  git push origin main
  ```

- [ ] **Gemini API Key ready**
  - Get from: https://aistudio.google.com/app/apikey

- [ ] **Qdrant Cloud instance ready**
  - Cluster URL: `https://xxxxx.cloud.qdrant.io:6333`
  - API Key: `xxxxx`

## Render Setup ✓

- [ ] **Create Render account**
  - Sign up at: https://render.com

- [ ] **Connect GitHub repository**
  - Render Dashboard → New → Blueprint
  - Select your repository

- [ ] **Configure environment variables**
  ```
  GEMINI_API_KEY=your_key_here
  QDRANT_URL=https://xxxxx.cloud.qdrant.io:6333
  QDRANT_API_KEY=your_key_here
  CORS_ORIGINS=https://naimalarain13.github.io,http://localhost:3000
  ```

- [ ] **Deploy service**
  - Click "Apply" to deploy from render.yaml
  - Wait for build to complete (~2-5 minutes)

## Post-Deployment ✓

- [ ] **Check deployment logs**
  - Should see: `Application startup complete`
  - Should see: `Uvicorn running on...`

- [ ] **Test health endpoint**
  ```bash
  curl https://your-app.onrender.com/api/health
  ```

- [ ] **Index textbook content**
  ```bash
  cd api
  # Update .env with production Qdrant credentials
  python scripts/index_content.py
  ```

- [ ] **Test chat endpoint**
  ```bash
  curl -X POST https://your-app.onrender.com/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "What is embodied intelligence?"}'
  ```

- [ ] **Update frontend API URL**
  - Edit: `docs/docusaurus.config.ts`
  - Set: `chatbotApiUrl: 'https://your-app.onrender.com/api'`

- [ ] **Rebuild and deploy frontend**
  ```bash
  cd docs
  npm run build
  npm run deploy
  ```

- [ ] **Test end-to-end**
  - Open your deployed site
  - Select text → Click "Ask about this"
  - Verify chatbot responds

## Your Deployment URLs

- **Backend API**: `https://your-app.onrender.com`
- **Frontend**: `https://naimalarain13.github.io/physical-ai-and-humaniod-robotics/`
- **API Health**: `https://your-app.onrender.com/api/health`
- **API Docs**: `https://your-app.onrender.com/docs`

## Quick Test Commands

### 1. Test Health
```bash
curl https://your-app.onrender.com/api/health
```

### 2. Test Chat
```bash
curl -X POST https://your-app.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is ROS 2?",
    "conversation_history": []
  }'
```

### 3. Check CORS
```bash
curl -H "Origin: https://naimalarain13.github.io" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://your-app.onrender.com/api/chat -v
```

## Troubleshooting

### Build Fails
- Check Render logs for Python/package errors
- Verify `requirements.txt` is correct
- Ensure `PYTHON_VERSION=3.11.0` is set

### 502 Bad Gateway
- Check if all environment variables are set
- View logs for startup errors
- Verify port is using `$PORT` (Render provides this)

### CORS Errors
- Add frontend URL to `CORS_ORIGINS`
- Format: `https://naimalarain13.github.io,http://localhost:3000`

### Slow First Request
- ⚠️ Free tier spins down after 15 minutes
- First request takes ~30 seconds (cold start)
- This is expected behavior on free tier

## Next Steps

After deployment succeeds:

1. Copy your Render app URL
2. Update frontend config with API URL
3. Deploy frontend to GitHub Pages
4. Test the full chatbot flow
5. Share your demo! 🎉

## Support

- **Render Docs**: https://render.com/docs/deploy-fastapi
- **Community**: https://community.render.com
- **Status**: https://status.render.com
