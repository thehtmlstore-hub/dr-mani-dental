# Hosting smoke checks

1. Build the exact preview commit with `node build.js`. Run `bash scripts/verify-hosting.sh PREVIEW_ORIGIN`. Confirm the server compresses markup and leaves the source scripts intact.
2. Verify technical response headers, CSP, media MIME types, MP4 byte ranges and the 404 status. Review the preview and production separately.
3. With Playwright and Chromium installed, run `SITE_ORIGIN=PREVIEW_ORIGIN node scripts/verify-browser.mjs`. Compare 390px and 1440px captures with the approved design after the overlay dismisses. Test mobile slow 4G and verify legacy inline source and canvas context loss separately.
4. Record Lighthouse mobile before/after, including the restored overlay's effect on LCP and CLS. Check field INP if available.
