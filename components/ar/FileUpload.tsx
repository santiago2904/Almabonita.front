'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, AlertCircle, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
}

export function FileUpload({ onFileSelect, preview, isUploading, error }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onFileSelect(imageFile);
    }
  }, [onFileSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          dragOver 
            ? "border-primary bg-primary/10 scale-105" 
            : "border-gray-300 hover:border-gray-400",
          isUploading && "opacity-50 cursor-not-allowed",
          preview && !isUploading && "border-green-300 bg-green-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            {preview && !isUploading ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : isUploading ? (
              <Upload className="h-12 w-12 text-blue-500 animate-pulse" />
            ) : (
              <Image className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-700 font-medium">
              {preview && !isUploading ? (
                "✅ Imagen cargada correctamente"
              ) : isUploading ? (
                "⏳ Subiendo imagen..."
              ) : dragOver ? (
                "🎯 Suelta la imagen aquí"
              ) : (
                "Arrastra una imagen aquí"
              )}
            </div>
            
            {!preview && !isUploading && (
              <div className="text-xs text-gray-500">
                o{' '}
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    selecciona un archivo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Badge variant="secondary" className="text-xs">
              JPG, PNG, GIF (máx. 5MB)
            </Badge>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <div className="text-sm text-blue-600 text-center">
            Subiendo imagen...
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}


    </div>
  );
}