# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The Title Bug is a playful single-page career debugger built with React, TypeScript and Vite, and deployed at https://the-title-bug.vercel.app/.

## Commands

```bash
npm ci                          # install dependencies
npm run dev                     # start the Vite dev server
npm test                        # run all tests once (vitest run)
npx vitest run src/logic.test.ts       # run one test file
npx vitest run -t "easter egg"         # run tests whose name matches
npm run build                   # type-check (tsc -b), then build to dist/
npm run preview                 # serve the production build
```

There is no linter. `npm run build` is the type check. CI (`.github/workflows/ci.yml`) runs `npm test` and `npm run build` on every push and pull request.

## Architecture

The whole UI is the `App` component in `src/main.tsx`, a single page with no router. Logic that needs tests lives in plain modules beside it, and all styles are in `src/style.css`.

### Two separate title generators

`src/logic.ts` serves two page sections that work differently. Changing titles usually means updating both:

- **"Generate my job title" (section 02)** has the Real-world and Funny modes. It calls `pickModeTitle(mode, attempt)`, which cycles through `REAL_TITLES` or `TITLES`. It ignores skills.
- **"Debug your own career" (section 03)** calls `generateTitle(skills, attempt)`, which builds a pool from conditional skill matches plus three generic titles, then cycles through it. It has no modes, so its results mix real-world and funny titles. Zero or one selected skills return early with fixed messages.

Selection is deterministic: `attempt` indexes the list, and nothing uses `Math.random`. This matters because `pickModeTitle` runs during render, and the diagnostics timer causes re-renders, so a random pick would make the title change on its own.

The Easter Egg (`EASTER_EGG`) replaces every `EASTER_EGG_INTERVAL`th attempt in Funny mode only. `pickModeTitle` offsets the index so the regular cycle doesn't skip a title, and the egg's description replaces the mode caption.

### Analytics and consent

`src/analytics.ts` holds the GA4 logic, and `App` owns the banner state.

- gtag.js is injected only after the visitor accepts. It is never in `index.html`.
- It loads only when the hostname equals `PRODUCTION_HOST`, so localhost and Vercel preview deployments never send data. A custom domain requires updating that constant.
- The gtag shim must push the `arguments` object, not an array, or gtag.js ignores the call.
- The tests run in Node with stubbed `window` and `document`, because the project has no DOM test environment. Real tracking can only be verified on the production site.

## Styling

`src/style.css` is written as long single-line runs of rules, with newer sections added under a comment at the end of the file. Reuse the existing colors, such as the mint accent `#7af1b9`.

The `.hero-bug` illustration uses `z-index:-1` and depends on the page background being set on `:root`.
