import { create } from 'zustand';
import { ARConfig } from '@/types';

interface ARConfigStore {
  config: ARConfig;
  updateConfig: (updates: Partial<ARConfig>) => void;
  resetConfig: () => void;
  generateUrl: () => string;
}

const defaultConfig: ARConfig = {
  imageUrl: '',
  text: 'AR Demo',
  subtitle: '',
  fontSize: '16',
  fontColor: '#ffffff',
  color: '#ffffff',
  backgroundColor: '#000000',
  borderRadius: '5',
  imageScale: '1',
  size: '1',
  text3D: false,
  text3d: false,
  text3DColor: '#ff0000',
  text3dColor: '#ff0000',
  text3DDepth: '0.1',
  text3dDepth: '0.1',
  text3DPosition: {
    x: 0,
    y: 1,
    z: 0
  },
  text3dX: '0',
  text3dY: '1',
  text3dZ: '0',
  animation: 'none',
  particles: 'false'
};

export const useARConfig = create<ARConfigStore>((set, get) => ({
  config: defaultConfig,
  
  updateConfig: (updates) => 
    set((state) => ({
      config: { ...state.config, ...updates }
    })),
  
  resetConfig: () => 
    set({ config: defaultConfig }),
  
  generateUrl: () => {
    const { config } = get();
    const params = new URLSearchParams();
    
    Object.entries(config).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        params.append(key, JSON.stringify(value));
      } else if (value !== '' && value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    });
    
    return `/ar-viewer?${params.toString()}`;
  }
}));