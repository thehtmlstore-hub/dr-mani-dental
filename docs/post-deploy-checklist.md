# Post-deployment checklist

1. Obtain access to the old registrar and DNS account. Inventory any additional legacy paths through Search Console, sitemaps, access logs and backlinks. Deploy the separate Vercel project from `migration/`.
2. Add the old apex and www hostnames to the redirect project. Use the exact DNS values from Vercel's Domains screen. Replace conflicting web records and preserve mail and verification records. Wait for HTTPS to work on both hosts.
3. Run `bash scripts/verify-redirects.sh`. If the platform sends a different status or adds an HTTP upgrade before the redirect, use a redirect-capable old origin or edge to serve the exact one-hop 301s.
4. Verify both domains as Domain properties in Search Console and verify them in Bing Webmaster Tools. Submit the current sitemap. Request indexing for home and top service pages via URL Inspection.
5. After the redirects pass, use Search Console's Change of Address on the old property. Keep the redirects for at least six months and keep the old domain renewed indefinitely. Monitor the Pages report weekly.
6. Confirm the Google Business Profile website and audit local listings. Complete the hosting, browser and clinic-review checks before release.
