# DGTL Service

Next.js frontend for `auth.dgtl.lk`: public landing page, client sign-in/sign-up, Google OAuth, company SAML SSO, client service dashboard and admin client management.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and publishable key.
3. Ensure `DGTL-Service-Backend` is running on port `4000`.
4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

Open `http://localhost:3000`.

## Local demo accounts

When the app runs with `npm run dev`, the sign-in page exposes two development-only accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@dgtl.lk` | `Admin@123` |
| Client | `client@dgtl.lk` | `Client@123` |

The demo session is stored in an HTTP-only cookie, uses sample dashboard data and is disabled automatically in production builds. Real authentication still uses Supabase.

## Supabase Auth configuration

- Set the Site URL to the production frontend origin.
- Add `http://localhost:3000/auth/callback` and the production `/auth/callback` URL to allowed redirect URLs.
- Enable Google in Authentication → Providers for Google sign-in.
- Register a SAML 2.0 identity provider before using Company SSO.

The frontend contains only the Supabase publishable key. Privileged client and service changes are sent to the separate backend with the current user's access token.
