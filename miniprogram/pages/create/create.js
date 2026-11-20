// pages/create/create.js
const app = getApp();
const { FITZGERALD_COLORS, autoGeneratePinyin } = require('../../utils/cards-data.js');

const CAT_OPTIONS = [
  { id: 'food', name: '🍽️ 食物饮料 (名词橙)', pos: 'noun' },
  { id: 'toy', name: '🧸 玩具游戏 (名词橙)', pos: 'noun' },
  { id: 'action', name: '🏃 动作动词 (动词绿)', pos: 'verb' },
  { id: 'daily', name: '🧻 日常自理 (动词绿)', pos: 'verb' },
  { id: 'emotion', name: '❤️ 情绪感受 (感受蓝)', pos: 'adj' },
  { id: 'people', name: '👨‍👩‍👧 人物称呼 (人物黄)', pos: 'people' },
  { id: 'social', name: '🤝 社交礼貌 (社交紫)', pos: 'social' }
];

const TAG_OPTIONS = [
  { id: 'meal', name: '🥣 进餐/点心' },
  { id: 'game', name: '🧸 游戏娱乐' },
  { id: 'class', name: '🎨 桌面课堂' },
  { id: 'toilet', name: '🚽 如厕洗漱' },
  { id: 'outdoor', name: '🌳 户外外出' },
  { id: 'always', name: '⭐ 全天常备' }
];

Page({
  data: {
    photoUrl: '',
    cardText: '',
    cardPinyin: '',
    catNames: CAT_OPTIONS.map(c => c.name),
    catIndex: 0,
    tagNames: TAG_OPTIONS.map(t => t.name),
    tagIndex: 0,
    isRecording: false,
    customAudioPath: ''
  },

  onLoad() {
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onStop((res) => {
      if (res.tempFilePath) {
        // 持久化保存录音文件到小程序本地目录
        wx.getFileSystemManager().saveFile({
          tempFilePath: res.tempFilePath,
          success: (saveRes) => {
            this.setData({
              isRecording: false,
              customAudioPath: saveRes.savedFilePath
            });
          },
          fail: () => {
            this.setData({
              isRecording: false,
              customAudioPath: res.tempFilePath
            });
          }
        });
      }
    });
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath;
        wx.getFileSystemManager().saveFile({
          tempFilePath: tempPath,
          success: (saveRes) => {
            this.setData({ photoUrl: saveRes.savedFilePath });
          },
          fail: () => {
            this.setData({ photoUrl: tempPath });
          }
        });
      }
    });
  },

  onInputText(e) {
    const val = e.detail.value;
    const py = autoGeneratePinyin(val);
    this.setData({
      cardText: val,
      cardPinyin: py || this.data.cardPinyin
    });
  },

  onInputPinyin(e) {
    this.setData({ cardPinyin: e.detail.value });
  },

  onCatChange(e) {
    this.setData({ catIndex: parseInt(e.detail.value, 10) });
  },

  onTagChange(e) {
    this.setData({ tagIndex: parseInt(e.detail.value, 10) });
  },

  toggleRecord() {
    if (this.data.isRecording) {
      this.recorderManager.stop();
    } else {
      this.setData({ isRecording: true });
      this.recorderManager.start({ duration: 10000, format: 'mp3' });
    }
  },

  playRecorded() {
    if (!this.data.customAudioPath) return;
    const ctx = wx.createInnerAudioContext();
    ctx.src = this.data.customAudioPath;
    ctx.play();
    ctx.onEnded(() => ctx.destroy());
  },

  saveCard() {
    const text = this.data.cardText.trim();
    if (!text) {
      wx.showToast({ title: '请输入卡片名称', icon: 'none' });
      return;
    }

    const catObj = CAT_OPTIONS[this.data.catIndex];
    const tagObj = TAG_OPTIONS[this.data.tagIndex];
    const fz = FITZGERALD_COLORS[catObj.pos] || FITZGERALD_COLORS.noun;

    const newCard = {
      id: 'custom_' + Date.now(),
      text,
      pinyin: this.data.cardPinyin.trim(),
      category: catObj.id,
      pos: catObj.pos,
      tags: [tagObj.id, 'custom'],
      color: fz.bg,
      borderColor: fz.border,
      icon: '✨',
      customImg: this.data.photoUrl,
      customAudio: this.data.customAudioPath,
      hidden: false
    };

    const cards = [newCard, ...(app.globalData.cards || [])];
    app.saveCards(cards);

    wx.showToast({ title: '制卡成功！', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 1000);
  }
});
