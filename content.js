const fs = require('node:fs');
const path = require('node:path');

function readContent(name, prefix, suffix = '') {
  const text = fs.readFileSync(path.join(__dirname, 'content', name + '.txt'), 'utf8');
  return text.trim().split(/^# /m).filter(Boolean).map(entry => {
    const [name, slugLine, descriptionLine, ...lines] = entry.trim().split('\n');
    const slug = slugLine.slice(2);
    if (!/^[a-z-]+$/.test(slug) || !descriptionLine.startsWith('! ')) {
      throw new Error('Invalid content entry: ' + name);
    }
    const page = { name, slug, description: descriptionLine.slice(2), path: prefix + slug + suffix + '/', sources: [], related: [], sections: [], questions: [] };
    for (const line of lines) {
      if (line.startsWith('> ')) page.sources.push(line.slice(2).split(' | '));
      else if (line.startsWith('+ ')) page.related = line.slice(2).split(',');
      else if (line.startsWith('## ')) page.sections.push({ heading: line.slice(3), paragraphs: [] });
      else if (line.startsWith('? ')) page.questions.push(line.slice(2).split(' | '));
      else if (line) page.sections.at(-1).paragraphs.push(line);
    }
    return page;
  });
}

const services = readContent('services', '/services/', '-karaikudi');
const articles = readContent('articles', '/blog/');

module.exports = { services, articles };
