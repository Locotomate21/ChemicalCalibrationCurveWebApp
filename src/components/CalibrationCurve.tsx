/* import * as XLSX from 'xlsx';
import type { CalibrationCurve } from '../types/types';

export function exportToExcel(curve: CalibrationCurve) {
  const wb = XLSX.utils.book_new();

  const dataRows = curve.points.map((point, i): Record<string, string | number> => ({
    'Concentración': point.concentration,
    'Absorbancia': point.absorbance,
    'Predicción': curve.regression.predictedValues[i]?.toFixed(4) || '',
    'Residuo': curve.regression.residuals[i]?.toFixed(4) || ''
  }));

  const resultsData = [
    ['Parámetro', 'Valor'],
    ['Pendiente (m)', curve.regression.slope.toFixed(6)],
    ['Intercepto (b)', curve.regression.intercept.toFixed(6)],
    ['R²', curve.regression.rSquared.toFixed(6)],
    ['Ecuación', `y = ${curve.regression.slope.toFixed(4)}x + ${curve.regression.intercept.toFixed(4)}`],
    [],
    ['Información de la Molécula'],
    ['Fórmula Molecular', curve.molecule.molecularFormula],
    ['Peso Molecular', `${curve.molecule.molecularWeight.toFixed(2)} g/mol`],
    ['Nombre IUPAC', curve.molecule.iupacName],
    ['PubChem CID', curve.molecule.cid],
    ['Número de Átomos', curve.molecule.atomCount],
  ];

  const ws1 = XLSX.utils.json_to_sheet(dataRows);
  const ws2 = XLSX.utils.aoa_to_sheet(resultsData);

  XLSX.utils.book_append_sheet(wb, ws1, 'Datos de Calibración');
  XLSX.utils.book_append_sheet(wb, ws2, 'Resultados');

  const fileName = `calibracion_${curve.molecule.molecularFormula}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
 */