# FortReader Deployment Guide

This document provides step-by-step instructions for deploying changes to the FortReader web application. This guide is designed for both human developers and LLM agents to ensure flawless deployments.

## Overview

The FortReader application uses:
- **Frontend**: React + TypeScript + Vite
- **Hosting**: Firebase Hosting
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions (automatic deployment)
- **Repository**: https://github.com/ColinThornburg/FortReader.git
- **Live URL**: https://fortreader-97219.web.app

## Prerequisites

Before deploying, ensure you have:
- Node.js installed (v16 or higher)
- Firebase CLI installed (`npm install -g firebase-tools`)
- Git configured with access to the repository
- Firebase project access (fortreader-97219)

## Deployment Process

### 1. Pre-Deployment Checks

```bash
# Navigate to project directory
cd /Users/colinthornburg/fortreader/reading-realms

# Check git status
git status

# Verify no uncommitted changes
git diff --exit-code
```

### 2. Code Quality Checks

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run build process to ensure it works
npm run build

# Check for linting errors
npm run lint  # if available
```

### 3. Development Testing

```bash
# Start development server for testing
npm run dev

# Test the application locally
# - Open http://localhost:5173 (or the port shown)
# - Test the specific functionality that was changed
# - Verify the changes work as expected
```

### 4. Commit Changes

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Description of changes made

- Specific change 1
- Specific change 2
- Any other relevant details"

# Example:
git commit -m "Implement half-time reading credit for incorrect answers

- Modified handleQuestionAnswered function to give half reading time for incorrect answers
- Updated ComprehensionQuestion component messaging
- Fixed duplicate import issue in App.tsx"
```

### 5. Deploy to Production

#### Option A: Automatic Deployment (Recommended)

```bash
# Push to GitHub - this triggers automatic deployment
git push origin master
```

The GitHub Actions workflow will automatically:
1. Install dependencies (`npm ci`)
2. Build the project (`npm run build`)
3. Deploy to Firebase Hosting
4. Update the live webapp at https://fortreader-97219.web.app

**Note**: If automatic deployment fails, use Option B below.

#### Option B: Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### 6. Verify Deployment

```bash
# Check deployment status
firebase hosting:channel:list

# Test the live application
curl -I https://fortreader-97219.web.app

# Verify specific functionality works on live site
```

## GitHub Actions Workflow

The repository includes two GitHub Actions workflows:

### 1. Pull Request Workflow (`.github/workflows/firebase-hosting-pull-request.yml`)
- Triggers on pull requests
- Creates preview deployments
- Allows testing changes before merging

### 2. Merge Workflow (`.github/workflows/firebase-hosting-merge.yml`)
- Triggers on pushes to `master` branch
- Automatically deploys to production
- Updates live webapp

## Firebase Configuration

### Project Details
- **Project ID**: fortreader-97219
- **Project Alias**: fortreader
- **Hosting Site**: fortreader-97219.web.app

### Configuration Files
- `firebase.json`: Firebase hosting configuration
- `.firebaserc`: Project aliases and settings
- `.github/workflows/`: GitHub Actions workflows

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **TypeScript Errors**
   ```bash
   # Check for type errors
   npx tsc --noEmit
   
   # Fix any type issues before deploying
   ```

3. **Firebase Authentication Issues**
   ```bash
   # Re-authenticate with Firebase
   firebase login
   
   # Check current project
   firebase use --list
   ```

4. **GitHub Push Issues**
   ```bash
   # Check remote configuration
   git remote -v
   
   # Verify GitHub access
   git push origin master
   ```

### Deployment Verification

After deployment, verify:
1. Live site loads: https://fortreader-97219.web.app
2. Changes are visible on the live site
3. No console errors in browser developer tools
4. All functionality works as expected

## File Structure

```
/Users/colinthornburg/fortreader/reading-realms/
├── .github/workflows/          # GitHub Actions workflows
├── components/                 # React components
├── services/                   # Firebase and API services
├── dist/                      # Built files (deployed to Firebase)
├── public/                    # Static assets
├── firebase.json              # Firebase configuration
├── .firebaserc               # Firebase project settings
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite build configuration
└── tsconfig.json             # TypeScript configuration
```

## Environment Variables

The application uses Firebase configuration that's automatically injected. No additional environment variables are required for deployment.

## Security Notes

- Firebase service account credentials are stored as GitHub Secrets
- Repository is public but contains no sensitive data
- All API keys are handled through Firebase configuration

## Rollback Procedure

If deployment issues occur:

```bash
# Revert to previous commit
git log --oneline -5  # Find the previous working commit
git reset --hard <previous-commit-hash>
git push --force origin master  # This will trigger automatic deployment
```

## Monitoring

- **Firebase Console**: https://console.firebase.google.com/project/fortreader-97219
- **GitHub Actions**: https://github.com/ColinThornburg/FortReader/actions
- **Live Site**: https://fortreader-97219.web.app

## Best Practices

1. **Always test locally** before deploying
2. **Use descriptive commit messages** that explain what changed
3. **Check TypeScript compilation** before pushing
4. **Verify deployment** after pushing to master
5. **Keep dependencies updated** regularly
6. **Monitor the live site** after deployment

## Quick Reference Commands

```bash
# Full deployment workflow
npm run build && git add . && git commit -m "Your changes" && git push origin master

# Check deployment status
firebase hosting:channel:list

# View live site
open https://fortreader-97219.web.app

# Check git status
git status

# View recent commits
git log --oneline -5
```

---

**Last Updated**: September 12, 2025
**Maintained By**: Development Team
**Repository**: https://github.com/ColinThornburg/FortReader.git
