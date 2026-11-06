// Extract the clinic's existing published media without changing its bytes.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const mediaSource = fs.readFileSync(path.join(__dirname, 'source/manidental2.html'), 'utf8');
const pageSource = fs.readFileSync(path.join(__dirname, 'manidental2.html'), 'utf8');
const out = path.join(__dirname, 'dist');
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
const digest = data => crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
const extensions = { jpeg: 'jpg', png: 'png', webp: 'webp', gif: 'gif', 'svg+xml': 'svg' };
for (const match of mediaSource.matchAll(/data:image\/(jpeg|png|webp|gif|svg\+xml);base64,([A-Za-z0-9+/=]+)/g)) {
  const data = Buffer.from(match[2], 'base64');
  fs.writeFileSync(path.join(out, 'assets', `image-${digest(data)}.${extensions[match[1]]}`), data);
}
const video = mediaSource.match(/<script type="application\/octet-stream" id="heroVideoData">([\s\S]*?)<\/script>/);
if (!video) throw new Error('Missing embedded hero video');
const data = Buffer.from(video[1], 'base64');
fs.writeFileSync(path.join(out, 'assets', `hero-${digest(data)}.mp4`), data);
fs.writeFileSync(path.join(out, 'manidental2.html'), pageSource);
for (const name of ['robots.txt', 'sitemap.xml']) fs.copyFileSync(path.join(__dirname, name), path.join(out, name));
const page = fs.readFileSync(path.join(out, 'manidental2.html'), 'utf8');
for (const match of page.matchAll(/assets\/(?:image|hero)-[\w.-]+/g)) {
  if (!fs.existsSync(path.join(out, match[0]))) throw new Error(`Missing asset: ${match[0]}`);
}
console.log('Built static site with verified media, robots.txt and sitemap.xml');
