const clinic = require('./clinic');
const { services, articles } = require('./content');
const { escape: e, metadata, businessGraph, pageGraph, schema } = require('./seo');

const serviceLink = slug => {
  const service = services.find(item => item.slug === slug);
  if (!service) throw new Error('Unknown service: '+slug);
  return [service.name, service.path];
};

const a = ([label, url]) => `<a href="${e(url)}">${e(label)}</a>`;
const list = links => `<ul class="info-links">${links.map(link => '<li>'+a(link)+'</li>').join('')}</ul>`;
const p = text => `<p>${e(text)}</p>`;
const h2 = text => `<h2>${e(text)}</h2>`;
const serviceLinks = services.map(({ name, path }) => [name,path]);
const navigation = [
  ['Home','/'], ['Services','/services/'], ['Our Doctors','/doctors/'],
  ['Visit Sekkalai',clinic.location], ['Patient Guides','/blog/'],
];
const policyLinks = Object.entries(clinic.policies).map(([slug,[title]]) => [title,'/'+slug+'/']);
const book = `<div class="info-actions">
<a class="btn btn-primary" href="/#booking">Book Appointment</a>
<a class="btn btn-ghost" href="tel:${clinic.telephone}">Call ${e(clinic.phone)}</a>
<a class="btn btn-ghost" href="${clinic.whatsapp}">WhatsApp</a>
</div>`;
const lastmod = '2026-11-18';

function sectionContent(page) {
  return page.sections.map(({ heading, paragraphs }) => {
    if (!paragraphs.length && page.questions.length) {
      return h2(heading) + page.questions.map(([question, answer]) => '<h3>'+e(question)+'</h3>'+p(answer)).join('');
    }
    return h2(heading) + paragraphs.map(p).join('');
  }).join('');
}

function sources(page) {
  return h2('Patient information sources') + list(page.sources);
}

function servicesContent() {
  return services.map(service => ({
    ...service,
    medical: true,
    about: { '@type':'MedicalProcedure',name:service.name },
    h1: (service.slug === 'periodontal' ? 'Periodontal Care' : service.name === 'Root Canal' ? 'Root Canal Treatment' : service.name) + ' in Karaikudi',
    title: (service.slug === 'periodontal' ? 'Periodontal Care' : service.name) + " in Karaikudi | Dr. Mani's",
    parent: navigation[1],
    body: sectionContent(service) + h2('Related dental services') + list(service.related.map(serviceLink))
      + h2('Ask a dentist about your options') + p('For an individual assessment, book an appointment at the clinic in Sekkalai. The clinic was founded by '+clinic.founder+'.') + list([[clinic.founder,clinic.profile],['Visit Sekkalai Clinic',clinic.location],['Patient guides','/blog/']])
      + sources(service),
  }));
}

function allPages(profilePhoto) {
  const team = {
    path:'/doctors/', h1:'Our Dental Team in Karaikudi', title:"Dental Team in Karaikudi | Dr. Mani's Dental Clinic",
    description:"Meet the founder of Dr. Mani's Dental Center and learn about the dental specialties available at the clinic in Sekkalai, Karaikudi.",
    body: `<img class="info-photo" src="/clinic-team.jpg" width="1024" height="582" alt="Dental team at Dr. Mani's Multispeciality Dental Center in Karaikudi" decoding="async">`
      + h2('How the clinic started') + p(clinic.founder+' founded '+clinic.name+' in 2017 in Karaikudi. The clinic brings together dental services for children and adults in Sekkalai.')
      + h2('Dental specialties') + '<ul>'+clinic.specialties.map(item=>'<li>'+e(item)+'</li>').join('')+'</ul>'
      + h2('Preparing for your visit') + p('Ask the front desk which clinician can assess your concern. You can also ask the team to explain how instruments are sterilised and how treatment areas are prepared between visits.')
      + list([[clinic.founder,clinic.profile],navigation[1],navigation[3]]),
  };
  const profile = {
    path:clinic.profile, h1:clinic.founder, title:'Dr. S. Manikandan | Dental Clinic Founder, Karaikudi', parent:navigation[2],
    about:{'@id':clinic.founderId},
    description:"Meet Dr. S. Manikandan, founder of Dr. Mani's Multispeciality Dental Center in Karaikudi. Contact the clinic in Sekkalai to book a visit.",
    body:`<img class="info-photo info-portrait" src="${e(profilePhoto)}" width="895" height="1200" alt="${e(clinic.founder)}, founder of the dental clinic in Karaikudi" decoding="async">`
      + h2('Founder of the clinic') + p(clinic.founder+' founded '+clinic.name+' in 2017. To ask about an appointment with him, call or WhatsApp the front desk.')
      + list([navigation[2],navigation[1],navigation[3]]),
  };
  const locationPage = {
    path:clinic.location, h1:'Dentist in Sekkalai, Karaikudi', title:"Dentist in Sekkalai, Karaikudi | Dr. Mani's Dental Clinic",
    description:"Find Dr. Mani's Dental Clinic in Sekkalai, Karaikudi, opposite Jeyakumaran Furniture. View clinic hours, directions and appointment contacts.",
    body:h2('Find the clinic') + p(clinic.name) + `<address>${e(clinic.address)}</address>`
      + p('Look for the MAM Building opposite Jeyakumaran Furniture. If you are coming via the Karaikudi bus stand or railway station, use the full address to plan your route. Call the clinic to ask about parking before travelling.')
      + h2('Opening hours') + p(clinic.hours) + p('For a Sunday visit, arrange an appointment with the front desk before travelling.')
      + h2('Directions and map') +
      `<p><a href="${e(clinic.map)}">Open directions in Google Maps</a> · <a href="https://www.google.com/maps?q=${encodeURIComponent(clinic.address)}&amp;output=embed" target="clinicMap">Load interactive map</a></p>
      <iframe class="info-map" name="clinicMap" title="Google Map for the Sekkalai dental clinic" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      + h2('Directions in Tamil') + '<p lang="ta">காரைக்குடி பல் மருத்துவமனை, செக்காலை. ஜெயகுமரன் ஃபர்னிச்சர் எதிரில் உள்ள எம்.ஏ.எம். கட்டிடத்தில் உள்ளது.</p>'
      + p("If you know us as Mani Dental Karaikudi or Dr. Mani's Dental Clinic, use the Sekkalai address above when you plan your visit.")
      + list([navigation[1],navigation[2],navigation[4]]),
  };
  const blog = {
    path:'/blog/', h1:'Dental Health Guides', title:"Dental Health Guides | Dr. Mani's Dental Clinic Karaikudi",
    description:'Find patient guides to root canals, implants, children’s dentistry, braces and gum care before a visit to our Sekkalai clinic.',
    body:h2('Read before your appointment') + p('Use these treatment guides to prepare questions for your dentist and understand what can happen before, during and after treatment.')
      + list(serviceLinks) + list([navigation[2], navigation[3]]),
  };
  const serviceIndex = {
    path:'/services/', h1:'Dental Services in Karaikudi', title:"Dental Services in Karaikudi | Dr. Mani's Dental Clinic",
    description:'Explore nine dental services in Sekkalai, including general dentistry, implants, root canal treatment, braces and dentistry for children.',
    body:h2('Explore our dental services') + list(serviceLinks) + h2('Plan a consultation') + p('Talk to the team about which appointment is suitable for you. The clinic is in Sekkalai, Karaikudi.') + list([navigation[2],navigation[3],navigation[4]]),
  };
  const about = {
    ...team, path:'/about/', h1:'About Our Dental Clinic in Karaikudi',
    title:"About Dr. Mani's Dental Clinic | Karaikudi",
    description:"Learn about Dr. Mani's Multispeciality Dental Center and its dental services in Sekkalai, Karaikudi.",
    body:h2('Visit us in Sekkalai') + p(clinic.name + ' is on Sekkalai Road, opposite Jeyakumaran Furniture.') +
      list([navigation[2], navigation[1], navigation[3]]),
  };
  const policies = Object.entries(clinic.policies).map(([slug,[h1,,summary]]) => ({
    path:'/'+slug+'/', h1, title:h1+" | Dr. Mani's", noindex:true,
    description:summary,
    body:p(summary) + h2('Contact the clinic') + p('For the complete policy or questions about how it applies to your appointment, contact the clinic directly.'),
  }));
  const notFound = {
    path:'/404', h1:'Page not found', title:"Page Not Found | Dr. Mani's Dental Clinic", noindex:true,
    description:'Find dental services, directions or booking information for our Sekkalai clinic in Karaikudi.',
    body:p('The address you entered could not be found.') + list(navigation),
  };
  return [serviceIndex, ...servicesContent(), team, profile, about, locationPage, blog, ...policies, notFound].map(page => ({lastmod,...page}));
}

function draftArticles() {
  return articles.map(article => ({
    ...article, h1:article.name, title:article.name+" | Dr. Mani's Dental Clinic", parent:navigation[4], noindex:true, medical:true,
    body:sectionContent(article)+h2('Related dental services')+list(article.related.map(serviceLink))+sources(article),
  }));
}

function render(page) {
  const breadcrumbs = [['Home','/'], ...(page.parent ? [page.parent] : []), [page.h1,page.path]];
  const graph = [...businessGraph(services), ...pageGraph(page,breadcrumbs)];
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${metadata(page)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap">
<link rel="stylesheet" href="/page.css">
${schema(graph)}
</head>
<body class="info">
<header class="info-header"><div class="wrap">
<a class="brand" href="/"><img src="/favicon.png" width="48" height="48" alt=""><span><b>${e(clinic.name)}</b><small>SEKKALAI · KARAIKUDI, TAMIL NADU</small></span></a>
<nav aria-label="Main">${navigation.map(a).join('')}</nav>
</div></header>
<main class="wrap info-main">
<nav class="info-breadcrumb" aria-label="Breadcrumb"><ol>${breadcrumbs.slice(0,-1).map(link=>'<li>'+a(link)+'</li>').join('')}<li aria-current="page">${e(page.h1)}</li></ol></nav>
<article>
<h1>${e(page.h1)}</h1>
${page.body}
${book}
</article>
</main>
<footer><div class="wrap info-foot">
<p><b>${e(clinic.name)}</b></p>
<address>${e(clinic.address)}</address>
<p>${e(clinic.hours)}</p>
<p><a href="tel:${clinic.telephone}">${e(clinic.phone)}</a> · <a href="${clinic.whatsapp}">WhatsApp</a></p>
<nav aria-label="Policies">${policyLinks.map(a).join('')}</nav>
</div></footer>
</body></html>`;
}

module.exports = { allPages, draftArticles, render };
