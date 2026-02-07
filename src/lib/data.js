export const questionsData = [
  { id:1, catKey:"gaslighting", en:"Does your partner deny things they said or did, making you question your own memory?", zh:"你的伴侣是否否认自己说过的话或做过的事，让你怀疑自己的记忆？" },
  { id:2, catKey:"gaslighting", en:"Do you find yourself constantly second-guessing your own feelings or perceptions?", zh:"你是否经常怀疑自己的感受或判断是否正确？" },
  { id:3, catKey:"lovebombing", en:"Did the relationship start with overwhelming affection, gifts, or attention that felt almost too good to be true?", zh:"这段关系开始时，是否有过铺天盖地的热情、礼物或关注，好到让你觉得不太真实？" },
  { id:4, catKey:"lovebombing", en:"Does your partner alternate between making you feel incredibly special and then putting you down or withdrawing?", zh:"你的伴侣是否在让你感觉自己很特别和贬低你、冷落你之间反复交替？" },
  { id:5, catKey:"emotional", en:"Does your partner use the silent treatment or emotional withdrawal as punishment when you disagree?", zh:"当你们意见不合时，你的伴侣是否会用冷暴力或情感冷落来惩罚你？" },
  { id:6, catKey:"emotional", en:"Do you feel like you're constantly walking on eggshells to avoid upsetting your partner?", zh:"你是否觉得自己一直如履薄冰，生怕惹伴侣不高兴？" },
  { id:7, catKey:"blame", en:"Does your partner refuse to take responsibility for their actions and instead blame you or others?", zh:"你的伴侣是否拒绝为自己的行为负责，反而把责任推给你或别人？" },
  { id:8, catKey:"blame", en:"When you bring up a concern, does your partner turn it around so you end up apologizing instead?", zh:"当你提出一个问题时，你的伴侣是否会反过来让你最终道歉？" },
  { id:9, catKey:"isolation", en:"Has your partner discouraged or made it difficult for you to spend time with friends or family?", zh:"你的伴侣是否阻止或增加你与朋友和家人相处的难度？" },
  { id:10, catKey:"isolation", en:"Do you feel like your world has become smaller since being in this relationship?", zh:"自从在这段关系中，你是否觉得自己的世界变小了？" },
  { id:11, catKey:"empathy", en:"Does your partner dismiss or minimize your feelings when you're hurt or upset?", zh:"当你受伤或难过时，你的伴侣是否会忽视或轻视你的感受？" },
  { id:12, catKey:"empathy", en:"Do you feel like your partner is unable or unwilling to see things from your perspective?", zh:"你是否觉得伴侣无法或不愿意从你的角度看问题？" },
  { id:13, catKey:"control", en:"Does your partner frequently criticize you — your appearance, choices, intelligence, or abilities?", zh:"你的伴侣是否经常批评你——你的外貌、选择、智力或能力？" },
  { id:14, catKey:"control", en:"Does your partner need to have the final say in most decisions, big or small?", zh:"在大多数决定上，无论大小，你的伴侣是否都要拥有最终决定权？" },
  { id:15, catKey:"persona", en:"Does your partner act charming and kind in public but behave very differently with you in private?", zh:"你的伴侣在公众场合是否表现得很有魅力和善良，但私下里对你的态度却截然不同？" },
  { id:16, catKey:"persona", en:"Would friends or family be surprised if they knew how your partner treats you behind closed doors?", zh:"如果朋友或家人知道你的伴侣在私下里如何对你，他们会感到惊讶吗？" },
  { id:17, catKey:"selfworth", en:"Do you feel like you've lost touch with who you are or what you want since being in this relationship?", zh:"自从在这段关系中，你是否觉得自己已经忘了自己是谁、想要什么？" },
  { id:18, catKey:"selfworth", en:"Do you often feel like nothing you do is ever good enough for your partner?", zh:"你是否经常觉得无论怎么做都无法让伴侣满意？" },
  { id:19, catKey:"boundaries", en:"Does your partner disregard your boundaries — emotional, physical, or personal?", zh:"你的伴侣是否无视你的边界——无论是情感上的、身体上的还是个人的？" },
  { id:20, catKey:"boundaries", en:"Does your partner monitor your phone, social media, or whereabouts in a way that feels controlling?", zh:"你的伴侣是否以一种让你觉得被控制的方式监视你的手机、社交媒体或行踪？" },
  { id:21, catKey:"trauma", en:"After a hurtful episode, does your partner become extremely loving and remorseful, making it hard to stay upset?", zh:"在一次伤害事件后，你的伴侣是否会变得极其温柔和悔恨，让你很难继续生气？" },
  { id:22, catKey:"trauma", en:"Do you find yourself making excuses for your partner's behavior to yourself or others?", zh:"你是否发现自己在为伴侣的行为向自己或他人找借口？" },
];

export const freqColors = ["#7a9a7e", "#b8a88a", "#c4956a", "#b87355", "#a05040"];

export const resultColors = {
  low: "#7a9a7e",
  mild: "#b8a88a",
  moderate: "#c4956a",
  high: "#b87355",
  veryHigh: "#a05040",
};

export const categoryKeys = [
  "gaslighting", "lovebombing", "emotional", "blame", "isolation",
  "empathy", "control", "persona", "selfworth", "boundaries", "trauma",
];

export function getResultKey(score, maxScore) {
  const pct = score / maxScore;
  if (pct <= 0.2) return "low";
  if (pct <= 0.4) return "mild";
  if (pct <= 0.6) return "moderate";
  if (pct <= 0.8) return "high";
  return "veryHigh";
}

export function getCategoryScores(answers) {
  const cats = {};
  questionsData.forEach((q) => {
    if (!cats[q.catKey]) cats[q.catKey] = { total: 0, count: 0 };
    if (answers[q.id] !== undefined) {
      cats[q.catKey].total += answers[q.id];
      cats[q.catKey].count++;
    }
  });
  const result = {};
  Object.entries(cats).forEach(([key, d]) => {
    result[key] = d.count > 0 ? +(d.total / d.count).toFixed(2) : 0;
  });
  return result;
}

export const translations = {
  en: {
    logoMark: "♡",
    title: "OneStep",
    subtitle: "One step toward clarity. One step toward you.",
    intro1: "This assessment is designed to help you recognize behavioral patterns in your relationship. There are no right or wrong answers — only your truth. Your responses are completely private and anonymous.",
    intro2: "This is <strong>not</strong> a diagnostic tool. It's a gentle guide to help you trust your own experience and understand what you may be going through.",
    timeNote: "🕐 Takes about 5 minutes · 22 questions",
    startBtn: "Begin When You're Ready",
    safetyNote: "If you are in immediate danger, please call 911 or the National Domestic Violence Hotline:",
    safetyPhone: "1-800-799-7233",
    backBtn: "← Back",
    privacyNote: "Your answers are anonymous and private.",
    resultsTitle: "Your Reflection Summary",
    suggestLabel: "💛 What We'd Suggest",
    breakdownTitle: "Pattern Breakdown",
    breakdownExplain: "Each category is scored 0–4 based on frequency. Tap any category for more details.",
    disclaimer: "<strong>Important:</strong> This assessment is for personal reflection only. It is not a clinical diagnosis and should not replace professional guidance. If you recognized yourself in many of these questions, please consider speaking with a licensed therapist who understands narcissistic abuse dynamics.",
    restartBtn: "Start Over",
    langSwitch: "中文",
    of: "of",
    freq: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    categories: {
      gaslighting: "Gaslighting & Reality Distortion",
      lovebombing: "Love Bombing & Devaluation",
      emotional: "Emotional Control",
      blame: "Blame & Accountability",
      isolation: "Isolation",
      empathy: "Empathy & Emotional Support",
      control: "Control & Criticism",
      persona: "Public vs. Private Persona",
      selfworth: "Self-Worth & Identity",
      boundaries: "Boundaries & Respect",
      trauma: "Trauma Bonding",
    },
    categoryExplain: {
      gaslighting: "This measures how often your reality is being denied or distorted, leading you to question your own memory and perception.",
      lovebombing: "This captures the cycle of being idealized then devalued — intense affection followed by coldness or criticism.",
      emotional: "This reflects how much your emotions and reactions are being controlled through punishment like the silent treatment.",
      blame: "This measures how often responsibility is shifted to you, even when you're the one who was hurt.",
      isolation: "This captures whether your social world has been shrinking, leaving you more dependent on your partner.",
      empathy: "This reflects whether your feelings are being heard and validated, or dismissed and minimized.",
      control: "This measures persistent criticism and the need to dominate decision-making in the relationship.",
      persona: "This captures the gap between how your partner behaves in public versus in private with you.",
      selfworth: "This reflects whether the relationship has eroded your sense of identity and self-confidence over time.",
      boundaries: "This measures whether your personal boundaries — emotional, physical, digital — are being respected.",
      trauma: "This captures the cycle of hurt followed by intense reconciliation that makes it hard to leave.",
    },
    results: {
      low: {
        level: "Low Concern",
        heading: "Your relationship shows mostly healthy patterns.",
        message: "Based on your responses, the behaviors you've described don't strongly align with patterns of narcissistic abuse. Every relationship has its challenges, and it's wonderful that you're being thoughtful about yours.",
        suggestion: "If you're feeling unsettled despite these results, consider talking to a therapist or counselor. Your feelings are valid regardless of any score.",
      },
      mild: {
        level: "Mild Concern",
        heading: "Some patterns are worth paying attention to.",
        message: "Your responses suggest some behaviors that could indicate unhealthy dynamics. While these may not point to narcissistic abuse specifically, they're worth exploring — especially if they're making you feel anxious or confused.",
        suggestion: "Consider starting a journal to track moments that feel off. Speaking with a therapist who understands relationship dynamics could also be really helpful.",
      },
      moderate: {
        level: "Moderate Concern",
        heading: "You may be experiencing emotionally harmful patterns.",
        message: "Your responses indicate behaviors consistent with emotional abuse and narcissistic relationship dynamics. The self-doubt, the walking on eggshells — these are not your fault. You deserve to feel safe and valued.",
        suggestion: "We gently encourage you to reach out to a mental health professional who specializes in narcissistic abuse. You are not alone in this.",
      },
      high: {
        level: "High Concern",
        heading: "The patterns you're describing are serious.",
        message: "Your responses strongly align with patterns of narcissistic abuse — gaslighting, isolation, emotional control, blame-shifting. This is not your fault. What you're experiencing is real.",
        suggestion: "Please consider reaching out to a professional. The National Domestic Violence Hotline (1-800-799-7233) is available 24/7 and can help you confidentially.",
      },
      veryHigh: {
        level: "Very High Concern",
        heading: "Your safety and well-being matter deeply.",
        message: "Your responses indicate pervasive patterns of narcissistic abuse across nearly every area. What you're going through is real, serious, and not your fault. You deserve so much more than this.",
        suggestion: "Please reach out for support. The National Domestic Violence Hotline (1-800-799-7233) offers confidential guidance 24/7. You don't have to figure this out alone.",
      },
    },
  },
  zh: {
    logoMark: "♡",
    title: "OneStep",
    subtitle: "迈出一步，看清关系；迈出一步，找回自己。",
    intro1: "这份评估旨在帮助你识别亲密关系中的行为模式。没有对错之分——只有你的真实感受。你的回答完全匿名和私密。",
    intro2: "这<strong>不是</strong>一个诊断工具。它只是一个温柔的指引，帮助你相信自己的感受，理解你可能正在经历的一切。",
    timeNote: "🕐 大约需要5分钟 · 共22个问题",
    startBtn: "准备好了，开始吧",
    safetyNote: "如果你正处于危险中，请立即拨打报警电话或全国妇女维权热线：",
    safetyPhone: "12338",
    backBtn: "← 返回",
    privacyNote: "你的回答完全匿名和保密。",
    resultsTitle: "你的觉察报告",
    suggestLabel: "💛 我们的建议",
    breakdownTitle: "各维度分析",
    breakdownExplain: "每个维度按频率评分0-4分。点击任意维度查看详细说明。",
    disclaimer: "<strong>重要提示：</strong>本评估仅供个人反思使用，不构成临床诊断，也不能替代专业指导。如果你在很多问题中看到了自己的影子，请考虑寻求专业心理咨询师的帮助。",
    restartBtn: "重新开始",
    langSwitch: "English",
    of: "/",
    freq: ["从不", "很少", "有时", "经常", "总是"],
    categories: {
      gaslighting: "煤气灯操纵与现实扭曲",
      lovebombing: "爱情轰炸与贬低",
      emotional: "情绪控制",
      blame: "推卸责任",
      isolation: "社交隔离",
      empathy: "共情与情感支持",
      control: "控制与批评",
      persona: "公众形象与私下面目",
      selfworth: "自我价值与身份认同",
      boundaries: "边界与尊重",
      trauma: "创伤性依恋",
    },
    categoryExplain: {
      gaslighting: "衡量你的现实感被否定或扭曲的程度，导致你怀疑自己的记忆和判断。",
      lovebombing: "捕捉被过度理想化然后被贬低的循环——从炽热的关注到冷漠或批评。",
      emotional: "反映你的情绪和反应被控制的程度，比如通过冷暴力来惩罚你。",
      blame: "衡量责任被转嫁给你的频率，即使你才是受伤的那个人。",
      isolation: "捕捉你的社交圈是否在缩小，让你越来越依赖伴侣。",
      empathy: "反映你的感受是否被倾听和认可，还是被忽视和轻视。",
      control: "衡量持续的批评以及在关系中主导所有决定的需要。",
      persona: "捕捉伴侣在公众场合和私下与你相处时的行为差距。",
      selfworth: "反映这段关系是否逐渐侵蚀了你的身份认同感和自信心。",
      boundaries: "衡量你的个人边界——情感上、身体上、数字上——是否被尊重。",
      trauma: "捕捉受伤后紧接着强烈和好的循环，这使得离开变得困难。",
    },
    results: {
      low: {
        level: "低度关注",
        heading: "你的关系总体呈现健康模式。",
        message: "根据你的回答，你描述的行为模式与自恋型虐待的特征并不太吻合。每段关系都有挑战，你能如此用心地审视自己的关系，这很棒。",
        suggestion: "即使结果显示低度关注，如果你仍感到不安，可以考虑与心理咨询师交流。无论分数如何，你的感受都是有效的。",
      },
      mild: {
        level: "轻度关注",
        heading: "有些模式值得留意。",
        message: "你的回答显示一些可能表明关系中存在不健康动态的行为。虽然不一定指向自恋型虐待，但值得进一步探索。",
        suggestion: "可以试着写日记，记录那些让你觉得不对劲的时刻。和一位了解关系动态的咨询师交流也会很有帮助。",
      },
      moderate: {
        level: "中度关注",
        heading: "你可能正在经历情感伤害的模式。",
        message: "你的回答显示了与情感虐待和自恋型关系动态一致的行为。这些都不是你的错。你值得在关系中感到安全和被珍视。",
        suggestion: "我们温柔地建议你寻求专业心理咨询师的帮助。了解创伤性依恋和自恋型关系循环的知识也会对你有所帮助。你并不孤单。",
      },
      high: {
        level: "高度关注",
        heading: "你描述的模式很严重。",
        message: "你的回答与自恋型虐待的模式高度吻合。这不是你的错，你经历的一切都是真实的。你没有在胡思乱想。",
        suggestion: "请考虑寻求专业帮助。全国心理援助热线（12320-5）全天候提供服务。你值得被支持。",
      },
      veryHigh: {
        level: "极高关注",
        heading: "你的安全和幸福至关重要。",
        message: "你的回答表明自恋型虐待的模式几乎遍及你关系的每个方面。你正在经历的一切是真实的、严重的，不是你的错。",
        suggestion: "请寻求帮助。全国心理援助热线（12320-5）提供全天候保密咨询。你不必独自面对这一切。",
      },
    },
  },
};
