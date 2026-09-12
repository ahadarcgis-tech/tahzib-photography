import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// Max payload = 50MB for high-resolution images
const MAX_BODY_SIZE = 50 * 1024 * 1024;

let gitPushTimer: NodeJS.Timeout | null = null;
function triggerGitAutoPush() {
  if (gitPushTimer) clearTimeout(gitPushTimer);
  gitPushTimer = setTimeout(() => {
    const cwd = process.cwd();
    exec('git add . && git commit -m "Auto-update content: ' + new Date().toLocaleString() + '" && git push origin main', { cwd }, (err, stdout, stderr) => {
      if (err) {
        console.log('ℹ️ [Git Auto-Sync Notice]:', err.message.split('\n')[0]);
      } else {
        console.log('🚀 [Git Auto-Sync] Successfully committed & pushed updates to GitHub origin/main!');
      }
    });
  }, 2000);
}

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

/**
 * Recursively search any object or array for base64 image strings.
 * If found, save them directly to public/uploads/ and replace with permanent /uploads/... URL.
 */
function extractAndSaveBase64Images(data: any, uploadsDir: string): any {
  if (!data) return data;
  if (typeof data === 'string') {
    const matches = data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      let ext = matches[1].toLowerCase();
      if (ext.includes('jpeg')) ext = 'jpg';
      else if (ext.includes('svg')) ext = 'svg';
      else if (ext.includes('webp')) ext = 'webp';
      else if (ext.includes('png')) ext = 'png';
      else if (ext.includes('gif')) ext = 'gif';
      else ext = 'jpg';

      const base64Data = matches[2];
      const savedFilename = `extracted_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, savedFilename);
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      console.log(`📸 [Studio API] Base64 image extracted and saved: ${filePath}`);
      return `/uploads/${savedFilename}`;
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => extractAndSaveBase64Images(item, uploadsDir));
  }
  if (typeof data === 'object') {
    const result: any = {};
    for (const key of Object.keys(data)) {
      result[key] = extractAndSaveBase64Images(data[key], uploadsDir);
    }
    return result;
  }
  return data;
}

export function studioBackendPlugin(): Plugin {
  return {
    name: 'studio-backend-api',
    configureServer(server: ViteDevServer) {
      // Register BEFORE Vite's internal middleware so our API routes are hit first
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // CORS headers for cross-device access (e.g. phone connecting to Mac IP)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

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
            console.log(`📸 [Studio API] Image uploaded & saved: ${filePath} → ${publicUrl}`);

            // Trigger auto-sync to GitHub
            triggerGitAutoPush();

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
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
        // 2. POST /api/save-content — Write siteContent.json to disk & GitHub
        // ──────────────────────────────────────────────
        if (url.startsWith('/api/save-content') && req.method === 'POST') {
          try {
            const bodyStr = await readBody(req);
            const data = JSON.parse(bodyStr);
            let rawContent = data.content || data;

            const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
            // Extract any base64 images into physical files
            const processedContent = extractAndSaveBase64Images(rawContent, uploadsDir);

            const srcJsonPath = path.resolve(process.cwd(), 'src', 'data', 'siteContent.json');
            const publicJsonPath = path.resolve(process.cwd(), 'public', 'siteContent.json');
            const distJsonPath = path.resolve(process.cwd(), 'dist', 'siteContent.json');

            const jsonStr = JSON.stringify(processedContent, null, 2);
            fs.writeFileSync(srcJsonPath, jsonStr, 'utf-8');
            fs.writeFileSync(publicJsonPath, jsonStr, 'utf-8');
            if (fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
              try {
                fs.writeFileSync(distJsonPath, jsonStr, 'utf-8');
              } catch {}
            }

            const timestamp = fs.statSync(srcJsonPath).mtimeMs;
            console.log(`💾 [Studio API] Content saved (${(jsonStr.length / 1024).toFixed(1)} KB) - timestamp: ${timestamp}`);

            // Trigger Git Auto-Sync
            triggerGitAutoPush();

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            res.end(JSON.stringify({ success: true, content: processedContent, timestamp }));
          } catch (err: any) {
            console.error('[Studio API] Save content error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Save failed' }));
          }
          return;
        }

        // ──────────────────────────────────────────────
        // 3. GET /api/content — Load siteContent.json fresh from disk
        // ──────────────────────────────────────────────
        if (url.startsWith('/api/content') && req.method === 'GET') {
          try {
            const srcJsonPath = path.resolve(process.cwd(), 'src', 'data', 'siteContent.json');
            const publicJsonPath = path.resolve(process.cwd(), 'public', 'siteContent.json');

            let contentData = null;
            let mtime = Date.now();

            if (fs.existsSync(srcJsonPath)) {
              contentData = JSON.parse(fs.readFileSync(srcJsonPath, 'utf-8'));
              mtime = fs.statSync(srcJsonPath).mtimeMs;
            } else if (fs.existsSync(publicJsonPath)) {
              contentData = JSON.parse(fs.readFileSync(publicJsonPath, 'utf-8'));
              mtime = fs.statSync(publicJsonPath).mtimeMs;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.end(JSON.stringify({ success: true, content: contentData, timestamp: mtime }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // ──────────────────────────────────────────────
        // 4. GET /uploads/* — Serve uploaded images directly (bypasses Vite static cache)
        // ──────────────────────────────────────────────
        if (url.startsWith('/uploads/') && req.method === 'GET') {
          try {
            const cleanUrl = url.split('?')[0];
            const filePath = path.join(process.cwd(), 'public', cleanUrl);
            if (fs.existsSync(filePath)) {
              const ext = path.extname(filePath).toLowerCase();
              let mime = 'image/jpeg';
              if (ext === '.png') mime = 'image/png';
              else if (ext === '.webp') mime = 'image/webp';
              else if (ext === '.svg') mime = 'image/svg+xml';
              else if (ext === '.gif') mime = 'image/gif';

              res.statusCode = 200;
              res.setHeader('Content-Type', mime);
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
              res.end(fs.readFileSync(filePath));
              return;
            }
          } catch (e) {
            // Fall through to next middleware if error
          }
        }

        next();
      });
    },
  };
}
