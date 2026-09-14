# CrazySMP Firebase Hosting — Setup Guide

This directory sets up `crazysmp.web.app` (Firebase Hosting) as a domain
that redirects to the main Vercel-hosted site at `crazysmp.vercel.app`.

## Why this approach

`web.app` is a Google-controlled domain reserved for Firebase Hosting.
We can't add it directly to Vercel as a custom domain. So instead we
deploy a redirect page to Firebase Hosting — anyone visiting
`crazysmp.web.app` is instantly redirected to `crazysmp.vercel.app/store`.

The redirect is implemented two ways for reliability:
1. `<meta http-equiv="refresh" content="0; url=...">` in HTML
2. `window.location.replace(...)` in JavaScript
3. Plus a `redirects` rule in `firebase.json` for server-side 302

## How to deploy (one-time setup)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Log in to Firebase
```bash
firebase login
```
(Log in with the Google account that owns the `crazysmp` project — the
same one that created the service account in the Firebase Console.)

### Step 3: Deploy
```bash
cd firebase-hosting
firebase deploy --only hosting --project crazysmp
```

This deploys the redirect page to `https://crazysmp.web.app`.
The first deploy may take 1-2 minutes for DNS to propagate.

### Step 4: Verify
Visit https://crazysmp.web.app — should redirect to https://crazysmp.vercel.app/store

## Verification
After deploy, the URL `https://crazysmp.web.app` should immediately
redirect to `https://crazysmp.vercel.app/store` (302 redirect from
Firebase Hosting's edge network, or the HTML meta refresh as a fallback).

## Updating
If you ever need to change the redirect target (e.g. move to a different
host), edit `public/index.html` and `firebase.json` then run `firebase deploy` again.
