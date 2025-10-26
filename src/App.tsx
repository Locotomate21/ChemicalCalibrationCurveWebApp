import { useState, useEffect } from 'react';
import { Download, Beaker } from 'lucide-react';
import MoleculeSearch from './components/MoleculeSearch';
import MoleculeInfo from './components/MoleculeInfo';
import MoleculeViewer from './components/MoleculeViewer';
import DataInput from './components/DataInput';
import CalibrationChart from './components/CalibrationChart';
import type { MoleculeData, CalibrationPoint, RegressionResults } from './types';
import { calculateLinearRegression } from './utils/calculations';
import { exportToExcel } from './lib/excel';

function App() {
  const [molecule, setMolecule] = useState<MoleculeData | null>(null);
  const [points, setPoints] = useState<CalibrationPoint[]>([
    { id: '1', concentration: 0.5, absorbance: 0.12 },
    { id: '2', concentration: 1.0, absorbance: 0.24 },
    { id: '3', concentration: 1.5, absorbance: 0.35 },
    { id: '4', concentration: 2.0, absorbance: 0.47 },
    { id: '5', concentration: 2.5, absorbance: 0.59 }
  ]);
  const [regression, setRegression] = useState<RegressionResults>({
    slope: 0,
    intercept: 0,
    rSquared: 0,
    predictedValues: [],
    residuals: []
  });

  useEffect(() => {
    if (points.length >= 2) {
      const results = calculateLinearRegression(points);
      setRegression(results);
    }
  }, [points]);

  const handleExport = () => {
    if (!molecule) {
      alert('Busca una molécula antes de exportar');
      return;
    }

    exportToExcel({
      molecule,
      points,
      regression,
      name: `Calibración ${molecule.molecularFormula}`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Beaker className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Curvas de Calibración Química
              </h1>
              <p className="text-slate-600 text-sm">
                Análisis espectrofotométrico con visualización molecular 3D
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-6">
            <MoleculeSearch onMoleculeFound={setMolecule} />
            <DataInput points={points} onPointsChange={setPoints} />

            {molecule && points.length >= 2 && (
              <button
                onClick={handleExport}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Exportar a Excel
              </button>
            )}
          </div>

          <MoleculeInfo molecule={molecule} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div style={{ minHeight: '400px' }}>
            <MoleculeViewer sdf={molecule?.sdf} />
          </div>

          <div style={{ minHeight: '400px' }}>
            <CalibrationChart points={points} regression={regression} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
