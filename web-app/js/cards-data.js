/**
 * 电子PECS核心预设词库 (Core Preset Vocabulary)
 * 严格遵照特教AAC与PECS各阶段标准临床语料设计
 * 全部采用高质量内置SVG，杜绝任何外链碎图风险，100%离线可用
 */

const DEFAULT_CARDS = [
  // --- 句式起始与社交核心词 ---
  {
    id: "core_want",
    text: "我想要",
    pinyin: "wǒ xiǎng yào",
    category: "social",
    pos: "starter",
    tags: ["always", "general"],
    color: "#E0F2FE",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="20" r="12"/><path d="M16 52c0-8.8 7.2-16 16-16s16 7.2 16 16"/><path d="M38 32l10 10m0-6v6h-6"/></svg>`
  },
  {
    id: "core_thanks",
    text: "谢谢",
    pinyin: "xiè xie",
    category: "social",
    pos: "polite",
    tags: ["always", "social"],
    color: "#FEF3C7",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 14c4-6 16-6 20 2s-4 16-20 28C16 32 8 22 12 16s16-8 20-2z"/><path d="M26 26l6 6 12-12"/></svg>`
  },
  {
    id: "core_help",
    text: "帮帮我",
    pinyin: "bāng bang wǒ",
    category: "social",
    pos: "demand",
    tags: ["always", "class", "game"],
    color: "#FEE2E2",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 12v40M12 32h40"/><circle cx="32" cy="32" r="24"/></svg>`
  },
  {
    id: "core_no",
    text: "不要",
    pinyin: "bú yào",
    category: "social",
    pos: "demand",
    tags: ["always", "emotion"],
    color: "#FEE2E2",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="4" stroke-linecap="round"><circle cx="32" cy="32" r="22"/><line x1="16" y1="16" x2="48" y2="48"/></svg>`
  },

  // --- 食物与饮品 (Food & Drink) ---
  {
    id: "food_water",
    text: "水",
    pinyin: "shuǐ",
    category: "food",
    pos: "noun",
    tags: ["meal", "outdoor", "always"],
    color: "#E0F2FE",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 10c0 10-14 24-14 34a14 14 0 0028 0c0-10-14-24-14-34z"/><path d="M26 44a6 6 0 006 6"/></svg>`
  },
  {
    id: "food_milk",
    text: "牛奶",
    pinyin: "niú nǎi",
    category: "food",
    pos: "noun",
    tags: ["meal", "breakfast"],
    color: "#F3F4F6",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#4B5563" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="16" width="24" height="40" rx="4"/><path d="M26 16v-6h12v6M20 28h24M28 36h8v8h-8z"/></svg>`
  },
  {
    id: "food_apple",
    text: "苹果",
    pinyin: "píng guǒ",
    category: "food",
    pos: "noun",
    tags: ["meal", "snack"],
    color: "#FEE2E2",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 18c-4-4-14-4-18 4-6 12 0 32 18 34 18-2 24-22 18-34-4-8-14-8-18-4z"/><path d="M32 18V8c4 0 8 4 8 4"/></svg>`
  },
  {
    id: "food_banana",
    text: "香蕉",
    pinyin: "xiāng jiāo",
    category: "food",
    pos: "noun",
    tags: ["meal", "snack"],
    color: "#FEF3C7",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 42c8 12 28 14 38 2 2-2 4-6 4-10-8 6-22 6-30-2-4-4-6-10-6-16-4 8-8 18-6 26z"/><path d="M52 34l6-6"/></svg>`
  },
  {
    id: "food_biscuit",
    text: "饼干",
    pinyin: "bǐng gān",
    category: "food",
    pos: "noun",
    tags: ["snack", "game"],
    color: "#FFEDD5",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#EA580C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><circle cx="24" cy="24" r="2" fill="#EA580C"/><circle cx="40" cy="24" r="2" fill="#EA580C"/><circle cx="32" cy="36" r="2" fill="#EA580C"/><circle cx="22" cy="38" r="2" fill="#EA580C"/><circle cx="42" cy="38" r="2" fill="#EA580C"/></svg>`
  },
  {
    id: "food_bread",
    text: "面包",
    pinyin: "miàn bāo",
    category: "food",
    pos: "noun",
    tags: ["meal", "breakfast"],
    color: "#FEF3C7",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 32C14 20 22 14 32 14s18 6 18 18v16H14V32z"/><path d="M22 24q5 4 10 0t10 0"/></svg>`
  },
  {
    id: "food_rice",
    text: "米饭",
    pinyin: "mǐ fàn",
    category: "food",
    pos: "noun",
    tags: ["meal"],
    color: "#F3F4F6",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#4B5563" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 28h40c0 14-9 24-20 24S12 42 12 28z"/><path d="M22 52h20"/><path d="M16 28c4-10 16-16 26-10"/></svg>`
  },
  {
    id: "food_egg",
    text: "鸡蛋",
    pinyin: "jī dàn",
    category: "food",
    pos: "noun",
    tags: ["meal", "breakfast"],
    color: "#FEF9C3",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#CA8A04" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 10C22 10 14 24 14 38c0 9 8 16 18 16s18-7 18-16c0-14-8-28-18-28z"/></svg>`
  },

  // --- 玩具与游戏 (Toys & Play) ---
  {
    id: "toy_blocks",
    text: "积木",
    pinyin: "jī mù",
    category: "toy",
    pos: "noun",
    tags: ["game", "class"],
    color: "#DCFCE7",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="32" width="16" height="18" rx="2"/><rect x="34" y="32" width="16" height="18" rx="2"/><rect x="24" y="14" width="16" height="18" rx="2"/></svg>`
  },
  {
    id: "toy_car",
    text: "小汽车",
    pinyin: "xiǎo qì chē",
    category: "toy",
    pos: "noun",
    tags: ["game", "outdoor"],
    color: "#FEE2E2",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 36l6-14h28l6 14v12H12V36z"/><circle cx="20" cy="48" r="5"/><circle cx="44" cy="48" r="5"/><path d="M24 22h16v10H24z"/></svg>`
  },
  {
    id: "toy_bubbles",
    text: "吹泡泡",
    pinyin: "chuī pào pao",
    category: "toy",
    pos: "noun",
    tags: ["game", "outdoor"],
    color: "#E0F2FE",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="12"/><circle cx="44" cy="20" r="8"/><circle cx="40" cy="42" r="14"/><path d="M16 48l12-12"/></svg>`
  },
  {
    id: "toy_book",
    text: "看绘本",
    pinyin: "kàn huì běn",
    category: "toy",
    pos: "noun",
    tags: ["class", "game"],
    color: "#F3E8FF",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#9333EA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 46c8-4 16-2 20 2 4-4 12-6 20-2V16c-8-4-16-2-20 2-4-4-12-6-20-2v30z"/><path d="M32 18v30"/></svg>`
  },
  {
    id: "toy_ball",
    text: "皮球",
    pinyin: "pí qiú",
    category: "toy",
    pos: "noun",
    tags: ["game", "outdoor"],
    color: "#FFEDD5",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#EA580C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M32 10c6 8 6 36 0 44M12 24c10 4 30 4 40 0M12 40c10-4 30-4 40 0"/></svg>`
  },
  {
    id: "toy_puzzle",
    text: "拼图",
    pinyin: "pīn tú",
    category: "toy",
    pos: "noun",
    tags: ["class", "game"],
    color: "#FEF3C7",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16h10a6 6 0 0112 0h10v10a6 6 0 000 12v10H38a6 6 0 01-12 0H16V38a6 6 0 000-12V16z"/></svg>`
  },
  {
    id: "toy_music",
    text: "听音乐",
    pinyin: "tīng yīn yuè",
    category: "toy",
    pos: "noun",
    tags: ["game", "emotion"],
    color: "#E0E7FF",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#4F46E5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 42a6 6 0 1012 0V16l22-4v26a6 6 0 1012 0V8L30 14v28"/></svg>`
  },

  // --- 动作与动词 (Actions) ---
  {
    id: "act_eat",
    text: "吃",
    pinyin: "chī",
    category: "action",
    pos: "verb",
    tags: ["meal", "always"],
    color: "#FFEDD5",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#EA580C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 14v16a6 6 0 0012 0V14M24 30v20M42 14v36M38 14h8"/></svg>`
  },
  {
    id: "act_drink",
    text: "喝",
    pinyin: "hē",
    category: "action",
    pos: "verb",
    tags: ["meal", "always"],
    color: "#E0F2FE",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20h24v28a8 8 0 01-8 8H24a8 8 0 01-8-8V20z"/><path d="M40 26h6a6 6 0 016 6v4a6 6 0 01-6 6h-6"/><path d="M24 12l4 8"/></svg>`
  },
  {
    id: "act_hug",
    text: "抱抱",
    pinyin: "bào bao",
    category: "action",
    pos: "verb",
    tags: ["emotion", "always"],
    color: "#FCE7F3",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DB2777" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="22" r="8"/><circle cx="40" cy="22" r="8"/><path d="M14 46c0-6 4-10 10-10 4 0 7 2 9 6 2-4 5-6 9-6 6 0 10 4 10 10v6H14v-6z"/></svg>`
  },
  {
    id: "act_play",
    text: "玩",
    pinyin: "wán",
    category: "action",
    pos: "verb",
    tags: ["game", "outdoor"],
    color: "#DCFCE7",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="18" r="8"/><path d="M22 34l10-4 10 4M32 30v14M24 54l8-10 8 10"/></svg>`
  },
  {
    id: "act_stop",
    text: "停止",
    pinyin: "tíng zhǐ",
    category: "action",
    pos: "verb",
    tags: ["always", "class"],
    color: "#FEE2E2",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 14 42 14 52 24 52 44 42 54 22 54 12 44 12 24"/><line x1="24" y1="32" x2="40" y2="32"/></svg>`
  },
  {
    id: "act_go",
    text: "去",
    pinyin: "qù",
    category: "action",
    pos: "verb",
    tags: ["outdoor", "always"],
    color: "#E0E7FF",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#4F46E5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 32h36M36 18l14 14-14 14"/></svg>`
  },

  // --- 日常与自理 (Daily Routine) ---
  {
    id: "daily_toilet",
    text: "去厕所",
    pinyin: "qù cè suǒ",
    category: "daily",
    pos: "demand",
    tags: ["toilet", "always"],
    color: "#E0F2FE",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="14" width="16" height="26" rx="3"/><path d="M34 26h12a8 8 0 018 8v6c0 8-8 14-18 14h-6M26 40v14"/></svg>`
  },
  {
    id: "daily_wash",
    text: "洗手",
    pinyin: "xǐ shǒu",
    category: "daily",
    pos: "verb",
    tags: ["toilet", "meal"],
    color: "#CCFBF1",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0D9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 10v10M26 16l6 4 6-4"/><path d="M16 46c4-6 10-10 18-10 6 0 14 6 14 10v6H16v-6z"/><circle cx="32" cy="24" r="3"/></svg>`
  },
  {
    id: "daily_sleep",
    text: "睡觉",
    pinyin: "shuì jiào",
    category: "daily",
    pos: "verb",
    tags: ["night", "rest"],
    color: "#E0E7FF",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#4F46E5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 44h40M12 28v20M52 36v12M18 36h14a6 6 0 016 6v2H18v-8z"/><path d="M36 16c4 0 8 4 8 8s-4 8-8 8c8 0 14-6 14-14s-6-14-14-2z"/></svg>`
  },
  {
    id: "daily_clothes",
    text: "穿衣服",
    pinyin: "chuān yī fu",
    category: "daily",
    pos: "verb",
    tags: ["morning", "outdoor"],
    color: "#FEF3C7",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 14l-8 10 6 4 4-6v28h20V22l4 6 6-4-8-10-10 4-10-4z"/></svg>`
  },

  // --- 情绪表达 (Emotions) ---
  {
    id: "emo_happy",
    text: "开心",
    pinyin: "kāi xīn",
    category: "emotion",
    pos: "adj",
    tags: ["emotion", "always"],
    color: "#FEF9C3",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#CA8A04" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><circle cx="24" cy="26" r="3" fill="#CA8A04"/><circle cx="40" cy="26" r="3" fill="#CA8A04"/><path d="M22 38c3 6 17 6 20 0"/></svg>`
  },
  {
    id: "emo_sad",
    text: "难过",
    pinyin: "nán guò",
    category: "emotion",
    pos: "adj",
    tags: ["emotion", "always"],
    color: "#E0F2FE",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><circle cx="24" cy="28" r="3" fill="#0284C7"/><circle cx="40" cy="28" r="3" fill="#0284C7"/><path d="M24 44c3-5 13-5 16 0"/><path d="M24 20l4 3M40 20l-4 3"/></svg>`
  },
  {
    id: "emo_angry",
    text: "生气",
    pinyin: "shēng qì",
    category: "emotion",
    pos: "adj",
    tags: ["emotion", "always"],
    color: "#FEE2E2",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><line x1="20" y1="22" x2="28" y2="28"/><line x1="44" y1="22" x2="36" y2="28"/><circle cx="24" cy="30" r="2" fill="#DC2626"/><circle cx="40" cy="30" r="2" fill="#DC2626"/><line x1="24" y1="44" x2="40" y2="44"/></svg>`
  },
  {
    id: "emo_pain",
    text: "痛",
    pinyin: "tòng",
    category: "emotion",
    pos: "adj",
    tags: ["emotion", "always"],
    color: "#FEE2E2",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M20 28l4-4 8 8 16-16"/><path d="M30 44a6 6 0 0112 0"/></svg>`
  },

  // --- 人物与称谓 (People) ---
  {
    id: "person_mom",
    text: "妈妈",
    pinyin: "mā ma",
    category: "people",
    pos: "noun",
    tags: ["always", "social"],
    color: "#FCE7F3",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DB2777" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="10"/><path d="M18 52c0-8 6-14 14-14s14 6 14 14"/><path d="M22 22c0-6 4-10 10-10s10 4 10 10c0 4-2 8-4 10"/></svg>`
  },
  {
    id: "person_dad",
    text: "爸爸",
    pinyin: "bà ba",
    category: "people",
    pos: "noun",
    tags: ["always", "social"],
    color: "#E0F2FE",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="10"/><path d="M18 52c0-8 6-14 14-14s14 6 14 14"/><path d="M26 28h12"/></svg>`
  },
  {
    id: "person_teacher",
    text: "老师",
    pinyin: "lǎo shī",
    category: "people",
    pos: "noun",
    tags: ["class", "always"],
    color: "#FEF3C7",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="10"/><path d="M18 52c0-8 6-14 14-14s14 6 14 14"/><polygon points="20 16 32 10 44 16 32 20"/></svg>`
  }
];

// 情境元数据定义
const CONTEXT_DEFINITIONS = [
  { id: "auto", name: "智能感知 (自动)", icon: "✨", desc: "依据当前时间和活跃度动态推荐" },
  { id: "snack", name: "进餐与点心", icon: "🥣", desc: "用餐、喝水、水果零食推荐", filterTags: ["meal", "snack"] },
  { id: "class", name: "桌面教学", icon: "🎨", desc: "课堂练习、指令与桌面教具", filterTags: ["class", "social"] },
  { id: "game", name: "游戏与娱乐", icon: "🧸", desc: "玩具、积木、音乐与互动", filterTags: ["game"] },
  { id: "toilet", name: "生活自理", icon: "🚽", desc: "如厕、洗手、睡觉、穿衣服", filterTags: ["toilet", "daily"] },
  { id: "emotion", name: "情绪与感受", icon: "❤️", desc: "开心、痛、抱抱、难过", filterTags: ["emotion"] },
  { id: "outdoor", name: "外出与公园", icon: "🌳", desc: "散步、滑梯、车、回家", filterTags: ["outdoor"] }
];

// 分类元数据
const CATEGORY_DEFINITIONS = [
  { id: "all", name: "全部卡片", icon: "🗂️" },
  { id: "food", name: "食物饮料", icon: "🍽️" },
  { id: "toy", name: "玩具游戏", icon: "🧸" },
  { id: "action", name: "动作动词", icon: "🏃" },
  { id: "daily", name: "日常自理", icon: "🧻" },
  { id: "emotion", name: "情绪感受", icon: "❤️" },
  { id: "people", name: "人物称呼", icon: "👨‍👩‍👧" },
  { id: "social", name: "社交礼貌", icon: "🤝" }
];
