import type { CalibrationPoint, RegressionResults } from '../types';

export function calculateLinearRegression(points: CalibrationPoint[]): RegressionResults {
  const n = points.length;

  if (n < 2) {
    return {
      slope: 0,
      intercept: 0,
      rSquared: 0,
      predictedValues: [],
      residuals: []
    };
  }

  const sumX = points.reduce((sum, p) => sum + p.concentration, 0);
  const sumY = points.reduce((sum, p) => sum + p.absorbance, 0);
  const sumXY = points.reduce((sum, p) => sum + p.concentration * p.absorbance, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.concentration ** 2, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const intercept = (sumY - slope * sumX) / n;

  const predictedValues = points.map(p => slope * p.concentration + intercept);
  const residuals = points.map((p, i) => p.absorbance - predictedValues[i]);

  const meanY = sumY / n;
  const ssTotal = points.reduce((sum, p) => sum + (p.absorbance - meanY) ** 2, 0);
  const ssResidual = residuals.reduce((sum, r) => sum + r ** 2, 0);
  const rSquared = 1 - ssResidual / ssTotal;

  return {
    slope,
    intercept,
    rSquared,
    predictedValues,
    residuals
  };
}

export function interpolateConcentration(absorbance: number, slope: number, intercept: number): number {
  if (slope === 0) return 0;
  return (absorbance - intercept) / slope;
}
