import React from 'react';
import { FlaskConical } from 'lucide-react';

interface InputFormProps {
  molecule: string;
  setMolecule: (val: string) => void;
  dataPoints: { concentration: number; signal: number }[];
  setDataPoints: (val: { concentration: number; signal: number }[]) => void;
  onSearch: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
  molecule,
  setMolecule,
  dataPoints,
  setDataPoints,
  onSearch
}) => {
  const handleAddPoint = () => {
    setDataPoints([...dataPoints, { concentration: 0, signal: 0 }]);
  };

  const handleChange = (index: number, field: 'concentration' | 'signal', value: string) => {
    const newPoints = [...dataPoints];
    newPoints[index][field] = parseFloat(value) || 0;
    setDataPoints(newPoints);
  };

  return (
    <div className="p-4 rounded-2xl shadow bg-white space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-600">
        <FlaskConical className="w-5 h-5" /> Curva de Calibración
      </h2>
      <input
        type="text"
        placeholder="Nombre de la molécula (ej: etanol)"
        className="w-full p-2 border rounded-lg"
        value={molecule}
        onChange={e => setMolecule(e.target.value)}
      />
      <button
        onClick={onSearch}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
      >
        Buscar molécula
      </button>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Datos experimentales</h3>
        {dataPoints.map((point, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="number"
              placeholder="Concentración"
              className="flex-1 border rounded-lg p-2"
              value={point.concentration || ''}
              onChange={e => handleChange(i, 'concentration', e.target.value)}
            />
            <input
              type="number"
              placeholder="Señal"
              className="flex-1 border rounded-lg p-2"
              value={point.signal || ''}
              onChange={e => handleChange(i, 'signal', e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={handleAddPoint}
          className="text-blue-500 hover:underline text-sm"
        >
          + Agregar punto
        </button>
      </div>
    </div>
  );
};

export default InputForm;
