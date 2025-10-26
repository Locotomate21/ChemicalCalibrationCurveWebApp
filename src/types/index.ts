// 🔹 Puntos de calibración con ID
export interface CalibrationPoint {
  id: string;
  concentration: number;
  absorbance: number;
}

// 🔹 Puntos de entrada para cálculo (sin ID)
export interface DataPoint {
  concentration: number;
  signal: number;
}

// 🔹 Resultado de regresión lineal
export interface RegressionResults {
  slope: number;        // pendiente (m)
  intercept: number;    // intersección con eje Y (b)
  rSquared: number;     // coeficiente de determinación R²
  predictedValues?: number[];
  residuals?: number[];
}

// 🔹 Resultado simplificado de calibración
export interface CalibrationResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

// 🔹 Datos de molécula (para MoleculeInfo)
export interface MoleculeData {
  cid: number;              // ID PubChem
  molecularFormula: string; // Fórmula química
  molecularWeight: number;  // Peso molecular
  iupacName: string;        // Nombre IUPAC
  atomCount: number;        // Cantidad de átomos
  sdf?: string;             // Datos 3D opcionales
}

// 🔹 Curva completa (molécula + puntos + regresión)
export interface CalibrationCurve {
  points: CalibrationPoint[];
  regression: RegressionResults;
  molecule: MoleculeData;
}
