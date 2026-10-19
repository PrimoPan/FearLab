import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, realpath, rename, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { imageMime, STATIC_IMAGE_PREFIX } from './image-assets.mjs';

const portablePath = path => path.split(sep).join('/');

async function imagesIn(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Image manifest does not follow symlinks: ${path}`);
    if (entry.isDirectory()) paths.push(...await imagesIn(path));
    else if (entry.isFile() && imageMime(entry.name)) paths.push(path);
  }
  return paths.sort();
}

export async function buildImageManifest({ root = process.cwd(), dist = 'dist', distOnly = false } = {}) {
  const buildPath = portablePath(relative(resolve(root), resolve(root, dist)));
  if (!buildPath || buildPath.startsWith('../') || isAbsolute(buildPath)) throw new Error('Build directory must be inside the project root.');
  const images = [];
  const directories = [...(distOnly ? [] : [['source', 'assets']]), ['build', dist]];
  for (const [kind, directory] of directories) {
    const base = resolve(root, directory);
    for (const file of await imagesIn(base)) {
      const bytes = await readFile(file);
      const path = portablePath(relative(root, file));
      const sha256 = createHash('sha256').update(bytes).digest('hex');
      images.push({
        kind, path,
        objectKey: STATIC_IMAGE_PREFIX + (kind === 'source' ? `archives/${sha256}.blob` : portablePath(relative(base, file))),
        size: bytes.length,
        sha256,
        mime: imageMime(file)
      });
    }
  }
  return {
    version: 1,
    roots: { source: 'assets', build: buildPath },
    images,
    totals: { count: images.length, bytes: images.reduce((sum, image) => sum + image.size, 0) }
  };
}

function within(parent, child) {
  const path = relative(parent, child);
  return !path || !path.startsWith(`..${sep}`) && path !== '..' && !isAbsolute(path);
}

export async function writeImageManifest(manifest, output, root = process.cwd()) {
  const target = resolve(root, output), build = resolve(root, manifest.roots.build);
  if (within(build, target)) throw new Error('The image manifest must not be written inside the public build directory.');
  await mkdir(dirname(target), { recursive: true, mode: 0o700 });
  if (within(await realpath(build), join(await realpath(dirname(target)), target.split(sep).at(-1)))) throw new Error('The image manifest must not be written inside the public build directory.');
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
  await rename(temporary, target);
}

// Run after vite build. Manifests include original filenames and stay private.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: {
    dist: { type: 'string', default: 'dist' },
    output: { type: 'string', default: '.local-data/media/image-manifest.json' },
    'dist-only': { type: 'boolean', default: false }
  } });
  const { dist, output } = values;
  const manifest = await buildImageManifest({ dist, distOnly: values['dist-only'] });
  await writeImageManifest(manifest, output);
  console.log(`Image manifest: ${output} (${manifest.totals.count} images, ${manifest.totals.bytes} bytes)`);
}
