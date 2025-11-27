# Docusaurus GitHub Pages Deployment Guide

## Overview

This guide explains how to deploy your Docusaurus site to GitHub Pages using the `gh-pages` branch.

## Important: Understanding the Deployment Process

### Source vs. Built Files

- **master branch**: Contains source code (.tsx, .ts, .md files)
- **gh-pages branch**: Contains built static files (index.html, .js, .css)

**The gh-pages branch is automatically managed by Docusaurus and should NOT be manually edited.**

## Prerequisites

1. GitHub repository created
2. Node.js 20+ installed
3. Dependencies installed (`npm install` in the `docs/` directory)

## Step 1: Configure Your Repository

### 1.1 Update docusaurus.config.ts

Replace the TODO placeholders in `docs/docusaurus.config.ts`:

```typescript
// Example: If your GitHub username is "johndoe" and repo is "ai-robotics-textbook"
url: 'https://johndoe.github.io',
baseUrl: '/ai-robotics-textbook/',
organizationName: 'johndoe',
projectName: 'ai-robotics-textbook',
```

### 1.2 Set Up Git Remote

If you haven't already, add your GitHub repository as a remote:

```bash
cd "/mnt/e/Q4 extension/Hackathon 2k25/add-hackathon-2k25"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```

## Step 2: Deployment Methods

### Method 1: Manual Deployment (npm run deploy)

This is the quickest method for one-time deployments:

```bash
cd docs
npm run deploy
```

**What this does:**
1. Builds your site (`npm run build`)
2. Creates/updates the `gh-pages` branch
3. Copies built files to `gh-pages` branch
4. Pushes to GitHub

**Important:** You need to configure Git credentials first:

```bash
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```

### Method 2: GitHub Actions (Recommended)

GitHub Actions automatically deploys your site whenever you push to master.

**Advantages:**
- Automatic deployment on every push
- No local build required
- Consistent deployment environment
- No need to manage gh-pages branch manually

**Setup:**

1. Create `.github/workflows/deploy.yml` (already created in this repo)
2. Enable GitHub Pages in repository settings:
   - Go to: Repository → Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Click Save

3. Push your code to master:

```bash
git add .
git commit -m "feat: configure Docusaurus for GitHub Pages"
git push origin master
```

4. GitHub Actions will automatically:
   - Build your site
   - Deploy to gh-pages branch
   - Make it available at: `https://YOUR-USERNAME.github.io/REPO-NAME/`

## Step 3: Verify Deployment

### Check GitHub Actions

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. You should see a workflow running
4. Wait for it to complete (green checkmark)

### Check GitHub Pages Settings

1. Go to: Repository → Settings → Pages
2. You should see: "Your site is published at https://..."
3. Click the link to view your deployed site

### Local Testing Before Deployment

Always test the build locally before deploying:

```bash
cd docs
npm run build
npm run serve
```

This serves the built site at `http://localhost:3000` (or similar).

## Common Issues and Solutions

### Issue 1: 404 Error on Deployment

**Cause:** Incorrect `baseUrl` in `docusaurus.config.ts`

**Solution:**
- For project pages: `baseUrl: '/repository-name/'`
- For user/org pages: `baseUrl: '/'`

### Issue 2: CSS/JS Not Loading

**Cause:** Wrong `url` or `baseUrl` configuration

**Solution:** Ensure:
```typescript
url: 'https://YOUR-USERNAME.github.io',
baseUrl: '/YOUR-REPO-NAME/',
```

### Issue 3: gh-pages Branch Has Wrong Files

**Cause:** Manual editing of gh-pages branch

**Solution:**
1. Delete the gh-pages branch: `git push origin --delete gh-pages`
2. Redeploy using `npm run deploy`

### Issue 4: GitHub Actions Fails

**Cause:** Permissions issue

**Solution:**
1. Go to: Repository → Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Click Save

## Deployment Checklist

Before deploying:

- [ ] Updated `docusaurus.config.ts` with correct GitHub details
- [ ] Tested locally with `npm run build && npm run serve`
- [ ] Committed all changes to master branch
- [ ] Set up GitHub Pages in repository settings
- [ ] Enabled GitHub Actions workflow permissions

After deploying:

- [ ] Verify GitHub Actions workflow completed successfully
- [ ] Check GitHub Pages URL loads correctly
- [ ] Verify navigation works
- [ ] Verify search works (if enabled)
- [ ] Check mobile responsiveness

## Directory Structure

```
master branch:
├── docs/                          # Docusaurus source
│   ├── src/                       # React components, pages
│   ├── docs/                      # Markdown documentation
│   ├── blog/                      # Blog posts
│   ├── static/                    # Static assets
│   ├── docusaurus.config.ts       # Configuration
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml             # GitHub Actions workflow

gh-pages branch (auto-generated):
├── index.html                     # Built homepage
├── docs/                          # Built documentation pages
├── blog/                          # Built blog pages
├── assets/                        # Bundled CSS, JS
│   ├── css/
│   └── js/
└── img/                           # Copied static images
```

## Advanced: Custom Domain

If you want to use a custom domain (e.g., `textbook.example.com`):

1. Create a `static/CNAME` file:
```
textbook.example.com
```

2. Configure DNS with your domain provider:
```
Type: CNAME
Name: textbook (or @)
Value: YOUR-USERNAME.github.io
```

3. Enable HTTPS in GitHub Pages settings

## Maintenance

### Updating Content

1. Edit files in master branch
2. Commit and push to master
3. GitHub Actions automatically rebuilds and deploys

### Rebuilding Manually

```bash
cd docs
npm run deploy
```

### Checking Build Size

```bash
cd docs
npm run build
du -sh build/
```

Keep build size under 1GB for GitHub Pages.

## Resources

- [Docusaurus Deployment Docs](https://docusaurus.io/docs/deployment)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
