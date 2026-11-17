const fs = require('node:fs');
const path = require('node:path');
const clinic = require('./clinic');
const { escape, metadata, home, businessGraph, pageGraph, schema } = require('./seo');

function applyHomepage(source, out, services, asset) {
  const logo = source.match(/window\.__LOGO="data:image\/png;base64,([\w+/=]+)"/);
  const team = source.match(/<img class="grp-img" src="data:image\/jpeg;base64,([\w+/=]+)"/);
  const founder = source.match(/<img class="face-top" src="data:image\/jpeg;base64,([\w+/=]+)"/);
  const poster = source.match(/id="heroMedia"[^>]*>\s*<img src="data:image\/jpeg;base64,([\w+/=]+)"/);
  const pack = source.match(/<script>window\.__HERO_PACK=([\s\S]*?);\s*<\/script>/);
  if (!logo || !team || !founder || !poster || !pack) throw new Error('Missing homepage media');
  fs.writeFileSync(path.join(out, 'favicon.png'), Buffer.from(logo[1], 'base64'));
  fs.writeFileSync(path.join(out, 'clinic-team.jpg'), Buffer.from(team[1], 'base64'));
  const profilePhoto = asset('jpeg', founder[1], 'dr-s-manikandan');
  const mobilePoster = asset('webp', fs.readFileSync(path.join(__dirname,'source/dental-clinic-poster-1200.webp')).toString('base64'), 'dental-clinic-hero-mobile');
  const posterUrl = asset('webp', fs.readFileSync(path.join(__dirname,'source/dental-clinic-poster-1920.webp')).toString('base64'), 'dental-clinic-hero');
  const posterVariants = mobilePoster+' 1200w, '+posterUrl+' 1920w';
  const posterSizes = '(max-width: 820px) min(180vw, 900px), 100vw';
  const [,width,height,encodedFrames] = pack[1].match(/^\{width:(\d+),height:(\d+),proxy:"[\w+/=]+",frames:(\[[\s\S]*\])\}$/) || [];
  const frames = encodedFrames && JSON.parse(encodedFrames.replace(/,\s*\]$/, ']'));
  if (frames?.length !== 150) throw new Error('Unexpected hero frame pack');
  const initialFrameCount = 12;
  const bootFrames = frames.slice(0,initialFrameCount).concat(Array(frames.length-initialFrameCount).fill(null));
  const frameAsset = (property, data, name) => asset('js', Buffer.from('document.currentScript.'+property+'='+JSON.stringify(data)+';').toString('base64'), name);
  const packUrl = frameAsset('heroPack', { width:Number(width),height:Number(height),frames:bootFrames }, 'hero-frames-initial');
  const remainingPackUrl = frameAsset('heroTail', frames.slice(initialFrameCount), 'hero-frames-remaining');

  const tamilCharacters = [...new Set((source+'காரைக்குடி பல் மருத்துவமனை').match(/[\u0b80-\u0bff]/gu))].sort().join('') + ' ·—';
  const tamilFamily = 'family=Noto+Serif+Tamil:ital,wdth,wght@0,62.5..100,500..800;1,62.5..100,500..800';
  const link = slug => '/'+slug+'/';
  let page = source
    .replace(/<title>[\s\S]*?<meta content="summary" name="twitter:card"\/>/, () =>
      metadata(home) + '\n' + schema([...businessGraph(services), ...pageGraph(home)]))
    .replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet"\/>/, original => {
      const latin = original.replace(/&amp;family=Noto\+Serif\+Tamil:[^&"]+/, '');
      const tamil = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?' + tamilFamily + '&amp;display=swap&amp;text=' + encodeURIComponent(tamilCharacters) + '">';
      const fontLinks = [latin,tamil];
      return fontLinks.map(link => link.replace('rel="stylesheet"', `rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'"`)).join('\n')
        + '\n<noscript>'+fontLinks.join('\n')+'</noscript>';
    })
    .replace(/<script>window\.__LOGO=[\s\S]*?<\/script>/, '<script>window.__LOGO="/favicon.png";</script>')
    .replace(pack[0], '')
    .replace(/script\.src=compactPack\?'assets\/hero-frames-compact\.js':'assets\/hero-frames-wide\.js';/,
      'script.src=' + JSON.stringify(packUrl) + ';')
    .replace("const budget=(compactPack?18:33)*1024*1024;", "const budget=18*1024*1024;")
    .replace("    script.onload=()=>{", "    script.fetchPriority='low';\n    script.onload=()=>{")
    .replace('  function loadVideoFallback(){', `  let requestedRemainingFrames=false;
  function requestRemainingFrames(){
    if(requestedRemainingFrames||videoFallback)return;
    requestedRemainingFrames=true;
    const script=document.createElement('script');
    script.src=${JSON.stringify(remainingPackUrl)};
    script.onload=()=>{
      const tail=script.heroTail;
      script.remove();
      if(disposed||videoFallback||!framePack)return;
      if(!Array.isArray(tail)||tail.length!==${frames.length-initialFrameCount}){loadVideoFallback();return;}
      framePack.frames.splice(${initialFrameCount},tail.length,...tail);
      queueMediaFrame();
    };
    script.onerror=()=>{script.remove();if(!disposed)loadVideoFallback();};
    document.head.append(script);
  }

  function loadVideoFallback(){`)
    .replace('frame<framePack.frames.length&&!frameCache.has(frame)', 'frame<framePack.frames.length&&Boolean(framePack.frames[frame])&&!frameCache.has(frame)')
    .replace('    if(!framePack)return;\n\n    const exact=', '    if(!framePack)return;\n    if(p>0)requestRemainingFrames();\n\n    const exact=')
    .replace("      showCanvas(true);\n      setMediaState('ready');\n    }\n    schedulePreparation();", "      if(p>0||canvasVisible)showCanvas(true);\n      setMediaState('ready');\n    }\n    if(p>0&&drawnFrame>=0)showCanvas(true);\n    schedulePreparation();")
    .replace("    if(mediaState==='idle')loadFramePack();", `    if(mediaState==='idle'){
      if(document.readyState!=='complete'&&p===0)return;
      loadFramePack();
    }`)
    .replace('  <div class="hero-stage" id="heroStage">', `  <script>
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !matchMedia('(max-height: 320px)').matches) {
      document.getElementById('heroTrack').classList.add('is-cinematic');
    }
  </script>
  <div class="hero-stage" id="heroStage">`)
    .replace("    const compactPack=compact.matches||(navigator.deviceMemory||8)<=4;\n", '')
    .replace(/data-fallback-src="assets\/hero\.mp4"/, 'data-fallback-src="/assets/hero.mp4"')
    .replace('muted playsinline preload="auto"', 'muted playsinline preload="metadata"')
    .replace('    vid.src=vid.dataset.fallbackSrc;', '    vid.poster=media.querySelector("img").currentSrc;\n    vid.src=vid.dataset.fallbackSrc;')
    .replace(/<title>[^<]+<\/title>/, match => match + `\n<link rel="preload" href="${posterUrl}" as="image" fetchpriority="high" imagesrcset="${posterVariants}" imagesizes="${posterSizes}">`)
    .replace(/<div aria-hidden="true" id="pre">/, '<div aria-hidden="true" id="pre" class="done">')
    .replace(/<span class="chip chip-sm">✦ Advanced Dental Care in Karaikudi<\/span>/,
      '<h1 class="chip chip-sm"><span aria-hidden="true">✦&nbsp;</span>Dentist in Karaikudi</h1>')
    .replace(/<h1 lang="ta" class="ta-h">([\s\S]*?)<\/h1>/, '<h2 lang="ta" class="ta-h">$1</h2>')
    .replace(/\.chapter h1\.ta-h/g, '.chapter h2.ta-h')
    .replace(/\.chapter h1(?![\w.-])/g, '.chapter .ta-h')
    .replace(/\.chapter h2(?![\w.-])/g, '.chapter h2:where(:not(.ta-h))')
    .replace('</style></head>', `.chapter h1.chip{font-family:inherit}
.is-cinematic .chapter[data-ch="0"]{opacity:1;visibility:visible;transform:translateY(-50%)}
@media (max-width:820px), (orientation:landscape) and (max-height:600px) and (max-width:1100px){
  .is-cinematic .chapter[data-ch="0"]{transform:none}
}
</style></head>`)
    .replace(/<!-- DOCTORS OVERLAY -->[\s\S]*?(?=<!-- FOOTER)/, '')
    .replace(/href="#doctors"/g, 'href="/doctors/"')
    .replace(/  \/\* DOCTORS OVERLAY \*\/[\s\S]*?(?=  \/\* everything that must be hidden)/, '')
    .replace('  let docReturnFocus=null;\n', '')
    .replace(/  const isDocsOpen=[\s\S]*?(?=  \/\* deep link: \/#doctors)/, `  const FOCUSABLE='a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  addEventListener('keydown',e=>{
    if(e.key==='Escape'&&document.body.classList.contains('nav-open')){setNav(false);burger.focus();}
  });
`)
    .replace(/  \/\* deep link: \/#doctors[^\n]*\n/, '')
    .replace(/\s*if \(isDocsOpen\(\)\) closeDocs\(null, true\);/, '')
    .replace(' && !isDocsOpen()', '')
    .replace("  if(location.hash==='#doctors')openDocs();", "  if(location.hash==='#doctors')location.replace('/doctors/');")
    .replace(/  const POLICIES = \{[\s\S]*?\n  \};/, () => {
      const policies = Object.fromEntries(Object.entries(clinic.policies).map(([slug, [title, chip, lead]]) => [
        slug, { slug, route: link(slug), title, chip, lead, metaTitle: title + ' | ' + clinic.name, metaDesc: lead, related: ['privacy-policy', 'cookie-policy'].filter(other => other !== slug), sections: [] },
      ]));
      policies['cookie-policy'].sections.push({
        id: 'map-preferences', title: 'Google Maps preferences',
        body: '<p>Choose whether to display the Google Maps embed.</p><button class="cookie-toggle" type="button" id="cpMapToggle" role="switch" aria-checked="false" aria-label="Toggle Google Map embed"></button>',
      });
      return '  const POLICIES = '+JSON.stringify(policies)+';';
    })
    .replace(/href="#([a-z-]+)" data-policy="\1"(?: data-route="[^"]+")?/g, (_, slug) => 'href="'+link(slug)+'"')
    .replace('if (POLICIES[cleanedSlug]) {', "if (rawHref.startsWith('#') && POLICIES[cleanedSlug]) {")
    .replace(/<span class="ph-tag">\[[A-Z /-]+\]<\/span>/g, '')
    .replace('<h1 id="legalTitle">Privacy Policy</h1>', '<h2 id="legalTitle">Privacy Policy</h2>')
    .replaceAll('.legal-hero h1', '.legal-hero #legalTitle')
    .replace('href="#${k}" data-policy="${k}"', 'href="/${k}/"')
    .replace('href="#${rk}" data-policy="${rk}"', 'href="/${rk}/"')
    .replace('You have chosen to disable third-party map embeds in your Cookie Preferences.', 'Enable the third-party map to view it here.')
    .replace(/\s*<span><b>Last Updated:<\/b>\s*<\/span>/, '')
    .replace(/<iframe([^>]*?) src="(https:\/\/www\.google\.com\/maps[^"]+)"/, '<iframe$1 data-map-src="$2"')
    .replace('const mapAllowed = !prefs || prefs.map !== false;', 'const mapAllowed = prefs?.map === true;')
    .replace("dirMapContainer.classList.toggle('map-off', !mapAllowed);", `dirMapContainer.classList.toggle('map-off', !mapAllowed);
      const mapFrame = dirMapContainer.querySelector('iframe[data-map-src]');
      if (mapAllowed && mapFrame && !mapFrame.hasAttribute('src')) mapFrame.src = mapFrame.dataset.mapSrc;
      if (!mapAllowed && mapFrame) mapFrame.removeAttribute('src');`)
    .replace('const cur = !prefs || prefs.map !== false;', 'const cur = prefs?.map === true;')
    .replace(/\s*<span><b>Legal Entity:<\/b>\s*<\/span>/, '')
    .replace(/<span>(?:Legal Name|Registered Office|Privacy Contact|Officer \/ Contact|Details):\s*<\/span>/g, '')
    .replace(/    (?:if \(canonicalEl\) canonicalEl\.href = baseCanonical.*;\r?\n)/g, '')
    .replace(/  let canonicalEl = [\s\S]*?  const baseCanonical = [^\n]*\n/, '')
    .replace(/  \/\* SERVICES \*\/\n[\s\S]*?(?=  \/\* FAQ ACCORDION)/, '');

  page = page
    .replace(/<script>\s*\/\* ={10,}\s*LIVE GOOGLE REVIEWS[\s\S]*?<\/script>/, '')
    .replace(/<span class="g-rating-val">4\.9<\/span> · <span class="g-count-val">121<\/span>\+ Google Reviews/g, 'Google Reviews')
    .replace(/<b><span class="g-rating-val">4\.9<\/span>★<\/b><small>Google<\/small>/g, '<b>★</b><small>Google Reviews</small>')
    .replace(/<b data-count="4\.9" data-dec="1">0<\/b><small>Google Rating · <span class="g-count-val">121<\/span>\+ Reviews<\/small>/, '<b>★</b><small>Google Reviews</small>')
    .replace(/<span class="g-sum-score g-rating-val">4\.9<\/span>/, '<span class="g-sum-score" aria-hidden="true">★</span>')
    .replace(/<span class="g-stars" role="img" aria-label="5 out of 5 stars">[\s\S]*?<\/span>/, '')
    .replace(/Based on <span class="g-count-val">121<\/span>\+ verified Google reviews/, 'See the clinic’s reviews on Google')
    .replace(/<span class="g-count-val">121<\/span>\+ reviews/gi, 'reviews')
    .replace(/<b>4\.9\/5<\/b><small>Google Rating<\/small>/, '<b>★</b><small>Google Reviews</small>')
    .replace(/<b><span class="g-count-val">121<\/span>\+<\/b><small>Google Reviews<\/small>/, '<b>6</b><small>Days Open Weekly</small>')
    .replace('title="Live data synced with Google Maps listing"', 'title="Open the clinic’s reviews on Google"')
    .replace('Verified on Google', 'Reviews on Google');

  let serviceIndex = 0;
  page = page.replace(/<button class="lm" type="button">Learn more<\/button>/g, () => {
    const { name, path } = services[serviceIndex++];
    return '<a class="lm" href="' + path + '">About ' + escape(name) + '</a>';
  });
  if (serviceIndex !== services.length) throw new Error('Homepage service links and service list differ');

  const replacements = [
    ['Modern technology, personalized attention, and a genuinely gentle approach — trusted by over a lakh patients across Tamil Nadu.', 'Modern technology, personalized attention, and a genuinely gentle approach in Sekkalai, Karaikudi.'],
    ['1,00,000+ Patients', 'Care in Sekkalai'],
    ['1,00,000+ Smiles.', 'Care for Every Smile.'],
    ['<b>1L+</b><small>Patients</small>', '<b>9</b><small>Dental services</small>'],
    ['<b>9+</b><small>Years</small>', '<b>2017</b><small>Founded</small>'],
    ['<b data-count="100000" data-fmt="lakh">0</b><small>Patients Treated</small>', '<b>9</b><small>Dental Services</small>'],
    ['<b data-count="9" data-suffix="+">0</b><small>Years of Experience</small>', '<b>2017</b><small>Clinic Founded</small>'],
    ['<b>1L+</b><small>Patients Treated</small>', '<b>9</b><small>Dental Services</small>'],
    ['<b>9+ Yrs</b><small>Of Experience</small>', '<b>2017</b><small>Clinic Founded</small>'],
    ['9+ Years Experience', 'Serving Karaikudi Since 2017'],
    ['Trusted by over a lakh patients with consistent, reliable outcomes across all ages and needs.', 'Dental consultations and treatment planning for children and adults.'],
    ['Painless Root Canal Techniques', 'Root Canal Treatment'],
    ['Painless Root Canals', 'Root Canal Treatment'],
    ['Painless, precision root canal treatment that saves your natural tooth and relieves deep discomfort.', 'Root canal treatment to address infection inside a tooth and help preserve it when possible.'],
    ['Permanent, natural-looking tooth replacement using modern implant systems designed to last decades.', 'Dental implants can support a replacement tooth when your gums, jawbone and health are suitable.'],
    ['painless treatments', 'treatment options'],
    ['treatment options, timelines, or fees', 'treatment options and timelines'],
    ['Not at all. We follow a comfort-first, anxiety-aware protocol using gentle local anaesthesia, rotary endodontics, and digital apex locators. Most root canals are completed painlessly in a single sitting, and we always move at your pace.', 'Local anaesthesia is typically used during root canal treatment. Some people have temporary soreness afterwards. Your dentist will assess the tooth and explain how many visits may be needed.'],
    ['Experience the care and precision that has transformed over 1,00,000 smiles. Book your visit today.', 'Talk to our dental team about your concerns and what to expect at your visit.'],
    ['Advanced, gentle and personalized dental care — trusted by over 1,00,000 patients across Tamil Nadu. Your smile is in good hands.', "Advanced, gentle and personalized dental care at Dr. Mani's Dental Clinic in Sekkalai, Karaikudi."],
    ['Led by Dr.S.Manikandan with 6 specialists in Implants, Periodontics, Oral Surgery &amp; Pedodontics', 'Founded by Dr. S. Manikandan. Specialists in Periodontics &amp; Implants, Oral &amp; Maxillofacial Surgery, and Pedodontics.'],
    ['Yes. Alongside our Founder &amp; Chief Dental Surgeon Dr. Manikandan (BDS, MBA — Hospital Management), our 7-doctor team includes dedicated specialists in Periodontics &amp; Implants, Oral &amp; Maxillofacial Surgery, and Pedodontics — all under one roof in Sekkalai.', 'The clinic offers care in Periodontics &amp; Implants, Oral &amp; Maxillofacial Surgery, and Pedodontics. Call the front desk to ask which clinician can assess your concern.'],
    ['Every treatment suite follows strict hospital-grade sterilization protocols. All instruments are ultrasonically cleaned, autoclaved in individual sealed pouches, and opened fresh in front of you before every procedure.', 'Ask the team to explain how dental instruments are sterilised and treatment rooms are prepared between visits. We can answer your questions before treatment.'],
    ['Hospital-grade sterilization', 'Instrument sterilization'],
    ['Sterilised, sealed instruments for every patient', 'Ask our team about instrument preparation'],
    ['Placing a single dental implant typically takes under an hour under local anaesthesia, followed by a healing window before the custom crown is fitted. On your first visit, we take digital scans and explain your complete step-by-step timeline and transparent cost estimate upfront.', 'The timeline depends on the treatment plan and your healing. An implant may need time to heal before the final crown is fitted. At the consultation, ask which stages apply to you.'],
    ['any required digital X-ray is taken and reviewed chairside at no extra cost', 'a clinically indicated digital X-ray is offered free on the first visit'],
    ['we’ll call you back to confirm your slot, usually within the hour.', 'the clinic will confirm your appointment.'],
    ["we'll call you back to confirm your slot, usually within the hour.", 'the clinic will confirm your appointment.'],
    ['It is easily accessible, well connected, and reasonably priced. With decent coverage and clean &amp; hygienic facilities, this clinic provides top-notch dental care.', '…'],
    ['The services were reasonably priced and I received quick service. Overall, a great experience!', '… Overall, a great experience!'],
    ['Short wait times and reasonably priced services.', '…'],
    ['13+ treatments delivered', 'dental care delivered'],
    ['planned to the micron', 'planned around your needs'],
    ['keeping children completely fear-free', 'helping children get used to dental visits'],
    ['fear-free', 'child-friendly'],
    ['Fear-free', 'Child-friendly'],
    ['so healing is quick and worry-free', 'to help you know what to expect while healing'],
    ['with total confidence', 'with support for everyday use'],
    ['On-site parking', 'Plan your visit'],
    ['Recognised &amp; accredited', 'Inside the clinic'],
    ['Certifications, awards and memberships earned over nine years of practice.', 'A look at the clinic’s interiors in Sekkalai.'],
    ['Wall of certifications, awards and memberships earned by the practice', 'A wall display inside the Karaikudi dental clinic'],
    ['Free X-Ray With Consultation', 'Free Digital X-Ray on First Visit'],
    ['Parking available on-site.', 'Call the front desk to ask about parking.'],
    ['Karaikudi – 630001, Tamil Nadu.</p>', 'Karaikudi – 630001, Tamil Nadu, India.</p>'],
    ['Karaikudi – 630001,<br/>Tamil Nadu.</p>', 'Karaikudi – 630001,<br/>Tamil Nadu, India.</p>'],
  ];
  for (const [oldText,newText] of replacements) page = page.replaceAll(oldText,newText);
  page = page.replace(
    '<p>Step inside Dr. Mani’s Multispeciality Dental Center',
    '<p><span lang="ta">காரைக்குடி பல் மருத்துவமனை</span> · Step inside Dr. Mani’s Multispeciality Dental Center',
  ).replace(/<div>\s*<h3>Quick Links<\/h3>[\s\S]*?<\/div>/, links => links
    .replace('href="#services">Services', 'href="/services/">Services')
    .replace('href="#faq">FAQs', 'href="/blog/">Patient Guides')
    .replace('href="#directions">Get Directions', 'href="'+clinic.location+'">Get Directions')
    ).replace(
    "Dr. Mani's Multispeciality Dental Center logo",
    "Dr. Mani's Multispeciality Dental Center logo, Mani Dental Karaikudi",
  );

  page = page.replace(/<img\b[^>]*>/g, tag => {
    const match = tag.match(/src="data:image\/(jpeg|webp|png);base64,([\w+/=]+)"/);
    if (!match) return tag;
    if (match[2] === logo[1]) return tag.replace(match[0], 'src="/favicon.png" width="256" height="256"');
    if (match[2] === poster[1]) return tag.replace(match[0], `src="${posterUrl}" srcset="${posterVariants}" sizes="${posterSizes}" width="1920" height="1080" fetchpriority="high"`);
    const alt = tag.match(/alt="([^"]*)"/)?.[1] || 'clinic-photo';
    const filename = alt.toLowerCase().match(/[a-z0-9]+/g)?.slice(0, 7).join('-') || 'clinic-photo';
    const src = asset(match[1], match[2], filename);
    const [width,height] = imageSize(match[1], Buffer.from(match[2], 'base64'));
    return tag.replace(match[0], 'src="'+src+'" width="'+width+'" height="'+height+'"'+(/loading=/.test(tag)?'':' loading="lazy"'));
  }).replace(/data:image\/(jpeg|png|webp);base64,([\w+/=]+)/g, (_, format, bytes) => asset(format, bytes, 'clinic-photo'));
  return { page, profilePhoto };
}

function imageSize(format, bytes) {
  if (format === 'png') return [bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
  if (format === 'webp') {
    const type = bytes.toString('ascii',12,16);
    if (type === 'VP8X') return [1+bytes.readUIntLE(24,3),1+bytes.readUIntLE(27,3)];
    if (type === 'VP8L') {
      const data = bytes.readUInt32LE(21);
      return [1+(data&0x3fff),1+((data>>>14)&0x3fff)];
    }
    if (type === 'VP8 ') return [bytes.readUInt16LE(26)&0x3fff,bytes.readUInt16LE(28)&0x3fff];
  }
  for (let offset = 2; offset + 8 < bytes.length; ) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset+1];
    if ([0xc0,0xc1,0xc2,0xc3].includes(marker)) {
      return [bytes.readUInt16BE(offset+7),bytes.readUInt16BE(offset+5)];
    }
    offset += 2 + bytes.readUInt16BE(offset+2);
  }
  throw new Error('Unknown image dimensions: '+format);
}

module.exports = applyHomepage;
