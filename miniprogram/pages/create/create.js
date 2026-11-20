// pages/create/create.js
const app = getApp();

Page({
  data: {
    photoUrl: '',
    cardText: '',
    cardPinyin: ''
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          photoUrl: res.tempFiles[0].tempFilePath
        });
      }
    });
  },

  onInputText(e) {
    this.setData({ cardText: e.detail.value });
  },

  onInputPinyin(e) {
    this.setData({ cardPinyin: e.detail.value });
  },

  saveCard() {
    if (!this.data.cardText) {
      wx.showToast({ title: '请输入卡片名称', icon: 'none' });
      return;
    }
    const newCard = {
      id: 'custom_' + Date.now(),
      text: this.data.cardText,
      pinyin: this.data.cardPinyin || '',
      category: 'food',
      icon: '✨',
      customImg: this.data.photoUrl
    };

    const cards = app.globalData.cards || [];
    cards.unshift(newCard);
    app.globalData.cards = cards;
    wx.setStorageSync('pecs_cards', cards);

    wx.showToast({ title: '制卡成功！', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1200);
  }
});
