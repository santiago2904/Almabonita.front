import { create } from 'zustand';
import { Text3DConfig } from '@/types';

interface Text3DStore {
  config: Text3DConfig;
  updateConfig: (updates: Partial<Text3DConfig>) => void;
  resetConfig: () => void;
  toggleEnabled: () => void;
  updatePosition: (axis: 'x' | 'y' | 'z', value: number) => void;
  updateRotation: (axis: 'x' | 'y' | 'z', value: number) => void;
}

const defaultText3DConfig: Text3DConfig = {
  enabled: false,
  text: 'AR Demo',
  color: '#ff0000',
  depth: 0.1,
  position: { x: 0, y: 1, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: 1
};

export const use3DText = create<Text3DStore>((set, get) => ({
  config: defaultText3DConfig,
  
  updateConfig: (updates) =>
    set((state) => ({
      config: { ...state.config, ...updates }
    })),
  
  resetConfig: () =>
    set({ config: defaultText3DConfig }),
  
  toggleEnabled: () =>
    set((state) => ({
      config: { ...state.config, enabled: !state.config.enabled }
    })),
  
  updatePosition: (axis, value) =>
    set((state) => ({
      config: {
        ...state.config,
        position: { ...state.config.position, [axis]: value }
      }
    })),
  
  updateRotation: (axis, value) =>
    set((state) => ({
      config: {
        ...state.config,
        rotation: { ...state.config.rotation, [axis]: value }
      }
    }))
}));