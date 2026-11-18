# Old-domain 301 rules

Deploy this directory as a separate legacy-domain project. The mapping is in `docs/old-domain-redirects.csv`. The routes preserve exact treatment intent, with case-insensitive PHP paths and slash variants. Add more paths if the old sitemap, Search Console or server logs establish a relevant destination. Each redirect should land directly on the new canonical URL.

Use `docs/post-deploy-checklist.md` for DNS and TLS. Use `scripts/verify-redirects.sh` to verify the first response for each known path and origin. Vercel may upgrade HTTP before project redirects run. A redirect-capable edge or the legacy origin is needed if testing shows a platform HTTP upgrade that breaks the strict one-hop 301 contract.
