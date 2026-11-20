// utils/cards-data.js
// 电子PECS微信小程序核心词库与情境推荐算法 (Fitzgerald Key 色彩规范)

const FITZGERALD_COLORS = {
  starter: { bg: "#EFF6FF", border: "#3B82F6" },
  social:  { bg: "#F5F3FF", border: "#8B5CF6" },
  noun:    { bg: "#FFF7ED", border: "#F97316" },
  verb:    { bg: "#F0FDF4", border: "#22C55E" },
  adj:     { bg: "#F0F9FF", border: "#0EA5E9" },
  people:  { bg: "#FEFCE8", border: "#EAB308" }
};

const STARTER_CARDS = [
  { id: "core_want", text: "我想要", pinyin: "wǒ xiǎng yào", category: "social", pos: "starter", tags: ["always"], color: "#EFF6FF", borderColor: "#3B82F6", icon: "🙋" },
  { id: "core_not_want", text: "我不要", pinyin: "wǒ bú yào", category: "social", pos: "starter", tags: ["always"], color: "#FEF2F2", borderColor: "#EF4444", icon: "🙅" },
  { id: "core_feel", text: "我感觉", pinyin: "wǒ gǎn jué", category: "social", pos: "starter", tags: ["always"], color: "#F5F3FF", borderColor: "#8B5CF6", icon: "💭" },
  { id: "core_see", text: "我看见", pinyin: "wǒ kàn jiàn", category: "social", pos: "starter", tags: ["class", "outdoor"], color: "#ECFDF5", borderColor: "#10B981", icon: "👀" }
];

const DEFAULT_CARDS = [
  ...STARTER_CARDS,
  // 社交
  { id: "core_thanks", text: "谢谢", pinyin: "xiè xie", category: "social", pos: "social", tags: ["always", "social"], color: "#F5F3FF", borderColor: "#8B5CF6", icon: "🙏" },
  { id: "core_help", text: "帮帮我", pinyin: "bāng bang wǒ", category: "social", pos: "social", tags: ["always", "class", "game"], color: "#FEF2F2", borderColor: "#EF4444", icon: "🆘" },
  { id: "core_more", text: "还要", pinyin: "hái yào", category: "social", pos: "social", tags: ["always", "meal", "game"], color: "#F5F3FF", borderColor: "#8B5CF6", icon: "➕" },

  // 食物饮料 (名词橙)
  { id: "food_water", text: "水", pinyin: "shuǐ", category: "food", pos: "noun", tags: ["meal", "outdoor", "always"], color: "#FFF7ED", borderColor: "#F97316", icon: "💧" },
  { id: "food_milk", text: "牛奶", pinyin: "niú nǎi", category: "food", pos: "noun", tags: ["meal", "breakfast"], color: "#FFF7ED", borderColor: "#F97316", icon: "🥛" },
  { id: "food_apple", text: "苹果", pinyin: "píng guǒ", category: "food", pos: "noun", tags: ["meal", "snack"], color: "#FFF7ED", borderColor: "#F97316", icon: "🍎" },
  { id: "food_banana", text: "香蕉", pinyin: "xiāng jiāo", category: "food", pos: "noun", tags: ["meal", "snack"], color: "#FFF7ED", borderColor: "#F97316", icon: "🍌" },
  { id: "food_biscuit", text: "饼干", pinyin: "bǐng gān", category: "food", pos: "noun", tags: ["snack", "game"], color: "#FFF7ED", borderColor: "#F97316", icon: "🍪" },
  { id: "food_bread", text: "面包", pinyin: "miàn bāo", category: "food", pos: "noun", tags: ["meal", "breakfast"], color: "#FFF7ED", borderColor: "#F97316", icon: "🍞" },
  { id: "food_rice", text: "米饭", pinyin: "mǐ fàn", category: "food", pos: "noun", tags: ["meal"], color: "#FFF7ED", borderColor: "#F97316", icon: "🍚" },
  { id: "food_egg", text: "鸡蛋", pinyin: "jī dàn", category: "food", pos: "noun", tags: ["meal", "breakfast"], color: "#FFF7ED", borderColor: "#F97316", icon: "🥚" },

  // 玩具游戏 (名词橙)
  { id: "toy_blocks", text: "积木", pinyin: "jī mù", category: "toy", pos: "noun", tags: ["game", "class"], color: "#FFF7ED", borderColor: "#F97316", icon: "🧱" },
  { id: "toy_car", text: "小汽车", pinyin: "xiǎo qì chē", category: "toy", pos: "noun", tags: ["game", "outdoor"], color: "#FFF7ED", borderColor: "#F97316", icon: "🚗" },
  { id: "toy_bubbles", text: "吹泡泡", pinyin: "chuī pào pao", category: "toy", pos: "noun", tags: ["game", "outdoor"], color: "#FFF7ED", borderColor: "#F97316", icon: "🫧" },
  { id: "toy_book", text: "绘本", pinyin: "huì běn", category: "toy", pos: "noun", tags: ["class", "game"], color: "#FFF7ED", borderColor: "#F97316", icon: "📖" },
  { id: "toy_ball", text: "皮球", pinyin: "pí qiú", category: "toy", pos: "noun", tags: ["game", "outdoor"], color: "#FFF7ED", borderColor: "#F97316", icon: "⚽" },
  { id: "toy_puzzle", text: "拼图", pinyin: "pīn tú", category: "toy", pos: "noun", tags: ["class", "game"], color: "#FFF7ED", borderColor: "#F97316", icon: "🧩" },
  { id: "toy_music", text: "音乐", pinyin: "yīn yuè", category: "toy", pos: "noun", tags: ["game", "emotion"], color: "#FFF7ED", borderColor: "#F97316", icon: "🎵" },

  // 动作动词 (动词绿)
  { id: "act_eat", text: "吃", pinyin: "chī", category: "action", pos: "verb", tags: ["meal", "always"], color: "#F0FDF4", borderColor: "#22C55E", icon: "🍽️" },
  { id: "act_drink", text: "喝", pinyin: "hē", category: "action", pos: "verb", tags: ["meal", "always"], color: "#F0FDF4", borderColor: "#22C55E", icon: "🥤" },
  { id: "act_hug", text: "抱抱", pinyin: "bào bao", category: "action", pos: "verb", tags: ["emotion", "always"], color: "#F0FDF4", borderColor: "#22C55E", icon: "🫂" },
  { id: "act_play", text: "玩", pinyin: "wán", category: "action", pos: "verb", tags: ["game", "outdoor"], color: "#F0FDF4", borderColor: "#22C55E", icon: "🤸" },
  { id: "act_stop", text: "停下", pinyin: "tíng xià", category: "action", pos: "verb", tags: ["always", "class"], color: "#F0FDF4", borderColor: "#22C55E", icon: "🛑" },
  { id: "act_go", text: "出去玩", pinyin: "chū qù wán", category: "action", pos: "verb", tags: ["outdoor", "always"], color: "#F0FDF4", borderColor: "#22C55E", icon: "🚪" },

  // 日常自理 (动词绿)
  { id: "daily_toilet", text: "去厕所", pinyin: "qù cè suǒ", category: "daily", pos: "verb", tags: ["toilet", "always"], color: "#F0FDF4", borderColor: "#22C55E", icon: "🚽" },
  { id: "daily_wash", text: "洗手", pinyin: "xǐ shǒu", category: "daily", pos: "verb", tags: ["toilet", "meal"], color: "#F0FDF4", borderColor: "#22C55E", icon: "🧼" },
  { id: "daily_sleep", text: "睡觉", pinyin: "shuì jiào", category: "daily", pos: "verb", tags: ["night", "rest"], color: "#F0FDF4", borderColor: "#22C55E", icon: "😴" },
  { id: "daily_clothes", text: "穿衣服", pinyin: "chuān yī fu", category: "daily", pos: "verb", tags: ["morning", "outdoor"], color: "#F0FDF4", borderColor: "#22C55E", icon: "👕" },

  // 情绪感受 (感受蓝)
  { id: "emo_happy", text: "开心", pinyin: "kāi xīn", category: "emotion", pos: "adj", tags: ["emotion", "always"], color: "#F0F9FF", borderColor: "#0EA5E9", icon: "😊" },
  { id: "emo_sad", text: "难过", pinyin: "nán guò", category: "emotion", pos: "adj", tags: ["emotion", "always"], color: "#F0F9FF", borderColor: "#0EA5E9", icon: "😢" },
  { id: "emo_angry", text: "生气", pinyin: "shēng qì", category: "emotion", pos: "adj", tags: ["emotion", "always"], color: "#F0F9FF", borderColor: "#0EA5E9", icon: "😠" },
  { id: "emo_pain", text: "不舒服", pinyin: "bù shū fu", category: "emotion", pos: "adj", tags: ["emotion", "always"], color: "#F0F9FF", borderColor: "#0EA5E9", icon: "🤒" },

  // 人物称呼 (人物黄)
  { id: "person_mom", text: "妈妈", pinyin: "mā ma", category: "people", pos: "people", tags: ["always", "social"], color: "#FEFCE8", borderColor: "#EAB308", icon: "👩" },
  { id: "person_dad", text: "爸爸", pinyin: "bà ba", category: "people", pos: "people", tags: ["always", "social"], color: "#FEFCE8", borderColor: "#EAB308", icon: "👨" },
  { id: "person_teacher", text: "老师", pinyin: "lǎo shī", category: "people", pos: "people", tags: ["class", "always"], color: "#FEFCE8", borderColor: "#EAB308", icon: "👩‍🏫" }
];

const CONTEXT_DEFINITIONS = [
  { id: "auto", name: "智能感知", icon: "✨", filterTags: [] },
  { id: "snack", name: "进餐点心", icon: "🥣", filterTags: ["meal", "snack"] },
  { id: "class", name: "桌面课堂", icon: "🎨", filterTags: ["class", "social"] },
  { id: "game", name: "游戏娱乐", icon: "🧸", filterTags: ["game"] },
  { id: "toilet", name: "生活自理", icon: "🚽", filterTags: ["toilet", "daily"] },
  { id: "emotion", name: "情绪感受", icon: "❤️", filterTags: ["emotion"] },
  { id: "outdoor", name: "外出公园", icon: "🌳", filterTags: ["outdoor"] }
];

const CATEGORY_DEFINITIONS = [
  { id: "all", name: "全部", icon: "🗂️" },
  { id: "food", name: "食物", icon: "🍽️" },
  { id: "toy", name: "玩具", icon: "🧸" },
  { id: "action", name: "动作", icon: "🏃" },
  { id: "daily", name: "自理", icon: "🧻" },
  { id: "emotion", name: "情绪", icon: "❤️" },
  { id: "people", name: "人物", icon: "👨‍👩‍👧" },
  { id: "social", name: "社交", icon: "🤝" }
];

const PINYIN_DICT = {
  "草": "cǎo", "莓": "méi", "海": "hǎi", "苔": "tái", "西": "xī", "瓜": "guā",
  "橙": "chéng", "子": "zi", "葡": "pú", "萄": "táo", "酸": "suān", "奶": "nǎi",
  "蛋": "dàn", "糕": "gāo", "糖": "táng", "果": "guǒ", "汁": "zhī", "水": "shuǐ",
  "面": "miàn", "条": "tiáo", "饺": "jiǎo", "包": "bāo", "肉": "ròu", "鱼": "yú",
  "鸡": "jī", "菜": "cài", "饭": "fàn", "汤": "tāng", "球": "qiú", "车": "chē",
  "书": "shū", "家": "jiā", "学": "xué", "狗": "gǒu", "猫": "māo", "花": "huā",
  "睡": "shuì", "洗": "xǐ", "吃": "chī", "喝": "hē", "玩": "wán", "抱": "bào"
};

function autoGeneratePinyin(text) {
  if (!text) return "";
  return Array.from(text.trim()).map(ch => PINYIN_DICT[ch] || "").filter(Boolean).join(" ");
}

function getRecommendedCards(cards, logs, currentContext) {
  let activeTags = [];
  const hour = new Date().getHours();

  if (currentContext === "auto") {
    if (hour >= 6 && hour < 10) activeTags = ["breakfast", "meal", "morning"];
    else if (hour >= 10 && hour < 12) activeTags = ["class", "social"];
    else if (hour >= 12 && hour < 14) activeTags = ["meal", "toilet", "rest"];
    else if (hour >= 14 && hour < 18) activeTags = ["game", "outdoor", "snack"];
    else if (hour >= 18 && hour < 20) activeTags = ["meal", "snack"];
    else activeTags = ["night", "toilet", "rest", "emotion"];
  } else {
    const ctxDef = CONTEXT_DEFINITIONS.find(c => c.id === currentContext);
    activeTags = ctxDef && ctxDef.filterTags ? ctxDef.filterTags : [];
  }

  const usageCounts = {};
  (logs || []).forEach(log => {
    if (log.cardIds) {
      log.cardIds.forEach(id => {
        usageCounts[id] = (usageCounts[id] || 0) + 1;
      });
    }
  });

  const starterIds = STARTER_CARDS.map(s => s.id);
  const scored = (cards || [])
    .filter(c => !starterIds.includes(c.id) && !c.hidden)
    .map(card => {
      let score = 0;
      if (card.tags && activeTags.some(t => card.tags.includes(t))) score += 50;
      score += Math.min((usageCounts[card.id] || 0) * 8, 30);
      if (card.tags && card.tags.includes("always")) score += 15;
      return { card, score };
    });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8).map(item => item.card);
}

module.exports = {
  FITZGERALD_COLORS,
  STARTER_CARDS,
  DEFAULT_CARDS,
  CONTEXT_DEFINITIONS,
  CATEGORY_DEFINITIONS,
  autoGeneratePinyin,
  getRecommendedCards
};
