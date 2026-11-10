# AURA Watches admin portal

## Create the first admin

The first account is the store owner. For local development, set these server-side environment variables before starting the API:

```powershell
$env:METRA_ADMIN_EMAIL = "owner@example.com"
$env:METRA_ADMIN_PASSWORD = "use-a-unique-password-with-at-least-12-characters"
npm run dev
```

Open `/admin/login` and sign in with those credentials. There is no public admin registration or built-in demo password. The API hashes the password and saves the admin account store in `data/admin-users.json`; that file is excluded from Git. Keep a backup of this file and restrict access to the server filesystem.

## Netlify deployment

In the Netlify site settings, add `METRA_ADMIN_EMAIL` and `METRA_ADMIN_PASSWORD` as private environment variables. Use a unique password of at least 12 characters; do not add credentials to the repository or `netlify.toml`. The deployed app uses Netlify Blobs for admin accounts, sessions, and orders, so these persist between function invocations. Deploy with the repository's Netlify build configuration, then open `/admin/login`.

## Add another administrator

Sign in as the store owner, open **Admin team**, and create the new account with a unique email address and a password of at least 12 characters. Share the password privately. Only the owner can add or remove admins. Removing an account ends its active sessions.

Additional accounts are saved in the same server-side store and remain available after an API restart. Admin sessions use an HttpOnly, SameSite cookie and expire after eight hours. Use HTTPS in production; the cookie is marked Secure in production and on Netlify.

If the local owner account store is lost, stop the API, remove only `data/admin-users.json`, set new owner credentials, and restart the API. This also removes any additional local admin accounts.

## Dashboard data

Orders are stored in Netlify Blobs in production and in memory during local development. Use the dashboard for operational visibility, and connect an appropriate payment and fulfilment workflow before accepting real payments.
