// pages/index/index.js
const app = getApp();

Page({
  data: {
    currentContextName: '智能感知',
    sentence: [],
    recommendList: [],
    activeCat: 'all',
    filteredCards: [],
    isSpeaking: false
  },

  onShow() {
    const cards = app.globalData.cards || [];
    this.setData({
      filteredCards: cards,
      recommendList: cards.slice(1, 6)
    });
    if (this.data.sentence.length === 0) {
      this.setData({
        sentence: [cards[0] || { id: "core_want", text: "我想要", pinyin: "wǒ xiǎng yào", icon: "👉" }]
      });
    }
  },

  changeCat(e) {
    const cat = e.currentTarget.dataset.cat;
    const all = app.globalData.cards || [];
    const filtered = cat === 'all' ? all : all.filter(c => c.category === cat);
    this.setData({
      activeCat: cat,
      filteredCards: filtered
    });
  },

  addCard(e) {
    const card = e.currentTarget.dataset.card;
    if (this.data.sentence.length >= 5) return;
    const newSentence = [...this.data.sentence, card];
    this.setData({ sentence: newSentence });
  },

  removeCard(e) {
    const idx = e.currentTarget.dataset.index;
    if (idx === 0) return; // 保护第一张“我想要”
    const s = [...this.data.sentence];
    s.splice(idx, 1);
    this.setData({ sentence: s });
  },

  clearSentence() {
    const starter = app.globalData.cards[0] || { id: "core_want", text: "我想要", pinyin: "wǒ xiǎng yào", icon: "👉" };
    this.setData({ sentence: [starter] });
  },

  playSentence() {
    const texts = this.data.sentence.map(c => c.text).join(' ');
    this.setData({ isSpeaking: true });
    
    // 微信小程序同声传译 / 内置TTS朗读触发
    wx.showToast({
      title: '正在朗读: ' + texts,
      icon: 'none',
      duration: 2000
    });

    // 记录行为日志入本地
    const logs = wx.getStorageSync('pecs_logs') || [];
    logs.unshift({
      time: new Date().toLocaleTimeString(),
      sentence: texts
    });
    wx.setStorageSync('pecs_logs', logs.slice(0, 100));

    setTimeout(() => {
      this.setData({ isSpeaking: false });
    }, 1500);
  },

  goToParent() {
    wx.navigateTo({
      url: '/pages/parent/parent'
    });
  }
});
