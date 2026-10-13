# InPockets Admin

Operations console for reviewing applications, releasing payouts and following repayments.
Desktop only (minimum width 1200px). Next.js 16, React 19, Tailwind CSS 4.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

- Data is **sandbox mock data** in `lib/mock.ts` (one consistent dataset across all screens).
- How this connects to the mobile app and backend: `docs/INTEGRATION.md`.
- Design tokens (colours, type) live in `app/globals.css`. Shared components: `components/ui.tsx`.
- Layout: the shell (`components/AppShell.tsx`) owns scrolling, so pages never create their own page-level scrollbars.
