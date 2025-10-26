import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CalibrationPoint } from '../types';

interface DataInputProps {
  points: CalibrationPoint[];
  onPointsChange: (points: CalibrationPoint[]) => void;
}

export default function DataInput({ points, onPointsChange }: DataInputProps) {
  const [concentration, setConcentration] = useState('');
  const [absorbance, setAbsorbance] = useState('');

  const addPoint = () => {
    const concValue = parseFloat(concentration);
    const absValue = parseFloat(absorbance);

    if (isNaN(concValue) || isNaN(absValue)) return;
    if (concValue < 0 || absValue < 0) return;

    const newPoint: CalibrationPoint = {
      id: crypto.randomUUID(),
      concentration: concValue,
      absorbance: absValue
    };

    onPointsChange([...points, newPoint]);
    setConcentration('');
    setAbsorbance('');
  };

  const removePoint = (id: string) => {
    onPointsChange(points.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Agregar Punto</h3>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Concentración
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={concentration}
              onChange={(e) => setConcentration(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Absorbancia
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={absorbance}
              onChange={(e) => setAbsorbance(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={addPoint}
          disabled={!concentration || !absorbance}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Punto
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">
            Puntos de Calibración ({points.length})
          </h3>
        </div>

        <div className="max-h-48 overflow-y-auto">
          {points.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-400 text-sm">
              No hay puntos agregados
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Concentración</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Absorbancia</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 text-slate-800">{point.concentration}</td>
                    <td className="px-4 py-2.5 text-slate-800">{point.absorbance}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => removePoint(point.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                        title="Eliminar punto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
