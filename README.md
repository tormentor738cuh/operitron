# Operitron

## Production Database Setup

The frontend and Vercel API routes require the Operitron Supabase schema before authentication or billing can work.

1. Open the Supabase SQL Editor for the production project.
2. Run `supabase-projects.sql` once. It creates `profiles`, `subscriptions`, `projects`, and `analyses`, enables Row Level Security, installs the signup trigger, and backfills profiles for existing Auth users.
3. Register the private administrator account through the app.
4. Update the email in `supabase-admin-access.sql`, then run it in the SQL Editor to grant administrator access.
5. Configure the Stripe webhook endpoint for `/api/stripe-webhook` and subscribe it to checkout completion and customer subscription create, update, and delete events.

When using Supabase CLI migrations instead of the SQL Editor, apply the files in `supabase/migrations` in order.

Required server-side Vercel variables for billing are `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_MONTHLY_PRICE_ID`, and `VITE_STRIPE_ANNUAL_PRICE_ID`. The service-role key is required only by Vercel API functions for protected database writes; never expose it in frontend code or give it a `VITE_` prefix.

Do not commit service-role keys, Stripe secret keys, administrator passwords, or OpenAI keys. Server secrets belong only in Vercel environment variables.
