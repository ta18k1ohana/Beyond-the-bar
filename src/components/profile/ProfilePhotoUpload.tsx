import { useState, useRef } from 'react';
import { uploadProfilePhoto, compressImage } from '../../services/storage.service';

interface ProfilePhotoUploadProps {
  userId: string;
  currentPhotoURL?: string;
  onPhotoUpdate: (newPhotoURL: string) => void;
}

export const ProfilePhotoUpload = ({
  userId,
  currentPhotoURL,
  onPhotoUpdate
}: ProfilePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewURL(reader.result as string);
      reader.readAsDataURL(file);

      setUploading(true);
      const compressedFile = await compressImage(file, 800, 800, 0.8);
      const downloadURL = await uploadProfilePhoto(userId, compressedFile);
      onPhotoUpdate(downloadURL);
      setPreviewURL(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo');
      setPreviewURL(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClick = () => fileInputRef.current?.click();
  const displayPhoto = previewURL || currentPhotoURL;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="relative w-32 h-32 rounded-full overflow-hidden border hairline group disabled:cursor-wait"
        style={{ background: 'var(--color-paper-2)' }}
        aria-label={currentPhotoURL ? 'Change portrait' : 'Upload portrait'}
      >
        {displayPhoto ? (
          <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* Neutral monogram placeholder — line icon, no emoji */}
            <svg
              viewBox="0 0 48 48"
              width="42"
              height="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-ink-soft)]"
              aria-hidden
            >
              <circle cx="24" cy="18" r="7" />
              <path d="M10 40c2-7 8-11 14-11s12 4 14 11" />
            </svg>
          </div>
        )}

        {/* Hover veil with "Edit" */}
        <span className="absolute inset-0 bg-[rgba(21,20,15,0.45)] text-white text-xs tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {currentPhotoURL ? 'Change' : 'Upload'}
        </span>

        {uploading && (
          <span className="absolute inset-0 bg-[rgba(21,20,15,0.55)] text-white text-xs tracking-[0.18em] uppercase flex items-center justify-center">
            Uploading
          </span>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-[11px] text-[var(--color-ink-soft)] text-center tracking-wide">
        JPG · PNG · WebP &nbsp;·&nbsp; up to 5MB
      </p>

      {error && <div className="alert-error text-xs">{error}</div>}
    </div>
  );
};
