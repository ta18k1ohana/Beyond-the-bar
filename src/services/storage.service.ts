/**
 * Storage Service
 * Handles Firebase Storage operations for file uploads (profile photos, etc.)
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type UploadResult
} from 'firebase/storage';
import { storage } from '../config/firebase';
import { updateUserProfile } from './user.service';

/**
 * Upload profile photo to Firebase Storage
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @returns The download URL of the uploaded photo
 */
export const uploadProfilePhoto = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPG, PNG, or WebP image.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Create a reference to the storage location
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile-photos/${fileName}`);

    // Upload the file
    const uploadResult: UploadResult = await uploadBytes(storageRef, file, {
      contentType: file.type
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);

    // Update user profile with new photo URL
    await updateUserProfile(userId, {
      profilePhoto: downloadURL
    });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

/**
 * Delete profile photo from Firebase Storage
 * @param photoURL - The URL of the photo to delete
 */
export const deleteProfilePhoto = async (photoURL: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const pathMatch = photoURL.match(/profile-photos%2F([^?]+)/);
    if (!pathMatch) {
      throw new Error('Invalid photo URL');
    }

    const fileName = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, `profile-photos/${fileName}`);

    // Delete the file
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    throw error;
  }
};

/**
 * Update profile photo (delete old one if exists, upload new one)
 * @param userId - The user's ID
 * @param file - The new image file
 * @param currentPhotoURL - The current photo URL (if any)
 * @returns The download URL of the new photo
 */
export const updateProfilePhoto = async (
  userId: string,
  file: File,
  currentPhotoURL?: string
): Promise<string> => {
  try {
    // Delete old photo if it exists and is from our storage
    if (currentPhotoURL && currentPhotoURL.includes('profile-photos')) {
      try {
        await deleteProfilePhoto(currentPhotoURL);
      } catch (error) {
        // Continue even if deletion fails
        console.warn('Could not delete old profile photo:', error);
      }
    }

    // Upload new photo
    const downloadURL = await uploadProfilePhoto(userId, file);

    return downloadURL;
  } catch (error) {
    console.error('Error updating profile photo:', error);
    throw error;
  }
};

/**
 * Compress and resize image before upload (client-side)
 * @param file - The original image file
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - JPEG quality (0-1)
 * @returns Compressed image file
 */
export const compressImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'));
              return;
            }

            // Create new file from blob
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Could not load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };

    reader.readAsDataURL(file);
  });
};
