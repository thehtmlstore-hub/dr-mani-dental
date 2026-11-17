const fs = require('node:fs');
const path = require('node:path');

const home = 'https://www.drmanisdentalkaraikudi.com/';
const clinicName = "Dr. Mani's Multispeciality Dental Center";
const title = "Dentist in Karaikudi | Dr. Mani's Multispeciality Dental Center";
const description = "Visit Dr. Mani's Dental Center in Sekkalai, Karaikudi for dental implants, root canal treatment, braces and children's dentistry. Call to book an appointment.";
const photo = home + 'clinic-team.jpg';
const icon = home + 'favicon.png';
const photoAlt = "The doctors and consultants at Dr. Mani's Dental Center in Karaikudi";
const clinicId = home + '#clinic';
const siteId = home + '#website';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Dentist',
      '@id': clinicId,
      name: clinicName,
      url: home,
      description,
      telephone: '+91 95516 24126',
      image: photo,
      logo: icon,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'No. 315/24, MAM Building, Opposite Jeyakumaran Furniture, Sekkalai',
        addressLocality: 'Karaikudi',
        addressRegion: 'Tamil Nadu',
        postalCode: '630001',
        addressCountry: 'IN',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '21:00',
      },
      hasMap: 'https://www.google.com/maps/search/?api=1&query=Dr+Mani%27s+Multispeciality+Dental+Center+Karaikudi&query_place_id=ChIJSVBa1mBnADsR_ZiisGrVwLU',
      sameAs: [
        'https://www.instagram.com/drmanis_dental_karaikudi',
        'https://www.facebook.com/p/DrManis-Multispeciality-Dental-Center-100066769136105/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      url: home,
      name: clinicName,
      publisher: { '@id': clinicId },
    },
    {
      '@type': 'WebPage',
      '@id': home + '#webpage',
      url: home,
      name: title,
      description,
      isPartOf: { '@id': siteId },
      about: { '@id': clinicId },
    },
  ],
};

function applySeo(page, outputDirectory) {
  const assets = [
    ['favicon.png', /window\.__LOGO="data:image\/png;base64,([\w+/=]+)"/],
    ['clinic-team.jpg', /<img class="grp-img" src="data:image\/jpeg;base64,([\w+/=]+)"/],
  ];
  for (const [name, pattern] of assets) {
    const match = page.match(pattern);
    if (!match) throw new Error('Missing clinic SEO asset: ' + name);
    fs.writeFileSync(path.join(outputDirectory, name), Buffer.from(match[1], 'base64'));
  }

  const metadata = [
    '<title>' + title + '</title>',
    '<meta name="description" content="' + description + '"/>',
    '<meta name="robots" content="index, follow, max-image-preview:large"/>',
    '<link rel="canonical" href="' + home + '"/>',
    '<link rel="icon" type="image/png" sizes="256x256" href="' + icon + '"/>',
    '<link rel="apple-touch-icon" href="' + icon + '"/>',
    '<meta property="og:type" content="website"/>',
    '<meta property="og:locale" content="en_IN"/>',
    '<meta property="og:site_name" content="' + clinicName + '"/>',
    '<meta property="og:title" content="' + title + '"/>',
    '<meta property="og:description" content="' + description + '"/>',
    '<meta property="og:url" content="' + home + '"/>',
    '<meta property="og:image" content="' + photo + '"/>',
    '<meta property="og:image:type" content="image/jpeg"/>',
    '<meta property="og:image:width" content="1024"/>',
    '<meta property="og:image:height" content="582"/>',
    '<meta property="og:image:alt" content="' + photoAlt + '"/>',
    '<meta name="twitter:card" content="summary_large_image"/>',
    '<meta name="twitter:title" content="' + title + '"/>',
    '<meta name="twitter:description" content="' + description + '"/>',
    '<meta name="twitter:image" content="' + photo + '"/>',
    '<meta name="twitter:image:alt" content="' + photoAlt + '"/>',
    '<script type="application/ld+json">' + JSON.stringify(schema, null, 2) + '</script>',
  ].join('\n');

  const oldMetadata = /<title>[^<]*<\/title>\r?\n[\s\S]*?<meta content="summary" name="twitter:card"\/>/;
  const legalCanonical = /  let canonicalEl = document\.querySelector\('link\[rel="canonical"\]'\);[\s\S]*?  const baseCanonical = location\.href\.split\('#'\)\[0\];\r?\n/;
  if (!oldMetadata.test(page) || !legalCanonical.test(page)) {
    throw new Error('Clinic HTML metadata or canonical script changed');
  }

  return page
    .replace(oldMetadata, () => metadata)
    .replace(legalCanonical, '')
    .replace(/^    if \(canonicalEl\) canonicalEl\.href = baseCanonical.*;\r?\n/gm, '')
    .replace("['icon','apple-touch-icon'].forEach", "if (location.protocol === 'file:') ['icon','apple-touch-icon'].forEach");
}

module.exports = applySeo;
