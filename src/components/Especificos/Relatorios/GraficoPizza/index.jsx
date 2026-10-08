import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { formatCurrency } from "../../../../utils";

export default function GraficoPizza({ titulo, dados }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
      <h2 className="font-semibold text-gray-800 mb-4 text-base">{titulo}</h2>

      <div className="w-full h-62.5">
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
