import type { NextConfig } from "next";
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Auto-copy volume cover and extract PPTX certificate media
try {
  console.log("=== TAMADDUN PRE-STARTUP INITIALIZATION ===");
  const srcCover = 'd:/grij/gjir-frontend/logo/jild/ChatGPT Image Jun 7, 2026, 01_28_16 AM.png';
  const destDir = 'd:/grij/gjir-frontend/public';
  const destCover = path.join(destDir, 'jild_cover.png');
  
  if (fs.existsSync(srcCover)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcCover, destCover);
    console.log("Copied cover image successfully to public/jild_cover.png");
  }

  // Extract PPTX media
  const pptxPath = 'd:/grij/gjir-frontend/logo/Sertifikat/Nomsiz taqdimot.pptx';
  if (fs.existsSync(pptxPath)) {
    const buffer = fs.readFileSync(pptxPath);
    let offset = 0;
    const entries: string[] = [];
    while (offset < buffer.length - 30) {
      if (buffer[offset] === 0x50 && buffer[offset+1] === 0x4B && buffer[offset+2] === 0x03 && buffer[offset+3] === 0x04) {
        const compMethod = buffer.readUInt16LE(offset + 8);
        const compSize = buffer.readUInt32LE(offset + 18);
        const nameLen = buffer.readUInt16LE(offset + 26);
        const extraLen = buffer.readUInt16LE(offset + 28);
        
        const fileName = buffer.toString('utf8', offset + 30, offset + 30 + nameLen);
        const dataOffset = offset + 30 + nameLen + extraLen;
        
        entries.push(`${fileName} (Size: ${compSize})`);
        
        if (fileName.includes('ppt/media/') || fileName.includes('docProps/')) {
          const fileData = buffer.subarray(dataOffset, dataOffset + compSize);
          let decompressed = null;
          try {
            if (compMethod === 8) {
              decompressed = zlib.inflateRawSync(fileData);
            } else if (compMethod === 0) {
              decompressed = fileData;
            }
          } catch (e) {}
          
          if (decompressed) {
            const outDir = 'd:/grij/gjir-frontend/public/sertifikat';
            if (!fs.existsSync(outDir)) {
              fs.mkdirSync(outDir, { recursive: true });
            }
            if (fileName.toLowerCase().includes('thumbnail')) {
              fs.writeFileSync('d:/grij/gjir-frontend/public/sertifikat_bg.jpg', decompressed);
            } else {
              const baseName = path.basename(fileName);
              fs.writeFileSync(path.join(outDir, baseName), decompressed);
            }
          }
        }
        offset = dataOffset + compSize;
      } else {
        offset++;
      }
    }
    fs.writeFileSync('d:/grij/gjir-frontend/logo/Sertifikat/info.txt', entries.join('\n'));
    console.log(`Extracted PPTX media files to public/sertifikat/ and logged ${entries.length} zip entries to info.txt`);
  }
} catch (err) {
  console.error("Startup assets processing failed:", err);
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
