import type { DataPoint, CalibrationCurve, MoleculeData, RegressionResults } from '../types';

/**
 * Calcula la curva de calibración completa (puntos + regresión) a partir
 * de puntos experimentales y opcionalmente la molécula asociada.
 */
export function calculateCalibration(
  points: DataPoint[],
  molecule: MoleculeData
): CalibrationCurve {
  if (points.length < 2) {
    throw new Error('Se requieren al menos dos puntos para calcular la regresión.');
  }

  // Cálculos de regresión lineal
  const n = points.length;
  const sumX = points.reduce((acc, p) => acc + p.concentration, 0);
  const sumY = points.reduce((acc, p) => acc + p.signal, 0);
  const sumXY = points.reduce((acc, p) => acc + p.concentration * p.signal, 0);
  const sumX2 = points.reduce((acc, p) => acc + p.concentration ** 2, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const intercept = (sumY - slope * sumX) / n;

  const predictedValues = points.map((p) => slope * p.concentration + intercept);
  const residuals = points.map((p, i) => p.signal - predictedValues[i]);

  const meanY = sumY / n;
  const ssTot = points.reduce((acc, p) => acc + (p.signal - meanY) ** 2, 0);
  const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
  const rSquared = 1 - ssRes / ssTot;

  const regression: RegressionResults = {
    slope,
    intercept,
    rSquared,
    predictedValues,
    residuals,
  };

  const calibrationPoints = points.map((p) => ({
    id: crypto.randomUUID(),
    concentration: p.concentration,
    absorbance: p.signal,
  }));

  return {
    points: calibrationPoints,
    regression,
    molecule,
  };
}
