import { useState } from "react";
import { saveResponse } from "./lib/supabase";
import {
  questionsData, freqColors, resultColors,
  getResultKey, getCategoryScores, translations,
} from "./lib/data";

export default function App() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fadeIn, setFadeIn] = useState(true);
  const [expandedCat, setExpandedCat] = useState(null);
  const [saved, setSaved] = useState(false);

  const t = translations[lang];
  const toggleLang = () => setLang(lang === "en" ? "zh" : "en");

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questionsData[currentQ].id]: value };
    setAnswers(newAnswers);
    setFadeIn(false);
    setTimeout(() => {
      if (currentQ < questionsData.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        // Save to Supabase
        const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0);
        const maxScore = questionsData.length * 4;
        const categoryScores = getCategoryScores(newAnswers);
        saveResponse({ language: lang, answers: newAnswers, totalScore, maxScore, categoryScores })
          .then(() => setSaved(true))
          .catch(() => setSaved(true)); // still show results
        setScreen("results");
      }
      setFadeIn(true);
    }, 280);
  };

  const goBack = () => {
    if (currentQ > 0) {
      setFadeIn(false);
      setTimeout(() => { setCurrentQ(currentQ - 1); setFadeIn(true); }, 280);
    }
  };

  const restart = () => {
    setScreen("welcome");
    setCurrentQ(0);
    setAnswers({});
    setExpandedCat(null);
    setSaved(false);
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = questionsData.length * 4;
  const resultKey = getResultKey(totalScore, maxScore);
  const result = t.results[resultKey];
  const resultColor = resultColors[resultKey];

  const breakdown = (() => {
    const cats = {};
    const catOrder = [];
    questionsData.forEach((q) => {
      if (!cats[q.catKey]) { cats[q.catKey] = { total: 0, count: 0 }; catOrder.push(q.catKey); }
      if (answers[q.id] !== undefined) { cats[q.catKey].total += answers[q.id]; cats[q.catKey].count++; }
    });
    return catOrder.map((key) => ({
      key, name: t.categories[key], explain: t.categoryExplain[key],
      avg: cats[key].count > 0 ? cats[key].total / cats[key].count : 0,
    }));
  })();

  const barColor = (avg) => avg <= 1 ? "#7a9a7e" : avg <= 2 ? "#b8a88a" : avg <= 3 ? "#c4956a" : "#a05040";
  const progress = (currentQ / questionsData.length) * 100;

  // ─── WELCOME ───
  if (screen === "welcome") {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <button style={s.langBtn} onClick={toggleLang}>{t.langSwitch}</button>
          <div style={s.logoMark}>{t.logoMark}</div>
          <h1 style={s.title}>{t.title}</h1>
          <p style={s.subtitle}>{t.subtitle}</p>
          <div style={s.divider} />
          <p style={s.bodyText} dangerouslySetInnerHTML={{ __html: t.intro1 }} />
          <p style={s.bodyText} dangerouslySetInnerHTML={{ __html: t.intro2 }} />
          <p style={s.note}>{t.timeNote}</p>
          <button style={s.primaryBtn} onClick={() => setScreen("assessment")}>{t.startBtn}</button>
          <p style={s.safetyNote}>{t.safetyNote} <strong>{t.safetyPhone}</strong></p>
        </div>
      </div>
    );
  }

  // ─── ASSESSMENT ───
  if (screen === "assessment") {
    const q = questionsData[currentQ];
    return (
      <div style={s.page}>
        <div style={s.card}>
          <button style={s.langBtn} onClick={toggleLang}>{t.langSwitch}</button>
          <div style={s.progressRow}>
            <div style={s.progressTrack}>
              <div style={{ ...s.progressFill, width: `${progress}%` }} />
            </div>
            <span style={s.progressLabel}>{currentQ + 1} {t.of} {questionsData.length}</span>
          </div>
          <div style={{
            ...s.questionArea,
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.28s ease",
          }}>
            <span style={s.categoryTag}>{t.categories[q.catKey]}</span>
            <h2 style={s.questionText}>{lang === "en" ? q.en : q.zh}</h2>
            <div style={s.options}>
              {t.freq.map((label, i) => {
                const selected = answers[q.id] === i;
                return (
                  <button key={i} onClick={() => handleAnswer(i)}
                    style={{
                      ...s.optionBtn,
                      ...(selected ? { backgroundColor: freqColors[i] + "20", borderColor: freqColors[i], color: freqColors[i] } : {}),
                    }}
                    onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = freqColors[i]; e.currentTarget.style.backgroundColor = freqColors[i] + "10"; } }}
                    onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = "#d9cfc4"; e.currentTarget.style.backgroundColor = "transparent"; } }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={s.navRow}>
            <button style={{ ...s.backBtn, opacity: currentQ === 0 ? 0.3 : 1 }} onClick={goBack} disabled={currentQ === 0}>{t.backBtn}</button>
            <p style={s.privacyNote}>{t.privacyNote}</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS ───
  return (
    <div style={s.page}>
      <div style={{ ...s.card, maxWidth: 640 }}>
        <button style={s.langBtn} onClick={toggleLang}>{t.langSwitch}</button>
        <h1 style={{ ...s.title, marginBottom: 8 }}>{t.resultsTitle}</h1>
        <div style={s.divider} />

        <div style={{ padding: "24px 28px", borderRadius: 14, margin: "24px 0", backgroundColor: resultColor + "18", borderLeft: `4px solid ${resultColor}` }}>
          <span style={{ fontSize: 12, fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, color: resultColor }}>{result.level}</span>
          <h2 style={{ fontSize: 20, color: "#4a3a2e", margin: "10px 0 12px", fontWeight: 500 }}>{result.heading}</h2>
          <p style={{ fontSize: 15, color: "#5a4a3a", lineHeight: 1.7 }}>{result.message}</p>
        </div>

        <div style={{ background: "#faf5ee", borderRadius: 14, padding: "20px 24px", margin: "16px 0 32px" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#8b6b4e", marginBottom: 8 }}>{t.suggestLabel}</p>
          <p style={{ fontSize: 14, color: "#6a5a4a", lineHeight: 1.7 }}>{result.suggestion}</p>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 500, color: "#5a4a3a", marginBottom: 6 }}>{t.breakdownTitle}</h3>
        <p style={{ fontSize: 13, color: "#a09080", marginBottom: 18, fontFamily: "system-ui, sans-serif" }}>{t.breakdownExplain}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {breakdown.map((cat) => (
            <div key={cat.key} style={{ cursor: "pointer" }} onClick={() => setExpandedCat(expandedCat === cat.key ? null : cat.key)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#6a5a4a", fontFamily: "system-ui, sans-serif" }}>
                  {cat.name} <span style={{ fontSize: 11, color: "#b8a898" }}>▾</span>
                </span>
                <span style={{ fontSize: 12, color: "#a09080", fontFamily: "system-ui, sans-serif" }}>{cat.avg.toFixed(1)} / 4</span>
              </div>
              <div style={{ height: 8, background: "#ede4d8", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 4, width: `${(cat.avg / 4) * 100}%`, backgroundColor: barColor(cat.avg), transition: "width 0.6s ease" }} />
              </div>
              {expandedCat === cat.key && (
                <p style={{ fontSize: 13, color: "#7a6a5a", lineHeight: 1.6, marginTop: 8, padding: "10px 14px", background: "#f8f2ea", borderRadius: 10 }}>{cat.explain}</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: "#f5efe8", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: "#8a7a6a", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: t.disclaimer }} />
        </div>

        <button style={s.outlineBtn} onClick={restart}>{t.restartBtn}</button>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "linear-gradient(160deg, #f5efe8 0%, #ede4d8 40%, #e8ddd0 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Lora', Georgia, serif" },
  card: { position: "relative", maxWidth: 580, width: "100%", background: "#fffcf8", borderRadius: 20, padding: "48px 40px", boxShadow: "0 8px 40px rgba(120, 90, 60, 0.08)" },
  langBtn: { position: "absolute", top: 16, right: 20, background: "none", border: "1.5px solid #d4c4b0", borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#8a7a6a", fontFamily: "system-ui, sans-serif", cursor: "pointer" },
  logoMark: { fontSize: 40, textAlign: "center", color: "#b8907a", marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 600, color: "#5a4a3a", textAlign: "center", marginBottom: 8, letterSpacing: "-0.3px" },
  subtitle: { fontSize: 16, color: "#8a7a6a", textAlign: "center", fontStyle: "italic", marginBottom: 24 },
  divider: { width: 60, height: 2, background: "#d4c4b0", margin: "0 auto 24px", borderRadius: 1 },
  bodyText: { fontSize: 15, lineHeight: 1.7, color: "#6a5a4a", marginBottom: 16, textAlign: "left" },
  note: { fontSize: 14, color: "#8a7a6a", textAlign: "center", margin: "20px 0 28px" },
  primaryBtn: { display: "block", margin: "0 auto 24px", background: "#8b6b4e", color: "#fff", border: "none", borderRadius: 12, padding: "16px 40px", fontSize: 16, fontFamily: "'Lora', Georgia, serif", cursor: "pointer", boxShadow: "0 3px 12px rgba(139, 107, 78, 0.2)" },
  safetyNote: { fontSize: 12, color: "#a0907e", lineHeight: 1.6, textAlign: "center" },
  progressRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 32 },
  progressTrack: { flex: 1, height: 6, background: "#ede4d8", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: "#b8907a", borderRadius: 3, transition: "width 0.4s ease" },
  progressLabel: { fontSize: 13, color: "#a09080", fontFamily: "system-ui, sans-serif", minWidth: 50, textAlign: "right" },
  questionArea: { minHeight: 300 },
  categoryTag: { display: "inline-block", fontSize: 11, fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "1.2px", color: "#a09080", background: "#f0e8dd", padding: "5px 12px", borderRadius: 20, marginBottom: 20 },
  questionText: { fontSize: 20, fontWeight: 500, color: "#4a3a2e", lineHeight: 1.5, marginBottom: 32 },
  options: { display: "flex", flexDirection: "column", gap: 10 },
  optionBtn: { display: "block", width: "100%", padding: "14px 20px", fontSize: 15, fontFamily: "'Lora', Georgia, serif", color: "#5a4a3a", background: "transparent", border: "1.5px solid #d9cfc4", borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all 0.15s ease" },
  navRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 },
  backBtn: { background: "none", border: "none", color: "#a09080", fontSize: 14, fontFamily: "'Lora', Georgia, serif", cursor: "pointer", padding: "8px 0" },
  privacyNote: { fontSize: 12, color: "#b8a898", fontStyle: "italic", margin: 0 },
  outlineBtn: { display: "block", margin: "0 auto", background: "transparent", color: "#8b6b4e", border: "1.5px solid #8b6b4e", borderRadius: 12, padding: "12px 32px", fontSize: 15, fontFamily: "'Lora', Georgia, serif", cursor: "pointer" },
};
