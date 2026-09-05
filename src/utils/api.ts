import { SiteContent } from '../types';

/**
 * Upload an image file to the local server backend.
 * The backend saves it into /public/uploads/ which triggers Git Auto-Sync.
 * Returns the public image path (e.g. '/uploads/1741234567_myphoto.jpg')
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

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
      } catch (err) {
        console.warn('Backend upload unavailable, using base64 fallback:', err);
      }

      // Fallback to direct base64 data URL if backend API is unreachable
      resolve(base64);
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Persist site content changes to disk and public repository files.
 * This ensures changes are recorded in Git and available across all devices.
 */
export async function persistContentToServer(content: SiteContent): Promise<boolean> {
  try {
    const response = await fetch('/api/save-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return response.ok;
  } catch (err) {
    console.warn('Failed to persist content to server:', err);
    return false;
  }
}

/**
 * Load latest content from published repository JSON file or server API.
 */
export async function fetchRemoteContent(): Promise<SiteContent | null> {
  try {
    // Try /siteContent.json first (available on any static hosting / Vercel / GitHub Pages)
    const res = await fetch(`/siteContent.json?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && data.brand) {
        return data as SiteContent;
      }
    }
  } catch (e) {
    // Fallback or ignore
  }

  try {
    const res = await fetch(`/api/content?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        return data.content as SiteContent;
      }
    }
  } catch (e) {}

  return null;
}
