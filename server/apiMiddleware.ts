import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';

// Max payload = 50MB for large image uploads
const MAX_BODY_SIZE = 50 * 1024 * 1024;

function readBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalSize = 0;
    req.on('data', (chunk: Buffer) => {
      totalSize += chunk.length;
      if (totalSize > MAX_BODY_SIZE) {
        reject(new Error('Payload too large'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

export function studioBackendPlugin(): Plugin {
  return {
    name: 'studio-backend-api',
    configureServer(server: ViteDevServer) {
      // Register BEFORE Vite's internal middleware so our API routes are hit first
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // ──────────────────────────────────────────────
        // 1. POST /api/upload — Save uploaded image file to public/uploads/
        // ──────────────────────────────────────────────
        if (url.startsWith('/api/upload') && req.method === 'POST') {
          try {
            const bodyStr = await readBody(req);
            const body = JSON.parse(bodyStr);
            const { filename, base64 } = body;

            if (!base64) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'No image data provided' }));
              return;
            }

            // Parse data:image/...;base64,xxxx format
            const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let ext = 'jpg';
            let rawBase64 = base64;

            if (matches && matches.length === 3) {
              const mime = matches[1];
              rawBase64 = matches[2];
              if (mime.includes('png')) ext = 'png';
              else if (mime.includes('webp')) ext = 'webp';
              else if (mime.includes('svg')) ext = 'svg';
              else if (mime.includes('gif')) ext = 'gif';
              else ext = 'jpg';
            }

            const cleanName = (filename || 'photo')
              .replace(/[^a-zA-Z0-9_-]/g, '_')
              .toLowerCase()
              .replace(/\.[a-zA-Z0-9]+$/, '');

            const savedFilename = `${Date.now()}_${cleanName}.${ext}`;
            const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');

            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const filePath = path.join(uploadsDir, savedFilename);
            fs.writeFileSync(filePath, Buffer.from(rawBase64, 'base64'));

            const publicUrl = `/uploads/${savedFilename}`;
            console.log(`📸 [Studio API] Image saved: ${filePath} → ${publicUrl}`);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, url: publicUrl, filename: savedFilename }));
          } catch (err: any) {
            console.error('[Studio API] Upload error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Upload failed' }));
          }
          return;
        }

        // ──────────────────────────────────────────────
        // 2. POST /api/save-content — Write siteContent.json to disk
        // ──────────────────────────────────────────────
        if (url.startsWith('/api/save-content') && req.method === 'POST') {
          try {
            const bodyStr = await readBody(req);
            const data = JSON.parse(bodyStr);
            const content = data.content || data;

            const srcJsonPath = path.resolve(process.cwd(), 'src', 'data', 'siteContent.json');
            const publicJsonPath = path.resolve(process.cwd(), 'public', 'siteContent.json');

            const jsonStr = JSON.stringify(content, null, 2);
            fs.writeFileSync(srcJsonPath, jsonStr, 'utf-8');
            fs.writeFileSync(publicJsonPath, jsonStr, 'utf-8');

            console.log(`💾 [Studio API] Content saved (${(jsonStr.length / 1024).toFixed(1)} KB)`);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err: any) {
            console.error('[Studio API] Save content error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Save failed' }));
          }
          return;
        }

        // ──────────────────────────────────────────────
        // 3. GET /api/content — Load siteContent.json from disk
        // ──────────────────────────────────────────────
        if (url.startsWith('/api/content') && req.method === 'GET') {
          try {
            const srcJsonPath = path.resolve(process.cwd(), 'src', 'data', 'siteContent.json');
            const publicJsonPath = path.resolve(process.cwd(), 'public', 'siteContent.json');

            let contentData = null;
            if (fs.existsSync(srcJsonPath)) {
              contentData = JSON.parse(fs.readFileSync(srcJsonPath, 'utf-8'));
            } else if (fs.existsSync(publicJsonPath)) {
              contentData = JSON.parse(fs.readFileSync(publicJsonPath, 'utf-8'));
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, content: contentData }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        next();
      });
    },
  };
}
