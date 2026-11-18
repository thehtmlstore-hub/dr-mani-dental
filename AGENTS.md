# Protected elements

- Preserve the branded homepage preloader during SEO, performance and refactor work. Its dependencies are `#pre`, `.pre-in`, `.pre-logo`, `.pre-name`, `.pre-sub`, `.pre-bar`, the `preFailsafe` keyframes, the original logo asset, and `initPreloader` in `homepage-resilience.js`. Preserve the fixed overlay, minimum display time, reduced-motion and noscript behaviour, readiness event and unconditional timeout.
- The in-hero `#heroLoader` is separate. Preserve the scroll-scrub frame sequence and its image/video fallback.
- Keep homepage content readable when JavaScript fails. Scroll reveals may enhance already-visible HTML.
