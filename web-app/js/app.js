/**
 * 声动星河 · 电子PECS系统 前端核心控制器 (临床升级版)
 * 支持：Fitzgerald Key 色彩编码、多句式起始卡、递卡社交交换展示、
 *       家长真人录音、卡片显隐渐进训练、情境推荐算法与行为CSV导出
 */

class PECSApplication {
  constructor() {
    this.cards = [];
    this.sentence = [];
    this.activeStarterId = 'core_want';
    this.currentCategory = 'all';
    this.currentContext = 'auto';
    this.logs = [];
    this.settings = {
      rate: 0.85,
      pitch: 1.0,
      volume: 1.0,
      voiceName: '',
      gridDensity: 'standard',
      autoTimeContext: true
    };

    this.speechSynthesis = window.speechSynthesis;
    this.availableVoices = [];
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.currentRecordedAudio = '';

    this.init();
  }

  init() {
    this.loadState();
    this.initVoices();
    this.applyGridDensity();
    this.renderContextPills();
    this.renderStarterSwitcher();
    this.renderCategoryNav();
    this.updateSentenceStrip();
    this.refreshCardsView();
    this.refreshRecommendations();
    this.bindEvents();
    this.refreshStats();
  }

  loadState() {
    try {
      const storedCards = localStorage.getItem('pecs_custom_cards_v2');
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

    this.resetSentenceToStarter();
  }

  resetSentenceToStarter() {
    const starterCard = this.cards.find(c => c.id === this.activeStarterId) || STARTER_CARDS[0];
    this.sentence = [{ ...starterCard, instanceId: 'init_' + Date.now() }];
  }

  saveCards() {
    localStorage.setItem('pecs_custom_cards_v2', JSON.stringify(this.cards));
  }

  saveLogs() {
    localStorage.setItem('pecs_behavior_logs', JSON.stringify(this.logs));
  }

  saveSettings() {
    localStorage.setItem('pecs_settings', JSON.stringify(this.settings));
  }

  initVoices() {
    if (!this.speechSynthesis) return;
    const updateVoices = () => {
      this.availableVoices = this.speechSynthesis.getVoices().filter(
        v => v.lang.includes('zh') || v.lang.includes('cmn')
      );
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

  applyGridDensity() {
    const grid = document.getElementById('cardsGrid');
    const sel = document.getElementById('settingGridDensity');
    if (grid) {
      if (this.settings.gridDensity === 'beginner') {
        grid.classList.add('grid-beginner');
      } else {
        grid.classList.remove('grid-beginner');
      }
    }
    if (sel) sel.value = this.settings.gridDensity;
  }

  // 渲染情境快捷胶囊栏
  renderContextPills() {
    const bar = document.getElementById('contextPillsBar');
    if (!bar) return;
    bar.innerHTML = `<span class="context-label">📍 当前情境:</span>`;

    CONTEXT_DEFINITIONS.forEach(ctx => {
      const btn = document.createElement('button');
      btn.className = `context-pill ${this.currentContext === ctx.id ? 'active' : ''}`;
      btn.innerHTML = `<span>${ctx.icon}</span><span>${ctx.name}</span>`;
      btn.title = ctx.desc;
      btn.addEventListener('click', () => {
        this.currentContext = ctx.id;
        this.renderContextPills();
        this.refreshRecommendations();
      });
      bar.appendChild(btn);
    });
  }

  // 渲染句式起始卡快速切换 (支持请求/拒绝/情绪/评论)
  renderStarterSwitcher() {
    const container = document.getElementById('starterSwitcher');
    if (!container) return;
    container.innerHTML = '';

    STARTER_CARDS.forEach(st => {
      const chip = document.createElement('button');
      chip.className = `starter-chip ${this.activeStarterId === st.id ? 'active' : ''}`;
      chip.textContent = st.text;
      chip.addEventListener('click', () => {
        this.activeStarterId = st.id;
        if (this.sentence.length > 0) {
          this.sentence[0] = { ...st, instanceId: 'init_' + Date.now() };
        } else {
          this.sentence = [{ ...st, instanceId: 'init_' + Date.now() }];
        }
        this.renderStarterSwitcher();
        this.updateSentenceStrip();
        this.speakSingleCard(st);
      });
      container.appendChild(chip);
    });
  }

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

  // 智能情境感知推荐算法
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

    const usageCounts = {};
    this.logs.forEach(log => {
      if (log.cardIds) {
        log.cardIds.forEach(id => {
          usageCounts[id] = (usageCounts[id] || 0) + 1;
        });
      }
    });

    const starterIds = STARTER_CARDS.map(s => s.id);

    const scoredCards = this.cards
      .filter(c => !starterIds.includes(c.id) && !c.hidden)
      .map(card => {
        let score = 0;
        if (card.tags && activeTags.some(t => card.tags.includes(t))) {
          score += 50;
        }
        score += Math.min((usageCounts[card.id] || 0) * 8, 30);
        if (card.tags && card.tags.includes('always')) {
          score += 15;
        }
        return { card, score };
      });

    scoredCards.sort((a, b) => b.score - a.score);
    return scoredCards.slice(0, 8).map(sc => sc.card);
  }

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

  refreshCardsView() {
    const grid = document.getElementById('cardsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const starterIds = STARTER_CARDS.map(s => s.id);
    let filtered = this.cards.filter(c => !c.hidden && !starterIds.includes(c.id));
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(c => c.category === this.currentCategory);
    }

    filtered.forEach(card => {
      const el = this.createCardElement(card, false);
      grid.appendChild(el);
    });
  }

  createCardElement(card, isInSentence = false, index = -1) {
    const div = document.createElement('div');
    div.className = `pecs-card ${isInSentence ? 'in-strip' : ''}`;
    div.dataset.cardId = card.id;
    if (card.color) div.style.backgroundColor = card.color;
    if (card.borderColor) div.style.borderColor = card.borderColor;

    if (card.customAudio && !isInSentence) {
      const audioBadge = document.createElement('span');
      audioBadge.className = 'card-audio-badge';
      audioBadge.textContent = '🎙️';
      audioBadge.title = '已录制家长原声';
      div.appendChild(audioBadge);
    }

    const pinyinEl = document.createElement('div');
    pinyinEl.className = 'card-pinyin';
    pinyinEl.textContent = card.pinyin || '';
    div.appendChild(pinyinEl);

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

    const textEl = document.createElement('div');
    textEl.className = 'card-text';
    textEl.textContent = card.text;
    div.appendChild(textEl);

    if (isInSentence && index > 0) {
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

    div.setAttribute('draggable', 'true');
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(card));
      div.classList.add('dragging');
    });
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
    });

    div.addEventListener('click', () => {
      if (!isInSentence) {
        this.addToSentence(card);
        this.speakSingleCard(card);
      }
    });

    return div;
  }

  addToSentence(card) {
    if (this.sentence.length >= 6) return;
    this.sentence.push({ ...card, instanceId: 'inst_' + Date.now() + '_' + Math.random() });
    this.updateSentenceStrip();
  }

  removeFromSentence(index) {
    if (index === 0 && this.sentence.length > 1) return;
    this.sentence.splice(index, 1);
    this.updateSentenceStrip();
  }

  updateSentenceStrip() {
    const board = document.getElementById('sentenceStripBoard');
    if (!board) return;
    board.innerHTML = '';

    this.sentence.forEach((card, index) => {
      const el = this.createCardElement(card, true, index);
      board.appendChild(el);
    });

    if (this.sentence.length <= 1) {
      const hint = document.createElement('span');
      hint.className = 'strip-placeholder-hint';
      hint.textContent = '👉 点击或拖拽下方卡片到这里组句...';
      board.appendChild(hint);
    }

    board.scrollLeft = board.scrollWidth;
  }

  // 单卡发声 (优先使用家长录制原声，否则使用TTS)
  speakSingleCard(card) {
    if (card.customAudio) {
      const audio = new Audio(card.customAudio);
      audio.play().catch(() => this.speakText(card.text));
      return;
    }
    this.speakText(card.text);
  }

  speakText(text) {
    if (!this.speechSynthesis || !text) return;
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

  // 朗读整句并逐卡高亮
  speakSentence(logEvent = true) {
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

    const board = document.getElementById('sentenceStripBoard');
    const cardsDom = board ? board.querySelectorAll('.pecs-card') : [];

    let currentCardIndex = 0;
    const stepMs = Math.max(350, (sentenceText.length * 360 * (1 / this.settings.rate)) / this.sentence.length);

    const animTimer = setInterval(() => {
      cardsDom.forEach((c, idx) => {
        if (idx === currentCardIndex) c.classList.add('highlight-playing');
        else c.classList.remove('highlight-playing');
      });
      currentCardIndex++;
      if (currentCardIndex >= this.sentence.length) {
        clearInterval(animTimer);
      }
    }, stepMs);

    utterance.onend = () => {
      clearInterval(animTimer);
      cardsDom.forEach(c => c.classList.remove('highlight-playing'));
      if (btnSpeak) btnSpeak.classList.remove('speaking');
      if (logEvent) this.logCommunicationEvent(true);
    };

    utterance.onerror = () => {
      clearInterval(animTimer);
      cardsDom.forEach(c => c.classList.remove('highlight-playing'));
      if (btnSpeak) btnSpeak.classList.remove('speaking');
    };

    this.speechSynthesis.speak(utterance);
  }

  // 打开“递给大人看”社交交换全屏模式
  openExchangeShowcase() {
    if (this.sentence.length === 0) return;
    const modal = document.getElementById('exchangeShowcaseModal');
    const showcase = document.getElementById('exchangeCardsShowcase');
    const textEl = document.getElementById('exchangeSentenceText');
    if (!modal || !showcase) return;

    showcase.innerHTML = '';
    this.sentence.forEach(card => {
      const cardEl = this.createCardElement(card, false);
      showcase.appendChild(cardEl);
    });

    const fullText = this.sentence.map(c => c.text).join(' ');
    if (textEl) textEl.textContent = fullText;

    modal.classList.add('active');
    this.speakSentence(false); // 展示时同时播报语音，但不重复计入日志，等大人确认后记入
  }

  confirmExchange(isIndependent) {
    this.logCommunicationEvent(isIndependent);
    const modal = document.getElementById('exchangeShowcaseModal');
    if (modal) modal.classList.remove('active');
    this.resetSentenceToStarter();
    this.updateSentenceStrip();
  }

  logCommunicationEvent(independent = true) {
    const event = {
      id: 'log_' + Date.now(),
      timestamp: Date.now(),
      timeStr: new Date().toLocaleTimeString(),
      dateStr: new Date().toLocaleDateString(),
      context: this.currentContext,
      sentenceText: this.sentence.map(c => c.text).join(' '),
      cardIds: this.sentence.map(c => c.id),
      cardCount: this.sentence.length,
      independent: independent
    };

    this.logs.unshift(event);
    if (this.logs.length > 500) this.logs.pop();
    this.saveLogs();
    this.refreshStats();
  }

  refreshStats() {
    const totalCountEl = document.getElementById('statTotalCount');
    const todayCountEl = document.getElementById('statTodayCount');
    const indepRateEl = document.getElementById('statIndependentRate');
    const topCardsEl = document.getElementById('statTopCards');
    const logsTbody = document.getElementById('logsTableBody');

    if (!totalCountEl) return;

    const todayStr = new Date().toLocaleDateString();
    const todayLogs = this.logs.filter(l => l.dateStr === todayStr);
    const indepCount = this.logs.filter(l => l.independent !== false).length;
    const indepRate = this.logs.length > 0 ? Math.round((indepCount / this.logs.length) * 100) : 100;

    totalCountEl.textContent = this.logs.length;
    todayCountEl.textContent = todayLogs.length;
    if (indepRateEl) indepRateEl.textContent = `${indepRate}%`;

    const starterIds = STARTER_CARDS.map(s => s.id);
    const cardFrequencies = {};
    this.logs.forEach(l => {
      if (l.cardIds) {
        l.cardIds.forEach(id => {
          if (!starterIds.includes(id)) {
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
        return found ? `${found.text}(${count})` : id;
      });

    if (topCardsEl) {
      topCardsEl.textContent = topList.length > 0 ? topList.join(' · ') : '暂无数据';
    }

    if (logsTbody) {
      logsTbody.innerHTML = '';
      const recentLogs = this.logs.slice(0, 20);
      if (recentLogs.length === 0) {
        logsTbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:18px;">尚无沟通记录，儿童完成一次朗读或交换后自动记录</td></tr>`;
      } else {
        recentLogs.forEach(l => {
          const tr = document.createElement('tr');
          const modeBadge = l.independent !== false
            ? `<span style="color:#15803D;background:#DCFCE7;padding:2px 6px;border-radius:6px;font-size:11px;font-weight:700;">自主表达</span>`
            : `<span style="color:#B45309;background:#FEF3C7;padding:2px 6px;border-radius:6px;font-size:11px;font-weight:700;">辅助引导</span>`;
          tr.innerHTML = `
            <td>${l.dateStr} ${l.timeStr}</td>
            <td><strong style="color:#0284c7;">${l.sentenceText}</strong></td>
            <td><span class="recommend-tag">${l.context}</span></td>
            <td>${modeBadge}</td>
          `;
          logsTbody.appendChild(tr);
        });
      }
    }

    this.renderCharts();
  }

  renderCharts() {
    const trendContainer = document.getElementById('chartTrend');
    if (!trendContainer) return;

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
    const width = 360;
    const height = 140;
    const padding = 25;

    const points = counts.map((c, i) => {
      const x = padding + (i / 6) * (width - 2 * padding);
      const y = height - padding - (c / maxCount) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%; height:140px; background:#F8FAFC; border-radius:12px; border:1px solid #E2E8F0;">`;
    svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#CBD5E1" stroke-width="1.5" />`;
    svg += `<polyline fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${points}" />`;

    counts.forEach((c, i) => {
      const x = padding + (i / 6) * (width - 2 * padding);
      const y = height - padding - (c / maxCount) * (height - 2 * padding);
      svg += `<circle cx="${x}" cy="${y}" r="4.5" fill="#0284C7" />`;
      svg += `<text x="${x}" y="${height - 6}" font-size="10" fill="#64748B" text-anchor="middle">${days[i]}</text>`;
      if (c > 0) {
        svg += `<text x="${x}" y="${y - 8}" font-size="10" font-weight="bold" fill="#0369A1" text-anchor="middle">${c}</text>`;
      }
    });

    svg += `</svg>`;
    trendContainer.innerHTML = svg;
  }

  bindEvents() {
    const btnSpeak = document.getElementById('btnSpeakSentence');
    if (btnSpeak) btnSpeak.addEventListener('click', () => this.speakSentence(true));

    const btnClear = document.getElementById('btnClearSentence');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        this.resetSentenceToStarter();
        this.updateSentenceStrip();
      });
    }

    const btnBack = document.getElementById('btnBackSentence');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (this.sentence.length > 1) {
          this.sentence.pop();
          this.updateSentenceStrip();
        }
      });
    }

    // 递卡社交交换按钮
    const btnExchange = document.getElementById('btnExchangeShow');
    if (btnExchange) btnExchange.addEventListener('click', () => this.openExchangeShowcase());

    const btnExchangeSpeak = document.getElementById('btnExchangeSpeak');
    if (btnExchangeSpeak) btnExchangeSpeak.addEventListener('click', () => this.speakSentence(false));

    const btnConfirmIndep = document.getElementById('btnConfirmIndependent');
    if (btnConfirmIndep) btnConfirmIndep.addEventListener('click', () => this.confirmExchange(true));

    const btnConfirmPrompt = document.getElementById('btnConfirmPrompted');
    if (btnConfirmPrompt) btnConfirmPrompt.addEventListener('click', () => this.confirmExchange(false));

    // 句子条拖放
    const stripBoard = document.getElementById('sentenceStripBoard');
    if (stripBoard) {
      stripBoard.addEventListener('dragover', (e) => {
        e.preventDefault();
        stripBoard.classList.add('drag-over');
      });
      stripBoard.addEventListener('dragleave', () => stripBoard.classList.remove('drag-over'));
      stripBoard.addEventListener('drop', (e) => {
        e.preventDefault();
        stripBoard.classList.remove('drag-over');
        try {
          const data = e.dataTransfer.getData('text/plain');
          if (data) {
            const card = JSON.parse(data);
            this.addToSentence(card);
            this.speakSingleCard(card);
          }
        } catch (err) {
          console.error('拖拽解析失败', err);
        }
      });
    }

    const btnParentMode = document.getElementById('btnParentMode');
    if (btnParentMode) btnParentMode.addEventListener('click', () => this.showChildLockModal());

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

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

    // 搜索卡库
    const searchInput = document.getElementById('inputSearchLibrary');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.refreshCardLibraryManager(e.target.value.trim());
      });
    }

    this.initCardCreator();
    this.initSettingsEvents();
  }

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
      setTimeout(() => inputEl.focus(), 100);
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

  openParentDashboard() {
    const modal = document.getElementById('parentDashboardModal');
    if (modal) {
      modal.classList.add('active');
      this.refreshStats();
      this.refreshCardLibraryManager();
    }
  }

  // 拍照做卡工坊 + 自动拼音 + 真人录音
  initCardCreator() {
    const fileInput = document.getElementById('inputCardPhoto');
    const previewWrap = document.getElementById('cardPhotoPreview');
    const previewImg = document.getElementById('previewImg');
    const textInput = document.getElementById('inputCardText');
    const pinyinInput = document.getElementById('inputCardPinyin');
    const btnSave = document.getElementById('btnSaveNewCard');
    const btnPreviewVoice = document.getElementById('btnPreviewVoice');

    const btnToggleRecord = document.getElementById('btnToggleRecord');
    const btnPlayRecorded = document.getElementById('btnPlayRecorded');
    const btnClearRecord = document.getElementById('btnClearRecord');
    const recordStatusText = document.getElementById('recordStatusText');

    let currentImageDataUrl = '';

    // 输入汉字自动匹配拼音
    if (textInput && pinyinInput) {
      textInput.addEventListener('input', (e) => {
        const autoPy = autoGeneratePinyin(e.target.value);
        if (autoPy) pinyinInput.value = autoPy;
      });
    }

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

    // 家长真人录音逻辑
    if (btnToggleRecord) {
      btnToggleRecord.addEventListener('click', async () => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();
          btnToggleRecord.textContent = '🎙️ 重新录音';
          return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.recordedChunks = [];
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (ev) => {
            if (ev.data.size > 0) this.recordedChunks.push(ev.data);
          };
          this.mediaRecorder.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
            const r = new FileReader();
            r.onloadend = () => {
              this.currentRecordedAudio = r.result;
              if (recordStatusText) recordStatusText.textContent = '✅ 已录制家长专属语音';
              if (btnPlayRecorded) btnPlayRecorded.style.display = 'inline-flex';
              if (btnClearRecord) btnClearRecord.style.display = 'inline-flex';
            };
            r.readAsDataURL(blob);
          };
          this.mediaRecorder.start();
          btnToggleRecord.textContent = '⏹️ 停止录音';
          if (recordStatusText) recordStatusText.textContent = '🔴 正在录音中，请清晰读出词汇...';
        } catch (err) {
          alert('无法访问麦克风，请检查浏览器权限或直接使用系统离线TTS');
        }
      });
    }

    if (btnPlayRecorded) {
      btnPlayRecorded.addEventListener('click', () => {
        if (this.currentRecordedAudio) {
          new Audio(this.currentRecordedAudio).play();
        }
      });
    }

    if (btnClearRecord) {
      btnClearRecord.addEventListener('click', () => {
        this.currentRecordedAudio = '';
        if (recordStatusText) recordStatusText.textContent = '未录制自定义语音 (将使用系统TTS)';
        if (btnPlayRecorded) btnPlayRecorded.style.display = 'none';
        if (btnClearRecord) btnClearRecord.style.display = 'none';
      });
    }

    if (btnPreviewVoice) {
      btnPreviewVoice.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) this.speakText(text);
        else alert('请先输入卡片词汇名称');
      });
    }

    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const text = textInput.value.trim();
        const pinyin = pinyinInput.value.trim();
        const category = document.getElementById('selectCardCategory').value;
        const tag = document.getElementById('selectCardTag').value;

        if (!text) {
          alert('请输入词汇汉字！');
          return;
        }

        // 自动匹配 Fitzgerald Key 色彩
        const posMap = {
          food: 'noun', toy: 'noun', action: 'verb',
          daily: 'verb', emotion: 'adj', people: 'people', social: 'social'
        };
        const pos = posMap[category] || 'noun';
        const fz = FITZGERALD_COLORS[pos] || FITZGERALD_COLORS.noun;

        const newCard = {
          id: 'custom_' + Date.now(),
          text: text,
          pinyin: pinyin,
          category: category,
          pos: pos,
          tags: [tag, 'custom'],
          color: fz.bg,
          borderColor: fz.border,
          customImg: currentImageDataUrl || '',
          customAudio: this.currentRecordedAudio || '',
          hidden: false,
          icon: currentImageDataUrl ? '' : `<svg viewBox="0 0 64 64" fill="none" stroke="${fz.border}" stroke-width="3"><circle cx="32" cy="32" r="22"/><text x="32" y="39" font-size="22" font-weight="bold" fill="${fz.border}" text-anchor="middle">${text.charAt(0)}</text></svg>`
        };

        this.cards.unshift(newCard);
        this.saveCards();
        this.refreshCardsView();
        this.refreshRecommendations();
        this.refreshCardLibraryManager();

        alert(`成功制作新卡片【${text}】！已加入卡库。`);

        textInput.value = '';
        pinyinInput.value = '';
        if (previewImg) previewImg.style.display = 'none';
        currentImageDataUrl = '';
        this.currentRecordedAudio = '';
        if (recordStatusText) recordStatusText.textContent = '未录制自定义语音 (将使用系统TTS)';
        if (btnPlayRecorded) btnPlayRecorded.style.display = 'none';
        if (btnClearRecord) btnClearRecord.style.display = 'none';
      });
    }
  }

  refreshCardLibraryManager(searchTerm = '') {
    const listWrap = document.getElementById('cardLibraryList');
    if (!listWrap) return;
    listWrap.innerHTML = '';

    const starterIds = STARTER_CARDS.map(s => s.id);
    const displayCards = this.cards.filter(c => {
      if (starterIds.includes(c.id)) return false;
      if (!searchTerm) return true;
      return c.text.includes(searchTerm) || c.category.includes(searchTerm);
    });

    displayCards.forEach(card => {
      const item = document.createElement('div');
      item.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border:1.5px solid #E2E8F0; border-radius:12px; margin-bottom:8px; background:#fff;';
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="width:10px; height:10px; border-radius:50%; background:${card.borderColor || '#94A3B8'};"></span>
          <span style="font-size:15px; font-weight:bold; color:#0F172A;">${card.text}</span>
          <span style="font-size:12px; color:#64748B;">${card.pinyin || ''}</span>
          <span class="recommend-tag">${card.category}</span>
          ${card.customAudio ? '<span title="已录音">🎙️</span>' : ''}
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn-action-ghost btn-toggle-vis" style="padding:4px 10px; font-size:12px; ${card.hidden ? 'opacity:0.6;' : 'background:#DCFCE7;color:#15803D;border-color:#86EFAC;'}">
            ${card.hidden ? '已隐藏' : '显示中'}
          </button>
          ${card.id.startsWith('custom_') ? `<button class="btn-action-ghost btn-del-custom" style="padding:4px 10px; font-size:12px; color:#ef4444; border-color:#fca5a5;">删除</button>` : ''}
        </div>
      `;

      const visBtn = item.querySelector('.btn-toggle-vis');
      visBtn.addEventListener('click', () => {
        card.hidden = !card.hidden;
        this.saveCards();
        this.refreshCardsView();
        this.refreshRecommendations();
        this.refreshCardLibraryManager(searchTerm);
      });

      const delBtn = item.querySelector('.btn-del-custom');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          if (confirm(`确认删除卡片【${card.text}】吗？`)) {
            this.cards = this.cards.filter(c => c.id !== card.id);
            this.saveCards();
            this.refreshCardsView();
            this.refreshRecommendations();
            this.refreshCardLibraryManager(searchTerm);
          }
        });
      }
      listWrap.appendChild(item);
    });
  }

  initSettingsEvents() {
    const rateRange = document.getElementById('settingRate');
    const rateValue = document.getElementById('rateValueLabel');
    if (rateRange) {
      rateRange.value = this.settings.rate;
      if (rateValue) rateValue.textContent = this.settings.rate + 'x';
      rateRange.addEventListener('input', (e) => {
        this.settings.rate = parseFloat(e.target.value);
        if (rateValue) rateValue.textContent = this.settings.rate + 'x';
        this.saveSettings();
      });
    }

    const densitySel = document.getElementById('settingGridDensity');
    if (densitySel) {
      densitySel.addEventListener('change', (e) => {
        this.settings.gridDensity = e.target.value;
        this.saveSettings();
        this.applyGridDensity();
      });
    }

    const voiceSelect = document.getElementById('settingVoice');
    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        this.settings.voiceName = e.target.value;
        this.saveSettings();
      });
    }

    // 导出 CSV 行为报表
    const btnExportCSV = document.getElementById('btnExportLogsCSV');
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => {
        if (this.logs.length === 0) {
          alert('暂无行为日志可导出');
          return;
        }
        const header = '\uFEFF日期,时间,表达句子,情境,卡片数,表达方式\n';
        const rows = this.logs.map(l =>
          `${l.dateStr},${l.timeStr},"${l.sentenceText}",${l.context},${l.cardCount},${l.independent !== false ? '自主表达' : '辅助引导'}`
        ).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `电子PECS_沟通行为日志_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const btnExport = document.getElementById('btnExportPack');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const bundle = {
          version: '2.0',
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

    const btnReset = document.getElementById('btnResetDefaults');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('确定要恢复系统默认词库吗？自定义卡片将被重置。')) {
          this.cards = [...DEFAULT_CARDS];
          this.saveCards();
          this.refreshCardsView();
          this.refreshRecommendations();
          this.refreshCardLibraryManager();
          alert('已恢复默认核心词库！');
        }
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.pecsApp = new PECSApplication();
});
