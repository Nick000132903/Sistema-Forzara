import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../../../utils";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-surface-dark-elevated p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 text-xs">
      <p className="font-medium text-gray-800 dark:text-gray-100 mb-1">
        {label}
      </p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color }}>
          {e.name}: {formatCurrency(e.value)}
        </p>
      ))}
    </div>
  );
};

export default function GraficoComposicao({ dados }) {
  if (!dados?.length) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-surface-dark rounded-lg border border-dashed border-gray-200 dark:border-slate-700">
        <span className="text-sm text-gray-400 dark:text-gray-500">
          Nenhuma movimentação no período
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            className="dark:opacity-20"
          />
          <XAxis
            dataKey="mesLabel"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            className="dark:[&_text]:fill-gray-400"
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            className="dark:[&_text]:fill-gray-400"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar
            dataKey="entradas"
            name="Entradas"
            stackId="a"
            fill="#10B981"
            radius={[0, 0, 0, 0]}
          />
          <Bar dataKey="saidas" name="Saídas" stackId="a" fill="#EF4444" />
          <Bar dataKey="perdas" name="Perdas" stackId="a" fill="#F59E0B" />
          <Bar
            dataKey="ajustes"
            name="Ajustes"
            stackId="a"
            fill="#8B5CF6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
