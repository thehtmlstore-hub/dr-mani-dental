# Old-domain migration

Deploy this directory as the root of a Vercel project for **drmanisdentalclinic.com** and **www.drmanisdentalclinic.com**, with DNS and TLS active for both. The file uses explicit HTTP 301 redirects. Keep the old domain active during the migration.

The old URL inventory is pending. Insert confirmed path rules above the catch-all. Keep user intent and link equity by redirecting each old page to its closest published equivalent. Review any unresolved paths before relying on the home fallback. Unrelated redirects can be treated as soft 404s.

| Old URL | New destination | Status |
| --- | --- | --- |
| `/` | `https://www.drmanisdentalkaraikudi.com/` | Configured |
| Service URLs from the old sitemap, Search Console and backlinks | Matching `/services/<service>-karaikudi/` | Exact source URLs needed |
| Doctor and team URLs | `/doctors/` or exact verified profile | Exact source URLs and doctor roster needed |
| Address, directions and contact URLs | `/dentist-in-sekkalai-karaikudi/` | Exact source URLs needed |
| Policy URLs | Corresponding policy route | Exact source URLs needed |
| Indexed article URLs | Closest equivalent guide or clinician-approved article | Exact source URLs and article approval needed |
| Other requests | New homepage | Temporary catch-all rule pending the URL inventory |

Check each known old path with `curl -sSI https://drmanisdentalclinic.com/OLD-PATH`. Check that the first response is a 301, its Location is the intended canonical, and the destination returns 200. Repeat on the old www host. Confirm DNS, HTTPS and redirect behaviour separately from the new Vercel project.
