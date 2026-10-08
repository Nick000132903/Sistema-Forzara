import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatCurrency } from "../../../../utils";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#181330] p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function GraficoMovimentacoes({ dados }) {
  if (!dados || dados.length === 0) {
    return (
      <div className="w-full h-87.5 flex items-center justify-center bg-gray-50 dark:bg-[#0B071E] rounded-lg border border-dashed border-gray-200 dark:border-slate-700">
        <span className="text-sm text-gray-400 dark:text-gray-500">
          Nenhum dado disponível
        </span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={440}>
      <LineChart data={dados}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#E5E7EB"
          className="dark:opacity-20"
        />
        <XAxis
          dataKey="mes_abreviado"
          tick={{ fontSize: 12, fill: "#6B7280" }}
          className="dark:[&_text]:fill-gray-400"
          axisLine={{ stroke: "#E5E7EB" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
          tick={{ fontSize: 12, fill: "#6B7280" }}
          className="dark:[&_text]:fill-gray-400"
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "13px" }}
          formatter={(value) => (
            <span className="text-gray-700 dark:text-gray-300">{value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="faturamento"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Faturamento"
        />
        <Line
          type="monotone"
          dataKey="cmv"
          stroke="#F59E0B"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="CMV"
        />
        <Line
          type="monotone"
          dataKey="lucro_bruto"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Lucro Bruto"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}