import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';

export function studioBackendPlugin(): Plugin {
  return {
    name: 'studio-backend-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // 1. API: Image Upload endpoint
        if (url.startsWith('/api/upload') && req.method === 'POST') {
          try {
            const chunks: Buffer[] = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(chunks).toString('utf-8');
                const body = JSON.parse(bodyStr);
                const { filename, base64 } = body;

                if (!base64) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'No image data provided' }));
                  return;
                }

                // Extract extension and raw data
                const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                let ext = 'jpg';
                let rawBase64 = base64;

                if (matches && matches.length === 3) {
                  const mime = matches[1];
                  rawBase64 = matches[2];
                  if (mime.includes('png')) ext = 'png';
                  else if (mime.includes('webp')) ext = 'webp';
                  else if (mime.includes('svg')) ext = 'svg';
                  else if (mime.includes('gif')) ext = 'gif';
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
                console.log(`📸 [Studio API] Image saved: ${publicUrl}`);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, url: publicUrl, filename: savedFilename }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Failed to process upload' }));
              }
            });
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 2. API: Save content JSON to disk & public
        if (url.startsWith('/api/save-content') && req.method === 'POST') {
          try {
            const chunks: Buffer[] = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(chunks).toString('utf-8');
                const data = JSON.parse(bodyStr);
                const content = data.content || data;

                const srcJsonPath = path.resolve(process.cwd(), 'src', 'data', 'siteContent.json');
                const publicJsonPath = path.resolve(process.cwd(), 'public', 'siteContent.json');

                const jsonStr = JSON.stringify(content, null, 2);
                fs.writeFileSync(srcJsonPath, jsonStr, 'utf-8');
                fs.writeFileSync(publicJsonPath, jsonStr, 'utf-8');

                console.log(`💾 [Studio API] Content saved to src/data/siteContent.json & public/siteContent.json`);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Failed to save content' }));
              }
            });
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 3. API: Load content JSON
        if (url.startsWith('/api/content') && req.method === 'GET') {
          try {
            const publicJsonPath = path.resolve(process.cwd(), 'public', 'siteContent.json');
            const srcJsonPath = path.resolve(process.cwd(), 'src', 'data', 'siteContent.json');

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
