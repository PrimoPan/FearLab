import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, readdir, realpath, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, test } from 'node:test';
import { build, loadConfigFromFile } from 'vite';
import { buildImageManifest, writeImageManifest } from './build-image-manifest.mjs';
import { imageBaseUrl } from './image-assets.mjs';

const fixture = await realpath(await mkdtemp(join(tmpdir(), 'fearlab-static-images-')));
const configFile = resolve(dirname(fileURLToPath(import.meta.url)), '../../vite.config.ts');
after(() => rm(fixture, { recursive: true, force: true }));

await mkdir(join(fixture, 'assets'));
await mkdir(join(fixture, 'public'));
for (const [index, name] of ['js image.png', 'url-image.JPG', 'css-image.webp', 'html-image.avif', 'archive.jpg', 'font.woff2'].entries()) {
  await writeFile(join(fixture, 'assets', name), Buffer.alloc(5000, index));
}
await writeFile(join(fixture, 'assets/tiny.png'), Buffer.from('tiny'));
await writeFile(join(fixture, 'public/public-photo.png'), Buffer.from('public'));
await writeFile(join(fixture, 'index.html'), '<html><body><img src="./assets/html-image.avif"><img src="/public-photo.png"><script type="module" src="/main.js"></script></body></html>');
await writeFile(join(fixture, 'main.js'), `
  import photo from './assets/js image.png';
  import tiny from './assets/tiny.png';
  import './style.css';
  document.body.dataset.photos = JSON.stringify([photo, tiny, new URL('./assets/url-image.JPG', import.meta.url).href]);
`);
await writeFile(join(fixture, 'style.css'), `
  @font-face { font-family: fixture; src: url('./assets/font.woff2'); }
  body { background-image: url('./assets/css-image.webp'); font-family: fixture; }
`);

async function fixtureBuild(imageBase, outDir) {
  const previous = process.env.FEARLAB_IMAGE_BASE_URL;
  if (imageBase === undefined) delete process.env.FEARLAB_IMAGE_BASE_URL;
  else process.env.FEARLAB_IMAGE_BASE_URL = imageBase;
  let loaded;
  try { loaded = await loadConfigFromFile({ command: 'build', mode: 'production' }, configFile); }
  finally {
    if (previous === undefined) delete process.env.FEARLAB_IMAGE_BASE_URL;
    else process.env.FEARLAB_IMAGE_BASE_URL = previous;
  }
  await build({
    ...loaded.config, configFile: false, root: fixture, plugins: [], logLevel: 'silent',
    build: { ...loaded.config.build, outDir, minify: false }
  });
  const assetDir = join(fixture, outDir, 'assets');
  const names = await readdir(assetDir);
  const output = { html: await readFile(join(fixture, outDir, 'index.html'), 'utf8') };
  for (const extension of ['js', 'css']) output[extension] = await readFile(join(assetDir, names.find(name => name.endsWith(`.${extension}`))), 'utf8');
  return output;
}

test('image base requires a clean HTTPS URL and returns the decoded Vite base', () => {
  assert.equal(imageBaseUrl(undefined), undefined);
  assert.equal(imageBaseUrl('  '), undefined);
  assert.equal(imageBaseUrl('https://cdn.example/fearlab/'), 'https://cdn.example/fearlab/');
  assert.equal(imageBaseUrl('https://cdn.example/our%20photos'), 'https://cdn.example/our photos/');
  for (const value of ['http://cdn.example', 'not a URL', 'https://user:secret@cdn.example', 'https://cdn.example/?key=secret', 'https://cdn.example/#image', 'https://cdn.example/%23bad', 'https://cdn.example/%zz']) {
    assert.throws(() => imageBaseUrl(value), /FEARLAB_IMAGE_BASE_URL/);
  }
});

test('without configuration, imported/HTML/CSS/new URL images retain local URLs and tiny images inline', async () => {
  const output = await fixtureBuild(undefined, 'default-dist');
  for (const content of Object.values(output)) assert.doesNotMatch(content, /https:\/\/cdn\.example/);
  assert.match(output.js, /\/assets\/js(?:%20| )image-[^"']+\.png/);
  assert.match(output.js, /\/assets\/url-image-[^"']+\.JPG/);
  assert.match(output.js, /data:image\/png;base64,/);
  assert.match(output.css, /\/assets\/css-image-[^)"']+\.webp/);
  assert.match(output.html, /src="\/assets\/html-image-[^"]+\.avif"/);
});

test('configured builds map only emitted images in JS, new URL, CSS and HTML', async () => {
  const output = await fixtureBuild('https://cdn.example/fearlab/', 'cdn-dist');
  assert.match(output.js, /https:\/\/cdn\.example\/fearlab\/assets\/js(?:%20| )image-[^"']+\.png/);
  assert.match(output.js, /https:\/\/cdn\.example\/fearlab\/assets\/url-image-[^"']+\.JPG/);
  assert.match(output.js, /https:\/\/cdn\.example\/fearlab\/assets\/tiny-[^"']+\.png/);
  assert.doesNotMatch(output.js, /data:image\/png;base64,/);
  assert.match(output.css, /https:\/\/cdn\.example\/fearlab\/assets\/css-image-[^)"']+\.webp/);
  assert.match(output.css, /\/assets\/font-[^)"']+\.woff2/);
  assert.match(output.html, /src="https:\/\/cdn\.example\/fearlab\/assets\/html-image-[^"]+\.avif"/);
  assert.match(output.html, /src="\/assets\/index-[^"]+\.js"/);
  assert.match(output.html, /href="\/assets\/index-[^"]+\.css"/);
  assert.match(output.html, /src="\/public-photo.png"/);
  for (const content of Object.values(output)) assert.doesNotMatch(content, /https:\/\/cdn\.example[^\s"'()]+\.(?:js|css|woff2)/);
});

test('direct COS image URLs match the public FEAR Lab object keys without requiring a custom domain', async () => {
  const origin = 'https://lingolift-1335262060.cos.ap-guangzhou.myqcloud.com';
  const output = await fixtureBuild(`${origin}/fearlab`, 'direct-cos-dist');
  const manifest = await buildImageManifest({ root: fixture, dist: 'direct-cos-dist', distOnly: true });
  const rendered = decodeURI(Object.values(output).join('\n'));
  for (const image of manifest.images.filter(image => image.objectKey.startsWith('fearlab/assets/'))) {
    assert.ok(rendered.includes(`${origin}/${image.objectKey}`));
  }
  assert.doesNotMatch(rendered, /images\.fearlab\.space|fearlab\/archives/);
  assert.match(output.html, /src="\/assets\/index-[^"]+\.js"/);
});

test('manifest includes unreferenced originals and all emitted images with distinct keys and verified hashes', async () => {
  const output = await fixtureBuild('https://cdn.example/fearlab/', 'manifest-dist');
  const manifest = await buildImageManifest({ root: fixture, dist: 'manifest-dist' });
  assert.equal(manifest.images.filter(image => image.kind === 'source').length, 6);
  assert.equal(manifest.images.filter(image => image.kind === 'build').length, 6);
  assert.ok(manifest.images.some(image => image.path === 'assets/archive.jpg' && image.objectKey === `fearlab/archives/${image.sha256}.blob`));
  assert.ok(manifest.images.every(image => image.objectKey.startsWith('fearlab/')));
  for (const image of manifest.images.filter(image => image.kind === 'build' && image.objectKey.startsWith('fearlab/assets/'))) {
    assert.ok(decodeURI(Object.values(output).join('\n')).includes(`https://cdn.example/${image.objectKey}`));
  }
  assert.equal(new Set(manifest.images.map(image => image.objectKey)).size, manifest.images.length);
  assert.ok(manifest.images.every(image => image.mime.startsWith('image/')));
  for (const image of manifest.images) {
    const bytes = await readFile(join(fixture, image.path));
    assert.equal(image.size, bytes.length);
    assert.equal(image.sha256, createHash('sha256').update(bytes).digest('hex'));
  }
  assert.equal(manifest.totals.count, manifest.images.length);
  assert.equal(manifest.totals.bytes, manifest.images.reduce((total, image) => total + image.size, 0));
});

test('dist-only manifests omit original paths and full manifests are saved privately outside the public build', async () => {
  await fixtureBuild('https://cdn.example/fearlab/', 'private-manifest-dist');
  const manifest = await buildImageManifest({ root: fixture, dist: 'private-manifest-dist', distOnly: true });
  assert.ok(manifest.images.every(image => image.kind === 'build'));
  const output = '.local-data/media/images.json';
  await writeImageManifest(manifest, output, fixture);
  assert.equal((await stat(join(fixture, output))).mode & 0o777, 0o600);
  await assert.rejects(writeImageManifest(manifest, 'private-manifest-dist/images.json', fixture), /public build/);
  await symlink(join(fixture, 'private-manifest-dist'), join(fixture, 'build-alias'));
  await assert.rejects(writeImageManifest(manifest, 'build-alias/images.json', fixture), /public build/);
});
