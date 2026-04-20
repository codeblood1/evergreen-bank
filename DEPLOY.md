# Deploy to Production (Vercel + GitHub)

This guide walks you through deploying Evergreen Bank to production using **GitHub** for source control and **Vercel** for hosting.

---

## Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (free tier works)
- [Node.js](https://nodejs.org) 20+ installed locally

---

## Step 1: Push to GitHub

### Option A: Using GitHub CLI (recommended)

```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Windows: winget install --id GitHub.cli
# Linux: see https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Authenticate with GitHub
gh auth login

# Create a new public repository and push
cd evergreen-bank
gh repo create evergreen-bank --public --source=. --push
```

### Option B: Manual

1. Go to [github.com/new](https://github.com/new)
2. Name it `evergreen-bank`, make it **Public**
3. Run these commands in your project folder:

```bash
cd evergreen-bank
git init
git add -A
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/evergreen-bank.git
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel --prod
```

### Option B: Using Vercel Dashboard (easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select **Import Git Repository**
3. Connect your GitHub account and select `evergreen-bank`
4. Vercel will auto-detect the Vite framework settings
5. Click **Deploy**

### Option C: Using the Deploy Script

```bash
# Make the script executable and run it
chmod +x deploy.sh
./deploy.sh
```

---

## Step 3: Configure Environment Variables (Important!)

After deployment, you **must** add your Supabase credentials to Vercel:

1. Go to your Vercel dashboard
2. Select the **evergreen-bank** project
3. Go to **Settings > Environment Variables**
4. Add these variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

5. Click **Save** and redeploy

---

## Step 4: Set Up GitHub Actions (Optional - Auto Deploy)

For automatic deployments on every push:

1. Get your Vercel tokens:

```bash
vercel tokens create
```

2. Go to your GitHub repo > **Settings > Secrets and variables > Actions**
3. Add these secrets:
   - `VERCEL_TOKEN` - From step 1
   - `VERCEL_ORG_ID` - From your Vercel dashboard settings
   - `VERCEL_PROJECT_ID` - From your project settings

The workflow file (`.github/workflows/deploy.yml`) is already included in this repo. It will automatically deploy to Vercel on every push to `main`.

---

## Project Structure for Deployment

```
evergreen-bank/
  .github/
    workflows/
      deploy.yml       # GitHub Actions CI/CD
  src/                  # Source code
  dist/                 # Build output (generated)
  vercel.json           # Vercel configuration
  deploy.sh             # One-click deploy script
  vite.config.ts        # Vite config
  package.json
  README.md
  DEPLOY.md             # This file
```

---

## Troubleshooting

### Build fails on Vercel

Make sure your `vercel.json` is properly configured. The included one should work out of the box.

### Supabase connection errors

Double-check your environment variables in the Vercel dashboard. The app needs:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### SPA routing (404 on refresh)

The `vercel.json` includes SPA routing configuration that redirects all routes to `index.html`. If you see 404s, verify this file is included in your deployment.

---

## Your Production URLs

After deployment:

| Service | URL |
|---------|-----|
| GitHub Repo | `https://github.com/YOUR_USERNAME/evergreen-bank` |
| Vercel App | `https://evergreen-bank.vercel.app` |
| Custom Domain | Configure in Vercel dashboard |

---

## Updating Your App

After initial deployment, simply push to GitHub:

```bash
git add -A
git commit -m "Update: description of changes"
git push origin main
```

If you set up GitHub Actions, Vercel will auto-deploy. Otherwise, run `vercel --prod` again.
