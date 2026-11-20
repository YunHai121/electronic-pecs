// pages/settings/settings.js
const app = getApp();
const { DEFAULT_CARDS } = require('../../utils/cards-data.js');

Page({
  data: {
    settings: {},
    rateSliderVal: 85
  },

  onShow() {
    const settings = app.globalData.settings || { rate: 0.85, gridDensity: 'standard' };
    this.setData({
      settings,
      rateSliderVal: Math.round((settings.rate || 0.85) * 100)
    });
  },

  onDensityChange(e) {
    const settings = { ...this.data.settings, gridDensity: e.detail.value };
    this.setData({ settings });
    app.saveSettings(settings);
    wx.showToast({ title: '网格密度已更新', icon: 'success' });
  },

  onRateChange(e) {
    const rate = parseFloat((e.detail.value / 100).toFixed(2));
    const settings = { ...this.data.settings, rate };
    this.setData({
      settings,
      rateSliderVal: e.detail.value
    });
    app.saveSettings(settings);
  },

  exportPack() {
    const bundle = {
      version: '2.0',
      appName: '声动星河电子PECS小程序',
      exportedAt: new Date().toISOString(),
      cards: app.globalData.cards,
      logs: app.globalData.logs
    };
    wx.setClipboardData({
      data: JSON.stringify(bundle),
      success: () => {
        wx.showToast({ title: '离线卡包JSON已复制到剪贴板', icon: 'none' });
      }
    });
  },

  resetDefaults() {
    wx.showModal({
      title: '恢复默认词库',
      content: '确定要恢复系统预设词库吗？',
      success: (res) => {
        if (res.confirm) {
          app.saveCards([...DEFAULT_CARDS]);
          wx.showToast({ title: '已恢复默认词库', icon: 'success' });
        }
      }
    });
  }
});
