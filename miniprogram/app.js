// app.js
App({
  globalData: {
    cards: [],
    logs: [],
    settings: {
      rate: 0.85,
      pitch: 1.0
    }
  },
  onLaunch() {
    // 初始化本地存储优先 (Local-First)
    const storedCards = wx.getStorageSync('pecs_cards');
    if (storedCards && storedCards.length > 0) {
      this.globalData.cards = storedCards;
    } else {
      // 预设默认核心卡
      this.globalData.cards = [
        { id: "core_want", text: "我想要", pinyin: "wǒ xiǎng yào", category: "social", icon: "👉" },
        { id: "food_water", text: "水", pinyin: "shuǐ", category: "food", icon: "💧" },
        { id: "food_milk", text: "牛奶", pinyin: "niú nǎi", category: "food", icon: "🥛" },
        { id: "food_apple", text: "苹果", pinyin: "píng guǒ", category: "food", icon: "🍎" },
        { id: "food_biscuit", text: "饼干", pinyin: "bǐng gān", category: "food", icon: "🍪" },
        { id: "toy_car", text: "小汽车", pinyin: "xiǎo qì chē", category: "toy", icon: "🚗" },
        { id: "toy_blocks", text: "积木", pinyin: "jī mù", category: "toy", icon: "🧱" },
        { id: "act_hug", text: "抱抱", pinyin: "bào bao", category: "action", icon: "🫂" },
        { id: "daily_toilet", text: "去厕所", pinyin: "qù cè suǒ", category: "daily", icon: "🚽" },
        { id: "emo_happy", text: "开心", pinyin: "kāi xīn", category: "emotion", icon: "😊" }
      ];
      wx.setStorageSync('pecs_cards', this.globalData.cards);
    }
  }
});
