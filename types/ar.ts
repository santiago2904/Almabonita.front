export interface ARConfig {
  imageUrl: string;
  text: string;
  subtitle?: string;
  fontSize: string;
  fontColor?: string;
  color: string;
  backgroundColor?: string;
  borderRadius: string;
  imageScale?: string;
  size: string;
  textPosition?: 'above' | 'below'; // Nueva propiedad para posición del texto
  text3D?: boolean;
  text3d?: boolean;
  text3DColor?: string;
  text3dColor?: string;
  text3DDepth?: string;
  text3dDepth?: string;
  text3DPosition?: {
    x: number;
    y: number;
    z: number;
  };
  text3dX?: string;
  text3dY?: string;
  text3dZ?: string;
  animation?: string;
  particles?: string;
}

export interface ImageUpload {
  file: File | null;
  preview: string | null;
  url: string | null;
  isUploading: boolean;
  error: string | null;
}

export interface ZoomConfig {
  scale: number;
  minScale: number;
  maxScale: number;
  step: number;
}

export interface Text3DConfig {
  enabled: boolean;
  text: string;
  color: string;
  depth: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: number;
}

export interface MarkerConfig {
  type: 'hiro' | 'custom';
  size: number;
  smooth: boolean;
  smoothCount: number;
  smoothTolerance: number;
  smoothThreshold: number;
}

export interface ARViewerProps {
  config: ARConfig;
  markerConfig?: MarkerConfig;
  onZoomChange?: (scale: number) => void;
  onError?: (error: string) => void;
}

export interface ARCreatorProps {
  onConfigChange: (config: ARConfig) => void;
  onGenerate: (config: ARConfig) => void;
  initialConfig?: Partial<ARConfig>;
}

export type UploadResponse = {
  success: boolean;
  url?: string;
  error?: string;
};