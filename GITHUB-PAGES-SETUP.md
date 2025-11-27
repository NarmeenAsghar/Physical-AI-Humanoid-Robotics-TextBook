# GitHub Pages Deployment Setup - Quick Start

## Key Concept: Source vs. Built Files

**IMPORTANT:** The `gh-pages` branch should NOT have `index.tsx` or any source files!

```
master branch                    gh-pages branch
(Your source code)               (Auto-generated built files)
───────────────────              ────────────────────────────
✅ index.tsx                      ❌ index.tsx (WRONG!)
✅ docusaurus.config.ts           ✅ index.html (CORRECT!)
✅ docs/*.md                      ✅ assets/js/*.js
✅ src/components/                ✅ assets/css/*.css
```

**Never manually edit the gh-pages branch!** Docusaurus manages it automatically.

## Quick Setup (3 Steps)

### Step 1: Configure Your Repository

Option A - Use the configuration script:
```bash
cd docs
./configure-deployment.sh
```

Option B - Manual configuration:
Edit `docs/docusaurus.config.ts` and replace:
- `YOUR-GITHUB-USERNAME` → your GitHub username
- `REPOSITORY-NAME` → your repository name

### Step 2: Set Up GitHub Repository

```bash
# If you haven't created a GitHub repository yet:
# 1. Go to github.com and create a new repository
# 2. Then run:

git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git add .
git commit -m "feat: configure Docusaurus for GitHub Pages"
git push -u origin master
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **root**
   - Click **Save**
4. Wait 1-2 minutes for GitHub Actions to build and deploy
5. Your site will be live at: `https://YOUR-USERNAME.github.io/REPO-NAME/`

## How Deployment Works

### Automatic Deployment (Recommended)

GitHub Actions automatically deploys when you push to master:

```
Push to master → GitHub Actions → Build → Deploy to gh-pages → Live site
```

**What happens:**
1. You push code to `master` branch
2. GitHub Actions workflow triggers (`.github/workflows/deploy.yml`)
3. Workflow runs `npm run build` in the `docs/` directory
4. Built files are pushed to `gh-pages` branch
5. GitHub Pages serves the site from `gh-pages` branch

### Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
cd docs
npm run deploy
```

This builds and pushes to gh-pages in one command.

## Troubleshooting

### Problem: Site shows 404 error

**Solution:** Check `baseUrl` in `docusaurus.config.ts`:
- For project repositories: `baseUrl: '/repository-name/'` (with slashes!)
- For user/org pages: `baseUrl: '/'`

### Problem: CSS/JavaScript not loading

**Solution:** Verify your configuration:
```typescript
url: 'https://YOUR-USERNAME.github.io',  // No trailing slash
baseUrl: '/YOUR-REPO-NAME/',              // With trailing slash
```

### Problem: GitHub Actions fails

**Solutions:**
1. Go to: Settings → Actions → General
2. Under "Workflow permissions", select **"Read and write permissions"**
3. Click **Save**
4. Re-run the workflow

### Problem: Changes not appearing on site

**Solutions:**
1. Check if GitHub Actions workflow succeeded (Actions tab)
2. Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
3. Wait 1-2 minutes for GitHub Pages to update
4. Check if you're viewing the correct URL

## Testing Locally Before Deployment

Always test your build locally:

```bash
cd docs

# Build the site
npm run build

# Serve the built site
npm run serve
```

Open `http://localhost:3000` (or the URL shown) to preview exactly how it will look when deployed.

## File Structure Explained

```
Project Root
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions workflow (auto-deploys)
├── docs/                       ← Docusaurus source directory
│   ├── docs/                   ← Your markdown content
│   ├── src/                    ← React components (.tsx files)
│   ├── static/                 ← Images, fonts, etc.
│   ├── docusaurus.config.ts    ← Main configuration
│   ├── package.json
│   ├── DEPLOYMENT.md           ← Detailed deployment guide
│   └── configure-deployment.sh ← Configuration helper script
└── GITHUB-PAGES-SETUP.md       ← This file

Branches:
├── master                      ← Your source code (commit here)
└── gh-pages                    ← Auto-generated (don't touch!)
```

## Workflow for Making Changes

1. **Edit content** in the `master` branch:
   ```bash
   # Edit markdown files in docs/docs/
   # Edit React components in docs/src/
   # Edit configuration in docs/docusaurus.config.ts
   ```

2. **Test locally**:
   ```bash
   cd docs
   npm start  # Development server with hot reload
   ```

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "docs: update content"
   git push origin master
   ```

4. **GitHub Actions automatically**:
   - Builds your site
   - Deploys to gh-pages branch
   - Updates live site (1-2 minutes)

## Important Notes

1. **Never edit gh-pages branch directly** - it's auto-managed
2. **The gh-pages branch contains built files only** - no source code
3. **index.html is generated from your source files** - don't create it manually
4. **Always test with `npm run build` before pushing** - catches build errors early
5. **GitHub Actions is free for public repositories** - no cost to deploy

## Configuration Checklist

Before your first deployment:

- [ ] Updated `docs/docusaurus.config.ts` with your GitHub username/repo
- [ ] Created GitHub repository
- [ ] Added git remote: `git remote add origin https://github.com/...`
- [ ] Pushed to master branch
- [ ] Enabled GitHub Pages in repository settings (branch: gh-pages)
- [ ] Verified GitHub Actions has "Read and write permissions"

After deployment:

- [ ] GitHub Actions workflow completed successfully (check Actions tab)
- [ ] Site loads at `https://YOUR-USERNAME.github.io/REPO-NAME/`
- [ ] Navigation works correctly
- [ ] Images and assets load properly
- [ ] Mobile view works

## Next Steps

1. Read `docs/DEPLOYMENT.md` for detailed deployment information
2. Customize your site content in `docs/docs/`
3. Update the homepage in `docs/src/pages/index.tsx`
4. Add your textbook content as markdown files
5. Configure the RAG chatbot (future step)

## Resources

- [Docusaurus Deployment Guide](https://docusaurus.io/docs/deployment)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- Project Constitution: `.specify/memory/constitution.md`

## Support

If you encounter issues:
1. Check `docs/DEPLOYMENT.md` for detailed troubleshooting
2. Review GitHub Actions logs (Actions tab on GitHub)
3. Verify your configuration matches the examples above
4. Ensure you're testing with `npm run build` before deploying
