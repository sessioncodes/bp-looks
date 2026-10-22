# Playbook

Draw, animate and share basketball plays. Coaches create a team, players join with a link,
make their own version of a play and submit it for feedback.

## Where it runs

The repo's Vercel project builds the root app, then `scripts/build-hoops.mjs` copies this
folder into the output, so every push to `main` publishes Playbook at `https://<your-domain>/hoops/`.

Locally: start the `hoops` entry in `.claude/launch.json`, or `python -m http.server 5190 --directory hoops`.
On localhost the team features run in **demo mode** (stored in this browser, sign-in asks for a name).
On the live site they stay off until Firebase is connected.

## Turn on teams (Firebase, about 10 minutes)

1. Create a project at https://console.firebase.google.com (free Spark plan is enough).
2. **Build → Authentication → Get started → Sign-in method → Google → Enable.**
3. **Authentication → Settings → Authorized domains → Add domain**: your Vercel domain
   (for example `bp-looks.vercel.app`).
4. **Build → Firestore Database → Create database** (production mode, any region).
   Open the **Rules** tab, paste the contents of `firestore.rules`, and **Publish**.
5. **Project settings → General → Your apps → Web (</>)**: register an app and copy its config.
6. In **Vercel → your project → Settings → Environment Variables**, add for Production:

   | Name | Value from the Firebase config |
   | --- | --- |
   | `FIREBASE_API_KEY` | `apiKey` |
   | `FIREBASE_AUTH_DOMAIN` | `authDomain` (e.g. `my-app.firebaseapp.com`) |
   | `FIREBASE_PROJECT_ID` | `projectId` |
   | `FIREBASE_APP_ID` | `appId` |

7. Redeploy (Vercel → Deployments → ⋯ → Redeploy), or push any commit.
8. For sign-in inside the installed iPhone app: in Google Cloud Console → **APIs & Services →
   Credentials**, open the "Web client (auto created by Google Service)" OAuth client and add
   `https://<your-domain>/__/auth/handler` under **Authorized redirect URIs**.

Sign-in on the live domain goes through `api/fb-auth.js`, which proxies Firebase's `/__/auth/*`
pages so Safari and home-screen apps can complete Google sign-in.

## Links you can share

- Team invite: on the Team tab (`…/hoops/?join=CODE`).
- Install page: `…/hoops/?install=1` opens the add-to-home-screen steps.

Android/Chrome shows a one-tap install button. iPhones don't let websites install themselves,
so the app shows the three taps (Share → Add to Home Screen → Add).

## Notes

- Google accounts for children under 13 are parent-supervised and may not be able to sign in.
- `firebase.json` is only needed if you'd rather host on Firebase Hosting (`firebase deploy`).
