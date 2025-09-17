# FortReader LLM Onboarding Cheat Sheet

This note gives future coding agents the minimum context needed to make safe changes without breaking core behaviour.

## App Shape
- **Stack:** React + TypeScript + Vite. Entry in `App.tsx`; routes handled via view state, not a router.
- **Data:** User profiles live in Firebase (Firestore + Auth + Storage). Local state is the source of truth and automatically persists via `firebaseService.saveUserData` whenever `currentUser` changes.
- **AI Services:** `services/geminiService.ts` wraps Google GenAI for story, question, and skin generation.

## Reading & Rewards Rules
- **Story Length Options:** `constants.ts` defines `STORY_LENGTH_SETTINGS` with max counted seconds (short=120, medium=240, long=480). Do **not** bump these unless product intentionally changes limits.
- **Prompting:** `generateStory` adjusts word counts based on the selected `StoryLength`; always pass the chosen length to avoid mismatched pacing.
- **Validated Time:** In `App.tsx#L301-L416`, validated reading time is capped by both question correctness (half credit on failure) **and** the story length max. Any tweak must keep logs (`console.info`) intact and maintain the cap logic.
- **Results Messaging:** `ResultsScreen` explains whether time was reduced by a missed question or a cap. Preserve this user feedback when altering flows.

## Skin Generation Logic
- **Availability:** `checkSkinGenerationLimits` combines earned reading time (10 minutes per generation by default) with optional admin bonus generations. Never remove the earned-time pathway; kids depend on it to unlock skins organically.
- **Deduction:** `updateSkinGenerationData` spends reading credit before consuming admin bonus tokens. Changes must keep this order.
- **Costs:** `SKIN_GENERATION_COST` lives in `constants.ts`. If you modify it, update all UI messaging that references the price.

## Firebase Configuration
- `services/firebase.ts` exposes a **default** production config and allows overrides via `VITE_FIREBASE_*` env vars. Never delete the default object or replace keys with placeholders—production deploys rely on it.
- `.env.local` is ignored by git. If you add new env vars, document them in `DEPLOYMENT.md` and ensure they are optional for the default project.

## Guardrails for Agents
- Run `npm run build` before commits; linting is not configured.
- Avoid touching generated assets under `dist/`—they are rebuilt by CI.
- UI components assume story content may contain HTML from Gemini. Sanitise or escape if introducing new rich text features.
- Preserve `console.info` diagnostics in `App.tsx`; they help parents audit reading sessions.
- When altering Firestore schemas or user data structures, update `types.ts`, `firebaseService.ts`, admin screens, and migration guidance in `DEPLOYMENT.md`.

## Deploy Flow
1. Implement changes.
2. `npm run build` locally.
3. `git commit` and `git push origin master`. GitHub Actions handles Firebase Hosting deploys.

Stick to these constraints and you’ll keep FortReader stable for its lone VIP user.
