export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const fail = (status, message) => { throw new ApiError(status, message); };
export function plainObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function string(value, field, max = 300, optional = false) {
  if (value === undefined && optional) return '';
  if (typeof value !== 'string' || value.length > max) fail(400, `Invalid ${field}.`);
  return value.trim();
}
export function safeLink(value) {
  if (value === '') return '';
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) fail(400, 'Links must use http or https.');
    return url.href;
  } catch { fail(400, 'Links must be valid http or https URLs.'); }
}
export function imageUrl(value) {
  if (value === '') return '';
  if (!/^\/api\/media\/[a-f0-9-]{36}$/.test(value)) fail(400, 'Images must be uploaded through the project editor.');
  return value;
}
const nodes = new Set(['doc', 'paragraph', 'text', 'heading', 'bulletList', 'orderedList', 'listItem', 'blockquote', 'codeBlock', 'hardBreak', 'horizontalRule']);
const marks = new Set(['bold', 'italic', 'underline', 'strike', 'code', 'link']);
export function richText(value) {
  let count = 0;
  function visit(node, depth = 0) {
    if (!plainObject(node) || !nodes.has(node.type) || depth > 16 || ++count > 10000) fail(400, 'Invalid rich text content.');
    const result = { type: node.type };
    if (node.type === 'text') {
      if (typeof node.text !== 'string' || node.text.length > 50000) fail(400, 'Invalid text.');
      result.text = node.text;
    } else if (node.text !== undefined) fail(400, 'Invalid rich text structure.');
    if (node.attrs !== undefined) {
      if (!plainObject(node.attrs)) fail(400, 'Invalid text attributes.');
      if (node.type === 'heading') {
        if (!Number.isInteger(node.attrs.level) || node.attrs.level < 1 || node.attrs.level > 6) fail(400, 'Invalid heading level.');
        result.attrs = { level: node.attrs.level };
      } else if (node.type === 'orderedList' && node.attrs.start !== undefined) {
        if (!Number.isInteger(node.attrs.start) || node.attrs.start < 1 || node.attrs.start > 10000) fail(400, 'Invalid list start.');
        result.attrs = { start: node.attrs.start };
      } else if (node.type === 'codeBlock' && node.attrs.language) {
        result.attrs = { language: string(node.attrs.language, 'code language', 40) };
      }
    }
    if (node.marks !== undefined) {
      if (!Array.isArray(node.marks) || node.marks.length > 6 || node.type !== 'text') fail(400, 'Invalid text marks.');
      result.marks = node.marks.map(mark => {
        if (!plainObject(mark) || !marks.has(mark.type)) fail(400, 'Unsupported text formatting.');
        if (mark.type === 'link') return { type: 'link', attrs: { href: safeLink(string(mark.attrs?.href, 'link', 2000)), target: '_blank', rel: 'noopener noreferrer' } };
        return { type: mark.type };
      });
    }
    if (node.content !== undefined) {
      if (!Array.isArray(node.content) || ['text', 'hardBreak', 'horizontalRule'].includes(node.type)) fail(400, 'Invalid rich text children.');
      result.content = node.content.map(child => visit(child, depth + 1));
    }
    return result;
  }
  if (!value || value.type !== 'doc') fail(400, 'Rich text must have a document root.');
  return visit(value);
}
export function projectData(value) {
  if (!plainObject(value)) fail(400, 'A project object is required.');
  const data = {};
  for (const field of ['title', 'subtitle', 'authors', 'leader', 'supervisor', 'heroAlt']) data[field] = string(value[field], field, field === 'subtitle' ? 1000 : 400, true);
  data.hero = imageUrl(string(value.hero, 'hero', 2000, true));
  if (!Array.isArray(value.sections) || value.sections.length > 40) fail(400, 'Use at most 40 project sections.');
  const ids = new Set();
  data.sections = value.sections.map(section => {
    if (!plainObject(section)) fail(400, 'Invalid section.');
    const id = string(section.id, 'section id', 80);
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || ids.has(id)) fail(400, 'Section IDs must be unique.');
    ids.add(id);
    if (!['text', 'image-left', 'image-right', 'gallery'].includes(section.layout)) fail(400, 'Invalid section layout.');
    if (!Array.isArray(section.images) || section.images.length > 8) fail(400, 'Use at most eight images per section.');
    const imageIds = new Set();
    return { id, layout: section.layout, heading: string(section.heading, 'section heading', 300, true),
      body: richText(section.body ?? { type: 'doc', content: [] }),
      images: section.images.map(image => {
        if (!plainObject(image)) fail(400, 'Invalid image.');
        const imageId = string(image.id, 'image id', 80, true);
        if (imageId && (!/^[a-zA-Z0-9_-]+$/.test(imageId) || imageIds.has(imageId))) fail(400, 'Image IDs must be unique.');
        if (imageId) imageIds.add(imageId);
        return { ...(imageId ? { id: imageId } : {}), url: imageUrl(string(image.url, 'image URL', 2000)), alt: string(image.alt, 'image description', 500, true), caption: string(image.caption, 'image caption', 1000, true) };
      }), linkLabel: string(section.linkLabel, 'link label', 200, true), linkUrl: safeLink(string(section.linkUrl, 'link URL', 2000, true)) };
  });
  return data;
}
export const mediaIds = data => [...new Set([data.hero, ...data.sections.flatMap(s => s.images.map(i => i.url))].filter(Boolean).map(url => url.slice('/api/media/'.length)))];
export const hasText = node => Boolean(node.text?.trim()) || Boolean(node.content?.some(hasText));
export function readyToSubmit(data) {
  if (!data.title || !data.subtitle || !data.authors || !data.hero || !data.sections.some(s => s.heading && (hasText(s.body) || s.images.some(i => i.url)))) {
    fail(400, 'Add a title, subtitle, authors, hero image and at least one headed section with text or images before submitting.');
  }
}
export function version(value) { if (!Number.isInteger(value) || value < 1) fail(400, 'A valid project version is required.'); return value; }
