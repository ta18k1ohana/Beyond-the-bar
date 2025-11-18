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
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Compress and upload
      setUploading(true);

      // Compress image before uploading
      const compressedFile = await compressImage(file, 800, 800, 0.8);

      // Upload to Firebase Storage
      const downloadURL = await uploadProfilePhoto(userId, compressedFile);

      // Update preview and notify parent
      onPhotoUpdate(downloadURL);
      setPreviewURL(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo');
      setPreviewURL(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayPhoto = previewURL || currentPhotoURL;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Photo Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
          {displayPhoto ? (
            <img
              src={displayPhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color-coffee-accent)] bg-opacity-20">
              <span className="text-5xl text-[var(--color-coffee-primary)]">👤</span>
            </div>
          )}
        </div>

        {/* Upload indicator */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="text-white text-sm font-semibold">Uploading...</div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex flex-col items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={handleClick}
          disabled={uploading}
          className="bg-[var(--color-coffee-accent)] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentPhotoURL ? 'Change Photo' : 'Upload Photo'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          JPG, PNG or WebP • Max 5MB • Recommended: 800x800px
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
