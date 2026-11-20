// pages/parent/parent.js
const app = getApp();

Page({
  data: {
    cardCount: 0,
    logCount: 0
  },

  onShow() {
    this.setData({
      cardCount: (app.globalData.cards || []).length,
      logCount: (app.globalData.logs || []).length
    });
  }
});
