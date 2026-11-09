import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { defaultCoursePasswordHash } from '../server/course-password.mjs';

const content = JSON.parse(await readFile(new URL('../server/course-content.json', import.meta.url), 'utf8'));
// Existing public lab profiles remain public; protect the course roster and its private entries.
const publicEmails = new Set();
const membersDirectory = new URL('../src/data/people/members/', import.meta.url);
for (const file of await readdir(membersDirectory)) {
  if (!file.endsWith('.ts')) continue;
  const profile = await readFile(new URL(file, membersDirectory), 'utf8');
  for (const email of profile.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? []) publicEmails.add(email);
}
const markers = [
  defaultCoursePasswordHash,
  content.course.description[0],
  new URL(content.courseDesignBoard.url).pathname.split('/')[2],
  ...content.courseProjects.flatMap(project => [project.title, ...project.students.map(student => student.email).filter(email => !publicEmails.has(email))]),
];
const textExtensions = new Set(['.js', '.mjs', '.cjs', '.html', '.json', '.map', '.txt', '.md', '.ts', '.tsx', '.yaml', '.yml']);

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) { await inspect(path); continue; }
    if (!textExtensions.has(extname(path))) continue;
    const text = (await readFile(path, 'utf8'))
      .replace(/\\u([a-f0-9]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\x([a-f0-9]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    if (markers.some(marker => text.includes(marker))) throw new Error(`Protected course content found in public output: ${path}`);
  }
}

await inspect(process.argv[2] ?? 'dist');
console.log('Public build contains no protected course data or password verifier.');
