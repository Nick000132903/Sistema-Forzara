import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../../../utils";

export default function GraficoBarras({ titulo, dados, cor }) {
  return (
    <div className="bg-white dark:bg-surface-dark-elevated rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-base">
        {titulo}
      </h2>

      <div className="w-full h-70">
        {dados?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dados}
              margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
                className="dark:opacity-20"
              />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                className="dark:[&_text]:fill-gray-400"
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                className="dark:[&_text]:fill-gray-400"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  fontSize: "12px",
                }}
                cursor={{ fill: "rgba(139, 92, 246, 0.06)" }}
              />
              <Bar
                dataKey="valor"
                fill={cor}
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#0B071E] rounded-lg border border-dashed border-gray-200 dark:border-slate-700">
            <span className="text-sm text-gray-400 dark:text-gray-500">
              Sem dados no período
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
