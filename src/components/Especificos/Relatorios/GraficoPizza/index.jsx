import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "../../../../utils";

export default function GraficoPizza({ titulo, dados }) {
  return (
    <div className="bg-white dark:bg-surface-dark-elevated rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 h-fit">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-base">
        {titulo}
      </h2>

      <div className="w-full h-62.5">
        {dados?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(v) => (
                  <span className="text-gray-700 dark:text-gray-300">{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-surface-dark rounded-lg border border-dashed border-gray-200 dark:border-slate-700">
            <span className="text-sm text-gray-400 dark:text-gray-500">
              Sem dados no período
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
