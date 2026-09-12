import { SiteContent } from '../types';

const GITHUB_REPO_OWNER = 'ahadarcgis-tech';
const GITHUB_REPO_NAME = 'tahzib-photography';
const GITHUB_BRANCH = 'main';
const GITHUB_TOKEN_KEY = 'tahzib_github_token';

/**
 * Retrieve saved GitHub Personal Access Token from storage
 */
export function getStoredGithubToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(GITHUB_TOKEN_KEY) || '';
  }
  return '';
}

/**
 * Save GitHub Personal Access Token to storage
 */
export function setStoredGithubToken(token: string): void {
  if (typeof window !== 'undefined') {
    if (token.trim()) {
      localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
    } else {
      localStorage.removeItem(GITHUB_TOKEN_KEY);
    }
  }
}

/**
 * UTF-8 safe base64 encoding
 */
function utf8ToBase64(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  ));
}

/**
 * Direct commit file to GitHub Repository using REST API
 */
export async function commitToGitHub(
  path: string,
  base64ContentOnly: string,
  commitMessage: string,
  token?: string
): Promise<boolean> {
  const authToken = token || getStoredGithubToken();
  if (!authToken) {
    console.warn('No GitHub PAT token provided for cloud sync.');
    return false;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${cleanPath}`;

  try {
    // 1. Check if file already exists to get its SHA (required for updating files)
    let existingSha: string | undefined = undefined;
    try {
      const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, {
        headers: {
          'Authorization': `token ${authToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      if (getRes.ok) {
        const getJson = await getRes.json();
        existingSha = getJson.sha;
      }
    } catch {
      // File may not exist yet, which is fine for new uploads
    }

    // 2. Commit the file (create or update)
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${authToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64ContentOnly,
        sha: existingSha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (putRes.ok) {
      console.log(`✅ GitHub Commit successful: ${cleanPath}`);
      return true;
    } else {
      const errData = await putRes.json();
      console.error('GitHub API Commit failed:', errData);
      return false;
    }
  } catch (err) {
    console.error('GitHub API request error:', err);
    return false;
  }
}

/**
 * Upload an image file.
 * Tries local server backend (/api/upload) first.
 * If local server is unavailable (live site), commits directly to GitHub via API if PAT is configured.
 * Fallback to base64 data URL.
 */
export async function uploadImageToServer(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      if (!base64) {
        resolve('');
        return;
      }

      // 1. Try local dev server first
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64: base64,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            resolve(data.url);
            return;
          }
        }
      } catch {
        // Backend upload unavailable
      }

      // 2. Try direct GitHub commit if PAT token exists
      const ghToken = getStoredGithubToken();
      if (ghToken) {
        const ext = file.name.split('.').pop() || 'jpg';
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
        const relativeUploadPath = `public/uploads/${timestamp}_${safeName}`;
        const rawBase64 = base64.split(',')[1] || base64;

        const committed = await commitToGitHub(
          relativeUploadPath,
          rawBase64,
          `Upload image ${file.name} via Admin Dashboard`,
          ghToken
        );

        if (committed) {
          const publicUrl = `/uploads/${timestamp}_${safeName}`;
          resolve(publicUrl);
          return;
        }
      }

      // 3. Fallback to direct base64 data URL
      resolve(base64);
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Persist site content changes.
 * Tries local server endpoint (/api/save-content) first.
 * If local server unavailable, commits public/siteContent.json directly to GitHub via API.
 */
export async function persistContentToServer(content: SiteContent): Promise<boolean> {
  // 1. Try local dev server first
  try {
    const response = await fetch('/api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (response.ok) return true;
  } catch {
    // Local server unavailable
  }

  // 2. Try direct GitHub API commit
  const ghToken = getStoredGithubToken();
  if (ghToken) {
    const jsonStr = JSON.stringify(content, null, 2);
    const base64Json = utf8ToBase64(jsonStr);
    const committed = await commitToGitHub(
      'public/siteContent.json',
      base64Json,
      'Update siteContent.json via Admin Dashboard',
      ghToken
    );
    if (committed) return true;
  }

  return false;
}

/**
 * Load latest content from server API or published repository JSON file.
 */
export async function fetchRemoteContent(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`/api/content?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        return data.content as SiteContent;
      }
    }
  } catch { }

  try {
    const res = await fetch(`/siteContent.json?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && data.brand) {
        return data as SiteContent;
      }
    }
  } catch { }

  return null;
}

