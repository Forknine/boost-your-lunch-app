# Boost Your Lunch App (Expo Starter)

This repository contains a runnable Expo + React Native starter app that implements the primary BYL screen map with a dramatic visual refresh: richer BYL-style blue/green palette, elevated cards, stronger contrast, and more modern CTA styling inspired by boostyourlunch.com.

## What's enhanced in this iteration
- Shared operational data model stubs (`ChildProfile`, `ScheduledOrderItem`, support threads, announcements)
- Centralized mock data source to mimic future Supabase-backed records
- Home dashboard summary computed from upcoming order data
- Upcoming Orders with both **List** and **Calendar** render modes over the same order records
- Status filtering for upcoming orders (All / Editable / Locked)
- Splash + Login/Account Link flow before entering the main app
- Route-param driven Order Detail and Child Detail screens
- Settings toggles for notification preferences (morning reminder + cutoff reminder)

## Files to know
- `App.tsx` — navigation + screen UI scaffold
- `src/models.ts` — domain model types
- `src/mockData.ts` — mock operational data
- `src/orderLogic.ts` — shared status/date/order helpers
- `src/auth.tsx` — lightweight auth provider/context for login + logout flow
- `docs/boost-your-lunch-app-blueprint.md` — product/system blueprint

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start Expo:
   ```bash
   npm run start
   ```
3. Launch on iOS, Android, or web using Expo CLI prompts.

## Next implementation targets
1. Replace `src/mockData.ts` with Supabase queries and mutations.
2. Add Supabase-backed draft creation/edit APIs.
3. Add Shopify checkout handoff and store returned order references.
4. Replace mock auth context with real Supabase auth + session persistence.
