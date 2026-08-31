const https = require('https');
const fs = require('fs');
const path = require('path');

const projectDir = '/Users/luigiviggiano/Desktop/Sito web personale';
const fontsDir = path.join(projectDir, 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir);
}

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';

const get = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': userAgent } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

const downloadFile = (url, dest) => new Promise((resolve, reject) => {
  const file = fs.createWriteStream(dest);
  https.get(url, (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close(resolve);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => reject(err));
  });
});

async function main() {
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Syne:wght@700;800&display=swap';
  console.log('Fetching CSS from Google Fonts...');
  let css = await get(cssUrl);

  const urlRegex = /url\((https:\/\/[^)]+)\)/g;
  let match;
  let fontCount = 0;
  
  while ((match = urlRegex.exec(css)) !== null) {
    const fontUrl = match[1];
    const filename = `font_${fontCount++}.woff2`;
    const localPath = path.join(fontsDir, filename);
    
    console.log(`Downloading ${fontUrl} to ${filename}...`);
    await downloadFile(fontUrl, localPath);
    
    css = css.replace(fontUrl, `../fonts/${filename}`);
  }
  
  fs.writeFileSync(path.join(projectDir, 'css', 'fonts.css'), css);
  console.log('Fonts downloaded and css/fonts.css created successfully.');
}

main().catch(console.error);
