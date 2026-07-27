"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ScoreChart({
  scores,
  compact = false,
}: {
  scores: number[];
  compact?: boolean;
}) {
  const data = scores.map((score, index) => ({
    test: compact ? `${index + 1}` : `Test ${index + 1}`,
    score,
  }));

  return (
    <div className={compact ? "h-44" : "h-72"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 12, bottom: 0, left: -20 }}
        >
          <CartesianGrid stroke="#e8ede9" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="test"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#718078", fontSize: 12 }}
          />
          <YAxis
            domain={[20, 40]}
            ticks={[20, 25, 30, 35, 40]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#718078", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ stroke: "#a7c7b0", strokeDasharray: "4 4" }}
            contentStyle={{
              border: "1px solid #dfe5e0",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(23,32,26,.08)",
            }}
            formatter={(value) => [`${value} / 40`, "Score"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#176b3a"
            strokeWidth={3}
            dot={{ fill: "#fff", stroke: "#176b3a", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#176b3a" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
