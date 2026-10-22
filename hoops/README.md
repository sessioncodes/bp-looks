# Playbook

Draw, animate and share basketball plays. Coaches create a team, players join with a link,
make their own version of a play and submit it for feedback.

## Run locally

Serve this folder with any static server, for example:

```
python -m http.server 5190
```

Without Firebase keys the team features run in **demo mode**: everything is stored in this
browser only, and "sign in" asks for a name instead of a Google account. Use it to try the flow.

## Connect Firebase (needed for real teams)

1. Create a project at https://console.firebase.google.com (free Spark plan is enough).
2. **Build → Authentication → Get started → Google**: enable it.
3. **Build → Firestore Database → Create database** (production mode).
4. **Project settings → Your apps → Web app (</>)**: register an app, copy the config into
   `firebase-config.js` (`apiKey`, `authDomain`, `projectId`, `appId`).
5. Install the CLI and deploy from this folder:

```
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy
```

`firebase deploy` publishes the app to `https://<project>.web.app` and uploads `firestore.rules`.
If you host somewhere else, add that domain under **Authentication → Settings → Authorized domains**.

## Links you can share

- Team invite: shown in the app on the Team tab (`…/?join=CODE`).
- Install page: `…/?install=1` opens the add-to-home-screen steps.

Android/Chrome shows a one-tap install button. iPhones don't let websites install themselves,
so the app shows the three taps (Share → Add to Home Screen → Add).
