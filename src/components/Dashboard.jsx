import { useState, useEffect } from "react";
import { fetchAllResponses } from "../lib/supabase";
import { categoryKeys, translations, resultColors, getResultKey } from "../lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useIsMobile } from "../lib/useIsMobile";

const catLabels = translations.en.categories;

export default function Dashboard() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const s = getStyles(isMobile);

  useEffect(() => {
    fetchAllResponses().then((data) => {
      setResponses(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.card}><p style={{ textAlign: "center", color: "#8a7a6a" }}>Loading dashboard...</p></div>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.heading}>📊 Dashboard</h1>
          <p style={{ textAlign: "center", color: "#8a7a6a", marginTop: 20 }}>No responses yet. Share the assessment and data will appear here.</p>
          <a href="/" style={s.link}>← Back to Assessment</a>
        </div>
      </div>
    );
  }

  // ─── Aggregate Stats ───
  const totalResponses = responses.length;
  const avgScore = (responses.reduce((sum, r) => sum + (r.score_pct || 0), 0) / totalResponses * 100).toFixed(1);

  const langBreakdown = responses.reduce((acc, r) => {
    acc[r.language || "en"] = (acc[r.language || "en"] || 0) + 1;
    return acc;
  }, {});

  // Result tier distribution
  const tierCounts = { low: 0, mild: 0, moderate: 0, high: 0, veryHigh: 0 };
  responses.forEach((r) => {
    const key = getResultKey(r.total_score, r.max_score);
    tierCounts[key]++;
  });

  const tierData = [
    { name: "Low", value: tierCounts.low, color: resultColors.low },
    { name: "Mild", value: tierCounts.mild, color: resultColors.mild },
    { name: "Moderate", value: tierCounts.moderate, color: resultColors.moderate },
    { name: "High", value: tierCounts.high, color: resultColors.high },
    { name: "Very High", value: tierCounts.veryHigh, color: resultColors.veryHigh },
  ].filter((d) => d.value > 0);

  // Average category scores
  const catAvgs = {};
  categoryKeys.forEach((key) => { catAvgs[key] = { total: 0, count: 0 }; });
  responses.forEach((r) => {
    if (r.category_scores) {
      Object.entries(r.category_scores).forEach(([key, val]) => {
        if (catAvgs[key]) {
          catAvgs[key].total += val;
          catAvgs[key].count++;
        }
      });
    }
  });

  const catChartData = categoryKeys.map((key) => ({
    name: catLabels[key]?.replace(" & ", "\n& ") || key,
    shortName: catLabels[key]?.split(" ")[0] || key,
    avg: catAvgs[key].count > 0 ? +(catAvgs[key].total / catAvgs[key].count).toFixed(2) : 0,
  }));

  const barColor = (avg) => avg <= 1 ? "#7a9a7e" : avg <= 2 ? "#b8a88a" : avg <= 3 ? "#c4956a" : "#a05040";

  // Responses over time (last 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dailyCounts = {};
  responses.forEach((r) => {
    const d = new Date(r.created_at);
    if (d >= thirtyDaysAgo) {
      const key = d.toISOString().slice(0, 10);
      dailyCounts[key] = (dailyCounts[key] || 0) + 1;
    }
  });
  const timeData = Object.entries(dailyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count }));

  return (
    <div style={s.page}>
      <div style={{ ...s.card, maxWidth: 900 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={s.heading}>📊 Aggregate Dashboard</h1>
          <a href="/" style={s.link}>← Assessment</a>
        </div>

        {/* Summary Cards */}
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <span style={s.statNumber}>{totalResponses}</span>
            <span style={s.statLabel}>Total Responses</span>
          </div>
          <div style={s.statCard}>
            <span style={s.statNumber}>{avgScore}%</span>
            <span style={s.statLabel}>Avg Score</span>
          </div>
          <div style={s.statCard}>
            <span style={s.statNumber}>{langBreakdown.en || 0} / {langBreakdown.zh || 0}</span>
            <span style={s.statLabel}>English / 中文</span>
          </div>
        </div>

        {/* Concern Level Distribution */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Concern Level Distribution</h2>
          <div style={{ width: "100%", height: isMobile ? 220 : 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={tierData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {tierData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Category Scores */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Average Scores by Category</h2>
          <div style={{ width: "100%", height: isMobile ? 300 : 400 }}>
            <ResponsiveContainer>
              <BarChart data={catChartData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede4d8" />
                <XAxis type="number" domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 12, fill: "#8a7a6a" }} />
                <YAxis type="category" dataKey="shortName" width={90} tick={{ fontSize: 11, fill: "#6a5a4a" }} />
                <Tooltip
                  formatter={(val) => [val.toFixed(2) + " / 4", "Avg Score"]}
                  contentStyle={{ borderRadius: 10, border: "1px solid #d4c4b0", fontFamily: "system-ui, sans-serif", fontSize: 13 }}
                />
                <Bar dataKey="avg" radius={[0, 6, 6, 0]} barSize={20}>
                  {catChartData.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.avg)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Responses Over Time */}
        {timeData.length > 1 && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Responses Over Time (Last 30 Days)</h2>
            <div style={{ width: "100%", height: isMobile ? 200 : 250 }}>
              <ResponsiveContainer>
                <BarChart data={timeData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede4d8" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8a7a6a" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#8a7a6a" }} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #d4c4b0", fontFamily: "system-ui, sans-serif", fontSize: 13 }} />
                  <Bar dataKey="count" fill="#b8907a" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Responses Table */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Recent Responses</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Lang</th>
                  <th style={s.th}>Score</th>
                  <th style={s.th}>Level</th>
                  <th style={s.th}>Top Concern</th>
                </tr>
              </thead>
              <tbody>
                {responses.slice(0, 20).map((r, i) => {
                  const rKey = getResultKey(r.total_score, r.max_score);
                  const rLabel = translations.en.results[rKey]?.level || rKey;
                  let topCat = "—";
                  if (r.category_scores) {
                    const sorted = Object.entries(r.category_scores).sort((a, b) => b[1] - a[1]);
                    if (sorted.length > 0) topCat = catLabels[sorted[0][0]] || sorted[0][0];
                  }
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #ede4d8" }}>
                      <td style={s.td}>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td style={s.td}>{r.language === "zh" ? "中文" : "EN"}</td>
                      <td style={s.td}>{r.total_score}/{r.max_score} ({(r.score_pct * 100).toFixed(0)}%)</td>
                      <td style={s.td}><span style={{ ...s.badge, backgroundColor: resultColors[rKey] + "20", color: resultColors[rKey] }}>{rLabel}</span></td>
                      <td style={s.td}>{topCat}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStyles(mobile) {
  return {
    page: { minHeight: "100vh", background: "linear-gradient(160deg, #f5efe8 0%, #ede4d8 40%, #e8ddd0 100%)", display: "flex", justifyContent: "center", padding: mobile ? "16px 8px" : "32px 24px", fontFamily: "'Lora', Georgia, serif" },
    card: { maxWidth: 900, width: "100%", background: "#fffcf8", borderRadius: 20, padding: mobile ? "24px 16px" : "40px 36px", boxShadow: "0 8px 40px rgba(120, 90, 60, 0.08)" },
    heading: { fontSize: mobile ? 20 : 26, fontWeight: 600, color: "#5a4a3a", margin: 0 },
    link: { fontSize: 14, color: "#8b6b4e", textDecoration: "none", fontFamily: "system-ui, sans-serif" },
    statsRow: { display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" },
    statCard: { flex: "1 1 150px", background: "#faf5ee", borderRadius: 14, padding: "20px 24px", textAlign: "center", display: "flex", flexDirection: "column", gap: 6 },
    statNumber: { fontSize: mobile ? 22 : 28, fontWeight: 600, color: "#5a4a3a" },
    statLabel: { fontSize: 13, color: "#8a7a6a", fontFamily: "system-ui, sans-serif" },
    section: { marginBottom: 36 },
    sectionTitle: { fontSize: 18, fontWeight: 500, color: "#5a4a3a", marginBottom: 16 },
    table: { width: "100%", borderCollapse: "collapse", fontFamily: "system-ui, sans-serif", fontSize: 13 },
    th: { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #d4c4b0", color: "#6a5a4a", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" },
    td: { padding: "10px 12px", color: "#5a4a3a" },
    badge: { padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600 },
  };
}
