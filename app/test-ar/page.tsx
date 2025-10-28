export default function TestARCreator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          AR Creator - Test de Estilos
        </h1>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Test de Componentes
          </h2>
          
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
              Botón con Gradiente
            </button>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700">
                Si puedes ver estos estilos correctamente, Tailwind funciona.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-100 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-bold text-red-800">Tarjeta Roja</h3>
                <p className="text-red-600">Contenido de prueba</p>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-bold text-green-800">Tarjeta Verde</h3>
                <p className="text-green-600">Contenido de prueba</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/ar-creator" 
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Ir al AR Creator Original
          </a>
        </div>
      </div>
    </div>
  );
}