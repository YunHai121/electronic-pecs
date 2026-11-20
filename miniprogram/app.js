// app.js
const { DEFAULT_CARDS } = require('./utils/cards-data.js');

App({
  globalData: {
    cards: [],
    logs: [],
    settings: {
      rate: 0.85,
      gridDensity: 'standard', // 'standard' (3列) | 'beginner' (2列大卡)
      autoTimeContext: true
    }
  },

  onLaunch() {
    this.loadLocalData();
  },

  loadLocalData() {
    const storedCards = wx.getStorageSync('pecs_cards_v2');
    if (storedCards && Array.isArray(storedCards) && storedCards.length > 0) {
      this.globalData.cards = storedCards;
    } else {
      this.globalData.cards = [...DEFAULT_CARDS];
      wx.setStorageSync('pecs_cards_v2', this.globalData.cards);
    }

    const storedLogs = wx.getStorageSync('pecs_logs_v2');
    if (storedLogs && Array.isArray(storedLogs)) {
      this.globalData.logs = storedLogs;
    }

    const storedSettings = wx.getStorageSync('pecs_settings_v2');
    if (storedSettings) {
      this.globalData.settings = { ...this.globalData.settings, ...storedSettings };
    }
  },

  saveCards(cards) {
    this.globalData.cards = cards;
    wx.setStorageSync('pecs_cards_v2', cards);
  },

  saveSettings(settings) {
    this.globalData.settings = settings;
    wx.setStorageSync('pecs_settings_v2', settings);
  },

  addLog(sentenceText, cardIds, context, independent = true) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const entry = {
      id: 'log_' + Date.now(),
      timestamp: Date.now(),
      dateStr,
      timeStr,
      sentenceText,
      cardIds,
      cardCount: cardIds.length,
      context,
      independent
    };

    const logs = [entry, ...(this.globalData.logs || [])].slice(0, 500);
    this.globalData.logs = logs;
    wx.setStorageSync('pecs_logs_v2', logs);
    return entry;
  },

  // 播放音频：优先播放家长自定义录音，其次尝试微信同声传译插件TTS，最后视觉震动反馈兜底
  playAudioFeedback(text, customAudioPath) {
    wx.vibrateShort({ type: 'light' });

    if (customAudioPath) {
      const innerAudio = wx.createInnerAudioContext();
      innerAudio.src = customAudioPath;
      innerAudio.play();
      innerAudio.onEnded(() => innerAudio.destroy());
      innerAudio.onError(() => innerAudio.destroy());
      return;
    }

    // 若项目已接入微信官方同声传译插件 (WechatSI)，自动调用合成发音
    try {
      const plugin = requirePlugin('WechatSI');
      if (plugin && plugin.textToSpeech) {
        plugin.textToSpeech({
          lang: 'zh_CN',
          tts: true,
          content: text,
          success: (res) => {
            if (res.filename) {
              const ctx = wx.createInnerAudioContext();
              ctx.src = res.filename;
              ctx.playbackRate = this.globalData.settings.rate || 0.85;
              ctx.play();
              ctx.onEnded(() => ctx.destroy());
            }
          }
        });
        return;
      }
    } catch (e) {
      // 未配置 WechatSI 插件时静默降级为提示条，确保无报错
    }
  }
});
