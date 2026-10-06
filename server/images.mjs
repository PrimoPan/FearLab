import { fail } from './validation.mjs';

export function decodeUpload(value) {
  if (typeof value !== 'string') fail(400, 'Image data must be base64.');
  const encoded = value.replace(/^data:image\/(?:png|jpeg|webp);base64,/, '');
  if (!encoded || encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) fail(400, 'Invalid base64 image.');
  if (encoded.length > Math.ceil(8 * 1024 * 1024 / 3) * 4) fail(413, 'Images must be 8 MB or smaller.');
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length > 8 * 1024 * 1024) fail(413, 'Images must be 8 MB or smaller.');
  if (bytes.length < 32) fail(400, 'Invalid image data.');
  let mime, width, height;
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
    if (bytes.toString('ascii', 12, 16) !== 'IHDR' || bytes.readUInt32BE(8) !== 13 || bytes.toString('ascii', bytes.length - 8, bytes.length - 4) !== 'IEND') fail(400, 'Invalid PNG image.');
    width = bytes.readUInt32BE(16); height = bytes.readUInt32BE(20); mime = 'image/png';
  } else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    if (bytes[bytes.length - 2] !== 255 || bytes[bytes.length - 1] !== 217) fail(400, 'Invalid JPEG image.');
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 255) break;
      const marker = bytes[offset + 1];
      if (marker === 255) { offset++; continue; }
      if (marker === 217 || marker === 218) break;
      if (marker === 1 || marker >= 208 && marker <= 215) { offset += 2; continue; }
      const size = bytes.readUInt16BE(offset + 2);
      if (size < 2 || offset + 2 + size > bytes.length) fail(400, 'Invalid JPEG image.');
      if ([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) {
        if (size < 8) fail(400, 'Invalid JPEG image.');
        height = bytes.readUInt16BE(offset + 5); width = bytes.readUInt16BE(offset + 7); break;
      }
      offset += 2 + size;
    }
    if (!width) fail(400, 'JPEG dimensions are missing.');
    mime = 'image/jpeg';
  } else if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') {
    if (bytes.readUInt32LE(4) + 8 !== bytes.length) fail(400, 'Invalid WebP image.');
    const format = bytes.toString('ascii', 12, 16);
    if (format === 'VP8X') {
      width = bytes.readUIntLE(24, 3) + 1; height = bytes.readUIntLE(27, 3) + 1;
    } else if (format === 'VP8 ' && bytes[23] === 157 && bytes[24] === 1 && bytes[25] === 42) {
      width = bytes.readUInt16LE(26) & 16383; height = bytes.readUInt16LE(28) & 16383;
    } else if (format === 'VP8L' && bytes[20] === 47) {
      const packed = bytes.readUInt32LE(21);
      width = (packed & 16383) + 1; height = ((packed >>> 14) & 16383) + 1;
    } else fail(400, 'Invalid WebP image.');
    mime = 'image/webp';
  } else fail(400, 'Upload a JPEG, PNG or WebP image.');
  if (!width || !height || width > 20000 || height > 20000 || width * height > 50000000) fail(400, 'Image dimensions are too large or invalid.');
  return { bytes, mime };
}
