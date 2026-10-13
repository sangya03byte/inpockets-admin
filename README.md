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


```bash
# First, update your local main branch
git switch main
git pull origin main

# Create a branch for your change
git switch -c fix/admin-user-loading

# Make your changes, then validate
npm run lint
npm run build

# Review, commit and push
git status
git diff
git add .
git commit -m "fix: resolve admin user loading issue"
git push -u origin fix/admin-user-loading --for new branch created
git push origin fix/admin-user-loading

```