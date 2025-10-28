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
    console.log('🎬 Starting upload process for file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });
    
    set((state) => ({
      upload: {
        ...state.upload,
        isUploading: true,
        error: null,
        file
      }
    }));

    try {
      console.log('📦 Creating FormData...');
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('🌐 Making API request to /api/upload...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 API response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload failed - Response not ok:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
      }

      console.log('🔍 Parsing response JSON...');
      const result = await response.json();
      console.log('✅ Upload response parsed:', result);
      
      // El servidor devuelve imagePath, no url
      const imageUrl = result.imagePath || result.url || result.imageUrl;
      console.log('🖼️ Final image URL:', imageUrl);
      
      set((state) => ({
        upload: {
          ...state.upload,
          isUploading: false,
          url: imageUrl,
          error: null
        }
      }));

      console.log('🎉 Upload completed successfully!');
      return { success: true, url: imageUrl };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      console.error('💥 Upload error caught:', {
        message: errorMessage,
        error: error,
        stack: error instanceof Error ? error.stack : undefined
      });
      
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