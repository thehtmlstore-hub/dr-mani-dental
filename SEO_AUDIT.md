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

The new FAQ is limited to logistics. Existing clinical FAQ text is a release review item because replacing or removing those panels changes the approved visible content. No new clinical Q&A was added to a public page.

## Branch verification

The local build before workspace disconnect emitted 28 HTML files and 17 indexable routes. Its homepage was 275,755 bytes. Static checks passed for canonical, H1, title/description limits, JSON-LD syntax, 16 matching English/Tamil FAQ entries, 22 known redirects and duplicate carousel removal. Three independent preloader tests passed. The last patches and handoff scripts were recovered after disconnect. Retest the exact branch preview before release.

| Mobile audit | Previous main baseline | Branch |
| --- | --- | --- |
| Lighthouse Performance | 90 | Fresh run pending |
| Lighthouse SEO | 100 | Fresh run pending |
| LCP | 3.6 s | Fresh run pending |
| CLS | 0.009 | Fresh run pending |
| Field INP | Unavailable | Unavailable |

## Release gates

- Main already serves a small static page with external media. The attached monolith remains the legacy visual input. Main's visible eyebrow, team directory and policy adjustments predate this branch. Returning to the legacy layout or overlay would change the deployed design and may expose unverified doctor details. Review this before merge.
- The original branded overlay was restored. The independent reveal uses visible-by-default content, so ordinary content is available without waiting for a timer.
- The new FAQ is logistics only. Existing clinical Q&A and visible founding claims require a design and clinic decision before merge. Removed unverified founding date from JSON-LD. See CLIENT-CONFIRM.md.
- The new share image and icons are metadata-stripped. Blanket source-photo conversion, critical-font self-hosting, grouped feature isolation and exact inline/video/canvas comparisons await visual and runtime verification.
- Fresh Lighthouse, public redirect status and compression, exact live/build SHA comparison, external schema validator results and 390px/1440px screenshot parity remain open. The workspace did not resolve public DNS or run Playwright.
