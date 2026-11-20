/**
 * 声动星河 · 电子PECS系统 前端核心控制器
 * 包含：双模状态机、拖拽引擎、TTS多模态联动、情境感知算法、拍照做卡与行为数据量化
 */

class PECSApplication {
  constructor() {
    this.cards = [];
    this.sentence = [];
    this.currentCategory = 'all';
    this.currentContext = 'auto';
    this.logs = [];
    this.settings = {
      rate: 0.85,
      pitch: 1.0,
      volume: 1.0,
      voiceName: '',
      autoTimeContext: true
    };
    
    this.speechSynthesis = window.speechSynthesis;
    this.availableVoices = [];
    
    this.init();
  }

  init() {
    this.loadState();
    this.initVoices();
    this.renderCategoryNav();
    this.renderContextSelector();
    this.updateSentenceStrip();
    this.refreshCardsView();
    this.refreshRecommendations();
    this.bindEvents();
    this.refreshStats();
  }

  // 持久化加载本地数据 (本地优先)
  loadState() {
    try {
      const storedCards = localStorage.getItem('pecs_custom_cards');
      if (storedCards) {
        this.cards = JSON.parse(storedCards);
      } else {
        this.cards = [...DEFAULT_CARDS];
        this.saveCards();
      }

      const storedLogs = localStorage.getItem('pecs_behavior_logs');
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }

      const storedSettings = localStorage.getItem('pecs_settings');
      if (storedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
      }
    } catch (e) {
      console.error('加载本地存储失败，回退默认配置', e);
      this.cards = [...DEFAULT_CARDS];
    }

    // 初始化句子条默认起始卡（我想要）
    const starterCard = this.cards.find(c => c.id === 'core_want') || DEFAULT_CARDS[0];
    this.sentence = [{ ...starterCard, instanceId: 'init_' + Date.now() }];
  }

  saveCards() {
    localStorage.setItem('pecs_custom_cards', JSON.stringify(this.cards));
  }

  saveLogs() {
    localStorage.setItem('pecs_behavior_logs', JSON.stringify(this.logs));
  }

  saveSettings() {
    localStorage.setItem('pecs_settings', JSON.stringify(this.settings));
  }

  // 语音库初始化
  initVoices() {
    if (!this.speechSynthesis) return;
    const updateVoices = () => {
      this.availableVoices = this.speechSynthesis.getVoices().filter(v => v.lang.includes('zh') || v.lang.includes('cmn'));
      this.populateVoiceSelect();
    };
    updateVoices();
    if (this.speechSynthesis.onvoiceschanged !== undefined) {
      this.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  populateVoiceSelect() {
    const sel = document.getElementById('settingVoice');
    if (!sel) return;
    sel.innerHTML = '';
    
    const optDefault = document.createElement('option');
    optDefault.value = '';
    optDefault.textContent = '系统默认中文发音 (自然)';
    sel.appendChild(optDefault);

    this.availableVoices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      if (v.name === this.settings.voiceName) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  // 渲染分类导航
  renderCategoryNav() {
    const nav = document.getElementById('categoryNav');
    if (!nav) return;
    nav.innerHTML = '';

    CATEGORY_DEFINITIONS.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `cat-tab-btn ${this.currentCategory === cat.id ? 'active' : ''}`;
      btn.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;
      btn.addEventListener('click', () => {
        this.currentCategory = cat.id;
        this.renderCategoryNav();
        this.refreshCardsView();
      });
      nav.appendChild(btn);
    });
  }

  // 渲染情境下拉选择
  renderContextSelector() {
    const sel = document.getElementById('contextSelect');
    if (!sel) return;
    sel.innerHTML = '';

    CONTEXT_DEFINITIONS.forEach(ctx => {
      const opt = document.createElement('option');
      opt.value = ctx.id;
      opt.textContent = `${ctx.icon} ${ctx.name}`;
      if (ctx.id === this.currentContext) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.addEventListener('change', (e) => {
      this.currentContext = e.target.value;
      this.refreshRecommendations();
    });
  }

  // 智能情境感知推荐算法实现
  getRecommendedCards() {
    let activeTags = [];
    const hour = new Date().getHours();

    if (this.currentContext === 'auto') {
      if (hour >= 6 && hour < 10) activeTags = ['breakfast', 'meal', 'morning'];
      else if (hour >= 10 && hour < 12) activeTags = ['class', 'social'];
      else if (hour >= 12 && hour < 14) activeTags = ['meal', 'toilet', 'rest'];
      else if (hour >= 14 && hour < 18) activeTags = ['game', 'outdoor', 'snack'];
      else if (hour >= 18 && hour < 20) activeTags = ['meal', 'snack'];
      else activeTags = ['night', 'toilet', 'rest', 'emotion'];
    } else {
      const ctxDef = CONTEXT_DEFINITIONS.find(c => c.id === this.currentContext);
      activeTags = ctxDef && ctxDef.filterTags ? ctxDef.filterTags : [];
    }

    // 统计每张卡片历史使用频次
    const usageCounts = {};
    this.logs.forEach(log => {
      if (log.cardIds) {
        log.cardIds.forEach(id => {
          usageCounts[id] = (usageCounts[id] || 0) + 1;
        });
      }
    });

    // 计算推荐分值
    const scoredCards = this.cards
      .filter(c => c.id !== 'core_want') // 排除已常驻开头的起始卡
      .map(card => {
        let score = 0;
        // 情境标签匹配 (权重 0.5)
        if (card.tags && activeTags.some(t => card.tags.includes(t))) {
          score += 50;
        }
        // 历史频次平滑加权 (权重 0.3)
        score += Math.min((usageCounts[card.id] || 0) * 8, 30);
        // 常驻通用标签加权 (权重 0.2)
        if (card.tags && card.tags.includes('always')) {
          score += 15;
        }
        return { card, score };
      });

    scoredCards.sort((a, b) => b.score - a.score);
    return scoredCards.slice(0, 8).map(sc => sc.card);
  }

  // 刷新情境推荐栏
  refreshRecommendations() {
    const container = document.getElementById('recommendList');
    const label = document.getElementById('recommendContextLabel');
    if (!container) return;

    const ctxDef = CONTEXT_DEFINITIONS.find(c => c.id === this.currentContext);
    if (label && ctxDef) {
      label.textContent = `${ctxDef.icon} ${ctxDef.name}`;
    }

    const recs = this.getRecommendedCards();
    container.innerHTML = '';

    recs.forEach(card => {
      const el = this.createCardElement(card, false);
      container.appendChild(el);
    });
  }

  // 刷新主卡片网格
  refreshCardsView() {
    const grid = document.getElementById('cardsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    let filtered = this.cards;
    if (this.currentCategory !== 'all') {
      filtered = this.cards.filter(c => c.category === this.currentCategory);
    }

    filtered.forEach(card => {
      const el = this.createCardElement(card, false);
      grid.appendChild(el);
    });
  }

  // 创建单张卡片 DOM
  createCardElement(card, isInSentence = false, index = -1) {
    const div = document.createElement('div');
    div.className = `pecs-card ${isInSentence ? 'in-strip' : ''}`;
    div.dataset.cardId = card.id;
    if (card.color) div.style.backgroundColor = card.color;

    // 拼音
    const pinyinEl = document.createElement('div');
    pinyinEl.className = 'card-pinyin';
    pinyinEl.textContent = card.pinyin || '';
    div.appendChild(pinyinEl);

    // 图像展示
    const imgWrap = document.createElement('div');
    imgWrap.className = 'card-img-wrap';
    if (card.customImg) {
      const img = document.createElement('img');
      img.src = card.customImg;
      img.alt = card.text;
      imgWrap.appendChild(img);
    } else if (card.icon) {
      imgWrap.innerHTML = card.icon;
    }
    div.appendChild(imgWrap);

    // 汉字
    const textEl = document.createElement('div');
    textEl.className = 'card-text';
    textEl.textContent = card.text;
    div.appendChild(textEl);

    // 句子条内卡片的删除角标
    if (isInSentence && index > 0) { // 第0张是起始卡，保留保护
      const delBtn = document.createElement('button');
      delBtn.className = 'btn-remove-card';
      delBtn.innerHTML = '✕';
      delBtn.title = '移除此卡';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeFromSentence(index);
      });
      div.appendChild(delBtn);
    }

    // 拖拽属性支持 (HTML5 Drag and Drop)
    div.setAttribute('draggable', 'true');
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(card));
      div.classList.add('dragging');
    });
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
    });

    // 触控/点击交互
    div.addEventListener('click', () => {
      if (!isInSentence) {
        // 单击直接飞入句子条，并播放单字预览
        this.addToSentence(card);
        this.speakSingle(card.text);
      }
    });

    return div;
  }

  // 加入句子条
  addToSentence(card) {
    if (this.sentence.length >= 6) {
      // 避免低龄儿童无限堆叠卡片，设定上限6张（符合临床语法结构）
      return;
    }
    this.sentence.push({ ...card, instanceId: 'inst_' + Date.now() + '_' + Math.random() });
    this.updateSentenceStrip();
  }

  // 移出句子条
  removeFromSentence(index) {
    if (index === 0 && this.sentence.length > 1) {
      // 起始卡保护
      return;
    }
    this.sentence.splice(index, 1);
    this.updateSentenceStrip();
  }

  // 更新句子条展示
  updateSentenceStrip() {
    const board = document.getElementById('sentenceStripBoard');
    if (!board) return;
    board.innerHTML = '';

    this.sentence.forEach((card, index) => {
      const el = this.createCardElement(card, true, index);
      board.appendChild(el);
    });

    // 自动滚动到最右端
    board.scrollLeft = board.scrollWidth;
  }

  // 单词即时试听
  speakSingle(text) {
    if (!this.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;
    if (this.settings.voiceName) {
      const voice = this.availableVoices.find(v => v.name === this.settings.voiceName);
      if (voice) utterance.voice = voice;
    }
    this.speechSynthesis.speak(utterance);
  }

  // 朗读整个句子条 (核心 PECS 沟通动作)
  speakSentence() {
    if (!this.speechSynthesis || this.sentence.length === 0) return;

    this.speechSynthesis.cancel();
    const btnSpeak = document.getElementById('btnSpeakSentence');
    if (btnSpeak) btnSpeak.classList.add('speaking');

    const sentenceText = this.sentence.map(c => c.text).join(' ');
    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.lang = 'zh-CN';
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;

    if (this.settings.voiceName) {
      const voice = this.availableVoices.find(v => v.name === this.settings.voiceName);
      if (voice) utterance.voice = voice;
    }

    // 逐卡高亮联动逻辑
    const board = document.getElementById('sentenceStripBoard');
    const cardsDom = board ? board.querySelectorAll('.pecs-card') : [];

    let currentCardIndex = 0;
    const highlightInterval = (sentenceText.length * 400 * (1 / this.settings.rate)) / this.sentence.length;
    
    // 启动定时视觉流动动画
    const animTimer = setInterval(() => {
      cardsDom.forEach((c, idx) => {
        if (idx === currentCardIndex) c.classList.add('highlight-playing');
        else c.classList.remove('highlight-playing');
      });
      currentCardIndex++;
      if (currentCardIndex >= this.sentence.length) {
        clearInterval(animTimer);
      }
    }, Math.max(350, highlightInterval));

    utterance.onend = () => {
      clearInterval(animTimer);
      cardsDom.forEach(c => c.classList.remove('highlight-playing'));
      if (btnSpeak) btnSpeak.classList.remove('speaking');
      
      // 记录本次沟通行为事件
      this.logCommunicationEvent();
    };

    utterance.onerror = () => {
      clearInterval(animTimer);
      cardsDom.forEach(c => c.classList.remove('highlight-playing'));
      if (btnSpeak) btnSpeak.classList.remove('speaking');
    };

    this.speechSynthesis.speak(utterance);
  }

  // 记录沟通行为事件
  logCommunicationEvent() {
    const event = {
      id: 'log_' + Date.now(),
      timestamp: Date.now(),
      timeStr: new Date().toLocaleTimeString(),
      dateStr: new Date().toLocaleDateString(),
      context: this.currentContext,
      sentenceText: this.sentence.map(c => c.text).join(' '),
      cardIds: this.sentence.map(c => c.id),
      cardCount: this.sentence.length,
      independent: true // 默认由儿童自主点击触发
    };

    this.logs.unshift(event);
    if (this.logs.length > 500) this.logs.pop(); // 存储最近500条
    this.saveLogs();
    this.refreshStats();
  }

  // 刷新行为统计与可视化看板
  refreshStats() {
    const totalCountEl = document.getElementById('statTotalCount');
    const todayCountEl = document.getElementById('statTodayCount');
    const topCardsEl = document.getElementById('statTopCards');
    const logsTbody = document.getElementById('logsTableBody');

    if (!totalCountEl) return;

    const todayStr = new Date().toLocaleDateString();
    const todayLogs = this.logs.filter(l => l.dateStr === todayStr);

    totalCountEl.textContent = this.logs.length;
    todayCountEl.textContent = todayLogs.length;

    // 统计高频卡片 Top 5
    const cardFrequencies = {};
    this.logs.forEach(l => {
      if (l.cardIds) {
        l.cardIds.forEach(id => {
          if (id !== 'core_want') {
            cardFrequencies[id] = (cardFrequencies[id] || 0) + 1;
          }
        });
      }
    });

    const topList = Object.entries(cardFrequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const found = this.cards.find(c => c.id === id);
        return found ? `${found.text} (${count}次)` : id;
      });

    if (topCardsEl) {
      topCardsEl.textContent = topList.length > 0 ? topList.join('、') : '暂无数据';
    }

    // 渲染最近日志表格
    if (logsTbody) {
      logsTbody.innerHTML = '';
      const recentLogs = this.logs.slice(0, 15);
      if (recentLogs.length === 0) {
        logsTbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:16px;">尚无沟通记录，儿童完成一次朗读后自动记录</td></tr>`;
      } else {
        recentLogs.forEach(l => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${l.dateStr} ${l.timeStr}</td>
            <td><strong style="color:#0284c7;">${l.sentenceText}</strong></td>
            <td><span class="recommend-tag">${l.context}</span></td>
            <td>${l.cardCount} 张卡</td>
          `;
          logsTbody.appendChild(tr);
        });
      }
    }

    this.renderCharts();
  }

  // 渲染原生轻量 SVG 图表
  renderCharts() {
    const trendContainer = document.getElementById('chartTrend');
    if (!trendContainer) return;

    // 统计过去 7 天每天的沟通次数
    const days = [];
    const counts = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toLocaleDateString();
      days.push((d.getMonth() + 1) + '/' + d.getDate());
      counts.push(this.logs.filter(l => l.dateStr === str).length);
    }

    const maxCount = Math.max(...counts, 8);
    const width = 340;
    const height = 140;
    const padding = 25;

    // 生成折线坐标点
    const points = counts.map((c, i) => {
      const x = padding + (i / 6) * (width - 2 * padding);
      const y = height - padding - (c / maxCount) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%; height:140px; background:#F8FAFC; border-radius:12px;">`;
    // 坐标横线
    svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#CBD5E1" stroke-width="1.5" />`;
    // 折线与面积
    svg += `<polyline fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${points}" />`;
    
    // 数据圆点与文字
    counts.forEach((c, i) => {
      const x = padding + (i / 6) * (width - 2 * padding);
      const y = height - padding - (c / maxCount) * (height - 2 * padding);
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="#0284C7" />`;
      svg += `<text x="${x}" y="${height - 6}" font-size="10" fill="#64748B" text-anchor="middle">${days[i]}</text>`;
      if (c > 0) {
        svg += `<text x="${x}" y="${y - 8}" font-size="10" font-weight="bold" fill="#0369A1" text-anchor="middle">${c}</text>`;
      }
    });

    svg += `</svg>`;
    trendContainer.innerHTML = svg;
  }

  // 绑定全局DOM交互事件
  bindEvents() {
    // 朗读整句
    const btnSpeak = document.getElementById('btnSpeakSentence');
    if (btnSpeak) {
      btnSpeak.addEventListener('click', () => this.speakSentence());
    }

    // 清空句子条
    const btnClear = document.getElementById('btnClearSentence');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        const starterCard = this.cards.find(c => c.id === 'core_want') || DEFAULT_CARDS[0];
        this.sentence = [{ ...starterCard, instanceId: 'init_' + Date.now() }];
        this.updateSentenceStrip();
      });
    }

    // 移除末尾
    const btnBack = document.getElementById('btnBackSentence');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (this.sentence.length > 1) {
          this.sentence.pop();
          this.updateSentenceStrip();
        }
      });
    }

    // 句子条拖放目标监听
    const stripBoard = document.getElementById('sentenceStripBoard');
    if (stripBoard) {
      stripBoard.addEventListener('dragover', (e) => {
        e.preventDefault();
        stripBoard.classList.add('drag-over');
      });
      stripBoard.addEventListener('dragleave', () => {
        stripBoard.classList.remove('drag-over');
      });
      stripBoard.addEventListener('drop', (e) => {
        e.preventDefault();
        stripBoard.classList.remove('drag-over');
        try {
          const data = e.dataTransfer.getData('text/plain');
          if (data) {
            const card = JSON.parse(data);
            this.addToSentence(card);
            this.speakSingle(card.text);
          }
        } catch (err) {
          console.error('拖拽解析失败', err);
        }
      });
    }

    // 家长模式切换与儿童锁
    const btnParentMode = document.getElementById('btnParentMode');
    if (btnParentMode) {
      btnParentMode.addEventListener('click', () => this.showChildLockModal());
    }

    // 模态框关闭
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

    // 家长中心标签切换
    document.querySelectorAll('.modal-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        const targetTab = e.target.dataset.tab;
        document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        const activePane = document.getElementById(`tabPane_${targetTab}`);
        if (activePane) activePane.classList.add('active');
      });
    });

    // 拍照/传图制卡处理
    this.initCardCreator();

    // 语音与设置监听
    this.initSettingsEvents();
  }

  // 儿童安全防误触锁
  showChildLockModal() {
    const modal = document.getElementById('childLockModal');
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    const expected = n1 + n2;

    const questionEl = document.getElementById('lockQuestion');
    const inputEl = document.getElementById('lockAnswerInput');
    const confirmBtn = document.getElementById('btnConfirmLock');

    if (questionEl) questionEl.textContent = `请计算：${n1} + ${n2} = ?`;
    if (inputEl) {
      inputEl.value = '';
      inputEl.focus();
    }

    modal.classList.add('active');

    const handleConfirm = () => {
      if (parseInt(inputEl.value, 10) === expected) {
        modal.classList.remove('active');
        this.openParentDashboard();
      } else {
        alert('答案有误，请家长或老师重新作答');
        inputEl.value = '';
        inputEl.focus();
      }
      confirmBtn.removeEventListener('click', handleConfirm);
    };

    confirmBtn.addEventListener('click', handleConfirm);
  }

  // 打开家长管理中心
  openParentDashboard() {
    const modal = document.getElementById('parentDashboardModal');
    if (modal) {
      modal.classList.add('active');
      this.refreshStats();
      this.refreshCardLibraryManager();
    }
  }

  // 拍照与制卡流水线
  initCardCreator() {
    const fileInput = document.getElementById('inputCardPhoto');
    const previewWrap = document.getElementById('cardPhotoPreview');
    const previewImg = document.getElementById('previewImg');
    const btnSave = document.getElementById('btnSaveNewCard');
    const btnPreviewVoice = document.getElementById('btnPreviewVoice');

    let currentImageDataUrl = '';

    if (previewWrap && fileInput) {
      previewWrap.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // 前端 Canvas 256x256 正方形自适应居中裁剪
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');

            const size = Math.min(img.width, img.height);
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;

            ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256);
            currentImageDataUrl = canvas.toDataURL('image/jpeg', 0.85);

            if (previewImg) {
              previewImg.src = currentImageDataUrl;
              previewImg.style.display = 'block';
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // 试听声音
    if (btnPreviewVoice) {
      btnPreviewVoice.addEventListener('click', () => {
        const text = document.getElementById('inputCardText').value.trim();
        if (text) this.speakSingle(text);
        else alert('请先输入卡片词汇名称');
      });
    }

    // 保存新卡片
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const text = document.getElementById('inputCardText').value.trim();
        const pinyin = document.getElementById('inputCardPinyin').value.trim();
        const category = document.getElementById('selectCardCategory').value;
        const tag = document.getElementById('selectCardTag').value;

        if (!text) {
          alert('请输入词汇汉字！');
          return;
        }

        const newCard = {
          id: 'custom_' + Date.now(),
          text: text,
          pinyin: pinyin,
          category: category,
          pos: 'noun',
          tags: [tag, 'custom'],
          color: '#FFFFFF',
          customImg: currentImageDataUrl || '',
          icon: currentImageDataUrl ? '' : `<svg viewBox="0 0 64 64" fill="none" stroke="#0284C7" stroke-width="3"><circle cx="32" cy="32" r="22"/><text x="32" y="38" font-size="20" font-weight="bold" fill="#0284C7" text-anchor="middle">${text.charAt(0)}</text></svg>`
        };

        this.cards.unshift(newCard);
        this.saveCards();
        this.refreshCardsView();
        this.refreshRecommendations();
        this.refreshCardLibraryManager();

        alert(`成功制作新卡片【${text}】！已加入卡库。`);

        // 重置表单
        document.getElementById('inputCardText').value = '';
        document.getElementById('inputCardPinyin').value = '';
        if (previewImg) previewImg.style.display = 'none';
        currentImageDataUrl = '';
      });
    }
  }

  // 卡库管理面板
  refreshCardLibraryManager() {
    const listWrap = document.getElementById('cardLibraryList');
    if (!listWrap) return;
    listWrap.innerHTML = '';

    this.cards.forEach(card => {
      const item = document.createElement('div');
      item.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border:1px solid #E2E8F0; border-radius:10px; margin-bottom:8px; background:#fff;';
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:15px; font-weight:bold; color:#0F172A;">${card.text}</span>
          <span style="font-size:12px; color:#64748B;">(${card.pinyin || ''})</span>
          <span class="recommend-tag">${card.category}</span>
        </div>
        <div>
          ${card.id.startsWith('custom_') ? `<button class="btn-action-ghost btn-del-custom" data-id="${card.id}" style="padding:4px 8px; color:#ef4444; border-color:#fca5a5;">删除</button>` : '<span style="font-size:11px; color:#94a3b8;">系统预置</span>'}
        </div>
      `;

      const delBtn = item.querySelector('.btn-del-custom');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          if (confirm(`确认删除卡片【${card.text}】吗？`)) {
            this.cards = this.cards.filter(c => c.id !== card.id);
            this.saveCards();
            this.refreshCardsView();
            this.refreshRecommendations();
            this.refreshCardLibraryManager();
          }
        });
      }
      listWrap.appendChild(item);
    });
  }

  // 语音调参与离线同步事件
  initSettingsEvents() {
    const rateRange = document.getElementById('settingRate');
    const rateValue = document.getElementById('rateValueLabel');
    if (rateRange) {
      rateRange.value = this.settings.rate;
      rateRange.addEventListener('input', (e) => {
        this.settings.rate = parseFloat(e.target.value);
        if (rateValue) rateValue.textContent = this.settings.rate + 'x';
        this.saveSettings();
      });
    }

    const voiceSelect = document.getElementById('settingVoice');
    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        this.settings.voiceName = e.target.value;
        this.saveSettings();
      });
    }

    // 导出离线卡包 (JSON)
    const btnExport = document.getElementById('btnExportPack');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const bundle = {
          version: '1.0',
          appName: '声动星河电子PECS',
          exportedAt: new Date().toISOString(),
          cards: this.cards,
          logs: this.logs
        };
        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `电子PECS_离线卡包_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // 导入离线卡包
    const btnImport = document.getElementById('btnImportPack');
    const inputImport = document.getElementById('inputImportFile');
    if (btnImport && inputImport) {
      btnImport.addEventListener('click', () => inputImport.click());
      inputImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data && data.cards && Array.isArray(data.cards)) {
              this.cards = data.cards;
              this.saveCards();
              this.refreshCardsView();
              this.refreshRecommendations();
              this.refreshCardLibraryManager();
              alert(`成功导入卡包！包含 ${data.cards.length} 张沟通卡。`);
            } else {
              alert('卡包格式不合规，未包含有效卡片数据');
            }
          } catch (err) {
            alert('卡包文件解析失败，请检查文件格式');
          }
        };
        reader.readAsText(file);
      });
    }
  }
}

// 页面加载完成后实例化应用
window.addEventListener('DOMContentLoaded', () => {
  window.pecsApp = new PECSApplication();
});
