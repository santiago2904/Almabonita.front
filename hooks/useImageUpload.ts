import { create } from 'zustand';
import { ImageUpload, UploadResponse } from '@/types';

interface ImageUploadStore {
  upload: ImageUpload;
  uploadFile: (file: File) => Promise<UploadResponse>;
  clearUpload: () => void;
  setPreview: (file: File) => void;
}

const defaultUpload: ImageUpload = {
  file: null,
  preview: null,
  url: null,
  isUploading: false,
  error: null,
};

export const useImageUpload = create<ImageUploadStore>((set, get) => ({
  upload: defaultUpload,
  
  uploadFile: async (file: File): Promise<UploadResponse> => {
    set((state) => ({
      upload: {
        ...state.upload,
        isUploading: true,
        error: null,
        file
      }
    }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // El servidor devuelve imagePath, no url
      const imageUrl = result.imagePath || result.url;
      
      set((state) => ({
        upload: {
          ...state.upload,
          isUploading: false,
          url: imageUrl,
          error: null
        }
      }));

      return { success: true, url: imageUrl };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      set((state) => ({
        upload: {
          ...state.upload,
          isUploading: false,
          error: errorMessage
        }
      }));

      return { success: false, error: errorMessage };
    }
  },

  clearUpload: () => set({ upload: defaultUpload }),
  
  setPreview: (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      set((state) => ({
        upload: {
          ...state.upload,
          file,
          preview: e.target?.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  }
}));