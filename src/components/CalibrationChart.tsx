  import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { CalibrationPoint, RegressionResults } from '../types';

interface CalibrationChartProps {
  points: CalibrationPoint[];
  regression: RegressionResults | null;
}

export default function CalibrationChart({ points, regression }: CalibrationChartProps) {
  if (points.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex items-center justify-center">
        <div className="text-center text-slate-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Agrega puntos para ver la curva de calibración</p>
        </div>
      </div>
    );
  }

  const chartData = regression
    ? points.map((point) => ({
        concentration: point.concentration,
        absorbance: point.absorbance,
        predicted: regression.slope * point.concentration + regression.intercept,
      }))
    : [];

  const maxConc = Math.max(...points.map((p) => p.concentration));
  const lineData =
    regression !== null
      ? [
          { concentration: 0, predicted: regression.intercept },
          { concentration: maxConc, predicted: regression.slope * maxConc + regression.intercept },
        ]
      : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Curva de Calibración</h2>

        {regression && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                <p className="text-xs font-medium text-blue-600 mb-0.5">Pendiente (m)</p>
                <p className="text-sm font-bold text-slate-800">{regression.slope.toFixed(4)}</p>
              </div>

              <div className="bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
                <p className="text-xs font-medium text-emerald-600 mb-0.5">Intercepto (b)</p>
                <p className="text-sm font-bold text-slate-800">{regression.intercept.toFixed(4)}</p>
              </div>

              <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                <p className="text-xs font-medium text-amber-600 mb-0.5">R²</p>
                <p className="text-sm font-bold text-slate-800">{regression.rSquared.toFixed(4)}</p>
              </div>
            </div>

            <div className="mt-3 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <p className="text-xs font-medium text-slate-600">Ecuación de la Recta</p>
              <p className="text-sm font-mono font-semibold text-slate-800 mt-1">
                y = {regression.slope.toFixed(4)}x + {regression.intercept.toFixed(4)}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex-1" style={{ minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="concentration"
              name="Concentración"
              label={{ value: 'Concentración', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
              stroke="#64748b"
            />
            <YAxis
              type="number"
              dataKey="absorbance"
              name="Absorbancia"
              label={{ value: 'Absorbancia', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              stroke="#64748b"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ fontWeight: 600, color: '#334155' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            <Scatter name="Puntos Experimentales" data={chartData} fill="#3b82f6" shape="circle" r={6} />
            {regression && (
              <Line
                data={lineData}
                type="monotone"
                dataKey="predicted"
                stroke="#10b981"
                strokeWidth={2}
                name="Línea de Regresión"
                dot={false}
              />
            )}
            <ReferenceLine y={0} stroke="#94a3b8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
