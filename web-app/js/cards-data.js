/**
 * 电子PECS核心预设词库 (Core Preset Vocabulary)
 * 采用国际临床AAC通用 Fitzgerald Key 词性色彩编码标准：
 * - 社交/礼貌/句式起始：淡紫/浅蓝 (#F3E8FF / #E0F2FE)
 * - 名词(食物/玩具/日常物品)：暖橙/琥珀 (#FFEDD5 / #FEF3C7)
 * - 动词/动作：柔绿 (#DCFCE7)
 * - 形容词/情绪感受：浅蓝 (#DBEAFE)
 * - 人物称谓：柔黄 (#FEF9C3)
 */

const FITZGERALD_COLORS = {
  starter: { bg: "#EFF6FF", border: "#3B82F6", badge: "句首" },
  social:  { bg: "#F5F3FF", border: "#8B5CF6", badge: "社交" },
  noun:    { bg: "#FFF7ED", border: "#F97316", badge: "名词" },
  verb:    { bg: "#F0FDF4", border: "#22C55E", badge: "动词" },
  adj:     { bg: "#F0F9FF", border: "#0EA5E9", badge: "感受" },
  people:  { bg: "#FEFCE8", border: "#EAB308", badge: "人物" }
};

// 句式起始卡列表 (支持PECS Phase IV 请求, 拒绝, Phase VI 评论/感受)
const STARTER_CARDS = [
  {
    id: "core_want",
    text: "我想要",
    pinyin: "wǒ xiǎng yào",
    category: "social",
    pos: "starter",
    tags: ["always", "general"],
    color: "#EFF6FF",
    borderColor: "#3B82F6",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="20" r="11"/><path d="M16 52c0-8.8 7.2-16 16-16s16 7.2 16 16"/><path d="M40 30l10 10m0-6v6h-6"/></svg>`
  },
  {
    id: "core_not_want",
    text: "我不要",
    pinyin: "wǒ bú yào",
    category: "social",
    pos: "starter",
    tags: ["always", "emotion"],
    color: "#FEF2F2",
    borderColor: "#EF4444",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3.5" stroke-linecap="round"><circle cx="32" cy="32" r="20"/><line x1="18" y1="18" x2="46" y2="46"/></svg>`
  },
  {
    id: "core_feel",
    text: "我感觉",
    pinyin: "wǒ gǎn jué",
    category: "social",
    pos: "starter",
    tags: ["always", "emotion"],
    color: "#F5F3FF",
    borderColor: "#8B5CF6",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 52S12 38 12 24a10 10 0 0120-2 10 10 0 0120 2c0 14-20 28-20 28z"/></svg>`
  },
  {
    id: "core_see",
    text: "我看见",
    pinyin: "wǒ kàn jiàn",
    category: "social",
    pos: "starter",
    tags: ["class", "outdoor"],
    color: "#ECFDF5",
    borderColor: "#10B981",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 32s10-16 24-16 24 16 24 16-10 16-24 16S8 32 8 32z"/><circle cx="32" cy="32" r="7"/></svg>`
  }
];

const DEFAULT_CARDS = [
  ...STARTER_CARDS,
  // --- 社交与礼貌 (Social) ---
  {
    id: "core_thanks",
    text: "谢谢",
    pinyin: "xiè xie",
    category: "social",
    pos: "social",
    tags: ["always", "social"],
    color: "#F5F3FF",
    borderColor: "#8B5CF6",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 14c4-6 16-6 20 2s-4 16-20 28C16 32 8 22 12 16s16-8 20-2z"/><path d="M26 26l6 6 12-12"/></svg>`
  },
  {
    id: "core_help",
    text: "帮帮我",
    pinyin: "bāng bang wǒ",
    category: "social",
    pos: "social",
    tags: ["always", "class", "game"],
    color: "#FEF2F2",
    borderColor: "#EF4444",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 14v36M14 32h36"/><circle cx="32" cy="32" r="22"/></svg>`
  },
  {
    id: "core_more",
    text: "还要",
    pinyin: "hái yào",
    category: "social",
    pos: "social",
    tags: ["always", "meal", "game"],
    color: "#F5F3FF",
    borderColor: "#8B5CF6",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="32" r="10"/><circle cx="42" cy="32" r="10"/><path d="M42 27v10M37 32h10"/></svg>`
  },

  // --- 食物与饮品 (Food & Drink - 名词橙色系) ---
  {
    id: "food_water",
    text: "水",
    pinyin: "shuǐ",
    category: "food",
    pos: "noun",
    tags: ["meal", "outdoor", "always"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 10c0 10-14 24-14 34a14 14 0 0028 0c0-10-14-24-14-34z"/><path d="M26 44a6 6 0 006 6"/></svg>`
  },
  {
    id: "food_milk",
    text: "牛奶",
    pinyin: "niú nǎi",
    category: "food",
    pos: "noun",
    tags: ["meal", "breakfast"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="16" width="24" height="40" rx="4"/><path d="M26 16v-6h12v6M20 28h24M28 36h8v8h-8z"/></svg>`
  },
  {
    id: "food_apple",
    text: "苹果",
    pinyin: "píng guǒ",
    category: "food",
    pos: "noun",
    tags: ["meal", "snack"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 18c-4-4-14-4-18 4-6 12 0 32 18 34 18-2 24-22 18-34-4-8-14-8-18-4z"/><path d="M32 18V8c4 0 8 4 8 4"/></svg>`
  },
  {
    id: "food_banana",
    text: "香蕉",
    pinyin: "xiāng jiāo",
    category: "food",
    pos: "noun",
    tags: ["meal", "snack"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 42c8 12 28 14 38 2 2-2 4-6 4-10-8 6-22 6-30-2-4-4-6-10-6-16-4 8-8 18-6 26z"/><path d="M52 34l6-6"/></svg>`
  },
  {
    id: "food_biscuit",
    text: "饼干",
    pinyin: "bǐng gān",
    category: "food",
    pos: "noun",
    tags: ["snack", "game"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#EA580C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><circle cx="24" cy="24" r="2" fill="#EA580C"/><circle cx="40" cy="24" r="2" fill="#EA580C"/><circle cx="32" cy="36" r="2" fill="#EA580C"/><circle cx="22" cy="38" r="2" fill="#EA580C"/><circle cx="42" cy="38" r="2" fill="#EA580C"/></svg>`
  },
  {
    id: "food_bread",
    text: "面包",
    pinyin: "miàn bāo",
    category: "food",
    pos: "noun",
    tags: ["meal", "breakfast"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 32C14 20 22 14 32 14s18 6 18 18v16H14V32z"/><path d="M22 24q5 4 10 0t10 0"/></svg>`
  },
  {
    id: "food_rice",
    text: "米饭",
    pinyin: "mǐ fàn",
    category: "food",
    pos: "noun",
    tags: ["meal"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 28h40c0 14-9 24-20 24S12 42 12 28z"/><path d="M22 52h20"/><path d="M16 28c4-10 16-16 26-10"/></svg>`
  },
  {
    id: "food_egg",
    text: "鸡蛋",
    pinyin: "jī dàn",
    category: "food",
    pos: "noun",
    tags: ["meal", "breakfast"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#CA8A04" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 10C22 10 14 24 14 38c0 9 8 16 18 16s18-7 18-16c0-14-8-28-18-28z"/></svg>`
  },

  // --- 玩具与游戏 (Toys & Play - 名词橙色系) ---
  {
    id: "toy_blocks",
    text: "积木",
    pinyin: "jī mù",
    category: "toy",
    pos: "noun",
    tags: ["game", "class"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="32" width="16" height="18" rx="2"/><rect x="34" y="32" width="16" height="18" rx="2"/><rect x="24" y="14" width="16" height="18" rx="2"/></svg>`
  },
  {
    id: "toy_car",
    text: "小汽车",
    pinyin: "xiǎo qì chē",
    category: "toy",
    pos: "noun",
    tags: ["game", "outdoor"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 36l6-14h28l6 14v12H12V36z"/><circle cx="20" cy="48" r="5"/><circle cx="44" cy="48" r="5"/><path d="M24 22h16v10H24z"/></svg>`
  },
  {
    id: "toy_bubbles",
    text: "吹泡泡",
    pinyin: "chuī pào pao",
    category: "toy",
    pos: "noun",
    tags: ["game", "outdoor"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="12"/><circle cx="44" cy="20" r="8"/><circle cx="40" cy="42" r="14"/><path d="M16 48l12-12"/></svg>`
  },
  {
    id: "toy_book",
    text: "绘本",
    pinyin: "huì běn",
    category: "toy",
    pos: "noun",
    tags: ["class", "game"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#9333EA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 46c8-4 16-2 20 2 4-4 12-6 20-2V16c-8-4-16-2-20 2-4-4-12-6-20-2v30z"/><path d="M32 18v30"/></svg>`
  },
  {
    id: "toy_ball",
    text: "皮球",
    pinyin: "pí qiú",
    category: "toy",
    pos: "noun",
    tags: ["game", "outdoor"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#EA580C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M32 10c6 8 6 36 0 44M12 24c10 4 30 4 40 0M12 40c10-4 30-4 40 0"/></svg>`
  },
  {
    id: "toy_puzzle",
    text: "拼图",
    pinyin: "pīn tú",
    category: "toy",
    pos: "noun",
    tags: ["class", "game"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16h10a6 6 0 0112 0h10v10a6 6 0 000 12v10H38a6 6 0 01-12 0H16V38a6 6 0 000-12V16z"/></svg>`
  },
  {
    id: "toy_music",
    text: "音乐",
    pinyin: "yīn yuè",
    category: "toy",
    pos: "noun",
    tags: ["game", "emotion"],
    color: "#FFF7ED",
    borderColor: "#F97316",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#4F46E5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 42a6 6 0 1012 0V16l22-4v26a6 6 0 1012 0V8L30 14v28"/></svg>`
  },

  // --- 动作与动词 (Actions - 动词绿色系) ---
  {
    id: "act_eat",
    text: "吃",
    pinyin: "chī",
    category: "action",
    pos: "verb",
    tags: ["meal", "always"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 14v16a6 6 0 0012 0V14M24 30v20M42 14v36M38 14h8"/></svg>`
  },
  {
    id: "act_drink",
    text: "喝",
    pinyin: "hē",
    category: "action",
    pos: "verb",
    tags: ["meal", "always"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20h24v28a8 8 0 01-8 8H24a8 8 0 01-8-8V20z"/><path d="M40 26h6a6 6 0 016 6v4a6 6 0 01-6 6h-6"/><path d="M24 12l4 8"/></svg>`
  },
  {
    id: "act_hug",
    text: "抱抱",
    pinyin: "bào bao",
    category: "action",
    pos: "verb",
    tags: ["emotion", "always"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="22" r="8"/><circle cx="40" cy="22" r="8"/><path d="M14 46c0-6 4-10 10-10 4 0 7 2 9 6 2-4 5-6 9-6 6 0 10 4 10 10v6H14v-6z"/></svg>`
  },
  {
    id: "act_play",
    text: "玩",
    pinyin: "wán",
    category: "action",
    pos: "verb",
    tags: ["game", "outdoor"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="18" r="8"/><path d="M22 34l10-4 10 4M32 30v14M24 54l8-10 8 10"/></svg>`
  },
  {
    id: "act_stop",
    text: "停下",
    pinyin: "tíng xià",
    category: "action",
    pos: "verb",
    tags: ["always", "class"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 14 42 14 52 24 52 44 42 54 22 54 12 44 12 24"/><line x1="24" y1="32" x2="40" y2="32"/></svg>`
  },
  {
    id: "act_go",
    text: "出去玩",
    pinyin: "chū qù wán",
    category: "action",
    pos: "verb",
    tags: ["outdoor", "always"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 32h36M36 18l14 14-14 14"/></svg>`
  },

  // --- 日常与自理 (Daily Routine - 动词绿色/名词橙色) ---
  {
    id: "daily_toilet",
    text: "去厕所",
    pinyin: "qù cè suǒ",
    category: "daily",
    pos: "verb",
    tags: ["toilet", "always"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="14" width="16" height="26" rx="3"/><path d="M34 26h12a8 8 0 018 8v6c0 8-8 14-18 14h-6M26 40v14"/></svg>`
  },
  {
    id: "daily_wash",
    text: "洗手",
    pinyin: "xǐ shǒu",
    category: "daily",
    pos: "verb",
    tags: ["toilet", "meal"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0D9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 10v10M26 16l6 4 6-4"/><path d="M16 46c4-6 10-10 18-10 6 0 14 6 14 10v6H16v-6z"/><circle cx="32" cy="24" r="3"/></svg>`
  },
  {
    id: "daily_sleep",
    text: "睡觉",
    pinyin: "shuì jiào",
    category: "daily",
    pos: "verb",
    tags: ["night", "rest"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#4F46E5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 44h40M12 28v20M52 36v12M18 36h14a6 6 0 016 6v2H18v-8z"/><path d="M36 16c4 0 8 4 8 8s-4 8-8 8c8 0 14-6 14-14s-6-14-14-2z"/></svg>`
  },
  {
    id: "daily_clothes",
    text: "穿衣服",
    pinyin: "chuān yī fu",
    category: "daily",
    pos: "verb",
    tags: ["morning", "outdoor"],
    color: "#F0FDF4",
    borderColor: "#22C55E",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 14l-8 10 6 4 4-6v28h20V22l4 6 6-4-8-10-10 4-10-4z"/></svg>`
  },

  // --- 情绪表达 (Emotions - 形容词/感受蓝色系) ---
  {
    id: "emo_happy",
    text: "开心",
    pinyin: "kāi xīn",
    category: "emotion",
    pos: "adj",
    tags: ["emotion", "always"],
    color: "#F0F9FF",
    borderColor: "#0EA5E9",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#CA8A04" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><circle cx="24" cy="26" r="3" fill="#CA8A04"/><circle cx="40" cy="26" r="3" fill="#CA8A04"/><path d="M22 38c3 6 17 6 20 0"/></svg>`
  },
  {
    id: "emo_sad",
    text: "难过",
    pinyin: "nán guò",
    category: "emotion",
    pos: "adj",
    tags: ["emotion", "always"],
    color: "#F0F9FF",
    borderColor: "#0EA5E9",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><circle cx="24" cy="28" r="3" fill="#0284C7"/><circle cx="40" cy="28" r="3" fill="#0284C7"/><path d="M24 44c3-5 13-5 16 0"/><path d="M24 20l4 3M40 20l-4 3"/></svg>`
  },
  {
    id: "emo_angry",
    text: "生气",
    pinyin: "shēng qì",
    category: "emotion",
    pos: "adj",
    tags: ["emotion", "always"],
    color: "#F0F9FF",
    borderColor: "#0EA5E9",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><line x1="20" y1="22" x2="28" y2="28"/><line x1="44" y1="22" x2="36" y2="28"/><circle cx="24" cy="30" r="2" fill="#DC2626"/><circle cx="40" cy="30" r="2" fill="#DC2626"/><line x1="24" y1="44" x2="40" y2="44"/></svg>`
  },
  {
    id: "emo_pain",
    text: "不舒服",
    pinyin: "bù shū fu",
    category: "emotion",
    pos: "adj",
    tags: ["emotion", "always"],
    color: "#F0F9FF",
    borderColor: "#0EA5E9",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M20 28l4-4 8 8 16-16"/><path d="M30 44a6 6 0 0112 0"/></svg>`
  },

  // --- 人物与称谓 (People - 人物黄色系) ---
  {
    id: "person_mom",
    text: "妈妈",
    pinyin: "mā ma",
    category: "people",
    pos: "people",
    tags: ["always", "social"],
    color: "#FEFCE8",
    borderColor: "#EAB308",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#DB2777" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="10"/><path d="M18 52c0-8 6-14 14-14s14 6 14 14"/><path d="M22 22c0-6 4-10 10-10s10 4 10 10c0 4-2 8-4 10"/></svg>`
  },
  {
    id: "person_dad",
    text: "爸爸",
    pinyin: "bà ba",
    category: "people",
    pos: "people",
    tags: ["always", "social"],
    color: "#FEFCE8",
    borderColor: "#EAB308",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="10"/><path d="M18 52c0-8 6-14 14-14s14 6 14 14"/><path d="M26 28h12"/></svg>`
  },
  {
    id: "person_teacher",
    text: "老师",
    pinyin: "lǎo shī",
    category: "people",
    pos: "people",
    tags: ["class", "always"],
    color: "#FEFCE8",
    borderColor: "#EAB308",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="10"/><path d="M18 52c0-8 6-14 14-14s14 6 14 14"/><polygon points="20 16 32 10 44 16 32 20"/></svg>`
  }
];

// 常用生活汉字快速自动注音字典 (用于家长拍照制卡时自动补全拼音)
const PINYIN_DICT = {
  "草": "cǎo", "莓": "méi", "海": "hǎi", "苔": "tái", "西": "xī", "瓜": "guā",
  "橙": "chéng", "子": "zi", "葡": "pú", "萄": "táo", "酸": "suān", "奶": "nǎi",
  "蛋": "dàn", "糕": "gāo", "糖": "táng", "果": "guǒ", "汁": "zhī", "水": "shuǐ",
  "面": "miàn", "条": "tiáo", "饺": "jiǎo", "包": "bāo", "肉": "ròu", "鱼": "yú",
  "鸡": "jī", "菜": "cài", "饭": "fàn", "汤": "tāng", "茶": "chá", "杯": "bēi",
  "碗": "wǎn", "勺": "sháo", "筷": "kuài", "球": "qiú", "车": "chē", "船": "chuán",
  "飞": "fēi", "机": "jī", "画": "huà", "笔": "bǐ", "纸": "zhǐ", "书": "shū",
  "滑": "huá", "梯": "tī", "秋": "qiū", "千": "qiān", "公": "gōng", "园": "yuán",
  "家": "jiā", "学": "xué", "校": "xiào", "医": "yī", "院": "yuàn", "狗": "gǒu",
  "猫": "māo", "鸟": "niǎo", "花": "huā", "树": "shù", "太": "tài", "阳": "yáng",
  "月": "yuè", "亮": "liàng", "星": "xīng", "雨": "yǔ", "雪": "xuě", "风": "fēng",
  "热": "rè", "冷": "lěng", "渴": "kě", "饿": "è", "累": "lèi", "怕": "pà",
  "哭": "kū", "笑": "xiào", "跑": "pǎo", "跳": "tiào", "坐": "zuò", "站": "zhàn",
  "看": "kàn", "听": "tīng", "说": "shuō", "唱": "chàng", "睡": "shuì", "醒": "xǐng",
  "洗": "xǐ", "擦": "cā", "穿": "chuān", "脱": "tuō", "开": "kāi", "关": "guān",
  "大": "dà", "小": "xiǎo", "多": "duō", "少": "shǎo", "好": "hǎo", "坏": "huài",
  "红": "hóng", "黄": "huáng", "蓝": "lán", "绿": "lǜ", "白": "bái", "黑": "hēi",
  "爷": "yé", "奶": "nǎi", "外": "wài", "婆": "pó", "哥": "gē", "姐": "jiě",
  "弟": "dì", "妹": "mèi", "叔": "shū", "姨": "yí", "我": "wǒ", "你": "nǐ", "他": "tā",
  "休": "xiū", "息": "xi", "电": "diàn", "视": "shì", "手": "shǒu", "鞋": "xié", "袜": "wà"
};

function autoGeneratePinyin(text) {
  if (!text) return "";
  return Array.from(text.trim()).map(ch => PINYIN_DICT[ch] || "").filter(Boolean).join(" ");
}

// 情境元数据定义
const CONTEXT_DEFINITIONS = [
  { id: "auto", name: "智能感知", icon: "✨", desc: "依据当前时间和活跃度动态推荐" },
  { id: "snack", name: "进餐点心", icon: "🥣", desc: "用餐、喝水、水果零食推荐", filterTags: ["meal", "snack"] },
  { id: "class", name: "桌面课堂", icon: "🎨", desc: "课堂练习、指令与桌面教具", filterTags: ["class", "social"] },
  { id: "game", name: "游戏娱乐", icon: "🧸", desc: "玩具、积木、音乐与互动", filterTags: ["game"] },
  { id: "toilet", name: "生活自理", icon: "🚽", desc: "如厕、洗手、睡觉、穿衣服", filterTags: ["toilet", "daily"] },
  { id: "emotion", name: "情绪感受", icon: "❤️", desc: "开心、不舒服、抱抱、难过", filterTags: ["emotion"] },
  { id: "outdoor", name: "外出公园", icon: "🌳", desc: "散步、小汽车、泡泡、回家", filterTags: ["outdoor"] }
];

// 分类元数据
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
