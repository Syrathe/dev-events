# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Dev Event Next.js App Router project. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using Next.js 15.3+'s instrumentation hook. Configured with a reverse proxy (`/ingest`), EU host, exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites so PostHog requests route through the app (avoids ad-blockers and improves data reliability). Also added `skipTrailingSlashRedirect: true` as required by PostHog.
- **`components/ExploreBtn.tsx`** (updated): Added `posthog.capture("explore_events_clicked")` to the button's `onClick` handler.
- **`components/EventCard.tsx`** (updated): Added `"use client"` directive and `posthog.capture("event_card_clicked", { title, slug, location, date })` on link click to track which events users navigate to.
- **`.env.local`** (updated): Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the Explore Events button on the home page | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details (properties: `title`, `slug`, `location`, `date`) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/703732)
- [Explore Events button clicks (last 30 days)](/insights/NO9h4eQd) — bold number total of button clicks
- [Event card clicks over time](/insights/FW6wX7Il) — daily line chart of card click volume
- [Engagement funnel: Explore → Event card click](/insights/HswGtHxY) — conversion rate from Explore button to event card click
- [Most clicked events (by title)](/insights/mjEggcPc) — bar chart showing which events attract the most clicks
- [Daily unique active users](/insights/RzviXGYp) — area chart of daily unique users based on event card activity

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
