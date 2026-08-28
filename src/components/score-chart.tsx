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
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="test"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-subtle)", fontSize: 13 }}
          />
          <YAxis
            domain={[0, 40]}
            ticks={[0, 10, 20, 30, 40]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-subtle)", fontSize: 13 }}
          />
          <Tooltip
            cursor={{ stroke: "#a7c7b0", strokeDasharray: "4 4" }}
            contentStyle={{
              border: "1px solid var(--border)",
              borderRadius: "10px",
              background: "var(--surface)",
              color: "var(--foreground)",
              boxShadow: "0 8px 24px rgba(23,32,26,.08)",
            }}
            formatter={(value) => [`${value} / 40`, "Score"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--primary)"
            strokeWidth={3}
            dot={{ fill: "#fff", stroke: "var(--primary)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "var(--primary)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
