import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">🎯 AR Demo - React</h1>
          <p className="text-xl text-gray-600">
            Crea experiencias de Realidad Aumentada con React y shadcn/ui
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 AR Creator
              </CardTitle>
              <CardDescription>
                Crea experiencias AR personalizadas con imágenes y texto 3D
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✨ Subida de imágenes con drag & drop</li>
                  <li>🎲 Texto 3D con geometría real</li>
                  <li>🎨 Interfaz moderna con shadcn/ui</li>
                  <li>📱 Compatible con dispositivos móviles</li>
                </ul>
                <Link href="/ar-creator">
                  <Button className="w-full">
                    🚀 Crear Experiencia AR
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👀 AR Viewer
              </CardTitle>
              <CardDescription>
                Visualiza experiencias AR con marcador HIRO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>📷 Detección de marcador HIRO</li>
                  <li>🔍 Controles de zoom con gestos</li>
                  <li>🎯 Experiencia AR fluida</li>
                  <li>⚡ Carga rápida de contenido</li>
                </ul>
                <Link href="/ar-viewer">
                  <Button variant="outline" className="w-full">
                    👁️ Ver Experiencia AR
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Card className="bg-gradient-to-r from-blue-100 to-purple-100">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">🔧 Tecnologías utilizadas</h3>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="bg-white px-3 py-1 rounded-full">React 18</span>
                  <span className="bg-white px-3 py-1 rounded-full">Next.js 15</span>
                  <span className="bg-white px-3 py-1 rounded-full">TypeScript</span>
                  <span className="bg-white px-3 py-1 rounded-full">shadcn/ui</span>
                  <span className="bg-white px-3 py-1 rounded-full">Tailwind CSS</span>
                  <span className="bg-white px-3 py-1 rounded-full">A-Frame</span>
                  <span className="bg-white px-3 py-1 rounded-full">AR.js</span>
                  <span className="bg-white px-3 py-1 rounded-full">Zustand</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}