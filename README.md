# Coffee Chat Outreach — Backend

This is a tiny backend with two endpoints:

- `GET /api/health` — confirms the backend is live
- `POST /api/find-email` — looks up an email via Hunter.io, given a name + company/domain

It exists so your Hunter.io API key never has to live in the browser (where
anyone could see it). The key stays here, on Vercel's servers, as an
environment variable.

## Deploy steps

1. Create a free account at vercel.com (sign in with GitHub or email).
2. Create a free account at github.com if you don't already have one.
3. Create a new GitHub repository and upload these files to it
   (`api/find-email.js`, `api/health.js`, `package.json`, `vercel.json`).
4. In Vercel, click "Add New... -> Project", and import that GitHub repo.
5. Before clicking Deploy, expand "Environment Variables" and add:
   - Name: `HUNTER_API_KEY`
   - Value: your Hunter.io API key
6. Click Deploy.
7. Once deployed, Vercel gives you a URL like `https://coffee-chat-backend-yourname.vercel.app`.
8. Test it by visiting `https://your-url.vercel.app/api/health` in your
   browser — you should see `{"status":"ok","message":"Backend is running."}`.

That URL is what the frontend (the HTML tool) will call instead of trying to
reach Hunter.io or Apollo directly.
