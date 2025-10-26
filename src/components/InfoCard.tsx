/* import React from 'react';
import type { MoleculeData } from '../lib/pubchem';

interface InfoCardProps {
  moleculeData: MoleculeData | null;
}

const InfoCard: React.FC<InfoCardProps> = ({ moleculeData }) => {
  if (!moleculeData) {
    return (
      <div className="p-4 rounded-2xl shadow bg-white text-gray-500 text-center">
        Ingresa una molécula para ver su información química.
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl shadow bg-white space-y-2">
      <h2 className="text-lg font-semibold text-blue-600">Información de la molécula</h2>
      <p><strong>Nombre:</strong> {moleculeData.name}</p>
      <p><strong>Fórmula:</strong> {moleculeData.formula}</p>
      <p>
        <strong>Peso molecular:</strong>{' '}
        {moleculeData.molecularWeight && !isNaN(Number(moleculeData.molecularWeight))
          ? Number(moleculeData.molecularWeight).toFixed(4)
          : 'N/A'}
      </p>
      <p><strong>Nombre IUPAC:</strong> {moleculeData.iupacName}</p>
      <p><strong>CID PubChem:</strong> {moleculeData.cid}</p>
      <p><strong>Número de átomos:</strong> {moleculeData.atomCount}</p>
    </div>
  );
};

export default InfoCard;
 */