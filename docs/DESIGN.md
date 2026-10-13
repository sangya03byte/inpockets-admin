# Design notes

**Palette.** Brand blues from the mobile app (#3B82F6, #60A5FA, #F0F9FF, ink #1F2937). Actions use #2563EB, one step deeper, so white button text passes contrast. Surfaces are white on a pale blue canvas. Green, amber and red appear only for status.

**Type.** Sora for headings and large figures, Inter for text (the same pair the app uses). Money and IDs use tabular numerals so columns line up.

**Overflow fixes.** The shell is `h-screen` with only `<main>` scrolling; every grid child has `min-w-0`; tables scroll inside their own container with sticky headers; long text truncates with a title or wraps with `wrap-any`; two-column layouts use `minmax(0,1fr)` plus a fixed side rail.

**Review workbench.** Application detail puts the pipeline, requested versus eligible amount, risk reasons and the decision rail on one screen. Every consequential action asks for a reason.
