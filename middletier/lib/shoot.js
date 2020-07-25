const puppeteer = require('puppeteer');
const os = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const tmpdir = os.tmpdir();
const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}.json`);
let backendUrl = config.backendUrl;

async function shoot(url) {
  const fullUrl = backendUrl+url;
  console.log(`env: ${env}, fullUrl: ${fullUrl}, BACKEND_SERVICE_HOST: ${process.env.BACKEND_SERVICE_HOST}, BACKEND_SERVICE_PORT: ${process.env.BACKEND_SERVICE_PORT}`);
  const browser = await puppeteer.launch({
    args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
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
