const clinic = require('./clinic');

const home = {
  path: '/',
  title: "Dr. Mani's Dental Clinic Karaikudi | Dentist in Sekkalai",
  description: "Dr. Mani's Multispeciality Dental Center, Karaikudi: implants, root canal, braces, kids' dentistry. Free digital X-ray on first visit. 95516 24126.",
  h1: 'Dentist in Karaikudi',
  lastmod: '2026-11-18',
};

const escape = value => String(value).replace(/[&<>"]/g, character => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]
));

function metadata(page) {
  const url = clinic.origin + page.path;
  const image = clinic.origin + '/assets/clinic-share.webp';
  const imageAlt = "Dental team at Dr. Mani's Multispeciality Dental Center in Sekkalai, Karaikudi";
  const properties = {
    'og:type': 'website',
    'og:locale': 'en_IN',
    'og:site_name': clinic.name,
    'og:title': page.title,
    'og:description': page.description,
    'og:url': url,
    'og:image': image,
    'og:image:type': 'image/webp',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': imageAlt,
  };
  const names = {
    description: page.description,
    robots: page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    'twitter:card': 'summary_large_image',
    'twitter:title': page.title,
    'twitter:description': page.description,
    'twitter:image': image,
    'twitter:image:alt': imageAlt,
  };
  return [
    `<title>${escape(page.title)}</title>`,
    `<link rel="canonical" href="${escape(url)}">`,
    '<link rel="icon" type="image/png" sizes="256x256" href="/favicon.png">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/assets/clinic-icon-32.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/assets/clinic-icon-180.png">',
    ...(process.env.GOOGLE_SITE_VERIFICATION ? [`<meta name="google-site-verification" content="${escape(process.env.GOOGLE_SITE_VERIFICATION)}">`] : []),
    ...(process.env.BING_SITE_VERIFICATION ? [`<meta name="msvalidate.01" content="${escape(process.env.BING_SITE_VERIFICATION)}">`] : []),
    ...Object.entries(names).map(([key, value]) => `<meta name="${key}" content="${escape(value)}">`),
    ...Object.entries(properties).map(([key, value]) => `<meta property="${key}" content="${escape(value)}">`),
  ].join('\n');
}

function businessGraph(services) {
  return [
    {
      '@type': ['Dentist', 'MedicalBusiness', 'MedicalClinic'],
      '@id': clinic.clinicId,
      name: clinic.name,
      alternateName: ["Dr. Mani's Dental Clinic", 'Manis Dental Clinic', 'Mani Dental Karaikudi'],
      url: clinic.origin + '/',
      logo: clinic.origin + '/favicon.png',
      image: clinic.origin + '/clinic-team.jpg',
      telephone: clinic.phone,
      foundingDate: '2017',
      founder: { '@id': clinic.founderId },
      address: {
        '@type': 'PostalAddress',
        streetAddress: clinic.streetAddress,
        addressLocality: 'Karaikudi',
        addressRegion: 'Tamil Nadu',
        postalCode: '630001',
        addressCountry: 'IN',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => 'https://schema.org/' + day),
        opens: '09:30',
        closes: '21:00',
      },
      medicalSpecialty: 'https://schema.org/Dentistry',
      availableService: services.map(({ name }) => ({ '@type': 'MedicalProcedure', name })),
      sameAs: [clinic.instagram, clinic.facebook],
    },
    {
      '@type': 'Person',
      '@id': clinic.founderId,
      name: clinic.founder,
      url: clinic.origin + clinic.profile,
      worksFor: { '@id': clinic.clinicId },
    },
    {
      '@type': 'WebSite',
      '@id': clinic.origin + '/#website',
      url: clinic.origin + '/',
      name: clinic.name,
      publisher: { '@id': clinic.clinicId },
    },
  ];
}

function pageGraph(page, breadcrumbs = []) {
  const url = clinic.origin + page.path;
  const breadcrumbId = url + '#breadcrumb';
  const object = {
    '@type': page.medical ? 'MedicalWebPage' : 'WebPage',
    '@id': url + '#webpage',
    url,
    name: page.h1,
    description: page.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': clinic.origin + '/#website' },
    about: page.about || { '@id': clinic.clinicId },
  };
  if (!breadcrumbs.length) return [object];
  object.breadcrumb = { '@id': breadcrumbId };
  return [object, {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: breadcrumbs.map(([name, path], index) => ({
      '@type': 'ListItem', position: index + 1, name, item: clinic.origin + path,
    })),
  }];
}

function schema(graph) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
  return `<script type="application/ld+json">${json.replaceAll('<', '\\u003c')}</script>`;
}

module.exports = { escape, metadata, home, businessGraph, pageGraph, schema };
