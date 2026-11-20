// pages/stats/stats.js
Page({
  data: {
    logs: []
  },
  onShow() {
    const logs = wx.getStorageSync('pecs_logs') || [];
    this.setData({ logs });
  }
});
