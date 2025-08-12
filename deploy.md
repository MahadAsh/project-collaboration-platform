# 🚀 GitHub Pages Deployment Guide

## Prerequisites
- GitHub account
- Git installed on your computer
- Node.js and pnpm installed

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `project-collaboration-platform`
5. Make it **Public** (required for GitHub Pages)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

## Step 2: Update Homepage URL

**IMPORTANT**: Before deploying, update the homepage URL in `package.json`:

```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/project-collaboration-platform"
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

## Step 3: Connect and Push to GitHub

Run these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/project-collaboration-platform.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Deploy to GitHub Pages

```bash
# Build and deploy
npm run deploy
```

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click the "Settings" tab
3. Scroll down to the "Pages" section (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Under "Branch", select "gh-pages" and "/(root)"
6. Click "Save"

## Step 6: Wait for Deployment

- GitHub Pages will take a few minutes to deploy
- You'll see a green checkmark when it's ready
- Your site will be available at: `https://YOUR_USERNAME.github.io/project-collaboration-platform`

## Troubleshooting

### If deployment fails:
1. Check that your GitHub username is correct in `package.json`
2. Make sure the repository is public
3. Verify that gh-pages branch was created
4. Check GitHub Actions for any build errors

### If the site doesn't load:
1. Wait 5-10 minutes for GitHub Pages to build
2. Check the repository settings > Pages section
3. Verify the gh-pages branch exists
4. Clear browser cache and try again

## Environment Variables for Production

For production deployment, you'll need to set up environment variables:

1. Go to your repository Settings > Secrets and variables > Actions
2. Add your Firebase configuration as repository secrets
3. Update the deployment workflow to use these secrets

## Success! 🎉

Your ProjectHub will be live at:
`https://YOUR_USERNAME.github.io/project-collaboration-platform`

---

**Need help?** Check the GitHub Pages documentation or create an issue in your repository. 