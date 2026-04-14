# Boost Your Lunch App Blueprint

## 1) Product Goal
Build a parent-facing mobile app for the next school year that lets families:
- place lunch orders
- view upcoming orders
- modify/cancel eligible orders
- view past orders
- manage family members
- receive reminders and morning-of notifications
- contact support
- view school-specific messaging and app announcements

The system should be designed for the desired long-term customer experience, not current website shortcuts.

---

## 2) Core Architecture

### Shopify owns (commerce + financial source of truth)
- products and variants
- pricing
- checkout
- payments
- refunds
- official order records
- customer identity (or linked account)

### Supabase owns (operational lunch logic + app behavior)
- parent profiles
- children/family members
- schools
- teachers/classrooms
- vendors/programs
- service dates
- menu structures
- school-specific messages
- app announcements
- draft order scheduling
- upcoming order presentation
- calendar/list order views
- modify/cancel eligibility windows
- support messages
- push notification tokens and preferences

### Expo owns (mobile experience)
- login/account-link flow
- home dashboard
- ordering flow
- family management
- upcoming orders
- calendar/list views
- support
- settings
- push notifications

---

## 3) Guiding Principle
Do not design around current JSON quirks.

Design around the target customer experience, and model data to support that experience. The app is not only a storefront; it is also:
- a family system
- a school-program scheduling system
- a lunch ordering system
- a communications system

---

## 4) Launch Timing Strategy
The app is intended for next school year, not this school year.

Implications:
- no need to preserve temporary website structures
- no need to keep current JSON as long-term source of truth
- build the future model now
- use summer for migration and testing
- launch next school year with the new structure

---

## 5) Future Data Strategy
Current `schooldetails` and `orderdetails` JSON should be treated as transitional scaffolding.

Future model should be structured entities, not hand-managed blobs.

### Core entities
- schools
- teachers/classrooms
- programs/vendors
- school-program relationships
- service dates
- menu groups
- menu items
- school messages
- app announcements
- child profiles
- scheduled order items

### School-specific configuration needs
- taglines
- parent messages
- vendors
- dates
- restrictions
- announcements

If JSON remains useful later, generate it from structured data instead of manually maintaining it.

---

## 6) Primary App Screens
1. Splash / Launch
2. Login / Account Link
3. Home Dashboard
4. Order Lunch
5. Upcoming Orders
6. Order Detail / Modify
7. Past Orders
8. My Family
9. Child Detail / Edit Child
10. Support
11. Notifications / Messages
12. Settings / Account

---

## 7) Screen-by-Screen Plan

### Splash / Launch
- branded BYL entry
- optional editable message from database
- loading state

### Login / Account Link
- authenticate parent
- link app identity with Shopify customer identity
- parent is primary account; children belong to parent profile

### Home Dashboard
- BYL logo
- editable announcement/message
- optional quick summary (next lunch date, upcoming count, cutoff reminder, unread support)
- large utility-first buttons:
  - Order Lunch
  - Upcoming Orders
  - Past Orders
  - My Family
  - Support

### Order Lunch
Flow should feel like scheduling lunches (not generic storefront browsing):
1) choose child
2) choose program/vendor
3) choose available date(s)
4) choose item(s)
5) review
6) checkout

Required data:
- child profile
- school
- teacher/class
- service dates
- available programs
- menu items
- validations + cutoffs

### Upcoming Orders
Supports both list and calendar views.

Per row/card:
- child
- date
- item
- vendor/program
- status
- editability

### Order Detail / Modify
Show full detail and allow eligible changes:
- child, school, date, item, modifiers
- status, editable-until, linked payment/order status

Actions:
- modify item
- change date (if allowed)
- cancel
- contact support

Rules:
- before cutoff: self-serve changes
- after cutoff: lock or route to support

### Past Orders
- completed and cancelled history
- list view (calendar later optional)
- reorder, view detail, refund/cancellation history

### My Family
Manage children and assignments:
- child list
- add/edit/deactivate child

Child fields:
- first name
- last name (optional)
- school
- teacher/class
- grade
- dietary/allergy notes
- active/inactive

### Child Detail / Edit Child
- edit one child profile cleanly
- future additions: favorites, default preferences, recurring defaults

### Support
MVP:
- create support request
- browse support threads
- view replies

Issue categories:
- order help
- cancellation/refund
- school/program question
- app issue
- general

### Notifications / Messages
In-app log for:
- order confirmed/changed/cancelled
- morning reminders
- deadline reminders
- support replies
- program updates

### Settings / Account
- notification preferences
- view defaults
- profile basics
- logout
- app version
- linked account info

---

## 8) Home Screen Design Direction
Layout:
- top: logo + short editable announcement
- middle: optional quick summary strip/cards
- main: large tappable cards (Order Lunch, Upcoming Orders, Past Orders, My Family, Support)

Announcement requirements:
- editable without app release
- global messages initially
- school-targeted messages later
- optional CTA target

---

## 9) Calendar and List Views
Plan both from day one.

- List view: quick scanning and management
- Calendar view: monthly/weekly family planning context

Both are different renderings over the same structured order records (not separate business logic).

---

## 10) Recommended Scheduled Order Item Model
Each scheduled lunch item should include:
- parent profile
- child
- school
- teacher/class
- service date
- program/vendor
- menu item
- modifiers/add-ons
- quantity
- status
- editable_until
- linked Shopify reference

This supports:
- list + calendar views
- notifications
- support context
- eligibility logic

---

## 11) Order Architecture Recommendation
**Supabase-first scheduling, Shopify-final checkout**

### Before payment
Supabase stores:
- draft selections
- child/date/item relationships
- validation
- availability
- scheduling logic

### At checkout
Shopify handles:
- cart/checkout
- payment
- order creation

### After payment
Supabase stores:
- confirmed scheduled items
- linked Shopify order reference
- status for app presentation/management

---

## 12) Order Lifecycle
Internal statuses:
- Draft
- Pending Payment
- Confirmed
- Editable
- Locked
- Cancelled
- Refunded
- Fulfilled

User-facing labels can simplify to:
- Upcoming
- Can modify
- Locked
- Cancelled
- Completed

---

## 13) Modify/Cancel Eligibility Logic
Rules must be backend-driven (not hardcoded in screens), e.g.:
- editable until specific cutoff
- auto-allowed cancellations before cutoff
- lock or support-only after cutoff
- support both refund and store-credit paths

---

## 14) Notifications Strategy
Use Expo push notifications, with categories:
- Operational (confirm/change/cancel/morning reminder)
- Reminder (deadline, incomplete orders, renewals)
- Exception (item unavailable, school/vendor issues, service changes)
- Support (reply received)

Also keep an in-app message log.

---

## 15) Support Strategy
Start simple:
- in-app support form
- categorized issue type
- thread view
- admin reply flow (dashboard or email-linked)

No live chat required for MVP.

---

## 16) Data Ownership Summary

### Shopify
- catalog, variants, pricing, discounts
- checkout, payments, refunds
- official financial records
- customer identity

### Supabase
- profiles/family/schools/classrooms/programs
- availability/service dates/menu structures
- school messages + announcements
- drafts + scheduled operational records
- eligibility logic
- support + notifications + preferences
- app-facing presentation model

---

## 17) Recommended Database Blueprint

### Identity / Account
- profiles
- shopify_customer_links

### Family
- children
- child_school_assignments (or direct fields initially)

### School / Program Configuration
- schools
- teachers_or_classrooms
- programs
- school_programs
- service_dates
- menu_groups
- menu_items
- school_messages

### Ordering
- order_drafts
- draft_items
- scheduled_orders
- scheduled_order_items
- order_status_history
- order_change_requests (optional)

### Communication
- announcements
- support_threads
- support_messages
- device_tokens
- notification_preferences
- notification_jobs
- notification_logs

### Integration
- shopify_order_links
- shopify_customer_links
- webhook_logs

---

## 18) Website Future Direction
By next school year, app and website should read from the same structured operational backend.

Recommended pattern:
1) website calls controlled API/edge functions
2) API reads structured Supabase data
3) API returns config/menu/date payloads

School-specific JSON can still exist as generated output from structured records.

---

## 19) Build Phases

### Phase 1 — Product + System Design
- schema
- user journeys
- lifecycle + integrations
- screen map

### Phase 2 — Supabase Backend
- schema implementation
- auth/profile model
- school/program/date/menu model
- family/support/notifications model

### Phase 3 — Expo App MVP
- auth
- dashboard
- family management
- order flow
- upcoming orders
- calendar/list views
- support
- settings

### Phase 4 — Shopify Integration
- checkout handoff
- order linkage
- payment confirmations
- refund/cancel hooks

### Phase 5 — Summer Testing
- school/program/date scenarios
- cutoffs
- notifications
- modifications
- support
- calendar rendering

### Phase 6 — Website Migration
- refactor website to consume same structured backend model

---

## 20) UX and Design Direction
Experience goals:
- clean
- fast
- parent-friendly
- polished
- not childish
- not bloated

Visual style:
- white base
- restrained BYL colors
- rounded cards
- strong hierarchy
- large touch targets
- minimal dashboard text
- obvious statuses

Interaction target:
- 1 tap from dashboard to destination
- 2–4 taps to complete common actions

---

## 21) Main Product Decisions
- Not launching during current school year.
- Future model should not be constrained by current website infrastructure.
- Supabase is operational backend; Shopify is commerce layer.
- Current giant JSON files are transitional, not permanent system of record.
- Both calendar and list views are first-class requirements.
- School-targeted messaging is a core schema requirement.
