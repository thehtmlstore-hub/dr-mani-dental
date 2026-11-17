# Old-domain migration

Deploy this directory as the root of a Vercel project for **drmanisdentalclinic.com** and **www.drmanisdentalclinic.com**, with DNS and TLS active for both. The file uses explicit HTTP 301 redirects. Keep the old domain active during the migration.

The old domain still served the legacy PHP site when checked on 17 November 2026. The following paths were discovered in its live navigation and homepage. Confirm additional URLs using the old sitemap, Search Console, access logs or backlinks, and insert additional rules above the final catch-all. Unrelated fallback redirects can be treated as soft 404s.

| Old path | New destination |
| --- | --- |
| `/` | `/` |
| `/index.php` | `/` |
| `/about.php` | `/doctors/` |
| `/appointment.php` | `/#booking` |
| `/contact.php` | `/dentist-in-sekkalai-karaikudi/` |
| `/facility.php` | `/#clinic` |
| `/gallery.php` | `/#results` |
| `/treatment.php` | `/services/` |
| `/treatments.php` | `/services/` |
| `/root_canal.php` | `/services/root-canal-karaikudi/` |
| `/dentures.php` | `/services/dental-implants-karaikudi/` |
| `/implant.php` | `/services/dental-implants-karaikudi/` |
| `/whitening.php` | `/services/cosmetic-dentistry-karaikudi/` |
| `/full_mouth.php` | `/services/dental-implants-karaikudi/` |
| `/kids.php` | `/services/pedodontics-karaikudi/` |
| `/Kids.php` | `/services/pedodontics-karaikudi/` |
| `/orthodontic.php` | `/services/braces-aligners-karaikudi/` |
| `/gums.php` | `/services/periodontal-karaikudi/` |
| `/filling.php` | `/services/general-dentistry-karaikudi/` |
| `/ceramic_crown.php` | `/services/general-dentistry-karaikudi/` |
| `/x-ray.php` | `/#booking` |
| `/laser.php` | `/services/` |

The implants page discusses dentures among the replacement options. The services directory is the nearest destination for the legacy laser dentistry link while that service remains unconfirmed. The old appointment fragment on `/index.php#appointment` is client-side and does not reach the host. Use the direct new booking link when updating citations and backlinks.

Check each known old path with `curl -sSI https://drmanisdentalclinic.com/OLD-PATH`. Check that the first response is a 301, its Location is the intended canonical, and the destination returns 200. Repeat on the old www host. Confirm DNS, HTTPS and redirect behaviour separately from the new Vercel project.
