# SEO and AEO audit

Baseline is GitHub main at 9a409362b5601c11c3dbc041be5a3a6fffff66d3. The local Downloads copy of the supplied 14,293,027-byte HTML has the same Git blob ID as the checked-in design input. The old HTML archive also supplied the original MP4. Both pre-existing WebP posters were reproduced byte-for-byte against the Git blob IDs.

| Check | Baseline |
| --- | --- |
| Stack and hosting | Node static build on Vercel, with vanilla HTML, CSS, JavaScript and Lenis. The Vercel output directory is dist. |
| Raw content | A reproducible baseline build emitted 26 HTML files and 15 indexable routes. Services, clinic details, reviews, form and most homepage content were static. The doctor overlay had been removed from the build. Legacy policy dialogs still depended on JavaScript. |
| Homepage | 308,081 bytes uncompressed. One H1 and an absolute HTTPS www canonical. Static document title differs from the design input. |
| Crawl and schema | Existing robots and sitemap. Dentist, WebSite, WebPage, founder Person and inner BreadcrumbList/MedicalWebPage markup. No FAQPage. The clinic founding year was present in schema despite conflicting source records. |
| Accessibility and failure modes | Main already restores the reveal observer and visible-by-default CSS. The preloader markup was stamped with class done during the build, and the source script also dismissed it on initialization. |
| Assets | The baseline already extracted editorial image payloads, the hero frames and original MP4. The 1.44 MB total frame payload is partially deferred. The legacy HTML retains the original visual reference and source imagery. |
| Content and NAP | Existing noindex policy pages use interim wording. The legacy source still contains unverified legal placeholders, credentials and clinic statistics. See CLIENT-CONFIRM.md. |
| Lighthouse | Previous production audit recorded mobile Performance 90, SEO 100, LCP 3.6 s and CLS 0.009. These are historical, pre-preloader figures. Field INP was unavailable. |

The working environment could not resolve the public domains with curl, and web fetch did not return the homepage. Baseline raw observations above come from the exact local build inputs. Fresh raw HTTP comparisons, console/network logs, pixel diffs and before/after Lighthouse remain open. Archived deployment screenshots and historical scores cannot substitute for those checks.

FAQPage serves structured access to the published FAQ. Google generally restricts FAQ rich results to well-known authoritative health or government sites. No rich-result or AI inclusion is assumed. See https://developers.google.com/search/docs/appearance/structured-data/faqpage.
