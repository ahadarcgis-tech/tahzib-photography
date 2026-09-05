import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let timeoutId = null;
let isSyncing = false;

function autoSync() {
  if (isSyncing) return;
  isSyncing = true;
  
  try {
    const status = execSync('git status --porcelain', { cwd: rootDir }).toString().trim();
    if (status) {
      console.log('\n🔄 Detected changes. Syncing with GitHub...');
      execSync('git add .', { cwd: rootDir, stdio: 'inherit' });
      const dateStr = new Date().toLocaleString();
      execSync(`git commit -m "Auto-update: ${dateStr}"`, { cwd: rootDir, stdio: 'inherit' });
      execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });
      console.log('✅ Changes successfully pushed to GitHub!\n');
    }
  } catch (error) {
    console.error('⚠️ Sync error:', error.message);
  } finally {
    isSyncing = false;
  }
}

function triggerDebouncedSync() {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    autoSync();
  }, 3000); // 3-second debounce to batch multiple file saves
}

console.log('👀 GitHub Auto-Sync Watcher is active...');
console.log('📁 Watching for file modifications in:', rootDir);
console.log('🚀 Every change will automatically be committed and pushed to origin/main.');

fs.watch(rootDir, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  // Ignore git, node_modules, temp files, dist, etc.
  if (
    filename.startsWith('.git') ||
    filename.includes('node_modules') ||
    filename.includes('dist') ||
    filename.includes('.log') ||
    filename.endsWith('.tmp')
  ) {
    return;
  }
  
  triggerDebouncedSync();
});
