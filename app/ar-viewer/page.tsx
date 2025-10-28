'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import type { ARConfig } from '@/types/ar';

// --- (INICIO) Definición del componente dentro de dynamic() ---
// (Eliminamos la primera definición duplicada de ARViewerContent)

const ARViewerContent = dynamic(
  () =>
    Promise.resolve(() => {
      // --- (INICIO) Componente ARViewerContent ---
      const [config, setConfig] = useState<ARConfig | null>(null);
      const [isLoaded, setIsLoaded] = useState(false);
      const [markerFound, setMarkerFound] = useState(false);

      // Single useEffect for initialization
      useEffect(() => {
        const initializeAR = async () => {
          if (typeof window === 'undefined') return;

          console.log('🚀 Inicializando componente AR...');
          console.log('📐 Viewport actual:', window.innerWidth, 'x', window.innerHeight);

          // Configure viewport for better AR experience
          let viewport = document.querySelector('meta[name="viewport"]');
          if (!viewport) {
            viewport = document.createElement('meta');
            viewport.setAttribute('name', 'viewport');
            document.head.appendChild(viewport);
          }
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover'
          );



          // Parse configuration from URL
          const urlParams = new URLSearchParams(window.location.search);

          const arConfig: ARConfig = {
            imageUrl:
              urlParams.get('imageUrl') ||
              urlParams.get('img') ||
              '/placeholder-image.svg',
            text: urlParams.get('text') || '¡Hola AR!',
            subtitle: urlParams.get('subtitle') || '',
            color:
              urlParams.get('fontColor') || urlParams.get('color') || '#ffffff',
            animation: urlParams.get('animation') || 'none',
            particles: urlParams.get('particles') || 'false',
            size: urlParams.get('imageScale') || urlParams.get('size') || '1',
            fontSize: urlParams.get('fontSize') || '16',
            borderRadius: urlParams.get('borderRadius') || '5',
            textPosition: (urlParams.get('textPosition') as 'above' | 'below') || 'below', // 'above' o 'below'
            text3d:
              urlParams.get('text3D') === 'true' ||
              urlParams.get('text3d') === 'true',
            text3dColor:
              urlParams.get('text3DColor') ||
              urlParams.get('text3dColor') ||
              '#ff0000',
            text3dDepth:
              urlParams.get('text3DDepth') ||
              urlParams.get('text3dDepth') ||
              '0.1',
            text3dX: urlParams.get('text3DPosition')
              ? JSON.parse(urlParams.get('text3DPosition')!).x
              : urlParams.get('text3dX') || '0',
            text3dY: urlParams.get('text3DPosition')
              ? JSON.parse(urlParams.get('text3DPosition')!).y
              : urlParams.get('text3dY') || '1',
            text3dZ: urlParams.get('text3DPosition')
              ? JSON.parse(urlParams.get('text3DPosition')!).z
              : urlParams.get('text3dZ') || '0',
          };

          setConfig(arConfig);
          console.log('🎯 Configuración AR cargada:', arConfig);

          // Check if scripts are already loaded
          if (
            (window as any).AFRAME &&
            (window as any).AFRAME.registerComponent
          ) {
            console.log('✅ Scripts ya cargados, omitiendo carga...');
            setIsLoaded(true);
            setupMarkerListeners();
            return;
          }

          // Load scripts sequentially
          try {
            const loadScript = (src: string): Promise<void> => {
              return new Promise((resolve, reject) => {
                const existingScript = document.querySelector(
                  `script[src="${src}"]`,
                );
                if (existingScript) {
                  console.log(`✅ Script ya cargado: ${src}`);
                  resolve();
                  return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.async = false; // Load in order
                script.onload = () => {
                  console.log(`✅ Script cargado: ${src}`);
                  resolve();
                };
                script.onerror = () => {
                  console.error(`❌ Error cargando: ${src}`);
                  reject(new Error(`Failed to load ${src}`));
                };
                document.head.appendChild(script);
              });
            };

            await loadScript('https://aframe.io/releases/1.0.4/aframe.min.js');
            console.log('✅ A-Frame cargado');

            await loadScript(
              'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js',
            );
            console.log('✅ AR.js cargado');

            await loadScript('/gesture-detector.js');
            console.log('✅ Gesture detector cargado');

            await loadScript('/gesture-handler.js');
            console.log('✅ Gesture handler cargado');

            console.log('🔍 Verificando objetos disponibles:');
            console.log('- AFRAME:', !!(window as any).AFRAME);
            console.log(
              '- AFRAME.registerComponent:',
              !!(
                (window as any).AFRAME &&
                (window as any).AFRAME.registerComponent
              ),
            );
            console.log(
              '- AFRAME.components:',
              !!((window as any).AFRAME && (window as any).AFRAME.components),
            );
            console.log('- THREEx:', !!(window as any).THREEx);

            const waitForARJS = () => {
              return new Promise<void>((resolve) => {
                let attempts = 0;
                const maxAttempts = 15; // 3 seconds max

                const checkARJS = () => {
                  attempts++;

                  const aframeReady =
                    (window as any).AFRAME &&
                    (window as any).AFRAME.registerComponent;
                  const arjsReady =
                    (window as any).AFRAME &&
                    (window as any).AFRAME.components &&
                    (window as any).AFRAME.components.arjs;

                  if (aframeReady && (arjsReady || attempts >= maxAttempts)) {
                    console.log(
                      '✅ AR.js inicializado (intentos:',
                      attempts,
                      ')',
                    );
                    resolve();
                  } else {
                    console.log(
                      `⏳ Esperando AR.js... intento ${attempts}/${maxAttempts}`,
                    );
                    if (attempts < maxAttempts) {
                      setTimeout(checkARJS, 200);
                    } else {
                      console.log('⚠️ Timeout esperando AR.js, continuando...');
                      resolve();
                    }
                  }
                };
                checkARJS();
              });
            };

            await waitForARJS();

            // Enhanced global error handling for AR.js issues
            const handleARJSError = (event: ErrorEvent | PromiseRejectionEvent) => {
              let errorMessage = '';
              
              if (event instanceof ErrorEvent) {
                errorMessage = event.error?.message || event.message || '';
              } else {
                errorMessage = event.reason?.message || event.reason || '';
              }

              // Check for specific AR.js errors
              if (
                errorMessage.includes('idPatt') ||
                errorMessage.includes('Cannot read properties of null') ||
                errorMessage.includes('Cannot read properties of undefined') ||
                errorMessage.includes('patternRatio') ||
                errorMessage.includes('marker')
              ) {
                console.warn('🚨 AR.js Error capturado durante tracking:', errorMessage);
                event.preventDefault?.();
                
                // Implement gentle recovery strategy
                setTimeout(() => {
                  console.log('🔄 Ejecutando recuperación suave del tracking...');
                  
                  // Strategy 1: Reset marker visibility
                  const markers = document.querySelectorAll('a-marker');
                  markers.forEach((marker) => {
                    try {
                      // Gentle reset - just ensure visibility
                      const markerEl = marker as any;
                      if (markerEl.object3D) {
                        markerEl.object3D.visible = false;
                        setTimeout(() => {
                          markerEl.object3D.visible = true;
                        }, 100);
                      }
                    } catch (resetError) {
                      console.warn('⚠️ Error en reset suave del marcador:', resetError);
                    }
                  });
                  
                }, 500);

                return true; // Indicate error was handled
              }
              
              return false; // Let other errors bubble up
            };

            // Add both error and rejection handlers
            window.addEventListener('error', handleARJSError);
            window.addEventListener('unhandledrejection', handleARJSError);

            // Add cleanup for error handlers when component unmounts
            const cleanup = () => {
              window.removeEventListener('error', handleARJSError);
              window.removeEventListener('unhandledrejection', handleARJSError);
            };

            // Cleanup after 30 seconds or when component might unmount
            setTimeout(cleanup, 30000);

            setTimeout(async () => {
              console.log('🎬 Inicializando escena AR...');
              setIsLoaded(true);

              setTimeout(async () => {
                console.log('⏰ Ejecutando createARScene...');
                try {
                  await createARScene(arConfig);
                  console.log('🎯 Escena lista, configurando listeners...');
                  setupMarkerListeners();
                } catch (error) {
                  console.error('❌ Error en createARScene:', error);
                }
              }, 500);
            }, 500);
          } catch (error) {
            console.error('❌ Error cargando scripts:', error);
          }
        };

        const setupMarkerListeners = () => {
          const attemptSetup = (attempts = 0) => {
            if (attempts > 20) {
              console.warn(
                '⚠️ No se pudo configurar los listeners del marcador después de 20 intentos',
              );
              return;
            }

            const scene = document.querySelector('a-scene');
            const marker = scene
              ? scene.querySelector('#hiro-marker')
              : document.getElementById('hiro-marker');

            console.log(
              `🔍 Intento ${attempts + 1}: scene=${!!scene}, marker=${!!marker}`,
            );

            if (marker) {
              try {
                marker.addEventListener('markerFound', (event) => {
                  console.log('🎯 Marcador HIRO detectado!', event);
                  setMarkerFound(true);

                  const markerObject3D = (marker as any).object3D;
                  if (markerObject3D) {
                    console.log('📍 Posición del marcador:', markerObject3D.position);
                    console.log(
                      '🔄 Rotación del marcador:',
                      markerObject3D.rotation,
                    );
                  }
                });

                marker.addEventListener('markerLost', (event) => {
                  console.log('❌ Marcador HIRO perdido', event);
                  setMarkerFound(false);
                });

                marker.addEventListener('markerVisible', () => {
                  console.log('👁️ Marcador visible');
                });

                marker.addEventListener('markerHidden', () => {
                  console.log('🙈 Marcador oculto');
                });

                console.log('✅ Listeners del marcador configurados correctamente');
              } catch (error) {
                console.error('❌ Error configurando listeners:', error);
                setTimeout(() => attemptSetup(attempts + 1), 300);
              }
            } else {
              setTimeout(() => attemptSetup(attempts + 1), 300);
            }
          };

          attemptSetup();
        };

        // Helper function for safe attribute setting
        const safeSetTextAttribute = (element: any, attr: string, value: any) => {
          try {
            if (value !== null && value !== undefined) {
              element.setAttribute(attr, value);
            }
          } catch (error) {
            console.warn(`⚠️ Error setting ${attr}:`, error);
          }
        };

        const createARScene = (arConfig: ARConfig) => {
          return new Promise<void>((resolve) => {
            console.log('🚀 Iniciando createARScene basado en documentación oficial...');
            const container = document.getElementById('ar-scene-container');
            if (!container || !arConfig) {
              console.error('❌ No se encontró contenedor o config');
              resolve();
              return;
            }

            container.innerHTML = '';
            
            // Crear escena con configuración específica para móviles
            const scene = document.createElement('a-scene');
            scene.setAttribute('vr-mode-ui', 'enabled: false');
            scene.setAttribute('loading-screen', 'enabled: false');
            scene.setAttribute('arjs', 'trackingMethod: best; sourceType: webcam; debugUIEnabled: false');
            scene.setAttribute('embedded', '');
            scene.setAttribute('gesture-detector', '');
            
            // Forzar estilos para móviles
            scene.style.width = '100vw';
            scene.style.height = '100vh';
            scene.style.position = 'absolute';
            scene.style.top = '0';
            scene.style.left = '0';

            // Assets
            const assets = document.createElement('a-assets');
            const assetItem = document.createElement('a-asset-item');
            assetItem.setAttribute('id', 'animated-asset');
            assetItem.setAttribute('src', '#');
            assets.appendChild(assetItem);

            // Marker
            const marker = document.createElement('a-marker');
            marker.setAttribute('preset', 'hiro');
            marker.setAttribute('raycaster', 'objects: .clickable');
            marker.setAttribute('emitevents', 'true');
            marker.setAttribute('cursor', 'fuse: false; rayOrigin: mouse');
            marker.setAttribute('id', 'main-marker');

            // Content entity
            const entity = document.createElement('a-entity');
            entity.setAttribute('position', '0 0 0');
            entity.setAttribute('scale', `${arConfig.size} ${arConfig.size} ${arConfig.size}`);
            entity.setAttribute('class', 'clickable');
            entity.setAttribute('gesture-handler', '');

            // Image
            const image = document.createElement('a-image');
            image.setAttribute('src', arConfig.imageUrl);
            image.setAttribute('position', '0 0 0');
            image.setAttribute('rotation', '-90 0 0');
            image.setAttribute('width', `${parseFloat(arConfig.size || '1') * 2}`);
            image.setAttribute('height', `${parseFloat(arConfig.size || '1') * 1.5}`);
            image.setAttribute('crossorigin', 'anonymous');

            // Calculamos las posiciones basadas en textPosition
            const imageSize = parseFloat(arConfig.size || '1');
            const imageWidth = imageSize * 2;
            const imageHeight = imageSize * 1.5; // Alto de la imagen
            const textScale = parseFloat(arConfig.fontSize || '16') / 10;
            const subtitleScale = parseFloat(arConfig.fontSize || '16') / 15;
            const textPosition = arConfig.textPosition || 'below';
            let imageY = 0;
            let textY = 0;
            let subtitleY = 0;
            
            if (textPosition === 'above') {
              // Texto ARRIBA de la imagen
              console.log('📍 Posicionando texto ARRIBA de la imagen');
              
              // Imagen va más abajo
              imageY = -1.0;
              
              // Texto principal va bien arriba
              textY = 1.0;
              
              // Subtítulo va entre texto principal e imagen
              if (arConfig.subtitle) {
                subtitleY = 0.4;
                textY = 1.3; // Subir más el texto principal
              }
            } else {
              // Texto ABAJO de la imagen (por defecto)
              console.log('📍 Posicionando texto ABAJO de la imagen');
              
              // Imagen va más arriba
              imageY = 1.0;
              
              // Texto principal va bien abajo
              textY = -1.0;
              
              // Subtítulo va más abajo aún
              if (arConfig.subtitle) {
                subtitleY = -1.4;
              }
            }

            console.log(`🎯 Posiciones calculadas - Imagen Y: ${imageY}, Texto Y: ${textY}, Subtítulo Y: ${subtitleY}`);

            // Image con posición ajustada
            image.setAttribute('position', `0 ${imageY} 0`);

            // Text con posición calculada
            const text = document.createElement('a-text');
            text.setAttribute('value', arConfig.text || '¡Hola AR!');
            text.setAttribute('position', `0 ${textY} 0.5`);
            text.setAttribute('rotation', '-90 0 0');
            text.setAttribute('align', 'center');
            text.setAttribute('color', arConfig.color || '#ffffff');
            text.setAttribute('scale', `${textScale} ${textScale} 1`);
            text.setAttribute('font', 'roboto');
            text.setAttribute('wrap-count', '20');

            // Assembly
            entity.appendChild(image);
            entity.appendChild(text);

            // Subtitle if exists con posición calculada
            if (arConfig.subtitle) {
              const subtitle = document.createElement('a-text');
              subtitle.setAttribute('value', arConfig.subtitle);
              subtitle.setAttribute('position', `0 ${subtitleY} 0.5`);
              subtitle.setAttribute('rotation', '-90 0 0');
              subtitle.setAttribute('align', 'center');
              subtitle.setAttribute('color', arConfig.color || '#ffffff');
              subtitle.setAttribute('scale', `${subtitleScale} ${subtitleScale} 1`);
              subtitle.setAttribute('font', 'roboto');
              subtitle.setAttribute('wrap-count', '25');
              entity.appendChild(subtitle);
            }

            marker.appendChild(entity);

            // Camera
            const camera = document.createElement('a-entity');
            camera.setAttribute('camera', '');

            // Build scene
            scene.appendChild(assets);
            scene.appendChild(marker);
            scene.appendChild(camera);
            container.appendChild(scene);

            // Event listeners - usar las variables ya creadas
            
            if (scene && marker) {
              // Marker events
              marker.addEventListener('markerFound', () => {
                console.log('🎯 Marcador HIRO detectado!');
                setMarkerFound(true);
              });

              marker.addEventListener('markerLost', () => {
                console.log('❌ Marcador HIRO perdido');
                setMarkerFound(false);
              });

              // Scene events
              scene.addEventListener('loaded', () => {
                console.log('� Escena AR cargada');
              });

              scene.addEventListener('arjs-video-loaded', () => {
                console.log('📹 Video cargado - aplicando fix móvil');
                setTimeout(() => {
                  const video = document.querySelector('#arjs-video');
                  const canvas = scene.querySelector('canvas');
                  
                  if (video) {
                    console.log('🔧 Corrigiendo video móvil');
                    // Reset video styles completamente
                    (video as HTMLVideoElement).style.cssText = `
                      width: 100vw !important;
                      height: 100vh !important;
                      object-fit: cover !important;
                      position: absolute !important;
                      top: 0 !important;
                      left: 0 !important;
                      margin: 0 !important;
                      z-index: -2 !important;
                    `;
                  }
                  
                  if (canvas) {
                    console.log('🔧 Corrigiendo canvas móvil');
                    (canvas as HTMLCanvasElement).style.cssText = `
                      width: 100vw !important;
                      height: 100vh !important;
                      object-fit: cover !important;
                      position: absolute !important;
                      top: 0 !important;
                      left: 0 !important;
                      margin: 0 !important;
                    `;
                  }
                }, 500);
              });

              console.log('✅ Escena AR creada con éxito');
            }

            resolve();
          });
        };

        initializeAR();
      }, []); // Empty dependency array - runs once

      //
      // AQUÍ ESTÁ EL ARREGLO
      //
      // Este `if` ahora renderiza EXACTAMENTE LO MISMO
      // que la prop `loading` del `dynamic` import.
      if (!config) {
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p>Cargando AR...</p>
            </div>
          </div>
        );
      }

      return (
        <>
          {/* A-Frame Scene Container */}
            <div
              id="ar-scene-container"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
              }}
            />

            {!isLoaded && (
              <div
                style={{
                  position: 'fixed',
                  top: '0',
                  left: '0',
                  width: '100vw',
                  height: '100vh',
                  background: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 999,
                  color: 'white',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      border: '4px solid #333',
                      borderTop: '4px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 20px',
                    }}
                  ></div>
                  <p>Cargando experiencia AR...</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Preparando cámara y marcadores
                  </p>
                </div>
              </div>
            )}

          <style jsx global>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            /* Críticos para móviles - Forzar video AR.js */
            #arjs-video {
              width: 100vw !important;
              height: 100vh !important;
              object-fit: cover !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              margin: 0 !important;
              z-index: -2 !important;
            }
            
            /* Asegurar que a-scene ocupe todo */
            a-scene {
              width: 100vw !important;
              height: 100vh !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
            }
            
            /* Canvas también debe ocupar todo */
            a-scene canvas {
              width: 100vw !important;
              height: 100vh !important;
              object-fit: cover !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              margin: 0 !important;
            }
          `}</style>
        </>
      );
      // --- (FIN) Componente ARViewerContent ---
    }),
  {
    // Esta es la prop de carga que usa el SERVIDOR
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando AR...</p>
        </div>
      </div>
    ),
  },
);

// --- (FIN) Definición del componente dentro de dynamic() ---

export default function ARViewer() {
  return <ARViewerContent />;
}