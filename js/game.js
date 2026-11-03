/* 어휘 탐험대: 워드몬 세계의 비밀 */
(function () {
  const DATA = window.WM_DATA;
  const KEY = "wordmon-save-v1";
  const INTERVALS = [1, 3, 7, 14, 30];
  const CONF = { b: "d", d: "b", p: "q", q: "p", m: "n", n: "m", i: "e", e: "a", a: "e", o: "u", u: "o", c: "k", k: "c", s: "z", g: "j", l: "r", f: "v", v: "f" };
  const BGS = [
    { id: "night", name: "밤하늘", price: 0 },
    { id: "sea", name: "바다", price: 80 },
    { id: "forest", name: "숲", price: 80 },
    { id: "town", name: "마을", price: 100 },
    { id: "space", name: "우주", price: 120 }
  ];
  const DECOS = [
    { id: "plant", name: "화분", price: 30, emo: "🪴", x: "8%", y: "62%" },
    { id: "books", name: "책장", price: 40, emo: "📚", x: "78%", y: "18%" },
    { id: "cushion", name: "쿠션", price: 30, emo: "🟨", x: "70%", y: "68%" },
    { id: "lamp", name: "램프", price: 40, emo: "💡", x: "18%", y: "16%" },
    { id: "ball", name: "축구공", price: 30, emo: "⚽", x: "46%", y: "72%" },
    { id: "flag", name: "깃발", price: 50, emo: "🚩", x: "84%", y: "48%" }
  ];

  let state = null;
  let screen = "home";
  let battle = null;
  let learnToken = 0;
  let toastMsg = "";
  let toastTimer = 0;
  let timerId = 0;
  let resetArm = 0;
  let overlay = null;
  let selectMode = false;
  const selected = {};

  const app = document.getElementById("app");

  function fresh() {
    return {
      v: 1, gold: 0, streak: 0, lastPlay: "", combo: 0, fever: false,
      settings: { difficulty: "normal", timer: false, seconds: 20 },
      unlockAll: false, evoItems: 0, bg: "night",
      ownedBg: ["night"], ownedDeco: [], chapterIndex: 0,
      nodes: {}, words: {}
    };
  }

  function blankWord() {
    return { learned: false, rescued: false, rescueDate: null, xp: 0, stage: 1, interval: 0, nextDue: null, jailed: false, reviewDays: [] };
  }

  function load() {
    state = fresh();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const base = fresh();
        state = Object.assign(base, parsed);
        state.settings = Object.assign(base.settings, parsed.settings || {});
        state.words = parsed.words || {};
        state.nodes = parsed.nodes || {};
        state.ownedBg = parsed.ownedBg && parsed.ownedBg.length ? parsed.ownedBg : ["night"];
        state.ownedDeco = parsed.ownedDeco || [];
      }
      localStorage.setItem(KEY, JSON.stringify(state));
      state.saveOk = true;
    } catch (err) {
      state.saveOk = false;
    }
  }

  function save() {
    try {
      const copy = JSON.parse(JSON.stringify(state));
      delete copy.saveOk;
      localStorage.setItem(KEY, JSON.stringify(copy));
      state.saveOk = true;
    } catch (err) {
      state.saveOk = false;
    }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function shiftDay(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function dueAfter(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function W(id) { return DATA.words[id]; }

  function wordState(id) { return state.words[id] || blankWord(); }

  function ensure(id) {
    if (!state.words[id]) state.words[id] = blankWord();
    return state.words[id];
  }

  function peekNodes(ci) { return state.nodes[ci] || [false, false, false, false, false]; }

  function nodesOf(ci) {
    if (!state.nodes[ci]) state.nodes[ci] = [false, false, false, false, false];
    return state.nodes[ci];
  }

  function chapterOpen(i) {
    if (i === 0 || state.unlockAll) return true;
    const prev = state.nodes[i - 1];
    return !!(prev && prev[4]);
  }

  function hungryIds() {
    const now = Date.now();
    return Object.keys(state.words).filter(function (id) {
      const w = state.words[id];
      return w.rescued && w.nextDue && now >= w.nextDue;
    });
  }

  function jailedIds() {
    return Object.keys(state.words).filter(function (id) { return state.words[id].jailed; });
  }

  function rescuedIds() {
    return Object.keys(state.words).filter(function (id) { return state.words[id].rescued; });
  }

  function toast(msg) {
    toastMsg = msg;
    clearTimeout(toastTimer);
    render();
    toastTimer = setTimeout(function () { toastMsg = ""; render(); }, 2200);
  }

  function clearTimer() { if (timerId) { clearInterval(timerId); timerId = 0; } }

  function maxHearts() { return state.settings.difficulty === "easy" ? 4 : 3; }

  function decoyCount(hard) {
    const d = state.settings.difficulty;
    let n = d === "easy" ? 1 : d === "hard" ? 3 : 2;
    if (hard) n += 1;
    return Math.min(4, n);
  }

  function optionCount() { return state.settings.difficulty === "easy" ? 3 : 4; }

  function addReviewDay(st) {
    const t = today();
    if (!st.reviewDays) st.reviewDays = [];
    if (st.reviewDays.indexOf(t) < 0) st.reviewDays.push(t);
  }

  function reviewCount(st) { return new Set(st.reviewDays || []).size; }

  function canEvolve(st) {
    if (!st || !st.rescued || st.stage >= 3) return false;
    if ((state.evoItems || 0) < 1) return false;
    const days = reviewCount(st);
    if (st.stage <= 1) return days >= 2 && st.xp >= 20;
    return days >= 4 && st.xp >= 50;
  }

  function evoHint(st) {
    if (!st.rescued) return "먼저 구출해야 해요";
    if ((st.stage || 1) >= 3) return "최종 진화예요!";
    const need = (st.stage || 1) <= 1 ? { d: 2, x: 20 } : { d: 4, x: 50 };
    return "복습 " + reviewCount(st) + "/" + need.d + "일 · 경험 " + st.xp + "/" + need.x + " · 아이템 " + state.evoItems + "/1";
  }

  function touchStreak() {
    const t = today();
    if (state.lastPlay === t) return;
    state.streak = state.lastPlay === shiftDay(-1) ? (state.streak || 0) + 1 : 1;
    state.lastPlay = t;
  }

  function lettersOf(word) {
    if (word.en === "TV") return ["t", "v"];
    return Array.from(word.en.toLowerCase());
  }

  function tileLabel(word, ch) {
    if (word.en === "TV") return ch.toUpperCase();
    if (word.en === "I" && ch.toLowerCase() === "i") return "I";
    return ch;
  }

  function buildTiles(word, extra) {
    const letters = lettersOf(word);
    const tiles = letters.map(function (ch, i) { return { id: "r" + i, ch: ch }; });
    const used = {};
    letters.forEach(function (ch) { if (ch !== "'") used[ch] = true; });
    const pool = [];
    letters.forEach(function (ch) {
      const p = CONF[ch];
      if (p && !used[p] && pool.indexOf(p) < 0) pool.push(p);
    });
    "abcdefghijklmnopqrstuvwxyz".split("").forEach(function (ch) {
      if (!used[ch] && pool.indexOf(ch) < 0) pool.push(ch);
    });
    shuffle(pool).slice(0, extra).forEach(function (ch, i) { tiles.push({ id: "d" + i, ch: ch }); });
    return shuffle(tiles);
  }

  function decoyWords(id, n) {
    const target = W(id);
    const chapter = DATA.chapters.find(function (c) { return c.words.indexOf(id) >= 0; });
    const near = chapter ? chapter.words.filter(function (k) { return k !== id; }) : [];
    const rest = Object.keys(DATA.words).filter(function (k) {
      return k !== id && Math.abs(W(k).en.length - target.en.length) <= 2;
    });
    const all = Object.keys(DATA.words).filter(function (k) { return k !== id; });
    const merged = [];
    shuffle(near).concat(shuffle(rest), shuffle(all)).forEach(function (k) {
      if (merged.indexOf(k) < 0) merged.push(k);
    });
    return merged.slice(0, n);
  }

  function splitWords(words) {
    const n = words.length;
    let a = 2;
    let b = 2;
    if (n === 6) { a = 2; b = 2; }
    else if (n === 7) { a = 2; b = 2; }
    else if (n >= 8) { a = 3; b = 2; }
    return { w0: words.slice(0, a), w1: words.slice(a, a + b), w3: words.slice(a + b) };
  }

  function makeBattleItems(ids, hard) {
    const items = [];
    ids.forEach(function (id) {
      if (!wordState(id).learned) items.push({ id: id, mode: "learn" });
      if (!hard) items.push({ id: id, mode: "recog" });
      items.push({ id: id, mode: "spell", hard: !!hard });
    });
    return items;
  }

  function makeBossItems(ids) {
    const items = [];
    ids.forEach(function (id, i) {
      if (!wordState(id).learned) items.push({ id: id, mode: "learn" });
      if (i % 2 === 0) items.push({ id: id, mode: "recall-spell", hard: true, boss: true });
      else items.push({ id: id, mode: "sentence", boss: true });
    });
    return items;
  }

  function header(title, back) {
    const mark = state.saveOk ? "💾" : "⚠️";
    return '<header class="top"><button type="button" class="btn btn-dark icon" data-act="' + back + '">←</button><h1>' + esc(title) + '</h1><span class="save-mark">' + mark + '</span></header>';
  }

  function art(id, opts) {
    const word = W(id);
    const st = wordState(id);
    const o = Object.assign({ stage: st.rescued ? (st.stage || 1) : 1, hungry: !!(st.rescued && st.nextDue && Date.now() >= st.nextDue) }, opts || {});
    const svg = window.WMArt.creature(word, o);
    if (word.verb && word.act && !o.silhouette) {
      const cls = "act-stage act-" + word.act + (o.cls ? " " + o.cls : "");
      return '<div class="' + cls + '"><div class="act-bg"></div><div class="mon">' + svg + '</div><div class="act-prop"></div><div class="act-fx"></div></div>';
    }
    return '<div class="mon ' + (o.cls || "") + '">' + svg + "</div>";
  }

  function render() {
    if (!DATA) {
      app.innerHTML = '<div class="screen"><p>단어 데이터를 찾지 못했어요.</p></div>';
      return;
    }
    document.body.classList.toggle("fever", !!state.fever);
    let html = "";
    if (screen === "home") html = renderHome();
    else if (screen === "chapters") html = renderChapters();
    else if (screen === "map") html = renderMap();
    else if (screen === "battle") html = renderBattle();
    else if (screen === "victory") html = renderVictory();
    else if (screen === "dex") html = renderDex();
    else if (screen === "base") html = renderBase();
    else if (screen === "shop") html = renderShop();
    else if (screen === "jail") html = renderJail();
    else if (screen === "settings") html = renderSettings();
    else if (screen === "print") html = renderPrint();
    else html = renderHome();
    if (overlay) html += renderOverlay();
    if (toastMsg) html += '<div class="toast">' + esc(toastMsg) + "</div>";
    app.innerHTML = html;
  }

  function renderHome() {
    const hungry = hungryIds().length;
    const jailed = jailedIds().length;
    const hero = window.WMArt.creature({ id: "hero", en: "wordmon", emo: "✨", col: "#ffd43b", shape: 0 }, { silhouette: true });
    const pal = window.WMArt.creature({ id: "pal", en: "pal", emo: "🌟", col: "#ff6b6b", shape: 2 }, { stage: 2 });
    const fever = state.fever ? '<div class="fever-banner">WORD FEVER! 골드 2배</div>' : "";
    return '<div class="screen">' +
      '<div class="top"><button type="button" class="btn btn-dark icon" data-act="settings">⚙️</button><h1>워드몬</h1><span class="save-mark">' + (state.saveOk ? "💾" : "⚠️") + '</span></div>' +
      '<div class="hero"><div class="hero-row"><div class="mon">' + hero + '</div><div class="mon sm">' + pal + '</div></div>' +
      '<h1 class="title">어휘 탐험대</h1><p class="subtitle">워드몬 세계의 비밀</p></div>' +
      '<p class="story">어둠의 망각몬이 글자를 훔쳤어요. 워드 스캐너로 단어를 되살려 워드몬을 구해요!</p>' +
      fever +
      '<div class="stats"><div class="stat">🪙 ' + state.gold + '</div><div class="stat">🔥 ' + (state.streak || 0) + '일</div><div class="stat">🍖 ' + hungry + '</div></div>' +
      '<div class="stack">' +
      '<button type="button" class="btn btn-yellow" data-act="chapters">탐험 시작</button>' +
      '<button type="button" class="btn btn-dark" data-act="dex">워드 도감 <span class="small">' + rescuedIds().length + "/" + Object.keys(DATA.words).length + "</span></button>" +
      '<button type="button" class="btn btn-dark" data-act="base">어휘 아지트</button>' +
      '<button type="button" class="btn btn-dark" data-act="jail">망각의 감옥 ' + (jailed ? '<span class="badge">' + jailed + "</span>" : "") + "</button>" +
      '<button type="button" class="btn btn-green" data-act="feed">배고픈 워드몬 밥 주기 ' + (hungry ? '<span class="badge">' + hungry + "</span>" : "") + "</button>" +
      "</div></div>";
  }

  function renderChapters() {
    let prevWorld = "";
    const cards = DATA.chapters.map(function (ch, i) {
      const open = chapterOpen(i);
      const nodes = peekNodes(i);
      const done = nodes.every(Boolean);
      const stars = nodes.map(function (ok) { return ok ? "★" : "☆"; }).join("");
      const cls = "chapter-card" + (done ? " done" : "") + (open && !done ? " open" : "");
      const act = open ? "open-chapter" : "locked-chapter";
      let banner = "";
      if ((ch.world || "") !== prevWorld) {
        prevWorld = ch.world || "";
        if (ch.world) banner = '<div class="world-banner"><b>동사 월드</b>' + esc(ch.world) + "</div>";
      }
      return banner + '<button type="button" class="' + cls + '" data-act="' + act + '" data-i="' + i + '"><span class="emo">' + ch.emo + '</span><span><b>' + (i + 1) + ". " + esc(ch.title) + "</b><span>" + esc(ch.blurb) + '</span><span class="dots">' + stars + "</span></span></button>";
    }).join("");
    return '<div class="screen">' + header("챕터", "home") + '<div class="stack">' + cards + "</div></div>";
  }

  function renderMap() {
    const ci = state.chapterIndex || 0;
    const ch = DATA.chapters[ci];
    const nodes = peekNodes(ci);
    const parts = splitWords(ch.words);
    const meta = [
      { icon: "⚔️", name: "탐험", sub: parts.w0.length + "마리" },
      { icon: "⚔️", name: "탐험", sub: parts.w1.length + "마리" },
      { icon: "🎁", name: "보물상자", sub: "듣기 퀴즈" },
      { icon: "⚔️", name: "탐험", sub: parts.w3.length + "마리" },
      { icon: "👾", name: "보스", sub: "망각몬" }
    ];
    const buttons = meta.map(function (m, ni) {
      let st = "locked";
      if (nodes[ni]) st = "done";
      else if (ni === 0 || nodes[ni - 1]) st = "open";
      const act = st === "open" ? "open-node" : st === "done" ? "done-node" : "locked-node";
      return '<button type="button" class="node ' + st + '" data-act="' + act + '" data-i="' + ni + '"><span style="font-size:36px">' + m.icon + '</span><span>' + m.name + '<span class="sub">' + m.sub + "</span></span></button>";
    }).join("");
    const worldLine = ch.world ? '<div class="world-banner"><b>동사 월드</b>' + esc(ch.world) + "</div>" : "";
    return '<div class="screen">' + header(ch.emo + " " + ch.title, "chapters") + worldLine +
      '<p class="story">' + esc(ch.blurb) + " 빛나는 칸을 눌러요.</p>" +
      '<div class="map-path">' + buttons + "</div></div>";
  }

  function renderBattle() {
    if (!battle || !battle.item) return '<div class="screen">' + header("배틀", "map") + "</div>";
    const item = battle.item;
    const word = W(item.id);
    const title = item.boss ? "보스전" : item.feed ? "밥 주기" : item.jail ? "구출" : (battle.meta.title || "탐험");
    const back = item.feed ? "home" : item.jail ? "jail" : "map";
    let body = "";
    if (battle.phase === "learn" || battle.phase === "learn-done") body = renderLearn(word);
    else if (battle.phase === "success") body = renderSuccess(word);
    else if (battle.phase === "retry") body = renderRetry();
    else if (battle.phase === "feedfail") body = '<div class="panel"><p class="hint">아직 배가 고파요. 감옥에서 다시 만나요.</p><button type="button" class="btn btn-yellow" data-act="next">다음</button></div>';
    else if (item.mode === "recog") body = renderRecog(word);
    else if (item.mode === "sentence") body = renderSentence(word);
    else if (item.mode === "treasure") body = renderTreasure(word);
    else body = renderSpell(word, item);
    const hearts = "❤".repeat(Math.max(0, battle.hearts)) + "♡".repeat(Math.max(0, battle.maxHearts - battle.hearts));
    const combo = state.combo ? '<span>COMBO ' + state.combo + "</span>" : "<span></span>";
    const timer = state.settings.timer && battle.phase === "ask" ? '<span id="timer">' + (battle.timeLeft || 0) + "</span>" : "<span></span>";
    let boss = "";
    if (battle.meta && battle.meta.nodeType === "boss" && battle.bossMax) {
      const pct = Math.max(0, Math.round(100 * battle.bossHp / battle.bossMax));
      boss = '<div class="boss-wrap">' + window.WMArt.boss(battle.bossHp < battle.bossMax) + '</div><div class="hp"><div style="width:' + pct + '%"></div></div><p class="small">망각몬 힘 ' + battle.bossHp + "/" + battle.bossMax + "</p>";
    }
    const prog = (battle.index + 1) + "/" + battle.items.length;
    return '<div class="screen">' + header(title, back) +
      '<div class="battle-top"><span class="hearts">' + hearts + "</span>" + combo + "<b>🪙 " + state.gold + "</b>" + timer + "<span>" + prog + "</span></div>" +
      (state.fever ? '<div class="fever-banner">WORD FEVER</div>' : "") +
      boss + body + "</div>";
  }

  function renderLearn(word) {
    const num = battle.count ? '<div class="count-num">' + battle.count + "</div>" : '<p class="hint">잘 들어요</p>';
    const go = battle.phase === "learn-done" ? '<button type="button" class="btn btn-yellow" data-act="learn-go">배틀 시작!</button>' : "";
    const sample = word.verb ? '<p class="black-note">' + esc(word.sentence) + "</p>" : "";
    return '<div class="panel">' + art(word.id, { cls: "lg", stage: 1, hungry: false }) +
      '<p class="en-chip"><span class="en">' + esc(word.en) + '</span></p><p class="ko">' + esc(word.ko) + "</p>" + sample +
      '<p class="hint">따라 말해 보세요 ' + battle.rep + "/3</p>" + num +
      '<button type="button" class="btn btn-dark" data-act="replay">🔊 다시 듣기</button>' + go + "</div>";
  }

  function renderRecog(word) {
    const opts = (battle.options || []).map(function (op) {
      const sh = battle.shake === op.id ? " shake" : "";
      return '<button type="button" class="word-opt' + sh + '" data-act="opt" data-id="' + esc(op.id) + '">' + esc(W(op.id).en) + "</button>";
    }).join("");
    const pic = word.verb
      ? art(word.id, { cls: "lg", stage: 1, hungry: false })
      : art(word.id, { cls: "lg", stage: 1, hungry: false }) + '<div style="font-size:72px">' + word.emo + "</div>";
    const ask = word.verb ? "어떻게 움직여요?" : "그림의 단어는?";
    return '<div class="battle-grid"><div class="panel"><div class="picture-row">' + pic + '</div><p class="hint">' + ask + '</p></div><div class="choice-grid">' + opts + "</div></div>";
  }

  function renderSpell(word, item) {
    const recall = item.mode === "recall-spell";
    const slots = battle.letters.map(function (ch, i) {
      const tile = battle.filled[i];
      return '<div class="slot' + (tile ? " filled" : "") + '">' + (tile ? esc(tileLabel(word, tile.ch)) : "") + "</div>";
    }).join("");
    const tiles = battle.tiles.filter(function (t) { return battle.filled.indexOf(t) < 0; }).map(function (t) {
      const sh = battle.shake === t.id ? " shake" : "";
      return '<button type="button" class="tile' + sh + '" data-act="tile" data-tile="' + t.id + '">' + esc(tileLabel(word, t.ch)) + "</button>";
    }).join("");
    const pic = recall
      ? '<div class="panel"><p class="en-chip"><span class="en">?</span></p><p class="hint">소리만 듣고 만들어요</p><button type="button" class="btn btn-yellow" data-act="replay">🔊 듣기</button></div>'
      : (word.verb
        ? '<div class="panel"><div class="picture-row">' + art(word.id, { cls: "lg", stage: 1, hungry: false }) + '</div><button type="button" class="btn btn-yellow" data-act="replay">🔊 듣기</button></div>'
        : '<div class="panel"><div class="picture-row">' + art(word.id, { cls: "lg", silhouette: !battle.reveal, stage: 1, hungry: false }) + '<div style="font-size:64px">' + word.emo + '</div></div><button type="button" class="btn btn-yellow" data-act="replay">🔊 듣기</button></div>');
    return '<div class="battle-grid">' + pic + '<div><div class="slots">' + slots + '</div><div class="tiles" style="margin-top:12px">' + tiles + "</div></div></div>";
  }

  function renderSentence(word) {
    const blank = esc(word.blank).replace("___", '<span class="blank-box">?</span>');
    const opts = (battle.options || []).map(function (op) {
      const sh = battle.shake === op.id ? " shake" : "";
      const ow = W(op.id);
      return '<button type="button" class="sent-opt' + sh + '" data-act="opt" data-id="' + esc(op.id) + '"><span class="mon sm">' + window.WMArt.creature(ow, { stage: 1 }) + '</span><span>' + esc(ow.en) + "</span></button>";
    }).join("");
    const tip = word.verb ? "빈칸의 동작을 보내요" : "빈칸에 알맞은 워드몬을 보내요";
    return '<div class="stack"><p class="blank-sent">' + blank + '</p><p class="small">' + tip + '</p><div class="choice-grid">' + opts + "</div></div>";
  }

  function renderTreasure(word) {
    const opts = (battle.options || []).map(function (op, i) {
      const sh = battle.shake === String(i) ? " shake" : "";
      return '<button type="button" class="spell-opt' + sh + '" data-act="spellopt" data-k="' + i + '">' + esc(op.text) + "</button>";
    }).join("");
    return '<div class="stack"><div class="panel"><p class="hint">소리를 듣고 철자를 고르세요</p><button type="button" class="btn btn-yellow" data-act="replay">🔊 듣기</button></div><div class="choice-grid">' + opts + "</div></div>";
  }

  function renderSuccess(word) {
    const st = wordState(word.id);
    const shown = battle.reveal || !battle.justRescued;
    const mon = art(word.id, { cls: "lg", silhouette: !shown, stage: st.stage || 1, hungry: false });
    const beam = battle.justRescued && !battle.reveal ? '<div class="beam"></div>' : "";
    const name = (word.names && word.names[(st.stage || 1) - 1]) || word.en;
    return '<div class="panel">' + beam + mon + '<p class="en-chip"><span class="en">' + esc(word.en) + '</span></p><p class="ko">' + esc(word.ko) + '</p><p class="black-note">' + esc(name) + "  ·  +" + battle.lastGold + ' 골드</p><button type="button" class="btn btn-yellow" data-act="next">다음</button></div>';
  }

  function renderRetry() {
    return '<div class="panel"><p class="hint">하트가 없어요. 이 단어를 다시 해 봐요.</p><p class="black-note">정답은 알려 주지 않아요.</p><button type="button" class="btn btn-yellow" data-act="retry">다시 도전</button></div>';
  }

  function renderVictory() {
    const ci = state.victoryCi || 0;
    const next = DATA.chapters[ci + 1];
    const msg = next ? "다음 챕터 「" + next.title + "」가 열렸어요." : "모든 챕터를 구했어요!";
    return '<div class="screen"><div class="hero"><div class="boss-wrap">' + window.WMArt.boss(true) + '</div><h1 class="title">보스 격파!</h1><p class="story">글자 조각을 되찾았어요. ' + esc(msg) + '</p><button type="button" class="btn btn-yellow" data-act="chapters">챕터 고르기</button></div></div>';
  }

  function renderDex() {
    const blocks = DATA.chapters.map(function (ch) {
      const cells = ch.words.map(function (id) {
        const w = W(id);
        const st = wordState(id);
        const hungry = st.rescued && st.nextDue && Date.now() >= st.nextDue;
        if (!st.rescued) {
          return '<button type="button" class="cell" data-act="locked-word"><div class="mon sm">' + window.WMArt.creature(w, { silhouette: true }) + '</div><div class="en-sm">???</div></button>';
        }
        const mark = (hungry ? "🍖" : "") + (st.jailed ? "⛓️" : "");
        const check = selectMode ? '<span class="check">' + (selected[id] ? "✓" : "") + "</span>" : "";
        const act = selectMode ? "pick" : "detail";
        return '<button type="button" class="cell" data-act="' + act + '" data-id="' + id + '">' + check + '<span class="mark">' + mark + "</span>" + art(id, { cls: "sm", hungry: hungry }) + '<div class="en-sm">' + esc(w.en) + '</div><div class="ko-sm">' + esc(w.ko) + "</div></button>";
      }).join("");
      return "<h2 class=\"sec\">" + ch.emo + " " + esc(ch.title) + "</h2><div class=\"grid\">" + cells + "</div>";
    }).join("");
    const tools = selectMode
      ? '<button type="button" class="btn btn-yellow" data-act="print-go">고른 카드 인쇄</button><button type="button" class="btn btn-dark" data-act="print-all">구한 카드 전부</button><button type="button" class="btn btn-white" data-act="select-off">고르기 끝</button>'
      : '<button type="button" class="btn btn-yellow" data-act="select-on">카드 고르기</button>';
    return '<div class="screen">' + header("워드 도감", "home") + '<div class="stack no-print" style="margin-bottom:12px">' + tools + "</div>" + blocks + "</div>";
  }

  function renderBase() {
    const ids = shuffle(rescuedIds()).slice(0, 18);
    const mons = ids.map(function (id, i) {
      const st = wordState(id);
      const left = 6 + ((i * 37) % 78);
      const top = 8 + ((i * 23) % 62);
      return '<button type="button" class="wander" style="left:' + left + "%;top:" + top + '%;animation-delay:' + (i * 0.15) + 's" data-act="detail" data-id="' + id + '">' + art(id, { cls: "sm", hungry: !!(st.nextDue && Date.now() >= st.nextDue) }) + "</button>";
    }).join("");
    const decos = DECOS.filter(function (d) { return state.ownedDeco.indexOf(d.id) >= 0; }).map(function (d) {
      return '<span class="deco" style="left:' + d.x + ";top:" + d.y + '">' + d.emo + "</span>";
    }).join("");
    const empty = ids.length ? "" : '<p class="floor-label">아직 친구가 없어요. 탐험에서 구해요!</p>';
    return '<div class="screen">' + header("어휘 아지트", "home") +
      '<div class="room bg-' + esc(state.bg || "night") + '">' + decos + mons + empty + '<span class="floor-label">친구 ' + rescuedIds().length + " · 아이템 " + state.evoItems + "</span></div>" +
      '<div class="stack" style="margin-top:12px"><button type="button" class="btn btn-yellow" data-act="shop">꾸미기 상점</button><p class="small">워드몬을 누르면 진화와 밥 시간을 볼 수 있어요. 진화는 서로 다른 날의 복습이 필요해요.</p></div></div>';
  }

  function renderShop() {
    const bgs = BGS.map(function (b) {
      const owned = state.ownedBg.indexOf(b.id) >= 0;
      const label = owned ? (state.bg === b.id ? "사용 중" : "사용하기") : b.price + " 골드";
      return '<button type="button" class="shop-item" data-act="buy-bg" data-id="' + b.id + '"><b>' + esc(b.name) + "</b><span>" + label + "</span></button>";
    }).join("");
    const decos = DECOS.map(function (d) {
      const owned = state.ownedDeco.indexOf(d.id) >= 0;
      return '<button type="button" class="shop-item" data-act="buy-deco" data-id="' + d.id + '"><span>' + d.emo + "</span><b>" + esc(d.name) + "</b><span>" + (owned ? "있음" : d.price + " 골드") + "</span></button>";
    }).join("");
    return '<div class="screen">' + header("상점 · " + state.gold + " 골드", "base") + "<h2 class=\"sec\">배경</h2><div class=\"stack\">" + bgs + "</div><h2 class=\"sec\">장식</h2><div class=\"stack\">" + decos + "</div></div>";
  }

  function renderJail() {
    const ids = jailedIds();
    const cards = ids.length ? ids.map(function (id) {
      const w = W(id);
      return '<button type="button" class="chapter-card" data-act="jail-word" data-id="' + id + '"><span class="mon sm">' + window.WMArt.creature(w, { stage: wordState(id).stage || 1, hungry: true }) + '</span><span><b class="en-sm" style="color:#ffe600;font-size:28px">' + esc(w.en) + "</b><span>" + esc(w.ko) + " · 눌러서 구출</span></span></button>";
    }).join("") : '<p class="story">감옥이 비었어요. 단어를 틀리면 여기로 와요.</p>';
    return '<div class="screen">' + header("망각의 감옥", "home") + '<div class="stack">' + cards + "</div></div>";
  }

  function renderSettings() {
    const d = state.settings.difficulty;
    const seg = ["easy", "normal", "hard"].map(function (k) {
      const name = k === "easy" ? "쉬움" : k === "hard" ? "어려움" : "보통";
      return '<button type="button" class="' + (d === k ? "on" : "") + '" data-act="set-diff" data-v="' + k + '">' + name + "</button>";
    }).join("");
    const secs = [15, 20, 30].map(function (n) {
      return '<button type="button" class="' + (state.settings.seconds === n ? "on" : "") + '" data-act="set-sec" data-v="' + n + '">' + n + "초</button>";
    }).join("");
    return '<div class="screen">' + header("부모 설정", "home") +
      '<div class="stack"><p class="story">힌트는 없어요. 아이가 스스로 떠올리게 해요. 마이크는 쓰지 않아요.</p>' +
      "<p>난이도</p><div class=\"seg\">" + seg + "</div>" +
      '<button type="button" class="btn ' + (state.settings.timer ? "btn-yellow" : "btn-dark") + '" data-act="toggle-timer">제한 시간 ' + (state.settings.timer ? "켜짐" : "꺼짐") + "</button>" +
      "<div class=\"seg\">" + secs + "</div>" +
      '<button type="button" class="btn btn-dark" data-act="skip-node">이번 칸 건너뛰기</button>' +
      '<button type="button" class="btn btn-dark" data-act="unlock-all">모든 챕터 열기</button>' +
      '<button type="button" class="btn btn-red" data-act="reset">기록 지우기</button>' +
      '<button type="button" class="btn btn-yellow" data-act="select-on">워드몬 카드 인쇄</button></div></div>';
  }

  function renderPrint() {
    const ids = (state.printIds || []).filter(function (id) { return wordState(id).rescued && W(id); });
    const cards = ids.map(function (id) {
      const w = W(id);
      const st = wordState(id);
      const stage = st.stage || 1;
      const name = (w.names && w.names[stage - 1]) || w.en;
      return '<article class="print-card"><div class="mon sm">' + window.WMArt.creature(w, { stage: stage }) + '</div><p class="en">' + esc(w.en) + '</p><p class="ko"><b>' + esc(w.ko) + "</b></p><p>" + esc(w.sentence) + "</p>" + (w.sentenceKo ? "<p>" + esc(w.sentenceKo) + "</p>" : "") + "<p>진화: " + esc(name) + " (" + stage + "/3)</p><p>구출: " + esc(st.rescueDate || "") + '</p><p class="say">말해 보세요: This is ___!</p></article>';
    }).join("");
    const empty = cards ? "" : '<p class="story">인쇄할 워드몬이 없어요. 도감에서 구한 친구를 고르세요.</p>';
    return '<div class="screen" id="print-root"><div class="no-print">' + header("워드몬 카드", "dex") + '<button type="button" class="btn btn-yellow" data-act="do-print" style="margin-bottom:12px">인쇄하기</button></div><div class="print-sheet">' + cards + "</div>" + empty + "</div>";
  }

  function renderOverlay() {
    const id = overlay.id;
    const w = W(id);
    const st = wordState(id);
    const stage = st.stage || 1;
    const name = (w.names && w.names[Math.max(0, stage - 1)]) || w.en;
    const due = !st.nextDue ? "" : (Date.now() >= st.nextDue ? "배고파요" : (Math.ceil((st.nextDue - Date.now()) / 86400000) <= 1 ? "내일 밥" : Math.ceil((st.nextDue - Date.now()) / 86400000) + "일 뒤 밥"));
    const evoBtn = canEvolve(st) ? '<button type="button" class="btn btn-yellow" data-act="evolve" data-id="' + id + '">진화하기</button>' : "";
    return '<div class="overlay"><div class="sheet">' + art(id, { cls: "lg", stage: stage }) +
      '<h2 class="en" style="text-shadow:none;color:#111">' + esc(w.en) + "</h2><p><b>" + esc(w.ko) + "</b> · " + esc(name) + "</p><p>" + esc(w.sentence) + "</p><p>" + esc(evoHint(st)) + "</p><p>" + esc(due) + "</p>" +
      '<div class="stack"><button type="button" class="btn btn-dark" data-act="replay" data-id="' + id + '">🔊 발음 듣기</button>' + evoBtn +
      '<button type="button" class="btn btn-white" data-act="close-overlay">닫기</button></div></div></div>';
  }

  function alive(token) { return battle && battle.token === token; }

  async function runLearn() {
    const token = battle.token;
    const id = battle.item.id;
    const word = W(id);
    battle.phase = "learn";
    for (let r = 1; r <= 3; r++) {
      if (!alive(token)) return;
      battle.rep = r;
      battle.count = 0;
      render();
      await Promise.race([window.WMAudio.playWord(id, word.en), wait(3500)]);
      for (let n = 3; n >= 1; n--) {
        if (!alive(token)) return;
        battle.count = n;
        render();
        await wait(700);
      }
    }
    if (!alive(token)) return;
    battle.phase = "learn-done";
    battle.count = 0;
    render();
  }

  function armTimer() {
    clearTimer();
    if (!state.settings.timer || !battle || battle.phase === "learn" || battle.phase === "learn-done") return;
    battle.timeLeft = state.settings.seconds || 20;
    timerId = setInterval(function () {
      if (!battle || battle.phase !== "ask") { clearTimer(); return; }
      battle.timeLeft -= 1;
      const el = document.getElementById("timer");
      if (el) el.textContent = String(Math.max(0, battle.timeLeft));
      if (battle.timeLeft <= 0) {
        battle.timeLeft = state.settings.seconds || 20;
        mistake();
      }
    }, 1000);
  }

  function setupRecog(word) {
    const ids = shuffle([word.id].concat(decoyWords(word.id, optionCount() - 1)));
    battle.options = ids.map(function (id) { return { id: id, ok: id === word.id }; });
    battle.phase = "ask";
  }

  function setupSentence(word) {
    setupRecog(word);
  }

  function setupTreasure(word) {
    const misses = (word.misses || []).filter(function (m) { return m && m.toLowerCase() !== word.en.toLowerCase(); }).slice(0, 2);
    while (misses.length < 2) misses.push(word.en.toLowerCase() + "e");
    const opts = [{ text: word.en, ok: true }].concat(misses.map(function (m) {
      let text = m;
      if (word.en === "TV") text = m.toUpperCase();
      else if (word.en[0] && word.en[0] === word.en[0].toUpperCase() && word.en !== "I") text = m.charAt(0).toUpperCase() + m.slice(1);
      else text = m.toLowerCase();
      return { text: text, ok: false };
    }));
    const uniq = [];
    opts.forEach(function (op) {
      if (!uniq.some(function (u) { return u.text.toLowerCase() === op.text.toLowerCase(); })) uniq.push(op);
    });
    battle.options = shuffle(uniq);
    battle.phase = "ask";
  }

  function setupSpell(word, item) {
    battle.letters = lettersOf(word);
    battle.tiles = buildTiles(word, decoyCount(!!item.hard));
    battle.filled = [];
    battle.phase = "ask";
  }

  function step() {
    clearTimer();
    if (!battle) return;
    if (battle.index >= battle.items.length) { finishQueue(); return; }
    const item = battle.items[battle.index];
    battle.item = item;
    battle.hearts = maxHearts();
    battle.maxHearts = battle.hearts;
    battle.clean = true;
    battle.filled = [];
    battle.shake = null;
    battle.lock = false;
    battle.reveal = false;
    battle.justRescued = false;
    battle.phase = "go";
    const word = W(item.id);
    if (item.mode === "learn") { runLearn(); return; }
    if (item.mode === "recog" || item.mode === "sentence") setupRecog(word);
    else if (item.mode === "treasure") setupTreasure(word);
    else setupSpell(word, item);
    if (item.mode === "sentence") battle.phase = "ask";
    armTimer();
    render();
    if (item.mode === "spell" || item.mode === "recall-spell" || item.mode === "treasure") {
      window.WMAudio.playWord(item.id, word.en);
    }
  }

  function applyFeedSuccess(st) {
    st.interval = Math.min(4, (st.interval || 0) + 1);
    st.nextDue = dueAfter(INTERVALS[st.interval]);
    st.xp = (st.xp || 0) + 15;
    st.jailed = false;
    addReviewDay(st);
  }

  function applyFeedFail(st) {
    st.interval = 0;
    st.nextDue = dueAfter(1);
    st.jailed = true;
  }

  function mistake() {
    if (!battle || battle.lock || battle.phase === "success" || battle.phase === "retry" || battle.phase === "feedfail") return;
    battle.clean = false;
    state.combo = 0;
    state.fever = false;
    ensure(battle.item.id).jailed = true;
    battle.hearts -= 1;
    window.WMAudio.sfx("bad");
    if (battle.hearts <= 0) {
      battle.lock = true;
      clearTimer();
      if (battle.item.feed) applyFeedFail(ensure(battle.item.id));
      battle.phase = battle.item.feed ? "feedfail" : "retry";
      save();
      render();
      return;
    }
    save();
    render();
  }

  function onSolved() {
    if (!battle || battle.lock) return;
    battle.lock = true;
    clearTimer();
    const item = battle.item;
    const word = W(item.id);
    const st = ensure(item.id);
    const clean = battle.clean;
    if (clean) {
      state.combo = (state.combo || 0) + 1;
      if (state.combo >= 3) {
        const was = state.fever;
        state.fever = true;
        if (!was) window.WMAudio.sfx("fever");
      }
    }
    const mult = state.fever && clean ? 2 : 1;
    let base = item.mode === "recog" ? 6 : 12;
    if (item.mode === "treasure") base = 8;
    if (!clean) base = 3;
    let gold = base * mult;
    if (item.jail && clean) gold += 15 * mult;
    state.gold += gold;
    battle.lastGold = gold;
    const capturing = item.mode === "spell" || item.mode === "recall-spell" || item.mode === "sentence";
    if (capturing && !st.rescued) {
      st.rescued = true;
      st.stage = st.stage && st.stage > 0 ? st.stage : 1;
      st.rescueDate = today();
      st.xp = (st.xp || 0) + 20;
      st.interval = 0;
      st.nextDue = dueAfter(1);
      addReviewDay(st);
      battle.justRescued = true;
    } else if (capturing) {
      st.xp = (st.xp || 0) + (clean ? 6 : 2);
    }
    if (item.feed) {
      if (clean) applyFeedSuccess(st);
      else applyFeedFail(st);
    } else if (item.jail) {
      st.jailed = false;
      if (clean) { addReviewDay(st); st.xp += 10; }
    } else if (!clean) {
      st.jailed = true;
    } else if (capturing) {
      st.jailed = false;
      addReviewDay(st);
    }
    if (item.boss) battle.bossHp = Math.max(0, (battle.bossHp || 0) - 1);
    touchStreak();
    save();
    battle.phase = "success";
    battle.reveal = !battle.justRescued;
    window.WMAudio.sfx("win");
    window.WMAudio.playWord(item.id, word.en);
    render();
    if (battle && battle.justRescued) {
      const token = battle.token;
      setTimeout(function () {
        if (battle && battle.token === token && battle.phase === "success") {
          battle.reveal = true;
          render();
        }
      }, 700);
    }
  }

  function finishQueue() {
    if (!battle) return;
    const meta = battle.meta || {};
    battle = null;
    learnToken += 1;
    clearTimer();
    window.WMAudio.stop();
    if (meta.kind === "node") {
      const nodes = nodesOf(meta.ci);
      const firstClear = !nodes[meta.ni];
      if (firstClear) nodes[meta.ni] = true;
      if (firstClear && meta.nodeType === "boss") {
        state.gold += 40 * (state.fever ? 2 : 1);
        state.victoryCi = meta.ci;
        save();
        screen = "victory";
        render();
        return;
      }
      if (firstClear && meta.nodeType === "chest") {
        state.evoItems = (state.evoItems || 0) + 1;
        state.gold += 20 * (state.fever ? 2 : 1);
      }
      save();
      screen = "map";
      if (firstClear && meta.nodeType === "chest") toast("진화 아이템을 얻었어요!");
      else render();
      return;
    }
    save();
    screen = meta.kind === "jail" ? "jail" : "home";
    if (meta.kind === "feed") toast("밥 주기가 끝났어요");
    else render();
  }

  function startQueue(items, meta) {
    learnToken += 1;
    const bossN = items.filter(function (it) { return it.boss; }).length;
    battle = {
      items: items, index: 0, meta: meta, token: learnToken,
      hearts: maxHearts(), maxHearts: maxHearts(), clean: true,
      filled: [], tiles: [], letters: [], options: [],
      phase: "go", rep: 0, count: 0, lock: false, shake: null,
      bossHp: bossN, bossMax: bossN, reveal: false, justRescued: false, lastGold: 0
    };
    screen = "battle";
    step();
  }

  function startNode(ci, ni) {
    const ch = DATA.chapters[ci];
    const parts = splitWords(ch.words);
    const plan = [
      { type: "battle", words: parts.w0, hard: false },
      { type: "battle", words: parts.w1, hard: false },
      { type: "chest", words: parts.w0.concat(parts.w1).slice(0, 4) },
      { type: "battle", words: parts.w3, hard: true },
      { type: "boss", words: ch.words.slice() }
    ][ni];
    let items = [];
    if (plan.type === "battle") items = makeBattleItems(plan.words, plan.hard);
    else if (plan.type === "chest") {
      items = [];
      plan.words.forEach(function (id) {
        if (!wordState(id).learned) items.push({ id: id, mode: "learn" });
        items.push({ id: id, mode: "treasure" });
      });
    } else items = makeBossItems(plan.words);
    overlay = null;
    startQueue(items, { kind: "node", ci: ci, ni: ni, nodeType: plan.type, title: ch.title });
  }

  function leaveBattle(dest) {
    battle = null;
    learnToken += 1;
    clearTimer();
    window.WMAudio.stop();
    screen = dest;
    render();
  }

  function onClick(e) {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    window.WMAudio.unlock();
    const act = el.dataset.act;
    const id = el.dataset.id;
    if (act === "home") { overlay = null; leaveBattle("home"); return; }
    if (act === "chapters") { overlay = null; leaveBattle("chapters"); return; }
    if (act === "map") { overlay = null; leaveBattle("map"); return; }
    if (act === "dex") { selectMode = false; overlay = null; leaveBattle("dex"); return; }
    if (act === "base") { overlay = null; leaveBattle("base"); return; }
    if (act === "shop") { screen = "shop"; render(); return; }
    if (act === "jail") { overlay = null; leaveBattle("jail"); return; }
    if (act === "settings") { overlay = null; leaveBattle("settings"); return; }
    if (act === "open-chapter") {
      state.chapterIndex = Number(el.dataset.i);
      save();
      screen = "map";
      render();
      return;
    }
    if (act === "locked-chapter") { toast("앞 챕터의 보스를 이겨야 열려요"); return; }
    if (act === "open-node") { startNode(state.chapterIndex || 0, Number(el.dataset.i)); return; }
    if (act === "locked-node") { toast("앞 칸을 먼저 해요"); return; }
    if (act === "done-node") { toast("이미 끝낸 칸이에요"); return; }
    if (act === "learn-go") {
      if (!battle) return;
      ensure(battle.item.id).learned = true;
      save();
      battle.index += 1;
      step();
      return;
    }
    if (act === "next") {
      if (!battle) return;
      battle.index += 1;
      step();
      return;
    }
    if (act === "retry") {
      if (!battle) return;
      battle.hearts = maxHearts();
      battle.maxHearts = battle.hearts;
      battle.clean = true;
      battle.lock = false;
      battle.shake = null;
      battle.filled = [];
      if (battle.tiles) battle.tiles = shuffle(battle.tiles);
      if (battle.options) battle.options = shuffle(battle.options);
      battle.phase = "ask";
      armTimer();
      render();
      return;
    }
    if (act === "opt") {
      if (!battle || battle.lock || battle.phase !== "ask") return;
      if (id === battle.item.id) onSolved();
      else { battle.shake = id; mistake(); }
      return;
    }
    if (act === "spellopt") {
      if (!battle || battle.lock || battle.phase !== "ask") return;
      const op = battle.options[Number(el.dataset.k)];
      if (op && op.ok) onSolved();
      else { battle.shake = el.dataset.k; mistake(); }
      return;
    }
    if (act === "tile") {
      if (!battle || battle.lock || battle.phase !== "ask") return;
      const tile = (battle.tiles || []).find(function (t) { return t.id === el.dataset.tile; });
      if (!tile || battle.filled.indexOf(tile) >= 0) return;
      const expect = battle.letters[battle.filled.length];
      if (tile.ch.toLowerCase() !== String(expect).toLowerCase()) {
        battle.shake = tile.id;
        mistake();
        return;
      }
      battle.filled.push(tile);
      battle.shake = null;
      window.WMAudio.playLetter(tile.ch);
      if (battle.filled.length === battle.letters.length) onSolved();
      else render();
      return;
    }
    if (act === "replay") {
      const wid = id || (battle && battle.item && battle.item.id);
      if (!wid) return;
      const w = W(wid);
      if (battle && battle.item && battle.item.mode === "sentence" && battle.phase !== "success") return;
      if (battle && battle.phase === "success") window.WMAudio.playSentence(wid, w.sentence);
      else window.WMAudio.playWord(wid, w.en);
      return;
    }
    if (act === "feed") {
      const ids = hungryIds();
      if (!ids.length) { toast("배고픈 워드몬이 없어요"); return; }
      const items = [];
      ids.forEach(function (wid) { items.push({ id: wid, mode: "recall-spell", hard: true, feed: true }); });
      startQueue(items, { kind: "feed", title: "밥 주기" });
      return;
    }
    if (act === "jail-word") {
      const items = [];
      if (!wordState(id).learned) items.push({ id: id, mode: "learn" });
      items.push({ id: id, mode: "spell", jail: true });
      startQueue(items, { kind: "jail", title: "구출" });
      return;
    }
    if (act === "detail") { overlay = { id: id }; render(); return; }
    if (act === "close-overlay") { overlay = null; render(); return; }
    if (act === "evolve") {
      const st = ensure(id);
      if (!canEvolve(st)) { toast("아직 진화할 수 없어요"); return; }
      state.evoItems -= 1;
      st.stage = (st.stage || 1) + 1;
      save();
      toast(W(id).names[st.stage - 1] + "(으)로 진화!");
      window.WMAudio.sfx("win");
      render();
      return;
    }
    if (act === "select-on") { selectMode = true; screen = "dex"; overlay = null; render(); return; }
    if (act === "select-off") { selectMode = false; render(); return; }
    if (act === "pick") { selected[id] = !selected[id]; render(); return; }
    if (act === "print-go" || act === "print-all") {
      const ids = act === "print-all" ? rescuedIds() : Object.keys(selected).filter(function (k) { return selected[k] && wordState(k).rescued; });
      state.printIds = ids;
      screen = "print";
      overlay = null;
      render();
      return;
    }
    if (act === "do-print") { window.print(); return; }
    if (act === "set-diff") { state.settings.difficulty = el.dataset.v; save(); render(); return; }
    if (act === "toggle-timer") { state.settings.timer = !state.settings.timer; save(); render(); return; }
    if (act === "set-sec") { state.settings.seconds = Number(el.dataset.v); save(); render(); return; }
    if (act === "skip-node") {
      const ci = state.chapterIndex || 0;
      if (!chapterOpen(ci)) { toast("아직 열리지 않은 챕터예요"); return; }
      const nodes = nodesOf(ci);
      const ni = nodes.findIndex(function (v) { return !v; });
      if (ni < 0) { toast("이 챕터는 이미 끝났어요"); return; }
      nodes[ni] = true;
      save();
      leaveBattle("map");
      toast("칸을 건너뛰었어요");
      return;
    }
    if (act === "unlock-all") { state.unlockAll = true; save(); toast("모든 챕터가 열렸어요"); return; }
    if (act === "reset") {
      const now = Date.now();
      if (now - resetArm < 5000) {
        resetArm = 0;
        try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
        state = fresh();
        state.saveOk = true;
        save();
        battle = null;
        overlay = null;
        screen = "home";
        toast("기록을 지웠어요");
      } else {
        resetArm = now;
        toast("한 번 더 누르면 기록이 지워져요");
      }
      return;
    }
    if (act === "buy-bg") {
      const item = BGS.find(function (b) { return b.id === id; });
      if (!item) return;
      if (state.ownedBg.indexOf(id) >= 0) { state.bg = id; save(); toast(item.name + " 배경"); render(); return; }
      if (state.gold < item.price) { toast("골드가 모자라요"); return; }
      state.gold -= item.price;
      state.ownedBg.push(id);
      state.bg = id;
      save();
      toast(item.name + "을 샀어요");
      render();
      return;
    }
    if (act === "buy-deco") {
      const item = DECOS.find(function (d) { return d.id === id; });
      if (!item) return;
      if (state.ownedDeco.indexOf(id) >= 0) { toast("이미 있어요"); return; }
      if (state.gold < item.price) { toast("골드가 모자라요"); return; }
      state.gold -= item.price;
      state.ownedDeco.push(id);
      save();
      toast(item.name + "을 샀어요");
      render();
      return;
    }
    if (act === "locked-word") { toast("아직 구하지 못한 워드몬이에요"); }
  }

  document.addEventListener("pointerdown", function () { window.WMAudio.unlock(); }, true);
  document.addEventListener("click", onClick);
  load();
  render();
})();
