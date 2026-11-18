const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const { initPreloader } = require('../homepage-resilience');

function page() {
  let now = 0;
  const pending = [];
  const events = {};
  let dismissed = false;
  const register = (name, handler) => { events[name] = handler; };
  const document = {
    getElementById: () => ({ classList: { add: token => { dismissed = token === 'done'; } } }),
    readyState: 'loading', addEventListener: register,
  };
  vm.runInNewContext('('+initPreloader.toString()+')()', {
    document, window: { addEventListener: register }, performance: { now: () => now },
    setTimeout(callback, delay) { pending.push([now + delay,callback]); },
  });
  return {
    ready() { events.load(); events['clinic:hero-frame-ready'](); },
    advance(ms) {
      now += ms;
      for (const [time, callback] of pending) if(time <= now) callback();
      return dismissed;
    },
  };
}

test('the branded overlay holds at least 600 ms when assets are ready', () => {
  const demo = page();
  demo.ready();
  assert.equal(demo.advance(300), false);
  assert.equal(demo.advance(300), true);
});
test('the overlay dismisses by 2.5 seconds without hero readiness', () => {
  const demo = page();
  assert.equal(demo.advance(300),false);
  assert.equal(demo.advance(2200),true);
});
test('the build preserves the CSS fallback and starts with a visible preloader', () => {
  const html = fs.readFileSync('dist/index.html','utf8');
  assert.match(html, /id="pre">/);
  assert.doesNotMatch(html, /id="pre" class="done"/);
  assert.match(html, /preFailsafe \.5s ease 2s forwards/);
  assert.match(html, /prefers-reduced-motion:reduce\)\{#pre\{display:none\}\}/);
  assert.ok(html.indexOf('function initReveals()') < html.indexOf('const faqItems='));
  assert.ok(html.indexOf('function initPreloader()') > html.indexOf('id="pre">'));
  assert.doesNotMatch(html, /\.rv\{opacity:0/);
});
