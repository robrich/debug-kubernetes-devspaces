const puppeteer = require('puppeteer');
const os = require('os');
const path = require('path');
const uuidv4 = require('uuid/v4');

const tmpdir = os.tmpdir();

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}.json`);

async function shoot({url, header}) {
  const fullUrl = config.backendUrl+url;
  console.log(`env: ${env}, fullUrl: ${fullUrl}, header: ${header}`);
  const browser = await puppeteer.launch({
    args: [`--no-sandbox`, `--disable-setuid-sandbox`]
  });
  const page = await browser.newPage();
  if (header) {
    await page.setExtraHTTPHeaders({
      'azds-route-as': header
    })
  }
  await page.goto(fullUrl, {waitUntil: 'networkidle0'});

  // FRAGILE: we're poluting the tmp folder and not cleaning it up
  const fileAndPath = path.join(tmpdir, uuidv4()+'.pdf');

  await page.setCacheEnabled(false);
  await page.pdf({
    printBackground: true,
    path: fileAndPath,
    margin: {
      top: '1in',
      right: '0in',
      bottom: '0.5in',
      left: '0in'
    }
  });

  await browser.close();

  return fileAndPath;
}

module.exports = shoot;
