import { DEFAULT_SITE_CONTENT } from '../src/data/defaultContent.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const jsonStr = JSON.stringify(DEFAULT_SITE_CONTENT, null, 2);
fs.writeFileSync(path.join(root, 'src/data/siteContent.json'), jsonStr);
fs.writeFileSync(path.join(root, 'public/siteContent.json'), jsonStr);
console.log('Generated initial siteContent.json in src/data and public!');
