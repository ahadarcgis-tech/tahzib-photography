import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Check, X, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadImageToServer } from '../../utils/api';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatioLabel?: string;
  description?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  aspectRatioLabel = 'Aspect Ratio: 3:4 / 16:9',
  description,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    setUploadStatus('idle');
    try {
      const publicUrl = await uploadImageToServer(file);
      if (publicUrl) {
        onChange(publicUrl);
        setUrlInput(publicUrl);
        setUploadStatus('success');
        // Auto-dismiss success after 3 seconds
        setTimeout(() => setUploadStatus('idle'), 3000);
      } else {
        setUploadStatus('error');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset file input so re-selecting same file triggers change event
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const applyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-[#A8A29E]">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#78716C]">{aspectRatioLabel}</span>
          <div className="flex items-center border border-[#3E3834] rounded overflow-hidden text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2 py-0.5 transition-colors cursor-pointer ${
                mode === 'upload' ? 'bg-[#DFB15B] text-[#1A1715] font-semibold' : 'text-[#A8A29E] hover:text-[#F6F3EC]'
              }`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2 py-0.5 transition-colors cursor-pointer ${
                mode === 'url' ? 'bg-[#DFB15B] text-[#1A1715] font-semibold' : 'text-[#A8A29E] hover:text-[#F6F3EC]'
              }`}
            >
              URL
            </button>
          </div>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-[#78716C] font-mono">{description}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Preview Thumbnail */}
        <div className="sm:col-span-4 relative aspect-[4/3] bg-[#12100E] border border-[#2E2925] rounded overflow-hidden flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="text-center p-3 text-[#78716C]">
              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
              <span className="text-[10px] font-mono uppercase tracking-wider block">No Image</span>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#DFB15B] animate-spin" />
            </div>
          )}
        </div>

        {/* Upload / URL Controls */}
        <div className="sm:col-span-8 space-y-2">
          {mode === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border border-dashed p-4 rounded text-center transition-colors ${
                isUploading
                  ? 'border-[#DFB15B] bg-[#DFB15B]/5 cursor-wait'
                  : isDragOver
                  ? 'border-[#DFB15B] bg-[#DFB15B]/10 cursor-pointer'
                  : 'border-[#3E3834] bg-[#1A1715] hover:border-[#DFB15B]/60 cursor-pointer'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mx-auto text-[#DFB15B] mb-1.5 animate-spin" />
                  <span className="block text-xs font-mono text-[#DFB15B]">
                    Uploading & saving to server...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mx-auto text-[#DFB15B] mb-1.5" />
                  <span className="block text-xs font-mono text-[#F6F3EC]">
                    Click to browse or drop photo here
                  </span>
                  <span className="block text-[10px] font-mono text-[#78716C] mt-0.5">
                    PNG, JPG, WEBP — Saved permanently to your project & GitHub
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or /images/..."
                className="flex-1 bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={applyUrl}
                className="bg-[#2E2925] hover:bg-[#3E3834] text-[#DFB15B] px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Set
              </button>
            </div>
          )}

          {/* Status messages */}
          {uploadStatus === 'success' && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Image saved permanently! Auto-syncing to GitHub...</span>
            </div>
          )}
          {uploadStatus === 'error' && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-red-400">
              <X className="w-3.5 h-3.5" />
              <span>Upload failed. Please try again.</span>
            </div>
          )}

          {value && (
            <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C]">
              <span className="truncate max-w-[200px]">
                {value.startsWith('data:') ? 'Uploaded (base64 — will convert on save)' : value}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setUrlInput('');
                }}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
