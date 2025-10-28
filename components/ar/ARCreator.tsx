'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Type, 
  Sparkles, 
  Settings, 
  Upload,  
  Palette,
  Layers3,
  Zap,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useARConfig, useImageUpload, use3DText } from '@/hooks';
import { FileUpload } from './FileUpload';
import { Text3DControls } from './Text3DControls';
// import { ARPreview } from './ARPreview'; // TODO: Create ARPreview component
import { cn } from '@/lib/utils';
import QRCode from 'qrcode';

const colorOptions = [
  { value: '#ffffff', label: '⚪ Blanco', color: 'bg-white' },
  { value: '#ff69b4', label: '💖 Rosa', color: 'bg-pink-400' },
  { value: '#00ff00', label: '💚 Verde', color: 'bg-green-400' },
  { value: '#ffff00', label: '💛 Amarillo', color: 'bg-yellow-400' },
  { value: '#ff0000', label: '❤️ Rojo', color: 'bg-red-500' },
  { value: '#0080ff', label: '💙 Azul', color: 'bg-blue-500' },
  { value: '#800080', label: '💜 Morado', color: 'bg-purple-500' },
];

const animationOptions = [
  { value: 'none', label: 'Sin animación', icon: '⏹️' },
  { value: 'bounce', label: 'Rebote', icon: '🦘' },
  { value: 'pulse', label: 'Pulso', icon: '💗' },
  { value: 'rotate', label: 'Rotación', icon: '🌀' },
  { value: 'wave', label: 'Onda', icon: '🌊' },
  { value: 'fade', label: 'Desvanecimiento', icon: '👻' },
  { value: 'scale', label: 'Escala', icon: '📏' },
];

export function ARCreator() {
  const { config, updateConfig } = useARConfig();
  const { upload, uploadFile, setPreview, clearUpload } = useImageUpload();
  const { config: text3dConfig } = use3DText();
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState('none');
  const [selectedParticles, setSelectedParticles] = useState('false');
  const [subtitleText, setSubtitleText] = useState('');
  const [textPosition, setTextPosition] = useState<'above' | 'below'>('below');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [imageInfo, setImageInfo] = useState<{
    name: string;
    size: number;
    type: string;
    dimensions?: { width: number; height: number };
  } | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setPreview(file);
    
    // Capturar información de la imagen
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      setImageInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        dimensions: {
          width: img.naturalWidth,
          height: img.naturalHeight
        }
      });
      URL.revokeObjectURL(objectUrl);
    };
    
    img.src = objectUrl;
    
    try {
      const result = await uploadFile(file);
      if (result.success && result.url) {
        updateConfig({ imageUrl: result.url });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }, [setPreview, uploadFile, updateConfig]);

  const handleGenerate = useCallback(async () => {
    if (!config.imageUrl) {
      alert('⚠️ Por favor selecciona una imagen para generar la experiencia AR');
      return;
    }

    // Si no hay texto, usar uno por defecto
    const finalText = config.text.trim() || 'AR Experience';

    setIsGenerating(true);
    
    try {
      // Crear URL con parámetros para el AR Viewer
      const params = new URLSearchParams();
      params.set('img', config.imageUrl);
      params.set('text', finalText);
      params.set('subtitle', subtitleText);
      params.set('color', config.fontColor || config.color || '#ffffff');
      params.set('animation', selectedAnimation);
      params.set('particles', selectedParticles);
      params.set('size', config.imageScale?.toString() || config.size || '1');
      params.set('fontSize', String(config.fontSize || '16'));
      params.set('borderRadius', String(config.borderRadius || '5'));
      params.set('textPosition', textPosition);
      
      // Parámetros de texto 3D
      if (text3dConfig.enabled) {
        params.set('text3d', 'true');
        params.set('text3dColor', text3dConfig.color);
        params.set('text3dDepth', text3dConfig.depth.toString());
        params.set('text3dX', text3dConfig.position.x.toString());
        params.set('text3dY', text3dConfig.position.y.toString());
        params.set('text3dZ', text3dConfig.position.z.toString());
      }

      // Generar URL completa
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const arUrl = `${baseUrl}/ar-viewer?${params.toString()}`;
      
      console.log('🎯 URL generada:', arUrl);
      setGeneratedUrl(arUrl);

      // Generar código QR
      const qrDataUrl = await QRCode.toDataURL(arUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(qrDataUrl);
      console.log('✅ QR Code generado');

      // Actualizar configuración completa
      const fullConfig = {
        ...config,
        text3D: text3dConfig.enabled,
        text3d: text3dConfig.enabled,
        text3DColor: text3dConfig.color,
        text3dColor: text3dConfig.color,
        text3DDepth: String(text3dConfig.depth),
        text3dDepth: String(text3dConfig.depth),
        text3DPosition: text3dConfig.position,
        text3dX: String(text3dConfig.position.x),
        text3dY: String(text3dConfig.position.y),
        text3dZ: String(text3dConfig.position.z),
        animation: selectedAnimation,
        particles: selectedParticles,
        subtitle: subtitleText,
      };

      updateConfig(fullConfig);
      setShowPreview(true);
      
    } catch (error) {
      console.error('Error generating AR:', error);
      alert('❌ Error generando la experiencia AR. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  }, [config, text3dConfig, updateConfig, selectedAnimation, selectedParticles, subtitleText]);

  const handleReset = useCallback(() => {
    updateConfig({
      imageUrl: '',
      text: 'AR Demo',
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
      text3DPosition: { x: 0, y: 1, z: 0 }
    });
    setSubtitleText('');
    setTextPosition('below');
    setSelectedAnimation('none');
    setSelectedParticles('false');
    setGeneratedUrl('');
    setQrCodeDataUrl('');
    setImageInfo(null);
    clearUpload();
    setShowPreview(false);
  }, [updateConfig, clearUpload]);

  const handleCopyUrl = useCallback(async () => {
    if (!generatedUrl) return;
    
    try {
      await navigator.clipboard.writeText(generatedUrl);
      alert('📋 URL copiada al portapapeles!');
    } catch (error) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = generatedUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('📋 URL copiada al portapapeles!');
    }
  }, [generatedUrl]);

  const handleOpenAR = useCallback(() => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank');
    }
  }, [generatedUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl border border-white/20">
            <Zap className="h-10 w-10 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AR Creator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6 leading-relaxed">
            Crea experiencias de realidad aumentada únicas con marcador HIRO. 
            Diseña, personaliza y comparte tus creaciones en segundos.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-14 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
                <TabsTrigger value="content" className="flex items-center gap-2 text-sm font-medium rounded-lg">
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">Contenido</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2 text-sm font-medium rounded-lg">
                  <Type className="h-4 w-4" />
                  <span className="hidden sm:inline">Texto</span>
                </TabsTrigger>
                <TabsTrigger value="effects" className="flex items-center gap-2 text-sm font-medium rounded-lg">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Efectos</span>
                </TabsTrigger>
                <TabsTrigger value="config" className="flex items-center gap-2 text-sm font-medium rounded-lg">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Config</span>
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="mt-8">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Camera className="h-6 w-6 text-blue-600" />
                      Contenido Visual
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      Selecciona la imagen que será el corazón de tu experiencia AR
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      preview={upload.preview}
                      isUploading={upload.isUploading}
                      error={upload.error}
                    />
                    
                    {upload.url && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 mb-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            ✓ Imagen lista
                          </Badge>
                          <span className="text-sm">Tu imagen está disponible para la experiencia AR</span>
                        </div>
                      </div>
                    )}

                    {/* Propiedades de la imagen */}
                    {imageInfo && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Propiedades de la Imagen
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-blue-600 font-medium">📁 Archivo:</span>
                            <div className="text-blue-800 truncate" title={imageInfo.name}>
                              {imageInfo.name}
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">📏 Dimensiones:</span>
                            <div className="text-blue-800">
                              {imageInfo.dimensions ? 
                                `${imageInfo.dimensions.width} × ${imageInfo.dimensions.height} px` : 
                                'Calculando...'
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">⚖️ Tamaño:</span>
                            <div className="text-blue-800">
                              {(imageInfo.size / (1024 * 1024)).toFixed(2)} MB
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">🎨 Formato:</span>
                            <div className="text-blue-800 uppercase">
                              {imageInfo.type.split('/')[1] || 'Unknown'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Recomendaciones */}
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="text-xs text-blue-700 space-y-1">
                            {imageInfo.size > 5 * 1024 * 1024 && (
                              <div className="flex items-center gap-1 text-amber-700">
                                <span>⚠️</span> 
                                Imagen muy grande, considera reducir el tamaño
                              </div>
                            )}
                            {imageInfo.dimensions && imageInfo.dimensions.width > 2048 && (
                              <div className="flex items-center gap-1 text-amber-700">
                                <span>💡</span> 
                                Resolución alta, perfecto para AR de calidad
                              </div>
                            )}
                            {imageInfo.dimensions && imageInfo.dimensions.width < 512 && (
                              <div className="flex items-center gap-1 text-amber-700">
                                <span>📱</span> 
                                Resolución baja, podría verse pixelada en AR
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Text Tab */}
              <TabsContent value="text" className="mt-8 space-y-8">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Type className="h-6 w-6 text-green-600" />
                      Configuración de Texto
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      Personaliza el mensaje que acompañará tu experiencia
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="main-text" className="text-sm font-semibold">
                          💬 Texto Principal *
                        </Label>
                        <Input
                          id="main-text"
                          value={config.text}
                          onChange={(e) => updateConfig({ text: e.target.value })}
                          placeholder="¡Feliz Aniversario!"
                          maxLength={50}
                          className="text-base"
                        />
                        <div className="text-xs text-gray-500">
                          {config.text.length}/50 caracteres
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subtitle-text" className="text-sm font-semibold">
                          📝 Subtítulo (opcional)
                        </Label>
                        <Input
                          id="subtitle-text"
                          value={subtitleText}
                          onChange={(e) => setSubtitleText(e.target.value)}
                          placeholder="Con amor..."
                          maxLength={30}
                          className="text-base"
                        />
                        <div className="text-xs text-gray-500">
                          {subtitleText.length}/30 caracteres
                        </div>
                      </div>
                    </div>

                    <div className="py-4">
                      <Separator />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Layers3 className="h-4 w-4" />
                          Posición del Texto
                        </Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full h-12 justify-start">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">
                                  {textPosition === 'above' ? '⬆️' : '⬇️'}
                                </span>
                                <span>
                                  {textPosition === 'above' ? 'Arriba de la imagen' : 'Abajo de la imagen'}
                                </span>
                              </div>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Posición relativa</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup 
                              value={textPosition} 
                              onValueChange={(value) => setTextPosition(value as 'above' | 'below')}
                            >
                              <DropdownMenuRadioItem value="above">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">⬆️</span>
                                  <span>Arriba de la imagen</span>
                                </div>
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="below">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">⬇️</span>
                                  <span>Abajo de la imagen</span>
                                </div>
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Color del Texto
                        </Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full h-12 justify-start">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-300" 
                                  style={{ backgroundColor: config.fontColor }}
                                />
                                <span>
                                  {colorOptions.find(c => c.value === config.fontColor)?.label || 'Seleccionar color'}
                                </span>
                              </div>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Selecciona un color</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup 
                              value={config.fontColor} 
                              onValueChange={(value) => updateConfig({ fontColor: value })}
                            >
                              {colorOptions.map((option) => (
                                <DropdownMenuRadioItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-3">
                                    <div className={cn("w-4 h-4 rounded-full border", option.color)} />
                                    <span>{option.label}</span>
                                  </div>
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">
                          📏 Tamaño: {config.fontSize}px
                        </Label>
                        <div className="px-2">
                          <Slider
                            value={[parseFloat(config.fontSize)]}
                            onValueChange={([value]: number[]) => updateConfig({ fontSize: String(value) })}
                            min={12}
                            max={48}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>12px</span>
                            <span>48px</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-8">
                  <Text3DControls />
                </div>
              </TabsContent>

              {/* Effects Tab */}
              <TabsContent value="effects" className="mt-8">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                      Animaciones y Efectos
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      Dale vida a tu experiencia con animaciones espectaculares
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">🎭 Animación</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full h-12 justify-start">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {animationOptions.find(a => a.value === selectedAnimation)?.icon || '🎭'}
                                </span>
                                <span>
                                  {animationOptions.find(a => a.value === selectedAnimation)?.label || 'Seleccionar animación'}
                                </span>
                              </div>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Tipo de animación</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup 
                              value={selectedAnimation} 
                              onValueChange={setSelectedAnimation}
                            >
                              {animationOptions.map((option) => (
                                <DropdownMenuRadioItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{option.icon}</span>
                                    <span>{option.label}</span>
                                  </div>
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">✨ Efectos Adicionales</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full h-12 justify-start">
                              <span>
                                {selectedParticles === 'false' ? 'Sin efectos' :
                                 selectedParticles === 'hearts' ? '💖 Corazones flotantes' :
                                 selectedParticles === 'stars' ? '⭐ Estrellas brillantes' :
                                 selectedParticles === 'confetti' ? '🎉 Confetti festivo' :
                                 'Seleccionar efecto'}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Efectos especiales</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup 
                              value={selectedParticles} 
                              onValueChange={setSelectedParticles}
                            >
                              <DropdownMenuRadioItem value="false">Sin efectos</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="hearts">💖 Corazones flotantes</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="stars">⭐ Estrellas brillantes</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="confetti">🎉 Confetti festivo</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {selectedAnimation !== 'none' && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <div className="font-semibold text-purple-800">Vista Previa de Animación</div>
                            <div className="text-sm text-purple-700 mt-1">
                              Has seleccionado: <strong>{animationOptions.find(a => a.value === selectedAnimation)?.label}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Config Tab */}
              <TabsContent value="config" className="mt-8">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Settings className="h-6 w-6 text-orange-600" />
                      Configuración Avanzada
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      Ajusta los parámetros técnicos para optimizar tu experiencia
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">
                          📏 Escala de Imagen: {config.imageScale}x
                        </Label>
                        <div className="px-2">
                          <Slider
                            value={[parseFloat(config.imageScale || config.size || '1')]}
                            onValueChange={([value]: number[]) => updateConfig({ imageScale: String(value), size: String(value) })}
                            min={0.5}
                            max={3}
                            step={0.1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0.5x</span>
                            <span>3x</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">
                          🔄 Radio del Borde: {config.borderRadius}px
                        </Label>
                        <div className="px-2">
                          <Slider
                            value={[parseFloat(config.borderRadius)]}
                            onValueChange={([value]: number[]) => updateConfig({ borderRadius: String(value) })}
                            min={0}
                            max={20}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0px</span>
                            <span>20px</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">📐 Tamaño de Imagen</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">📱 Pequeña (2x1.5)</SelectItem>
                          <SelectItem value="medium">💻 Mediana (3x2.25)</SelectItem>
                          <SelectItem value="large">🖥️ Grande (4x3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Live Preview Card */}
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Eye className="h-6 w-6 text-indigo-600" />
                    Vista Previa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center p-6">
                    {upload.preview ? (
                      <div className="text-center space-y-4 w-full">
                        <div className="relative inline-block">
                          <img 
                            src={upload.preview} 
                            alt="Preview" 
                            className="max-w-full max-h-40 rounded-xl shadow-lg border border-white/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="text-xl font-bold px-4 py-2 rounded-lg bg-black/10" style={{ color: config.fontColor }}>
                            {config.text}
                          </div>
                          {subtitleText && (
                            <div className="text-base px-3 py-1 rounded-lg bg-black/5" style={{ color: config.fontColor }}>
                              {subtitleText}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <Upload className="h-16 w-16 mx-auto mb-4 opacity-40" />
                        <p className="text-lg font-medium">Sube una imagen</p>
                        <p className="text-sm">para ver la vista previa</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {config.imageUrl && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        ✅ Listo para AR
                      </Badge>
                    )}
                    {config.text && (
                      <Badge variant="secondary">
                        📝 {config.text.length} chars
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {textPosition === 'above' ? '⬆️ Texto arriba' : '⬇️ Texto abajo'}
                    </Badge>
                    {text3dConfig.enabled && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        🎲 3D Text
                      </Badge>
                    )}
                    {selectedAnimation !== 'none' && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        ✨ {animationOptions.find(a => a.value === selectedAnimation)?.icon}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !config.imageUrl}
                  size="lg"
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 shadow-2xl rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                      Generando...
                    </>
                  ) : config.imageUrl ? (
                    <>
                      <Zap className="h-6 w-6 mr-3" />
                      Generar Experiencia AR
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 mr-3" />
                      Sube una imagen primero
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleReset} 
                  size="lg"
                  className="w-full h-14 font-semibold text-gray-700 border-2 hover:bg-gray-50 rounded-xl transition-all duration-200"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reiniciar Formulario
                </Button>
              </div>

              {/* Tips Card */}
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-amber-800 font-bold">💡 Consejos Pro</CardTitle>
                </CardHeader>
                <CardContent className="text-base text-amber-700 space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="text-amber-600">📸</span>
                    Usa imágenes de alta calidad (máx. 5MB)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-amber-600">✨</span>
                    Textos cortos funcionan mejor en AR
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-amber-600">🎲</span>
                    El texto 3D es ideal para títulos
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-amber-600">🎭</span>
                    Prueba diferentes animaciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">🎯 Tu Experiencia AR está Lista!</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowPreview(false)}
                  className="text-2xl hover:bg-gray-100 w-10 h-10 rounded-full"
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* QR Code Section */}
                <div className="text-center">
                  <h4 className="text-xl font-semibold mb-4 text-gray-700">
                    📱 Escanea con tu teléfono
                  </h4>
                  
                  {qrCodeDataUrl ? (
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 inline-block">
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code para AR" 
                        className="w-64 h-64 mx-auto rounded-lg shadow-lg"
                      />
                      <p className="text-sm text-gray-500 mt-4 max-w-xs">
                        Apunta tu cámara al código QR para abrir la experiencia AR
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-8 rounded-xl">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-gray-500 mt-4">Generando QR...</p>
                    </div>
                  )}
                </div>

                {/* URL and Actions Section */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-700">
                      🔗 Enlace directo
                    </h4>
                    
                    {generatedUrl ? (
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm break-all">
                        {generatedUrl}
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="animate-pulse h-6 bg-gray-300 rounded"></div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={handleCopyUrl}
                      disabled={!generatedUrl}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold"
                    >
                      📋 Copiar URL
                    </Button>
                    
                    <Button 
                      onClick={handleOpenAR}
                      disabled={!generatedUrl}
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold"
                    >
                      🚀 Abrir Experiencia AR
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => window.open('/ar-demo/marcador-hiro.html', '_blank')}
                      className="w-full border-2 border-amber-500 text-amber-700 hover:bg-amber-50 h-12 text-lg font-semibold"
                    >
                      🖨️ Imprimir Marcador HIRO
                    </Button>
                  </div>

                  {/* Instructions */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h5 className="font-semibold text-amber-800 mb-2">📋 Instrucciones:</h5>
                    <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                      <li>Permite el acceso a la cámara en tu dispositivo</li>
                      <li>Imprime el marcador HIRO si no lo tienes</li>
                      <li>Apunta la cámara al marcador desde 30-40cm</li>
                      <li>¡Disfruta tu experiencia AR personalizada!</li>
                    </ol>
                  </div>

                  {/* Configuration Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-800 mb-2">⚙️ Configuración:</h5>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>Texto:</strong> {config.text}</div>
                      {subtitleText && <div><strong>Subtítulo:</strong> {subtitleText}</div>}
                      <div><strong>Color:</strong> {config.fontColor}</div>
                      <div><strong>Posición:</strong> {textPosition === 'above' ? 'Arriba de la imagen' : 'Abajo de la imagen'}</div>
                      {selectedAnimation !== 'none' && <div><strong>Animación:</strong> {animationOptions.find(a => a.value === selectedAnimation)?.label}</div>}
                      {text3dConfig.enabled && <div><strong>Texto 3D:</strong> Habilitado</div>}
                      {selectedParticles !== 'false' && <div><strong>Efectos:</strong> {selectedParticles}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreview(false)}
                  className="px-8 py-2 border-2 hover:bg-gray-50"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
