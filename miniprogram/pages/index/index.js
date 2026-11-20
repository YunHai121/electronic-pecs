// pages/index/index.js
const app = getApp();
const {
  STARTER_CARDS,
  CONTEXT_DEFINITIONS,
  CATEGORY_DEFINITIONS,
  getRecommendedCards
} = require('../../utils/cards-data.js');

Page({
  data: {
    contexts: CONTEXT_DEFINITIONS,
    categories: CATEGORY_DEFINITIONS,
    starters: STARTER_CARDS,
    currentContext: 'auto',
    currentContextLabel: '✨ 智能感知',
    activeCat: 'all',
    activeStarterId: 'core_want',
    gridDensity: 'standard',
    sentence: [],
    recommendList: [],
    filteredCards: [],
    scrollTargetId: '',
    isSpeaking: false,
    playingIndex: -1,

    // 递卡交换弹窗
    showExchangeModal: false,
    exchangeText: '',

    // 儿童防误触锁
    showLockModal: false,
    lockN1: 3,
    lockN2: 5,
    lockInput: ''
  },

  onShow() {
    this.refreshAllViews();
  },

  refreshAllViews() {
    const cards = app.globalData.cards || [];
    const logs = app.globalData.logs || [];
    const settings = app.globalData.settings || {};

    this.setData({
      gridDensity: settings.gridDensity || 'standard'
    });

    if (this.data.sentence.length === 0) {
      const starter = cards.find(c => c.id === this.data.activeStarterId) || STARTER_CARDS[0];
      this.setData({
        sentence: [{ ...starter, instanceId: 'init_' + Date.now() }]
      });
    }

    this.updateFilteredCards();
    this.updateRecommendations(cards, logs);
  },

  updateFilteredCards() {
    const cards = app.globalData.cards || [];
    const starterIds = STARTER_CARDS.map(s => s.id);
    const cat = this.data.activeCat;

    const filtered = cards.filter(c => {
      if (c.hidden || starterIds.includes(c.id)) return false;
      if (cat === 'all') return true;
      return c.category === cat;
    });

    this.setData({ filteredCards: filtered });
  },

  updateRecommendations(cards, logs) {
    const recs = getRecommendedCards(cards, logs, this.data.currentContext);
    const ctxDef = CONTEXT_DEFINITIONS.find(c => c.id === this.data.currentContext);
    this.setData({
      recommendList: recs,
      currentContextLabel: ctxDef ? `${ctxDef.icon} ${ctxDef.name}` : '✨ 智能感知'
    });
  },

  changeContext(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentContext: id });
    this.updateRecommendations(app.globalData.cards, app.globalData.logs);
  },

  changeCat(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ activeCat: cat });
    this.updateFilteredCards();
  },

  switchStarter(e) {
    const starter = e.currentTarget.dataset.starter;
    const s = [...this.data.sentence];
    if (s.length > 0) {
      s[0] = { ...starter, instanceId: 'init_' + Date.now() };
    } else {
      s.push({ ...starter, instanceId: 'init_' + Date.now() });
    }
    this.setData({
      activeStarterId: starter.id,
      sentence: s
    });
    app.playAudioFeedback(starter.text, starter.customAudio);
  },

  addCard(e) {
    const card = e.currentTarget.dataset.card;
    if (this.data.sentence.length >= 6) {
      wx.showToast({ title: '句子条已满(最多6张)', icon: 'none' });
      return;
    }
    const newSentence = [
      ...this.data.sentence,
      { ...card, instanceId: 'inst_' + Date.now() + '_' + Math.random() }
    ];
    this.setData({
      sentence: newSentence,
      scrollTargetId: `strip_${newSentence.length - 1}`
    });
    app.playAudioFeedback(card.text, card.customAudio);
  },

  removeCard(e) {
    const idx = e.currentTarget.dataset.index;
    if (idx === 0) return; // 保护句首起始卡
    const s = [...this.data.sentence];
    s.splice(idx, 1);
    this.setData({ sentence: s });
  },

  undoLastCard() {
    if (this.data.sentence.length <= 1) return;
    const s = [...this.data.sentence];
    s.pop();
    this.setData({ sentence: s });
  },

  clearSentence() {
    const starter = STARTER_CARDS.find(s => s.id === this.data.activeStarterId) || STARTER_CARDS[0];
    this.setData({
      sentence: [{ ...starter, instanceId: 'init_' + Date.now() }]
    });
  },

  playSentence() {
    if (this.data.isSpeaking || this.data.sentence.length === 0) return;

    const sentence = this.data.sentence;
    const fullText = sentence.map(c => c.text).join(' ');
    const cardIds = sentence.map(c => c.id);

    this.setData({ isSpeaking: true, playingIndex: 0 });
    app.playAudioFeedback(fullText, null);

    wx.showToast({
      title: '🔊 ' + fullText,
      icon: 'none',
      duration: 2000
    });

    // 逐卡高亮动画演示
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      if (idx >= sentence.length) {
        clearInterval(timer);
        this.setData({ isSpeaking: false, playingIndex: -1 });
        app.addLog(fullText, cardIds, this.data.currentContext, true);
        this.updateRecommendations(app.globalData.cards, app.globalData.logs);
      } else {
        this.setData({ playingIndex: idx });
      }
    }, 550);
  },

  openExchangeModal() {
    const fullText = this.data.sentence.map(c => c.text).join(' ');
    this.setData({
      showExchangeModal: true,
      exchangeText: fullText
    });
    app.playAudioFeedback(fullText, null);
  },

  closeExchangeModal() {
    this.setData({ showExchangeModal: false });
  },

  confirmExchange(e) {
    const isIndep = e.currentTarget.dataset.indep === 'true';
    const fullText = this.data.sentence.map(c => c.text).join(' ');
    const cardIds = this.data.sentence.map(c => c.id);

    app.addLog(fullText, cardIds, this.data.currentContext, isIndep);
    this.setData({ showExchangeModal: false });
    this.clearSentence();
    this.updateRecommendations(app.globalData.cards, app.globalData.logs);

    wx.showToast({
      title: isIndep ? '✅ 已记录自主沟通' : '👏 已记录引导完成',
      icon: 'success'
    });
  },

  // 儿童防误触锁
  openChildLock() {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    this.setData({
      showLockModal: true,
      lockN1: n1,
      lockN2: n2,
      lockInput: ''
    });
  },

  closeLockModal() {
    this.setData({ showLockModal: false });
  },

  onLockInput(e) {
    this.setData({ lockInput: e.detail.value });
  },

  verifyLock() {
    const ans = parseInt(this.data.lockInput, 10);
    if (ans === this.data.lockN1 + this.data.lockN2) {
      this.setData({ showLockModal: false });
      wx.navigateTo({ url: '/pages/parent/parent' });
    } else {
      wx.showToast({ title: '答案有误，请重新计算', icon: 'none' });
      this.setData({ lockInput: '' });
    }
  }
});
