const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const applyHomepage = require('./homepage');
const { origin } = require('./clinic');
const { services } = require('./content');
const { home } = require('./seo');
const { allPages, draftArticles, render } = require('./pages');

const root = __dirname;
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive:true, force:true });
fs.mkdirSync(path.join(out, 'assets'), { recursive:true });
for (const name of ['clinic-share.webp','clinic-icon-32.png','clinic-icon-180.png']) {
  fs.copyFileSync(path.join(root,'source',name),path.join(out,'assets',name));
}

function asset(format, base64, name) {
  const bytes = Buffer.from(base64, 'base64');
  const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const extension = format === 'jpeg' ? 'jpg' : format;
  const file = name+'-'+hash+'.'+extension;
  fs.writeFileSync(path.join(out, 'assets', file), bytes);
  return '/assets/'+file;
}

const pageSource = fs.readFileSync(path.join(root, 'manidental2.html'), 'utf8');
const mediaSource = fs.readFileSync(path.join(root, 'source/manidental2.html'), 'utf8');
const video = mediaSource.match(/<script type="application\/octet-stream" id="heroVideoData">([\s\S]*?)<\/script>/);
if (!video) throw new Error('Missing embedded video fallback');
fs.writeFileSync(path.join(out, 'assets', 'hero.mp4'), Buffer.from(video[1], 'base64'));
const homepage = applyHomepage(pageSource, out, services, asset);
fs.writeFileSync(path.join(out, 'index.html'), homepage.page);

const styles = pageSource.match(/<style>([\s\S]*?)<\/style>/)[1];
fs.writeFileSync(path.join(out, 'page.css'), styles+'\n'+fs.readFileSync(path.join(root, 'page.css'), 'utf8'));

const pages = allPages(homepage.profilePhoto);
const routes = [home, ...pages];
for (const page of pages) {
  const file = path.join(out, page.path.replace(/^\/|\/$/g,'')+'.html');
  fs.mkdirSync(path.dirname(file), { recursive:true });
  fs.writeFileSync(file, render(page));
}
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.filter(page=>!page.noindex).map(page=>`  <url><loc>${origin+page.path}</loc><lastmod>${page.lastmod}</lastmod></url>`),
  '</urlset>',
].join('\n')+'\n';
fs.writeFileSync(path.join(out,'sitemap.xml'),sitemap);
fs.copyFileSync(path.join(root,'robots.txt'),path.join(out,'robots.txt'));

if (process.argv.includes('--review')) {
  const review = path.join(root, 'review');
  fs.mkdirSync(review, { recursive:true });
  for (const article of draftArticles()) fs.writeFileSync(path.join(review, article.slug+'.html'), render(article));
  const entries = [...routes, ...draftArticles()].map(({path,title,description,h1,noindex}, index) => ({
    path, title, description, h1, status:index>=routes.length?'Draft, outside deployment':noindex?'Noindex':'Indexable',
  }));
  fs.writeFileSync(path.join(review, 'metadata.json'), JSON.stringify(entries,null,2)+'\n');
}
console.log(`Built ${routes.length} static pages including 404 and ${routes.filter(page=>!page.noindex).length} indexable URLs.`);
