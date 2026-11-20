// pages/library/library.js
const app = getApp();
const { STARTER_CARDS } = require('../../utils/cards-data.js');

Page({
  data: {
    searchTerm: '',
    displayCards: []
  },

  onShow() {
    this.refreshList();
  },

  onSearch(e) {
    this.setData({ searchTerm: e.detail.value.trim() });
    this.refreshList();
  },

  refreshList() {
    const cards = app.globalData.cards || [];
    const starterIds = STARTER_CARDS.map(s => s.id);
    const term = this.data.searchTerm;

    const list = cards
      .filter(c => !starterIds.includes(c.id))
      .filter(c => !term || c.text.includes(term) || c.category.includes(term))
      .map(c => ({
        ...c,
        isCustom: c.id.startsWith('custom_')
      }));

    this.setData({ displayCards: list });
  },

  toggleVisibility(e) {
    const id = e.currentTarget.dataset.id;
    const isVisible = e.detail.value;
    const cards = (app.globalData.cards || []).map(c => {
      if (c.id === id) return { ...c, hidden: !isVisible };
      return c;
    });
    app.saveCards(cards);
    this.refreshList();
  },

  deleteCard(e) {
    const { id, text } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: `确定要删除自定义卡片【${text}】吗？`,
      success: (res) => {
        if (res.confirm) {
          const cards = (app.globalData.cards || []).filter(c => c.id !== id);
          app.saveCards(cards);
          this.refreshList();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  }
});
