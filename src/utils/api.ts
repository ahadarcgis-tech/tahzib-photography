import { SiteContent } from '../types';

export interface RemoteContentResponse {
  content: SiteContent;
  timestamp: number;
}

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

      // Fallback to base64 data URL; backend save-content will extract and save it as a file
      resolve(base64);
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Persist site content changes to disk and public repository files.
 * Returns the updated content (with any extracted images) and timestamp.
 */
export async function persistContentToServer(content: SiteContent): Promise<{ success: boolean; content?: SiteContent; timestamp?: number }> {
  try {
    const response = await fetch('/api/save-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, content: data.content, timestamp: data.timestamp };
    }
    return { success: false };
  } catch (err) {
    console.warn('Failed to persist content to server:', err);
    return { success: false };
  }
}

/**
 * Load latest content from server API or published repository JSON file.
 * Returns both the content object and the server modification timestamp.
 */
export async function fetchRemoteContent(): Promise<RemoteContentResponse | null> {
  try {
    // Try /api/content first to get fresh data directly from disk
    const res = await fetch(`/api/content?t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        return {
          content: data.content as SiteContent,
          timestamp: data.timestamp || Date.now(),
        };
      }
    }
  } catch (e) {}

  try {
    // Try /siteContent.json as a fallback (available on static hosting / Vercel)
    const res = await fetch(`/siteContent.json?t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && data.brand) {
        return {
          content: data as SiteContent,
          timestamp: Date.now(),
        };
      }
    }
  } catch (e) {
    // Fallback or ignore
  }

  return null;
}
