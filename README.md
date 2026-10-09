# Karvia Website Design

Clickable design for **Karvia.services**, a local service marketplace where clients find verified workers within 5 KM. These are design screens, not the production app.

**Start here:** `index.html` (Home), or `screens.html` for the list of all 44 screens.

## What's inside

| Area | Screens |
|---|---|
| Public website | Home, How Karvia works, Categories, Become a worker, Help, Terms & privacy, OTP login |
| Client app | Name & location, ₹9 access payment, Dashboard, Find workers, Worker profile, New request, Request status, Compare quotes, My bookings, Booking detail, My workers, Notifications, Payments, Report a problem, Profile |
| Worker app | Registration (autosave), Dashboard, Requests & jobs, Services & pricing, Experience & work history, Documents & verification, Trial & ₹199 plan, Reviews |
| Admin & Telecaller | Dashboard, Verification queue, Worker review, Clients, Categories, Matching rules, Requests & bookings, Payments, Complaints, Leads, Telecaller console, Business settings, Roles & audit log |
| Design system | Colours, type, buttons, inputs, status pills, components, layout rules |

Interactive screens: Home (client/worker toggle), Login (OTP steps), New request (Instant/Scheduled/Quote), Worker dashboard (AVAILABLE/BUSY, accept/reject).

All names, prices and numbers are sample data. Text in [brackets] is a placeholder to fill in.

## Run locally

Open `index.html` in a browser. No build step is needed.

## Deploy on Vercel

1. Go to https://vercel.com/new and import this GitHub repository.
2. Framework preset: **Other**. Leave build and output settings empty.
3. Click **Deploy**.

## Files

- `*.dc.html`: one file per screen. The screen markup sits in a `<script type="text/x-dc-template">` block and its logic in a `<script type="text/x-dc">` block.
- `support.js`: small runtime that renders each screen's template and handles clicks.
- `screens.html`: index of all screens.
