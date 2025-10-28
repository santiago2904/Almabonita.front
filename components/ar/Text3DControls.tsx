'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { use3DText } from '@/hooks';
import { cn } from '@/lib/utils';

const colorOptions = [
  { value: '#ffffff', label: '⚪ Blanco' },
  { value: '#ff69b4', label: '💖 Rosa' },
  { value: '#00ff00', label: '💚 Verde' },
  { value: '#ffff00', label: '💛 Amarillo' },
  { value: '#ff0000', label: '❤️ Rojo' },
  { value: '#0080ff', label: '💙 Azul' },
  { value: '#800080', label: '💜 Morado' },
];

export function Text3DControls() {
  const { config, updateConfig, toggleEnabled, updatePosition } = use3DText();

  return (
    <Card className={cn(
      "transition-all duration-200",
      config.enabled 
        ? "border-blue-200 bg-blue-50/50 shadow-md" 
        : "border-gray-200 bg-gray-50/30"
    )}>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center gap-2 transition-colors",
          config.enabled ? "text-blue-700" : "text-gray-600"
        )}>
          🎲 Texto 3D
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="text3d-enabled"
            checked={config.enabled}
            onCheckedChange={toggleEnabled}
          />
          <Label htmlFor="text3d-enabled">Habilitar texto 3D</Label>
        </div>

        {config.enabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text3d-text">Texto 3D</Label>
              <Input
                id="text3d-text"
                value={config.text}
                onChange={(e) => updateConfig({ text: e.target.value })}
                placeholder="Texto en 3D"
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text3d-color">Color 3D</Label>
              <Select
                value={config.color}
                onValueChange={(value) => updateConfig({ color: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Profundidad: {config.depth}</Label>
              <Slider
                value={[config.depth]}
                onValueChange={([value]) => updateConfig({ depth: value })}
                min={0.1}
                max={0.5}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Posición X: {config.position.x}</Label>
                <Slider
                  value={[config.position.x]}
                  onValueChange={([value]) => updatePosition('x', value)}
                  min={-3}
                  max={3}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Posición Y: {config.position.y}</Label>
                <Slider
                  value={[config.position.y]}
                  onValueChange={([value]) => updatePosition('y', value)}
                  min={0}
                  max={3}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Posición Z: {config.position.z}</Label>
                <Slider
                  value={[config.position.z]}
                  onValueChange={([value]) => updatePosition('z', value)}
                  min={-2}
                  max={2}
                  step={0.1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Escala: {config.scale}</Label>
              <Slider
                value={[config.scale]}
                onValueChange={([value]) => updateConfig({ scale: value })}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
              💡 <strong>Texto 3D:</strong> Cada letra se convierte en geometría 3D real con profundidad y efectos de luz.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}