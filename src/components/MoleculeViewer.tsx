import { useEffect, useRef } from 'react';
import { Box, AlertCircle } from 'lucide-react';

interface MoleculeViewerProps {
  sdf?: string;
}

interface ThreeDMolViewer {
  addModel: (data: string, format: string) => void;
  setStyle: (sel: object, style: object) => void;
  zoomTo: () => void;
  render: () => void;
  rotate: (angle: number, axis: { x: number; y: number; z: number }) => void;
  spin: (state: boolean) => void;
  clear: () => void;
}

declare global {
  interface Window {
    $3Dmol?: {
      createViewer: (element: HTMLElement, config: { backgroundColor: string }) => ThreeDMolViewer;
    };
  }
}

export default function MoleculeViewer({ sdf }: MoleculeViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<ThreeDMolViewer | null>(null);

  // Cargar script 3Dmol
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://3Dmol.csb.pitt.edu/build/3Dmol-min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Inicializar el viewer cuando cambia el SDF
  useEffect(() => {
    if (!sdf || !viewerRef.current) return;

    const initViewer = () => {
      if (!window.$3Dmol) {
        setTimeout(initViewer, 100);
        return;
      }

      // Limpiar viewer anterior
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.clear();
        viewerInstanceRef.current = null;
      }

      const container = viewerRef.current;
      if (!container) return;

      // IMPORTANTE: Asegurarse de que el contenedor tenga dimensiones
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn('Contenedor sin dimensiones, reintentando...');
        setTimeout(initViewer, 100);
        return;
      }

      try {
        const viewer = window.$3Dmol.createViewer(container, {
          backgroundColor: 'white',
        });

        viewer.addModel(sdf, 'sdf');
        viewer.setStyle({}, { 
          stick: { colorscheme: 'Jmol', radius: 0.15 }, 
          sphere: { scale: 0.3, colorscheme: 'Jmol' } 
        });
        viewer.zoomTo();
        viewer.render();
        viewer.rotate(30, { x: 0, y: 1, z: 0 });
        viewer.spin(true);

        viewerInstanceRef.current = viewer;
      } catch (error) {
        console.error('Error al inicializar 3Dmol:', error);
      }
    };

    // Esperar un momento para que el DOM se renderice completamente
    setTimeout(initViewer, 50);

    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.spin(false);
        viewerInstanceRef.current.clear();
        viewerInstanceRef.current = null;
      }
    };
  }, [sdf]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Visualización 3D</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <AlertCircle className="w-4 h-4" />
          <span>Rotación automática</span>
        </div>
      </div>

      {/* Contenedor del viewer con dimensiones EXPLÍCITAS */}
      {sdf ? (
        <div
          ref={viewerRef}
          className="w-full rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 relative"
          style={{ 
            height: '400px', 
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}
        />
      ) : (
        <div 
          className="w-full rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center"
          style={{ height: '400px' }}
        >
          <div className="text-center text-slate-400">
            <Box className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">La visualización 3D aparecerá aquí</p>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 mt-3 text-center">
        💡 Usa el ratón para rotar, zoom y explorar la molécula
      </p>
    </div>
  );
}