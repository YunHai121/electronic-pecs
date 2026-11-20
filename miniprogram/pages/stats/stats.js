// pages/stats/stats.js
const app = getApp();
const { STARTER_CARDS } = require('../../utils/cards-data.js');

Page({
  data: {
    totalCount: 0,
    todayCount: 0,
    indepRate: 100,
    topCards: [],
    logs: []
  },

  onShow() {
    const logs = app.globalData.logs || [];
    const cards = app.globalData.cards || [];
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    const todayLogs = logs.filter(l => l.dateStr === todayStr);
    const indepCount = logs.filter(l => l.independent !== false).length;
    const indepRate = logs.length > 0 ? Math.round((indepCount / logs.length) * 100) : 100;

    const starterIds = STARTER_CARDS.map(s => s.id);
    const freq = {};
    logs.forEach(l => {
      (l.cardIds || []).forEach(id => {
        if (!starterIds.includes(id)) {
          freq[id] = (freq[id] || 0) + 1;
        }
      });
    });

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxFreq = sorted.length > 0 ? sorted[0][1] : 1;
    const topCards = sorted.map(([id, count]) => {
      const found = cards.find(c => c.id === id);
      return {
        name: found ? found.text : id,
        count,
        percent: Math.round((count / maxFreq) * 100)
      };
    });

    this.setData({
      totalCount: logs.length,
      todayCount: todayLogs.length,
      indepRate,
      topCards,
      logs: logs.slice(0, 30)
    });
  },

  copyReport() {
    const { totalCount, todayCount, indepRate, topCards } = this.data;
    const topStr = topCards.map(t => `${t.name}(${t.count}次)`).join('、') || '暂无';
    const report = `【声动星河 · 电子PECS 沟通行为报告】\n累计主动沟通：${totalCount} 次\n今日沟通次数：${todayCount} 次\n自主表达比例：${indepRate}%\n高频核心词汇：${topStr}\n（数据本地记录，供特教IEP评估参考）`;

    wx.setClipboardData({
      data: report,
      success: () => {
        wx.showToast({ title: '报告已复制，可粘贴给老师', icon: 'success' });
      }
    });
  }
});
