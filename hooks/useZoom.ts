import { create } from 'zustand';
import { ZoomConfig } from '@/types';

interface ZoomStore {
  config: ZoomConfig;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (scale: number) => void;
  resetZoom: () => void;
  updateConfig: (updates: Partial<ZoomConfig>) => void;
}

const defaultZoomConfig: ZoomConfig = {
  scale: 1,
  minScale: 0.1,
  maxScale: 5,
  step: 0.1
};

export const useZoom = create<ZoomStore>((set, get) => ({
  config: defaultZoomConfig,
  
  zoomIn: () => {
    const { config } = get();
    const newScale = Math.min(config.scale + config.step, config.maxScale);
    set((state) => ({
      config: { ...state.config, scale: newScale }
    }));
  },
  
  zoomOut: () => {
    const { config } = get();
    const newScale = Math.max(config.scale - config.step, config.minScale);
    set((state) => ({
      config: { ...state.config, scale: newScale }
    }));
  },
  
  setZoom: (scale: number) => {
    const { config } = get();
    const clampedScale = Math.max(config.minScale, Math.min(scale, config.maxScale));
    set((state) => ({
      config: { ...state.config, scale: clampedScale }
    }));
  },
  
  resetZoom: () => 
    set((state) => ({
      config: { ...state.config, scale: 1 }
    })),
  
  updateConfig: (updates) =>
    set((state) => ({
      config: { ...state.config, ...updates }
    }))
}));