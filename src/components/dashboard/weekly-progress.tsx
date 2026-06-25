"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Lun", value: 20 },
  { name: "Mar", value: 50 },
  { name: "Miy", value: 45 },
  { name: "Huw", value: 65 },
  { name: "Biy", value: 85 },
  { name: "Sab", value: 75 },
  { name: "Lin", value: 95 },
];

export default function WeeklyProgress() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Progress mo ngayong linggo</h2>
        <div className="bg-[#6C63FF]/10 text-[#6C63FF] text-xs font-bold px-2 py-1 rounded-lg">
          75% Avg
        </div>
      </div>

      <div className="flex-1 w-full h-[200px] min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                borderRadius: "12px",
                border: "none",
                color: "#fff",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#fff" }}
              cursor={{ stroke: "#E5E7EB", strokeWidth: 2, strokeDasharray: "3 3" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6C63FF"
              strokeWidth={4}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#6C63FF" }}
              activeDot={{ r: 6, fill: "#6C63FF", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
