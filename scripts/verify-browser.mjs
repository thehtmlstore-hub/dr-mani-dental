import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const origin = process.env.SITE_ORIGIN || 'http://127.0.0.1:8080';
const browser = await chromium.launch();
try {
  for (const width of [390,1440]) {
    const context = await browser.newContext({ viewport:{width,height:844} });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if(message.type()==='error') errors.push(message.text()); });
    await page.addInitScript(() => {
      const start=performance.now();
      const observer=new MutationObserver(() => {
        const el=document.getElementById('pre');
        if (!el || window.preloaderVisibleAt !== undefined) return;
        const style=getComputedStyle(el);
        if(style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity)>0) window.preloaderVisibleAt=performance.now()-start;
      });
      observer.observe(document,{subtree:true,childList:true});
    });
    const frameRequest=page.waitForResponse(response=>response.url().includes('hero-frames-initial'),{timeout:8000});
    await page.goto(origin,{waitUntil:'commit'});
    await page.waitForFunction(()=>window.preloaderVisibleAt!==undefined,null,{timeout:1000});
    assert.ok(await page.evaluate(()=>window.preloaderVisibleAt)<=300);
    await page.locator('#pre').waitFor({state:'hidden',timeout:3000});
    assert.ok((await frameRequest).ok());
    assert.ok(await page.locator('#services h2').isVisible());
    assert.deepEqual(errors,[]);
    await page.screenshot({path:'browser-'+width+'.png',fullPage:true});
    await context.close();
  }
  const disabled=await browser.newContext({javaScriptEnabled:false});
  const page=await disabled.newPage();
  await page.goto(origin);
  assert.equal(await page.locator('#pre').isVisible(),false);
  for(const id of ['services','clinic','faq','contact']) assert.ok(await page.locator('#'+id).isVisible());
  const fallback=await browser.newPage();
  await fallback.route('**/assets/hero-frames-*.js',route=>route.abort());
  const video=fallback.waitForResponse(response=>response.url().includes('/assets/hero.mp4'),{timeout:8000});
  await fallback.goto(origin,{waitUntil:'commit'});
  assert.ok((await video).ok());
  await fallback.locator('#pre').waitFor({state:'hidden',timeout:3000});
} finally {
  await browser.close();
}
