const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  
  const computed = await page.evaluate(() => {
    const input = document.querySelector('input[type="email"]');
    if (!input) return null;
    const style = window.getComputedStyle(input);
    const span = input.previousElementSibling;
    const spanStyle = window.getComputedStyle(span);
    const svg = span.querySelector('svg');
    const svgRect = svg ? svg.getBoundingClientRect() : null;
    const inputRect = input.getBoundingClientRect();
    return {
      paddingLeft: style.paddingLeft,
      className: input.className,
      iconLeft: spanStyle.left,
      iconRect: svgRect,
      inputRect: inputRect
    };
  });
  
  console.log(JSON.stringify(computed, null, 2));
  await browser.close();
})();
