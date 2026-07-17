---
trigger: always_on
---

# Frontend Engineering

## Components
* One component = one job. Composition over duplication.
* Follow project's existing component patterns. Consistency > personal preference.
* Name by what they represent: `UserProfile` > `CardComponent2`.
* Extract reusable components to shared directory. Max ~200 lines per component file.

## Separation of Concerns
* Components render UI only. Business logic belongs in hooks, services, or state management.
* No `fetch()`/`axios` calls inside JSX. API calls go in service layers or custom hooks.
* Keep styling consistent with the project's chosen approach — never mix systems.

## UI/UX
* Every async operation needs 3 states: Loading (skeleton/spinner), Error (message + retry), Empty (helpful guidance).
* Mobile-first, then scale up. Semantic HTML (`<button>` for actions, `<a>` for links, not `<div onClick>`).
* Accessibility: alt text, keyboard support, ARIA labels, color not sole indicator.
* Forms: real-time validation, inline errors, preserve data on failure, disable submit during submission.

## Performance
* Memoize only where profiling shows benefit — not as default.
* Lazy-load routes and heavy components. Virtualize lists with 1000+ items.
* Debounce: search input (300ms), resize (150ms), scroll (rAF/throttle).
* Optimize images (WebP/AVIF, srcset, lazy-load below fold). Code-split aggressively.

## State Management
* Local state (useState) → Lifted state → Context → Global store. Not everything is global.
* Server state (React Query/SWR) ≠ Client state (Zustand/Redux/Context). Use appropriate tools.
* Keep state normalized. Don't store the same object in 5 places.

## Design System
* Use project's existing components and design tokens. Don't create parallel versions.
* No hardcoded URLs, strings, colors, sizes, breakpoints, or API paths. Use config/tokens/i18n.