import { useState } from 'react';
import { Download, FlaskConical } from 'lucide-react';
import InputForm from '../components/InputForm';
import MoleculeViewer from '../components/MoleculeViewer';
import CalibrationChart from '../components/CalibrationChart';
import MoleculeInfo from '../components/MoleculeInfo';

import { searchMolecule } from '../lib/pubchem';
import type { MoleculeData, DataPoint, CalibrationCurve } from '../types';
import { calculateCalibration } from '../utils/calibration';
import { exportToExcel } from '../lib/excel';

const Dashboard: React.FC = () => {
  const [molecule, setMolecule] = useState('');
  const [moleculeData, setMoleculeData] = useState<MoleculeData | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [calibration, setCalibration] = useState<CalibrationCurve | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar molécula en PubChem
  const handleSearch = async () => {
    if (!molecule.trim()) {
      alert('Por favor, ingresa el nombre o fórmula de una molécula.');
      return;
    }

    setLoading(true);
    try {
      const data = await searchMolecule(molecule);
      setMoleculeData(data);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Generar curva de calibración
  const handleGenerateCalibration = () => {
    if (dataPoints.length < 2 || !moleculeData) {
      alert('Agrega al menos dos puntos válidos y busca la molécula.');
      return;
    }

    const result = calculateCalibration(dataPoints, moleculeData);
    setCalibration(result);
  };

  // 🔹 Exportar a Excel
  const handleExport = () => {
    if (!calibration || !moleculeData) {
      alert('Faltan datos de molécula o calibración.');
      return;
    }

    exportToExcel(calibration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-indigo-600">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FlaskConical className="w-10 h-10 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Curva de Calibración Química
                </h1>
                <p className="text-gray-600 mt-1">
                  Sistema de análisis cuantitativo con visualización molecular 3D
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={!calibration || !moleculeData}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-lg"
            >
              <Download className="w-5 h-5" />
              Exportar a Excel
            </button>
          </div>
        </div>

        {/* Grid 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fila 1, Columna 1: Formulario de entrada */}
          <div className="flex flex-col">
            <InputForm
              molecule={molecule}
              setMolecule={setMolecule}
              dataPoints={dataPoints}
              setDataPoints={setDataPoints}
              onSearch={handleSearch}
            />
          </div>

          {/* Fila 1, Columna 2: Información de la molécula */}
          <div className="flex flex-col">
            <MoleculeInfo molecule={moleculeData} />
          </div>

          {/* Fila 2, Columna 1: Visualizador 3D */}
          <div className="flex flex-col">
            <MoleculeViewer sdf={moleculeData?.sdf} />
          </div>

          {/* Fila 2, Columna 2: Gráfico de calibración */}
          <div className="flex flex-col">
            <CalibrationChart
              points={calibration ? calibration.points : []}
              regression={calibration ? calibration.regression : null}
            />
          </div>
        </div>

        {/* Botón de generar calibración */}
        <div className="mt-6">
          <button
            onClick={handleGenerateCalibration}
            disabled={loading || dataPoints.length < 2 || !moleculeData}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition shadow-lg text-lg"
          >
            {loading ? 'Procesando...' : 'Generar Curva de Calibración'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Departamento de Química • Sistema de Calibración v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;