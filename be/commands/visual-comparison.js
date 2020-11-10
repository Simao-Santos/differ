const Pageres = require('pageres');
const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

module.exports = {
  compareVisual(firstPageContent, secondPageContent) {
    (async () => {
      console.log('Getting screenshots...');

      const today = new Date();
      const year = String(today.getFullYear());
      const mon = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const hour = String(today.getHours()).padStart(2, '0');
      const min = String(today.getMinutes()).padStart(2, '0');
      const sec = String(today.getSeconds()).padStart(2, '0');
      const millisec = String(today.getMilliseconds()).padStart(3, '0');

      const filename =				`${year}_${mon}_${day}_${
        hour}_${min}_${sec}_${millisec}`;

      // A rare bug can occur when launching Chrome. From what I understand it's related to the GNU C library, don't know what we can do about it.
      // It is very rare though. As of now, it has only happened once.
      // https://github.com/puppeteer/puppeteer/issues/2207
      await new Pageres({ delay: 2 })
        .src(`data:text/html,${firstPageContent}`, ['1920x1080'], { filename: `${filename}-before` })
        .src(`data:text/html,${secondPageContent}`, ['1920x1080'], { filename: `${filename}-after` })
        .dest('./shots')
        .run();

      console.log('Finished generating screenshots!');
      console.log('Comparing screenshots...');

      const img1 = PNG.sync.read(fs.readFileSync(`./shots/${filename}-before.png`));
      const img2 = PNG.sync.read(fs.readFileSync(`./shots/${filename}-after.png`));
      const { width, height } = img1;
      const diff = new PNG({ width, height });

      const diff_pixels = 				pixelmatch(img1.data, img2.data, diff.data, width, height,
				  { threshold: 0.1, diffColorAlt: [0, 200, 0], alpha: 0.5 });

      fs.writeFileSync(`./shots/${filename}-diff.png`, PNG.sync.write(diff));

      console.log('Finished generating screenshots!');
      console.log(`${diff_pixels} different pixels (${diff_pixels / (width * height) * 100}%)`);

      // return { filename: filename, diff_pixels: diff_pixels };
    })();
  },
};
