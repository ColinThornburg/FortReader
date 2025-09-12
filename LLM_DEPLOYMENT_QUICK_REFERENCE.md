# LLM Agent Quick Deployment Reference

## Essential Commands for FortReader Deployment

### 1. Pre-Deployment Checklist
```bash
cd /Users/colinthornburg/fortreader/reading-realms
git status
npx tsc --noEmit
npm run build
```

### 2. Deploy Changes
```bash
git add .
git commit -m "Description of changes"
git push origin master
```

### 3. Verify Deployment
```bash
firebase hosting:channel:list
curl -I https://fortreader-97219.web.app
```

## Key Information
- **Repository**: https://github.com/ColinThornburg/FortReader.git
- **Live URL**: https://fortreader-97219.web.app
- **Firebase Project**: fortreader-97219
- **Auto-deployment**: Yes (GitHub Actions on master branch push)

## Common Issues & Solutions

### TypeScript Errors
```bash
npx tsc --noEmit  # Check for errors
# Fix errors in code, then retry
```

### Build Failures
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Git Issues
```bash
git remote -v  # Check remotes
git status     # Check status
```

## Deployment Flow
1. Make code changes
2. Test locally (`npm run dev`)
3. Build project (`npm run build`)
4. Commit changes (`git add . && git commit -m "message"`)
5. Push to master (`git push origin master`)
6. GitHub Actions automatically deploys to Firebase
7. Verify at https://fortreader-97219.web.app

## Critical Files
- `App.tsx` - Main application logic
- `components/ComprehensionQuestion.tsx` - Question component
- `firebase.json` - Firebase configuration
- `.github/workflows/` - Auto-deployment workflows

## Never Skip
- TypeScript compilation check
- Build process verification
- Git status check before committing
- Post-deployment verification
