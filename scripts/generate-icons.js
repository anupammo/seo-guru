const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPNG(width, height, bgR, bgG, bgB) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function uint32be(n) {
    const b = Buffer.alloc(4);
    b.writeUInt32BE(n, 0);
    return b;
  }
  
  function crc32(buf) {
    const table = (() => {
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[i] = c;
      }
      return t;
    })();
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  
  function makeChunk(type, data) {
    const typeBytes = Buffer.from(type, 'ascii');
    const len = uint32be(data.length);
    const crcBuf = Buffer.concat([typeBytes, data]);
    const crcVal = uint32be(crc32(crcBuf));
    return Buffer.concat([len, typeBytes, data, crcVal]);
  }
  
  const ihdrData = Buffer.concat([uint32be(width), uint32be(height), Buffer.from([8, 2, 0, 0, 0])]);
  const ihdr = makeChunk('IHDR', ihdrData);
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      rawData.push(bgR, bgG, bgB);
    }
  }
  
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([sig, ihdr, idat, iend]);
}

const publicDir = path.join(__dirname, '..', 'public');
fs.mkdirSync(publicDir, { recursive: true });

const sizes = [192, 512];
for (const size of sizes) {
  const png = createPNG(size, size, 13, 110, 253);
  fs.writeFileSync(path.join(publicDir, `icon-${size}.png`), png);
  console.log(`Created icon-${size}.png (${png.length} bytes)`);
}
