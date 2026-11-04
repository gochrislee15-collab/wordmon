import { useState, useEffect, useRef, useGrokTheme } from "grok/canvas";

const U: [string, string, string][] = [
["1주차", "12주 과정", "like|좋아하다|❤️;apple|사과|🍎;dog|강아지|🐶;can|~할 수 있다|💪;swim|수영하다|🏊;run|달리다|🏃;fast|빠르게|⚡;cat|고양이|🐱;small|작은|🐭;big|큰|🐘"],
["2주차", "12주 과정", "red|빨간색|🔴;ball|공|⚽;this|이것|👇;blue|파란색|🔵;bag|가방|🎒;yellow|노란색|🟡;pencil|연필|✏️;long|긴|📏;green|초록색|🟢;book|책|📕;new|새로운|🆕;white|하얀색|⚪;bird|새|🐦;pretty|예쁜|🌸;mom|엄마|👩;dad|아빠|👨;happy|행복한|😊"],
["3주차", "12주 과정", "have|가지고 있다|🤲;two|둘|2️⃣;eye|눈|👁️;one|하나|1️⃣;nose|코|👃;mouth|입|👄;you|너|🫵;ten|열|🔟;finger|손가락|☝️;she|그녀|👧;black|검은색|⚫;hair|머리카락|💇;he|그|👦;brother|남자 형제|🧑;sister|여자 형제|👱‍♀️;we|우리|👫;five|다섯|5️⃣;friend|친구|🤝"],
["4주차", "12주 과정", "milk|우유|🥛;yes|네|⭕;carrot|당근|🥕;no|아니요|❌;eat|먹다|😋;egg|달걀|🥚;bread|빵|🍞;drink|마시다|🥤;cold|차가운|🧊;water|물|💧;chicken|닭고기|🍗;soup|수프|🥣;hot|뜨거운|🔥;very|매우|💯;hungry|배고픈|🍽️"],
["5주차", "12주 과정", "jump|뛰다|🦘;high|높이|🪜;dance|춤추다|💃;sing|노래하다|🎤;song|노래|🎵;well|잘|👍;ride|타다|🛞;bike|자전거|🚲;fly|날다|🪽;sky|하늘|🌤️;play|놀다|🎮;soccer|축구|🥅;together|함께|🫶"],
["6주차", "12주 과정", "want|원하다|🤩;toy|장난감|🧸;robot|로봇|🤖;orange|주황색|🟠;cap|모자|🧢;how|어떻게|🤔;much|많은(양)|💰;shirt|셔츠|👕;these|이것들|👐;shoe|신발|👟;nice|멋진, 좋은|✨;buy|사다|🛍️;gift|선물|🎁;thank|고마워하다|🙏"],
["7주차", "12주 과정", "go|가다|🚶;park|공원|🏞️;walk|걷다|👣;school|학교|🏫;please|~해 주세요|🥺;open|열다|🔓;door|문|🚪;stand|서다|🧍;up|위로|⬆️;sit|앉다|🪑;down|아래로|⬇️;read|읽다|📖;library|도서관|🏛️;watch|보다|👀;TV|텔레비전|📺;after|~후에|⏭️;dinner|저녁 식사|🍛"],
["8주차", "12주 과정", "lion|사자|🦁;that|저것|👈;funny|웃긴|🤪;monkey|원숭이|🐵;rabbit|토끼|🐰;brown|갈색|🟤;bear|곰|🐻;strong|힘센|🏋️;horse|말|🐴;cow|소|🐮;grass|풀|🌿;who|누구|🕵️;teacher|선생님|🧑‍🏫"],
["9주차", "12주 과정", "where|어디에|🗺️;desk|책상|🖥️;under|~아래에|🔽;table|탁자|🟫;cookie|쿠키|🍪;kitchen|부엌|🍳;now|지금|⏰;home|집|🏠;store|가게|🏪;next|옆의|⏩;bank|은행|🏦;straight|곧장|🛣️;turn|돌다|↩️;left|왼쪽|⬅️"],
["10주차", "12주 과정", "many|많은(수)|🔢;six|여섯|6️⃣;eight|여덟|8️⃣;crayon|크레용|🖍️;four|넷|4️⃣;eraser|지우개|🧽;what|무엇|❔;time|시간|⏱️;nine|아홉|9️⃣;get|얻다|🛏️;seven|일곱|7️⃣;every|매, 모든|🔁;morning|아침|🌅;sleep|자다|😴;early|일찍|🐓;night|밤|🌙;day|날, 요일|📅;today|오늘|📆;Monday|월요일|🗓️"],
["11주차", "12주 과정", "draw|그리다|🎨;beautiful|아름다운|🌈;picture|그림|🖼️;wash|씻다|🧼;face|얼굴|😀;they|그들|👨‍👩‍👧;make|만들다|🛠️;snowman|눈사람|⛄;late|늦은|🐢;class|수업|🧑‍🎓;rainy|비 오는|🌧️;take|가져가다|🫳;umbrella|우산|☂️;brush|닦다(솔질)|🪥;teeth|이(치아)|🦷;before|~전에|⏮️;bed|침대|🛌"],
["12주차", "12주 과정", "was|~이었다|⏪;sick|아픈|🤒;yesterday|어제|📜;went|갔다|🏃‍♀️;zoo|동물원|🦓;with|~와 함께|🤗;saw|보았다|🔭;tall|키 큰|🗼;giraffe|기린|🦒;ate|먹었다|🍴;ice|얼음|❄️;cream|크림|🍦;had|가졌다|🎉;great|훌륭한|🌟;clean|청소하다|🧹;room|방|🪟;last|지난|🔚"],
["더 배우기 1", "동물·자연", "tiger|호랑이|🐯;elephant|코끼리|🐘;pig|돼지|🐷;duck|오리|🦆;frog|개구리|🐸;fish|물고기|🐟;snake|뱀|🐍;sheep|양|🐑;mouse|생쥐|🐭;penguin|펭귄|🐧;whale|고래|🐳;butterfly|나비|🦋;tree|나무|🌳;flower|꽃|🌷;sun|해|☀️;moon|달|🌕;star|별|⭐;mountain|산|⛰️;sea|바다|🌊;leaf|나뭇잎|🍃"],
["더 배우기 2", "음식", "banana|바나나|🍌;grape|포도|🍇;strawberry|딸기|🍓;watermelon|수박|🍉;peach|복숭아|🍑;lemon|레몬|🍋;tomato|토마토|🍅;potato|감자|🥔;corn|옥수수|🌽;rice|밥|🍚;pizza|피자|🍕;cake|케이크|🍰;candy|사탕|🍬;juice|주스|🧃;cheese|치즈|🧀;sandwich|샌드위치|🥪;noodle|국수|🍜;breakfast|아침 식사|🥞;lunch|점심 식사|🍱"],
["더 배우기 3", "날씨·계절·요일", "sunny|맑은|🌞;cloudy|흐린|☁️;snowy|눈 오는|🌨️;windy|바람 부는|🌬️;warm|따뜻한|🔆;cool|시원한|😎;spring|봄|🌱;summer|여름|🌻;fall|가을|🍂;winter|겨울|🥶;Tuesday|화요일|🔥;Wednesday|수요일|💧;Thursday|목요일|🌲;Friday|금요일|🪙;Saturday|토요일|🪨;Sunday|일요일|🌅;tomorrow|내일|➡️;birthday|생일|🎂;weekend|주말|🎈"],
["더 배우기 4", "탈것·장소·직업", "bus|버스|🚌;car|자동차|🚗;train|기차|🚆;airplane|비행기|✈️;ship|배|🚢;taxi|택시|🚕;subway|지하철|🚇;hospital|병원|🏥;museum|박물관|🦖;market|시장|🧺;playground|놀이터|🛝;beach|해변|🏖️;police|경찰|👮;doctor|의사|🧑‍⚕️;nurse|간호사|🩺;chef|요리사|🧑‍🍳;farmer|농부|🧑‍🌾;firefighter|소방관|🧑‍🚒;pilot|조종사|🧑‍✈️"],
["더 배우기 5", "몸·옷·기분", "head|머리|🙂;ear|귀|👂;hand|손|✋;foot|발|🦶;arm|팔|💪;leg|다리|🦵;shoulder|어깨|🤷;dress|원피스|👗;pants|바지|👖;socks|양말|🧦;coat|외투|🧥;gloves|장갑|🧤;glasses|안경|👓;scarf|목도리|🧣;boots|장화|👢;ring|반지|💍;sad|슬픈|😢;angry|화난|😠;tired|피곤한|🥱;scared|무서워하는|😱"],
["더 배우기 6", "학교·동작", "ruler|자|📐;scissors|가위|✂️;notebook|공책|📓;homework|숙제|📝;computer|컴퓨터|💻;piano|피아노|🎹;math|수학|➗;music|음악|🎼;art|미술|🖌️;cry|울다|😭;laugh|웃다|😂;cook|요리하다|🍲;climb|오르다|🧗;write|쓰다|✍️;listen|듣다|🎧;speak|말하다|🗣️;study|공부하다|📚;close|닫다|🔒;throw|던지다|🤾"],
];

type Word = { en: string; ko: string; emo: string; u: number };
type Unit = { name: string; theme: string; words: Word[]; rounds: Word[][] };

function chunk(ws: Word[]): Word[][] {
  const n = Math.max(1, Math.ceil(ws.length / 8));
  const out: Word[][] = [];
  let s = 0;
  for (let i = 0; i < n; i++) {
    const k = Math.round((ws.length - s) / (n - i));
    out.push(ws.slice(s, s + k));
    s += k;
  }
  return out;
}

const UNITS: Unit[] = U.map(([name, theme, s], i) => {
  const words = s.split(";").map((x: string) => {
    const p = x.split("|");
    return { en: p[0], ko: p[1], emo: p[2], u: i };
  });
  return { name, theme, words, rounds: chunk(words) };
});
const ALL: Word[] = UNITS.flatMap((u: Unit) => u.words);
const MAP: Record<string, Word> = {};
ALL.forEach((w: Word) => { MAP[w.en] = w; });

function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
}
const rnd = (a: number, b: number): number => a + Math.random() * (b - a);

/* ---------- save ---------- */
type Rec = { c: number; m: number; t: number; s?: number; n?: number };
type Save = { best: number; stars: number; words: Record<string, Rec>; ustar: Record<string, number>; streak: number; last: string; skin: number; games: number; boss: Record<string, number>; ver: number };
const DEF: Save = { best: 0, stars: 0, words: {}, ustar: {}, streak: 0, last: "", skin: 0, games: 0, boss: {}, ver: 2 };
const KEY = "spaceWordShooter.v1";
const DAY = 86400000;
const INT = [1, 3, 7, 14];
function dayStart(t: number): number { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
function migrate(p: Partial<Save>): Save {
  const s: Save = { ...DEF, ...p, words: { ...(p.words || {}) }, ustar: { ...(p.ustar || {}) }, boss: { ...(p.boss || {}) } };
  if (!p.ver || p.ver < 2) {
    const now = Date.now();
    Object.keys(s.words).forEach((en: string) => {
      const r = s.words[en];
      if (r && r.n === undefined && (r.c > 0 || r.m > 0)) {
        s.words[en] = r.m > 0 ? { ...r, s: 0, n: dayStart(now) } : { ...r, s: 1, n: dayStart(r.t || now) + DAY };
      }
    });
    s.ver = 2;
  }
  return s;
}
function loadSave(): { s: Save; ok: boolean } {
  try {
    const ls = window.localStorage;
    const raw = ls.getItem(KEY);
    ls.setItem(KEY + ".probe", "1");
    ls.removeItem(KEY + ".probe");
    if (!raw) return { s: { ...DEF }, ok: true };
    return { s: migrate(JSON.parse(raw) as Partial<Save>), ok: true };
  } catch {
    return { s: { ...DEF }, ok: false };
  }
}
function persist(s: Save): boolean {
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { return false; }
}
function dayStr(d: Date): string { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

/* ---------- sound ---------- */
let AC: AudioContext | null = null;
function ac(): AudioContext | null {
  try {
    if (!AC) {
      const Wn = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
      const C = Wn.AudioContext || Wn.webkitAudioContext;
      if (!C) return null;
      AC = new C();
    }
    if (AC.state === "suspended") void AC.resume();
    return AC;
  } catch { return null; }
}
function tone(f: number, d: number, type: OscillatorType, vol: number, f2?: number, delay?: number): void {
  const a = ac(); if (!a) return;
  const t = a.currentTime + (delay || 0);
  const o = a.createOscillator(); const g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
  o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + 0.03);
}
function noise(d: number, vol: number): void {
  const a = ac(); if (!a) return;
  const n = Math.floor(a.sampleRate * d);
  const b = a.createBuffer(1, n, a.sampleRate);
  const ch = b.getChannelData(0);
  for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = a.createBufferSource(); s.buffer = b;
  const fl = a.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = 1400;
  const g = a.createGain(); g.gain.value = vol;
  s.connect(fl); fl.connect(g); g.connect(a.destination); s.start();
}
const SFX = {
  laser: (): void => tone(1500, 0.18, "square", 0.07, 240),
  boom: (): void => noise(0.35, 0.4),
  ding: (): void => { tone(988, 0.12, "triangle", 0.16); tone(1319, 0.25, "triangle", 0.16, undefined, 0.1); },
  buzz: (): void => { tone(150, 0.45, "sawtooth", 0.16, 80); tone(156, 0.45, "square", 0.07, 84); },
  tap: (): void => tone(700, 0.06, "triangle", 0.1),
  crack: (): void => { noise(0.12, 0.3); tone(2200, 0.09, "square", 0.06, 900); },
  level: (): void => { [523, 659, 784, 1047, 1319].forEach((f: number, i: number) => tone(f, 0.2, "square", 0.07, undefined, i * 0.09)); },
  win: (): void => { [784, 988, 1175, 1568, 2093].forEach((f: number, i: number) => tone(f, 0.25, "triangle", 0.16, undefined, i * 0.12)); },
  lose: (): void => { [392, 330, 262, 196].forEach((f: number, i: number) => tone(f, 0.32, "triangle", 0.14, undefined, i * 0.18)); },
};

/* ---------- speech (fallback only) ---------- */
let VOICE: SpeechSynthesisVoice | null = null;
function pickVoice(): void {
  try {
    const vs = window.speechSynthesis.getVoices();
    const us = vs.filter((v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase().indexOf("en-us") === 0);
    VOICE = us.find((v: SpeechSynthesisVoice) => /samantha|ava|allison|aria|jenny|ana|google us/i.test(v.name)) || us[0] ||
      vs.find((v: SpeechSynthesisVoice) => v.lang.toLowerCase().indexOf("en") === 0) || null;
  } catch { VOICE = null; }
}
function speak(text: string, rate?: number): void {
  try {
    const s = window.speechSynthesis; if (!s) return;
    if (!VOICE) pickVoice();
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = rate || 0.8; u.pitch = 1.05;
    if (VOICE) u.voice = VOICE;
    s.speak(u);
  } catch { /* no speech available */ }
}

/* ---------- native MP3 (워드몬 recordings), Web Speech only as fallback ---------- */
const AUD = "../audio/";
const AU = { el: null as HTMLAudioElement | null, ok: 0, fails: 0, unlocked: false, tok: 0, plays: 0, falls: 0 };
try { (window as unknown as Record<string, unknown>).__swAudio = AU; } catch { /* ignore */ }
function audioEl(): HTMLAudioElement | null {
  try { if (!AU.el) { AU.el = new Audio(); AU.el.preload = "auto"; } return AU.el; } catch { return null; }
}
function unlockAudio(): void {
  ac();
  if (AU.unlocked) return;
  const el = audioEl();
  if (!el) { AU.ok = -1; return; }
  AU.unlocked = true;
  const tok = ++AU.tok;
  try {
    el.onplaying = null;
    el.onerror = () => { if (tok !== AU.tok) return; AU.fails += 1; if (AU.fails >= 2 && AU.ok !== 1) AU.ok = -1; };
    el.src = AUD + "silence.mp3";
    const p = el.play();
    if (p && p.then) {
      p.then(() => { if (AU.ok === 0) AU.ok = 1; AU.fails = 0; }).catch((e: unknown) => {
        const nm = e && typeof e === "object" && "name" in e ? String((e as { name: string }).name) : "";
        if (nm === "NotAllowedError") AU.unlocked = false;
        else if (nm !== "AbortError") { AU.fails += 1; if (AU.fails >= 2 && AU.ok !== 1) AU.ok = -1; }
      });
    }
  } catch { AU.unlocked = false; }
}
function playClip(path: string, text: string, rate?: number): void {
  const el = audioEl();
  if (!el || AU.ok === -1) { AU.falls += 1; speak(text, rate); return; }
  const tok = ++AU.tok;
  let fired = false; let started = false;
  try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch { /* none */ }
  const fb = (): void => {
    if (tok !== AU.tok || started || fired) return;
    fired = true; AU.falls += 1;
    try { el.pause(); } catch { /* ignore */ }
    speak(text, rate);
  };
  el.onplaying = () => {
    if (tok !== AU.tok) return;
    if (fired) { try { el.pause(); } catch { /* ignore */ } return; }
    started = true; AU.ok = 1; AU.fails = 0; AU.plays += 1;
  };
  el.onerror = () => {
    if (tok !== AU.tok) return;
    AU.fails += 1; if (AU.fails >= 2 && AU.ok !== 1) AU.ok = -1;
    fb();
  };
  try {
    el.src = AUD + path;
    const p = el.play();
    if (p && p.catch) p.catch(() => { window.setTimeout(fb, 0); });
  } catch { fb(); }
  window.setTimeout(fb, 2500);
}
function sayWord(w: Word): void { playClip("w/" + w.en.toLowerCase() + ".mp3", w.en); }
function sayLetter(ch: string): void { playClip("ph/" + ch.toLowerCase() + ".mp3", ch.toUpperCase(), 0.9); }

/* ---------- letters ---------- */
const CONF: Record<string, string> = { b: "d", d: "b", p: "q", q: "p", m: "n", n: "m", i: "l", l: "i", u: "vo", v: "u", a: "e", e: "a", o: "u", c: "ks", k: "c", s: "c" };
const ABC = "abcdefghijklmnopqrstuvwxyz";
const LOW: string[] = ALL.map((w: Word) => w.en.toLowerCase());
function fitsOther(lw: string, pos: number, d: string, open: number[]): boolean {
  return LOW.some((o: string) => {
    if (o === lw || o.length !== lw.length || o[pos] !== d) return false;
    for (let i = 0; i < lw.length; i++) { if (i !== pos && open.indexOf(i) < 0 && o[i] !== lw[i]) return false; }
    return true;
  });
}
function decoys(correct: string, n: number, avoid: string, prefer: string, ok: (d: string) => boolean): string[] {
  const out: string[] = [];
  const add = (d: string): void => { if (out.length < n && d !== correct && avoid.indexOf(d) < 0 && out.indexOf(d) < 0 && ok(d)) out.push(d); };
  shuffle(prefer.split("")).forEach(add);
  shuffle(ABC.split("")).forEach(add);
  return out;
}
function pickBlanks(lw: string): number[] {
  const k = lw.length <= 4 ? 1 : 2;
  return shuffle(lw.split("").map((_: string, i: number) => i)).slice(0, k).sort((a: number, b: number) => a - b);
}

/* ---------- skins ---------- */
const SKINS: { n: string; e: string; need: number; c: string; rot: boolean; pw: number }[] = [
  { n: "번개 로켓", e: "🚀", need: 0, c: "#ffe14d", rot: true, pw: 1 },
  { n: "꼬마 UFO", e: "🛸", need: 30, c: "#5ee7ff", rot: false, pw: 2 },
  { n: "불꽃 드래곤", e: "🐉", need: 80, c: "#ff7a3d", rot: false, pw: 2 },
  { n: "무지개 유니콘", e: "🦄", need: 150, c: "#ff7ae0", rot: false, pw: 3 },
  { n: "번개 독수리", e: "🦅", need: 250, c: "#b7ff4a", rot: false, pw: 3 },
  { n: "황금 별함선", e: "🌟", need: 400, c: "#ffd700", rot: false, pw: 4 },
];

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  const k = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + k, y); ctx.lineTo(x + w - k, y); ctx.quadraticCurveTo(x + w, y, x + w, y + k);
  ctx.lineTo(x + w, y + h - k); ctx.quadraticCurveTo(x + w, y + h, x + w - k, y + h);
  ctx.lineTo(x + k, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - k);
  ctx.lineTo(x, y + k); ctx.quadraticCurveTo(x, y, x + k, y); ctx.closePath();
}

/* ---------- shooter (미션 ① 소리 슈팅 / 미션 ② 스펠링 조준) ---------- */
type Met = { w: Word; ch: string; x: number; y: number; vy: number; pw: number; ph: number; kind: number; rot: number; spin: number; hue: string; id: number; hp: number; mhp: number; crack: number };
type Part = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; s: number };
type Pop = { t: string; x: number; y: number; life: number; c: string; big: boolean };
type Res = { win: boolean; score: number; gained: number; hearts: number; missed: string[]; warn: number };
type Mode = "sound" | "spell";
type Spell = { lw: string; blanks: number[]; bi: number; bad: boolean };

function Shooter(props: { mode: Mode; warn0: number; study: Word[]; review: Word[]; first: string[]; skin: number; onWord: (w: Word, ok: boolean) => void; onEnd: (r: Res) => void; onQuit: () => void }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const pRef = useRef(props);
  pRef.current = props;
  const pauseRef = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const box = boxRef.current; const cv = cvRef.current;
    if (!box || !cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const P = pRef.current;
    const SP = P.mode === "spell";
    const base = Math.max(0, Math.min(SKINS.length - 1, P.skin));
    const firstW = P.first.map((en: string) => MAP[en]).filter((w: Word | undefined) => !!w);
    const fset = new Set(firstW.map((w: Word) => w.en));
    let queue: Word[];
    if (SP) {
      const rest = shuffle(P.study.filter((w: Word) => !fset.has(w.en)));
      const rv = P.review.filter((w: Word) => !fset.has(w.en) && !P.study.some((s: Word) => s.en === w.en)).slice(0, 2);
      queue = [...shuffle(firstW), ...rest, ...rv];
    } else {
      const q1 = shuffle(P.study.filter((w: Word) => !fset.has(w.en)));
      const q2 = shuffle([...P.study, ...P.review]);
      if (q2.length > 1 && q1.length > 0 && q2[0].en === q1[q1.length - 1].en) { const t = q2[0]; q2[0] = q2[q2.length - 1]; q2[q2.length - 1] = t; }
      queue = [...shuffle(firstW), ...q1, ...q2];
    }
    const known: Word[] = [...P.study, ...P.review];
    const G = {
      W: 800, H: 600, dpr: 1, mets: [] as Met[], parts: [] as Part[],
      lasers: [] as { x1: number; y1: number; x2: number; y2: number; life: number }[], pops: [] as Pop[],
      target: null as Word | null, hearts: 3, score: 0, combo: 0, level: 1, correct: 0, gained: 0, done: 0,
      spawnT: 0.5, flash: 0, shake: 0, sx: 400, stx: 400, lvlT: 0, intro: 1.8, ended: false, endT: 0, win: false,
      reported: false, id: 0, missed: new Set<string>(), stars: [] as { x: number; y: number; z: number }[],
      again: new Set<string>(fset), miss: {} as Record<string, number>, taught: {} as Record<string, number>,
      teachT: 0, teachW: null as Word | null, nextT: 0,
      cur: base, warn: Math.max(0, Math.min(2, P.warn0 || 0)), recov: 0, lock: null as Met | null, fireT: 0, upT: 0, downT: 0,
      sp: null as Spell | null, opts: [] as string[],
    };
    (window as unknown as Record<string, unknown>).__swG = G;
    for (let i = 0; i < 100; i++) G.stars.push({ x: Math.random(), y: Math.random(), z: rnd(0.2, 1) });
    const fs = (): number => Math.max(38, Math.min(58, G.W / 16));
    const lfs = (): number => Math.max(52, Math.min(72, G.W / 12));
    const groundY = (): number => G.H - 112;
    const shipY = (): number => G.H - 154;
    const fontEn = (s: number): string => `900 ${s}px "Avenir Next","Trebuchet MS",system-ui,sans-serif`;
    const fontKo = (s: number): string => `800 ${s}px "Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif`;
    const fontEmo = (s: number): string => `${s}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    const curCh = (): string => { const s = G.sp; return s && s.bi < s.blanks.length ? s.lw[s.blanks[s.bi]] : ""; };

    function finish(win: boolean): void {
      if (G.ended) return;
      G.ended = true; G.win = win; G.endT = 1.8;
      if (win) SFX.win(); else SFX.lose();
    }
    function buildOpts(): void {
      const s = G.sp;
      G.mets.forEach((m: Met) => burst(m.x, m.y, "#9aa3b5", 6));
      G.mets = []; G.lock = null;
      if (!s || s.bi >= s.blanks.length) { G.opts = []; return; }
      const pos = s.blanks[s.bi]; const ch = s.lw[pos];
      const open = s.blanks.slice(s.bi + 1);
      const n = G.level >= 6 ? 4 : G.level >= 3 ? 3 : 2;
      G.opts = [ch, ...decoys(ch, n, "", CONF[ch] || "", (d: string) => !fitsOther(s.lw, pos, d, open))];
      G.spawnT = 0.25;
    }
    function nextTarget(): void {
      G.target = queue.shift() || null;
      if (!G.target) { G.sp = null; finish(true); return; }
      G.spawnT = Math.min(G.spawnT, 0.35);
      const t = G.target; const mc = G.miss[t.en] || 0;
      if (SP) { const lw = t.en.toLowerCase(); G.sp = { lw, blanks: pickBlanks(lw), bi: 0, bad: false }; buildOpts(); }
      if (mc >= 3 && G.taught[t.en] !== mc) { G.taught[t.en] = mc; G.teachW = t; G.teachT = 2.8; }
      sayWord(t);
    }
    function requeue(w: Word): void {
      G.again.add(w.en);
      G.miss[w.en] = (G.miss[w.en] || 0) + 1;
      const i = queue.findIndex((q: Word) => q.en === w.en);
      if (i >= 0 && i <= 2) return;
      if (i > 2) queue.splice(i, 1);
      queue.splice(Math.min(1, queue.length), 0, w);
    }
    function burst(x: number, y: number, c: string, n: number): void {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, Math.PI * 2); const v = rnd(80, 380);
        G.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(0.4, 0.9), max: 0.9, c, s: rnd(4, 10) });
      }
    }
    function pop(t: string, x: number, y: number, c: string, big: boolean): void {
      G.pops.push({ t, x, y, life: big ? 1.6 : 1.1, c, big });
    }
    function hurt(): void {
      G.hearts -= 1; G.flash = 1; G.shake = 1; SFX.buzz();
      if (G.hearts <= 0) finish(false);
    }
    function warnUp(): void {
      G.recov = 0;
      G.warn += 1;
      if (G.warn >= 3 && G.ended) G.warn = 2;
      else if (G.warn >= 3) {
        G.warn = 0;
        if (G.cur > 0) {
          G.cur -= 1; G.downT = 1.6;
          burst(G.sx, shipY(), "#ff3b3b", 30);
          pop(`우주선 다운그레이드! ${SKINS[G.cur].e} ⚡${SKINS[G.cur].pw}`, G.W / 2, G.H * 0.3, "#ff6b6b", true);
          tone(400, 0.5, "sawtooth", 0.12, 120);
        }
      }
    }
    function markBad(t: Word): void {
      if (G.sp && !G.sp.bad) {
        G.sp.bad = true;
        G.missed.add(t.en);
        requeue(t);
        pRef.current.onWord(t, false);
      }
    }
    function spawn(forceTarget: boolean): void {
      if (!G.target) return;
      let w: Word; let ch = "";
      if (SP) {
        if (!G.sp || !G.opts.length) return;
        const onS = new Set(G.mets.map((m: Met) => m.ch));
        if (forceTarget) ch = curCh();
        else {
          const free = G.opts.filter((o: string) => !onS.has(o));
          if (!free.length) return;
          ch = free[Math.floor(Math.random() * free.length)];
        }
        if (!ch) return;
        w = G.target;
      } else if (forceTarget) w = G.target;
      else {
        const onScreen = new Set(G.mets.map((m: Met) => m.w.en));
        const tk = G.target.ko; const ten = G.target.en.toLowerCase();
        const pool = known.length > 3 && Math.random() < 0.65 ? known : ALL;
        let tries = 0;
        w = pool[Math.floor(Math.random() * pool.length)];
        while ((onScreen.has(w.en) || w.ko === tk || w.en.toLowerCase() === ten) && tries < 40) {
          const pl = tries > 12 ? ALL : pool;
          w = pl[Math.floor(Math.random() * pl.length)];
          tries++;
        }
      }
      const f = ch ? lfs() : fs();
      ctx!.font = fontEn(f);
      const tw = ctx!.measureText(ch || w.en).width;
      const pw = Math.min(G.W - 20, Math.max(tw + 36, ch ? f + 34 : 0)); const ph = f + 24;
      let x = G.W / 2; let best = -1e9;
      for (let i = 0; i < 12; i++) {
        const lo = pw / 2 + 10; const hi = Math.max(lo + 1, G.W - pw / 2 - 84);
        const cx = rnd(lo, hi);
        let dmin = 1e9;
        for (const m of G.mets) { if (m.y < 300) dmin = Math.min(dmin, Math.abs(m.x - cx) - (m.pw + pw) / 2); }
        if (dmin > best) { best = dmin; x = cx; }
        if (dmin > 30) break;
      }
      const sp = G.H * (0.068 + 0.016 * (Math.min(G.level, 10) - 1)) * rnd(0.88, 1.12) * (SP ? 0.9 : 1);
      const hues = ["#ff9f43", "#7dd3fc", "#2ed3a0", "#fd79a8", "#4dabff", "#f9c80e"];
      const L = G.level; const rr0 = Math.random();
      let hp = 1;
      if (L >= 7) hp = rr0 < 0.3 ? 3 : rr0 < 0.75 ? 2 : 1;
      else if (L >= 5) hp = rr0 < 0.15 ? 3 : rr0 < 0.6 ? 2 : 1;
      else if (L >= 3) hp = rr0 < 0.35 ? 2 : 1;
      G.mets.push({ w, ch, x, y: -30, vy: sp, pw, ph, kind: Math.random() < 0.4 ? 1 : 0, rot: rnd(0, 6), spin: rnd(-1.5, 1.5), hue: hues[G.id % hues.length], id: G.id++, hp, mhp: hp, crack: 0 });
    }
    function onTap(x: number, y: number): void {
      unlockAudio();
      if (G.ended || G.intro > 0 || pauseRef.current) return;
      if (G.target && y >= G.H - 104 && x >= G.W - 140) { SFX.tap(); sayWord(G.target); return; }
      if (G.teachT > 0 || G.lock || G.nextT > 0 || !G.target) return;
      let hit: Met | null = null;
      for (let i = G.mets.length - 1; i >= 0; i--) {
        const m = G.mets[i];
        if (Math.abs(x - m.x) <= m.pw / 2 + 18 && y >= m.y - m.ph / 2 - 66 && y <= m.y + m.ph / 2 + 18) { hit = m; break; }
      }
      if (!hit) return;
      const h = hit;
      G.stx = h.x;
      const good = SP ? h.ch === curCh() : h.w.en === G.target.en;
      if (good) { G.lock = h; G.fireT = 0; return; }
      if (SP) wrongLetter(h); else wrongShot(h);
    }
    function kill(h: Met): void {
      G.lasers.push({ x1: G.sx, y1: shipY() - 30, x2: h.x, y2: h.y - 20, life: 0.22 });
      SFX.laser(); SFX.boom(); SFX.ding();
      burst(h.x, h.y - 20, h.hue, 26); burst(h.x, h.y - 20, "#fff27a", 14);
      G.mets = G.mets.filter((m: Met) => m !== h);
      G.recov += 1;
      if (G.recov >= 5) {
        G.recov = 0;
        if (G.cur < base) {
          G.cur += 1; G.upT = 1.6; SFX.level();
          burst(G.sx, shipY(), "#7dff9a", 30);
          pop(`우주선 회복! ${SKINS[G.cur].e} ⚡${SKINS[G.cur].pw}`, G.W / 2, G.H * 0.3, "#7dff9a", true);
        }
      }
      if (SP) {
        const s = G.sp; if (!s) return;
        s.bi += 1; sayLetter(h.ch);
        if (s.bi >= s.blanks.length) wordDone();
        else { pop("👍", h.x, h.y - 50, "#7dff9a", false); buildOpts(); }
        return;
      }
      G.combo += 1;
      const mult = Math.min(5, 1 + Math.floor(G.combo / 3));
      G.score += 10 * mult; G.gained += 1; G.correct += 1; G.done += 1;
      pop(`${h.w.emo} ${h.w.en} = ${h.w.ko}`, G.W / 2, G.H * 0.42, "#ffffff", true);
      pop(mult > 1 ? `+⭐  콤보 x${mult}!` : "+⭐", h.x, h.y - 50, "#ffe14d", false);
      sayWord(h.w);
      pRef.current.onWord(h.w, true);
      if (!queue.some((q: Word) => q.en === h.w.en)) G.again.delete(h.w.en);
      levelCheck();
      G.target = null; G.nextT = 1.2;
    }
    function levelCheck(): void {
      if (G.correct > 0 && G.correct % 6 === 0 && G.level < 10) {
        G.level += 1; G.lvlT = 2.2; SFX.level();
        G.mets.forEach((m: Met) => { m.vy *= 1.1; });
      }
    }
    function wordDone(): void {
      const t = G.target; const s = G.sp; if (!t || !s) return;
      G.done += 1;
      if (!s.bad) {
        G.combo += 1;
        const mult = Math.min(5, 1 + Math.floor(G.combo / 3));
        G.score += 10 * mult; G.gained += 1; G.correct += 1;
        pRef.current.onWord(t, true);
        pop(mult > 1 ? `+⭐  콤보 x${mult}!` : "+⭐", G.W / 2, G.H * 0.52, "#ffe14d", false);
        if (!queue.some((q: Word) => q.en === t.en)) G.again.delete(t.en);
        levelCheck();
      }
      pop(`${t.emo} ${t.en} = ${t.ko}`, G.W / 2, G.H * 0.42, "#ffffff", true);
      G.mets.forEach((m: Met) => burst(m.x, m.y, "#9aa3b5", 6));
      G.mets = []; G.opts = [];
      window.setTimeout(() => sayWord(t), 500);
      G.nextT = 1.5;
    }
    function wrongShot(h: Met): void {
      const tgt = G.target;
      if (!tgt) return;
      hurt();
      G.combo = 0; G.score = Math.max(0, G.score - 5);
      G.missed.add(tgt.en);
      requeue(tgt);
      pRef.current.onWord(tgt, false);
      burst(h.x, h.y, "#9aa3b5", 16);
      pop(`앗! ${h.w.en} = ${h.w.ko}`, h.x, h.y - 40, "#ff9a9a", false);
      G.mets = G.mets.filter((m: Met) => m !== h);
      warnUp();
    }
    function wrongLetter(h: Met): void {
      const tgt = G.target;
      if (!tgt || !G.sp) return;
      hurt();
      G.combo = 0; G.score = Math.max(0, G.score - 5);
      markBad(tgt);
      burst(h.x, h.y, "#9aa3b5", 16);
      pop("앗! 아니에요", h.x, h.y - 40, "#ff9a9a", false);
      G.mets = G.mets.filter((m: Met) => m !== h);
      warnUp();
    }
    function update(dt: number): void {
      G.stars.forEach((s: { x: number; y: number; z: number }) => { s.y += dt * 0.05 * s.z * (1 + G.level * 0.2); if (s.y > 1) { s.y = 0; s.x = Math.random(); } });
      G.flash = Math.max(0, G.flash - dt * 2); G.upT = Math.max(0, G.upT - dt); G.downT = Math.max(0, G.downT - dt); G.shake = Math.max(0, G.shake - dt * 2.5); G.lvlT = Math.max(0, G.lvlT - dt);
      G.sx += (G.stx - G.sx) * Math.min(1, dt * 8);
      G.parts.forEach((p: Part) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt; p.life -= dt; });
      G.parts = G.parts.filter((p: Part) => p.life > 0);
      G.lasers.forEach((l: { life: number }) => { l.life -= dt; });
      G.lasers = G.lasers.filter((l: { life: number }) => l.life > 0);
      G.pops.forEach((p: Pop) => { p.life -= dt; });
      G.pops = G.pops.filter((p: Pop) => p.life > 0);
      if (G.ended) {
        G.endT -= dt;
        if (G.endT <= 0 && !G.reported) {
          G.reported = true;
          pRef.current.onEnd({ win: G.win, score: G.score, gained: G.gained, hearts: G.hearts, missed: Array.from(G.missed), warn: G.warn });
        }
        return;
      }
      if (G.intro > 0) { G.intro -= dt; if (G.intro <= 0) nextTarget(); return; }
      if (G.teachT > 0) { G.teachT -= dt; return; }
      if (G.nextT > 0) { G.nextT -= dt; if (G.nextT <= 0) { G.nextT = 0; nextTarget(); } }
      if (G.lock) {
        const Lm = G.lock;
        if (!G.mets.includes(Lm)) G.lock = null;
        else {
          G.fireT -= dt;
          if (G.fireT <= 0) {
            G.fireT = 0.17;
            Lm.hp -= SKINS[G.cur].pw;
            if (Lm.hp <= 0) { G.lock = null; kill(Lm); }
            else {
              G.lasers.push({ x1: G.sx, y1: shipY() - 30, x2: Lm.x, y2: Lm.y - 20, life: 0.15 });
              SFX.laser(); SFX.crack(); Lm.crack = 0.4;
              burst(Lm.x, Lm.y, "#7fe9ff", 14);
              pop("🛡️ 깨짐!", Lm.x, Lm.y - 60, "#7fe9ff", false);
            }
          }
        }
      }
      const maxN = SP ? G.opts.length : Math.min(5, 3 + Math.floor((G.level - 1) / 2));
      G.spawnT -= dt;
      const tg = G.target;
      if (tg && G.nextT <= 0) {
        const hasT = SP ? G.mets.some((m: Met) => m.ch === curCh()) : G.mets.some((m: Met) => m.w.en === tg.en);
        if (!hasT && G.spawnT <= 0) { spawn(true); G.spawnT = rnd(0.9, 1.4) / (1 + G.level * 0.08); }
        else if (G.spawnT <= 0 && G.mets.length < maxN) { spawn(false); G.spawnT = rnd(0.9, 1.5) / (1 + G.level * 0.08); }
      }
      const gy = groundY();
      G.mets.forEach((m: Met) => { if (m !== G.lock) m.y += m.vy * dt; m.rot += m.spin * dt; m.crack = Math.max(0, m.crack - dt); });
      const fallen = G.mets.filter((m: Met) => m.y + m.ph / 2 >= gy);
      if (fallen.length) {
        G.mets = G.mets.filter((m: Met) => m.y + m.ph / 2 < gy);
        for (const m of fallen) {
          burst(m.x, gy, "#8d8da8", 10);
          if (!G.target || G.ended || G.nextT > 0) continue;
          if (SP) {
            if (m.ch === curCh()) {
              hurt(); G.combo = 0; G.recov = 0;
              markBad(G.target);
              pop("놓쳤어요!", G.W / 2, G.H * 0.42, "#ffb3b3", true);
            }
          } else if (m.w.en === G.target.en) {
            hurt(); G.combo = 0; G.recov = 0;
            G.missed.add(m.w.en);
            pRef.current.onWord(m.w, false);
            pop(`놓쳤어요! ${m.w.en} = ${m.w.ko}`, G.W / 2, G.H * 0.42, "#ffb3b3", true);
            sayWord(m.w);
            requeue(m.w);
            G.target = null; G.nextT = 1.4;
          }
        }
      }
    }
    function draw(now: number): void {
      const c = ctx!; const W = G.W; const H = G.H;
      const skin = SKINS[G.cur] || SKINS[0];
      c.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
      c.save();
      const sh = G.shake * 14;
      if (sh > 0) c.translate(rnd(-sh, sh), rnd(-sh, sh));
      const bg = c.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#081030"); bg.addColorStop(0.6, "#12296b"); bg.addColorStop(1, "#0f3c7d");
      c.fillStyle = bg; c.fillRect(-20, -20, W + 40, H + 40);
      c.globalAlpha = 0.55;
      c.fillStyle = "#ff7eb6"; c.beginPath(); c.arc(W * 0.86, H * 0.2, 54, 0, Math.PI * 2); c.fill();
      c.strokeStyle = "#ffd93b"; c.lineWidth = 6; c.beginPath(); c.ellipse(W * 0.86, H * 0.2, 90, 20, -0.35, 0, Math.PI * 2); c.stroke();
      c.fillStyle = "#5ee7ff"; c.beginPath(); c.arc(W * 0.1, H * 0.55, 30, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
      G.stars.forEach((s: { x: number; y: number; z: number }) => {
        c.fillStyle = `rgba(255,255,255,${0.35 + s.z * 0.6})`;
        const r = s.z * 2.4; c.fillRect(s.x * W, s.y * H, r, r);
      });
      const gy = groundY();
      c.fillStyle = "rgba(120,220,255,0.18)"; c.fillRect(0, gy, W, 3);
      for (const m of G.mets) {
        const by = m.y - m.ph / 2 - 30;
        c.globalAlpha = 0.35; c.fillStyle = m.hue;
        c.beginPath(); c.moveTo(m.x - 20, by - 6); c.lineTo(m.x, by - 80); c.lineTo(m.x + 20, by - 6); c.fill();
        c.globalAlpha = 1;
        if (m.kind === 0) {
          c.save(); c.translate(m.x, by); c.rotate(m.rot);
          const g2 = c.createRadialGradient(-8, -8, 4, 0, 0, 30);
          g2.addColorStop(0, "#ffcf8a"); g2.addColorStop(1, "#b5562b");
          c.fillStyle = g2; c.beginPath(); c.arc(0, 0, 30, 0, Math.PI * 2); c.fill();
          c.fillStyle = "rgba(90,35,10,0.45)";
          c.beginPath(); c.arc(10, -6, 7, 0, Math.PI * 2); c.fill();
          c.beginPath(); c.arc(-10, 9, 5, 0, Math.PI * 2); c.fill();
          c.beginPath(); c.arc(4, 14, 4, 0, Math.PI * 2); c.fill();
          c.restore();
        } else {
          c.font = fontEmo(56); c.textAlign = "center"; c.textBaseline = "middle";
          c.fillText(m.id % 2 ? "👾" : "👽", m.x, by + Math.sin(now / 200 + m.id) * 4);
        }
        c.globalAlpha = 1;
        rr(c, m.x - m.pw / 2, m.y - m.ph / 2, m.pw, m.ph, m.ph / 2);
        c.fillStyle = "#111111"; c.fill();
        c.lineWidth = 7; c.strokeStyle = m.hue; c.stroke();
        rr(c, m.x - m.pw / 2 + 6, m.y - m.ph / 2 + 6, m.pw - 12, m.ph - 12, (m.ph - 12) / 2);
        c.lineWidth = 2; c.strokeStyle = "#ffffff"; c.stroke();
        c.font = fontEn(m.ch ? lfs() : fs()); c.textAlign = "center"; c.textBaseline = "middle";
        c.lineJoin = "round"; c.lineWidth = 8; c.strokeStyle = "#000000";
        const lab = m.ch || m.w.en;
        c.strokeText(lab, m.x, m.y + 2, m.pw - 20);
        c.fillStyle = "#FFE600"; c.fillText(lab, m.x, m.y + 2, m.pw - 20);
        if (m.hp > 1) {
          rr(c, m.x - m.pw / 2 - 6, m.y - m.ph / 2 - 6, m.pw + 12, m.ph + 12, (m.ph + 12) / 2);
          c.lineWidth = 5; c.strokeStyle = "#5ee7ff"; c.stroke();
          c.font = fontEmo(28); c.textAlign = "center";
          for (let i = 0; i < m.hp - 1; i++) c.fillText("🛡️", m.x - m.pw / 2 + 16 + i * 32, m.y - m.ph / 2 - 6);
        }
        if (m.crack > 0) {
          c.globalAlpha = Math.min(1, m.crack / 0.25); c.strokeStyle = "#ffffff"; c.lineWidth = 3;
          c.beginPath();
          c.moveTo(m.x - m.pw * 0.35, m.y - m.ph / 2); c.lineTo(m.x - m.pw * 0.15, m.y); c.lineTo(m.x - m.pw * 0.25, m.y + m.ph / 2);
          c.moveTo(m.x + m.pw * 0.3, m.y - m.ph / 2); c.lineTo(m.x + m.pw * 0.12, m.y - 4); c.lineTo(m.x + m.pw * 0.28, m.y + m.ph / 2);
          c.stroke(); c.globalAlpha = 1;
        }
      }
      for (const l of G.lasers) {
        const a = Math.min(1, l.life / 0.15);
        c.globalAlpha = a; c.lineCap = "round";
        c.strokeStyle = skin.c; c.lineWidth = 14; c.beginPath(); c.moveTo(l.x1, l.y1); c.lineTo(l.x2, l.y2); c.stroke();
        c.strokeStyle = "#ffffff"; c.lineWidth = 5; c.beginPath(); c.moveTo(l.x1, l.y1); c.lineTo(l.x2, l.y2); c.stroke();
        c.globalAlpha = 1;
      }
      for (const p of G.parts) {
        c.globalAlpha = Math.max(0, p.life / p.max); c.fillStyle = p.c;
        c.beginPath(); c.arc(p.x, p.y, p.s, 0, Math.PI * 2); c.fill();
      }
      c.globalAlpha = 1;
      const sy = shipY();
      c.fillStyle = "#ff9f1c";
      const fl = 14 + Math.sin(now / 40) * 6;
      c.beginPath(); c.moveTo(G.sx - 12, sy + 26); c.lineTo(G.sx, sy + 26 + fl + 10); c.lineTo(G.sx + 12, sy + 26); c.fill();
      c.fillStyle = "#fff27a";
      c.beginPath(); c.moveTo(G.sx - 6, sy + 26); c.lineTo(G.sx, sy + 26 + fl); c.lineTo(G.sx + 6, sy + 26); c.fill();
      c.save(); c.translate(G.sx, sy);
      if (skin.rot) c.rotate(-Math.PI / 4);
      c.font = fontEmo(66); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(skin.e, 0, 0);
      c.restore();
      if (G.downT > 0 || G.upT > 0) {
        const dn = G.downT > 0; const tt = dn ? G.downT : G.upT;
        c.globalAlpha = Math.min(1, tt); c.strokeStyle = dn ? "#ff3b3b" : "#7dff9a"; c.lineWidth = 7;
        c.beginPath(); c.arc(G.sx, sy, 50 + (1.6 - tt) * 70, 0, Math.PI * 2); c.stroke(); c.globalAlpha = 1;
      }
      // HUD
      c.textBaseline = "middle"; c.textAlign = "left";
      c.font = fontEmo(30);
      for (let i = 0; i < 3; i++) c.fillText(i < G.hearts ? "❤️" : "🖤", 14 + i * 40, 36);
      c.font = fontKo(24); c.fillStyle = "#ffffff";
      c.fillText(`⭐ ${G.score}점`, 140, 36);
      c.fillStyle = "#ffd93b";
      c.fillText(`Lv.${G.level}`, 140, 70);
      if (G.combo >= 2) { c.fillStyle = "#ff9f43"; c.fillText(`🔥 콤보 ${G.combo}`, 220, 70); }
      c.font = fontKo(24); c.fillStyle = "#7fe9ff"; c.fillText(`⚡ 레이저 ${skin.pw}`, 290, 36);
      c.font = fontKo(18); c.fillStyle = "#ffffff"; c.fillText("⚠️ 경고", 14, 126);
      for (let i = 0; i < 3; i++) {
        c.beginPath(); c.arc(110 + i * 30, 126, 10, 0, Math.PI * 2);
        c.fillStyle = i < G.warn ? "#ff3b3b" : "rgba(255,255,255,0.25)"; c.fill();
        c.lineWidth = 2; c.strokeStyle = "#ffffff"; c.stroke();
      }
      c.textAlign = "right"; c.font = fontKo(20); c.fillStyle = "#FFE600";
      c.fillText(SP ? "미션 ② 스펠링 조준" : "미션 ① 소리 슈팅", W - 14, 96);
      const tot = G.done + queue.length + (G.target ? 1 : 0);
      const pr = tot ? G.done / tot : 0;
      rr(c, 14, 92, Math.max(120, W * 0.4), 12, 6); c.fillStyle = "rgba(255,255,255,0.2)"; c.fill();
      rr(c, 14, 92, Math.max(12, Math.max(120, W * 0.4) * pr), 12, 6); c.fillStyle = "#4ade80"; c.fill();
      // bottom target panel (dark, bright text)
      rr(c, 12, H - 100, W - 24, 88, 24);
      c.fillStyle = "#111111"; c.fill(); c.lineWidth = 5; c.strokeStyle = "#FFE600"; c.stroke();
      const bx = W - 128; const by2 = H - 92;
      rr(c, bx, by2, 104, 72, 18); c.fillStyle = "#0e7490"; c.fill(); c.lineWidth = 3; c.strokeStyle = "#ffffff"; c.stroke();
      c.textAlign = "center"; c.textBaseline = "middle";
      c.font = fontEmo(30); c.fillText("🔊", bx + 52, by2 + 26);
      c.font = fontKo(17); c.fillStyle = "#ffffff"; c.fillText("다시 듣기", bx + 52, by2 + 56);
      const mid = (12 + bx) / 2;
      if (!G.target) {
        c.font = fontKo(26); c.fillStyle = "#ffffff";
        c.fillText(G.ended ? "" : (G.nextT > 0 ? "잘했어요! 다음 단어…" : "준비 중…"), mid, H - 56);
      } else if (!SP) {
        c.font = fontKo(16); c.fillStyle = "#ffffff"; c.fillText("소리를 듣고 맞는 영어 단어 운석을 쏘세요!", mid, H - 82);
        c.font = fontKo(Math.min(40, W / 16)); c.fillStyle = "#FFE600"; c.fillText("🎯 🔊 무슨 단어일까요?", mid, H - 46);
      } else if (G.sp) {
        const s = G.sp; const t = G.target;
        c.font = fontKo(16); c.fillStyle = "#ffffff"; c.fillText("빈칸에 들어갈 글자를 쏘세요!", mid, H - 84);
        let left = 24;
        if (W >= 640) {
          c.textAlign = "left"; c.font = fontEmo(42); c.fillText(t.emo, 26, H - 50);
          c.font = fontKo(22); c.fillStyle = "#ffffff"; c.fillText(t.ko, 78, H - 48);
          left = 78 + c.measureText(t.ko).width + 16;
        }
        const n = t.en.length;
        const room = bx - 12 - left;
        const cw = Math.min(50, room / n);
        const x0 = left + (room - cw * n) / 2;
        const ef = Math.min(46, cw * 1.05);
        c.textAlign = "center";
        for (let i = 0; i < n; i++) {
          const cx = x0 + cw * i + cw / 2; const cy = H - 46;
          const bIdx = s.blanks.indexOf(i);
          if (bIdx >= 0 && bIdx >= s.bi) {
            const curB = bIdx === s.bi;
            rr(c, cx - cw / 2 + 3, cy - 24, cw - 6, 46, 8);
            c.lineWidth = curB ? 4 : 2; c.strokeStyle = curB ? (Math.sin(now / 160) > 0 ? "#FFE600" : "#ffffff") : "#ffffff"; c.stroke();
          } else {
            c.font = fontEn(ef); c.fillStyle = bIdx >= 0 ? "#7dff9a" : "#FFE600";
            c.fillText(t.en[i], cx, cy);
          }
        }
      }
      if (G.target && G.again.has(G.target.en)) {
        rr(c, 24, H - 142, 100, 36, 18); c.fillStyle = "#ff3b3b"; c.fill(); c.lineWidth = 3; c.strokeStyle = "#ffffff"; c.stroke();
        c.font = fontKo(19); c.fillStyle = "#ffffff"; c.textAlign = "center"; c.fillText("🔁 다시!", 74, H - 123);
      }
      for (const p of G.pops) {
        const a = Math.min(1, p.life * 2);
        c.globalAlpha = a;
        const fsz = p.big ? Math.min(48, W / 14) : 26;
        c.font = fontKo(fsz); c.textAlign = "center";
        const yy = p.y - (p.big ? (1.6 - p.life) * 20 : (1.1 - p.life) * 50);
        c.lineWidth = 7; c.strokeStyle = "#000000"; c.strokeText(p.t, p.x, yy);
        c.fillStyle = p.c; c.fillText(p.t, p.x, yy);
      }
      c.globalAlpha = 1;
      if (G.intro > 0) {
        c.font = fontKo(Math.min(64, W / 9)); c.textAlign = "center";
        c.lineWidth = 8; c.strokeStyle = "#000000";
        const t = G.intro > 0.8 ? (SP ? "미션 ② 스펠링 조준!" : "미션 ① 소리 슈팅!") : "출발! 🚀";
        c.strokeText(t, W / 2, H * 0.4); c.fillStyle = "#ffe14d"; c.fillText(t, W / 2, H * 0.4);
      }
      if (G.lvlT > 0) {
        const s = 1 + Math.sin((2.2 - G.lvlT) * 8) * 0.06;
        c.save(); c.translate(W / 2, H * 0.28); c.scale(s, s);
        c.font = fontKo(Math.min(60, W / 10)); c.textAlign = "center";
        c.lineWidth = 9; c.strokeStyle = "#000000"; c.strokeText(`🎉 레벨 업! Lv.${G.level}`, 0, 0);
        c.fillStyle = "#FFE600"; c.fillText(`🎉 레벨 업! Lv.${G.level}`, 0, 0);
        c.font = fontKo(24); c.fillStyle = "#ffffff"; c.fillText(SP ? "글자가 더 빨라지고 헷갈리는 글자가 늘어요!" : "운석이 더 빨라져요!", 0, 46);
        c.restore();
      }
      if (G.teachT > 0 && G.teachW) {
        const tw0 = G.teachW;
        c.fillStyle = "rgba(0,0,0,0.65)"; c.fillRect(-20, -20, W + 40, H + 40);
        const hw = Math.min(280, W / 2 - 16); const ty = H * 0.2;
        rr(c, W / 2 - hw, ty, hw * 2, 250, 30); c.fillStyle = "#ffffff"; c.fill(); c.lineWidth = 6; c.strokeStyle = "#ffd93b"; c.stroke();
        c.textAlign = "center"; c.textBaseline = "middle";
        c.font = fontKo(22); c.fillStyle = "#000000"; c.fillText("여러 번 틀렸어요. 다시 배워요!", W / 2, ty + 32);
        c.font = fontEmo(60); c.fillText(tw0.emo, W / 2, ty + 88);
        c.font = fontEn(52); const ew = c.measureText(tw0.en).width;
        rr(c, W / 2 - ew / 2 - 18, ty + 124, ew + 36, 64, 16); c.fillStyle = "#111111"; c.fill();
        c.fillStyle = "#FFE600"; c.fillText(tw0.en, W / 2, ty + 157);
        c.font = fontKo(32); const kw = c.measureText(tw0.ko).width;
        rr(c, W / 2 - kw / 2 - 14, ty + 196, kw + 28, 44, 12); c.fillStyle = "#ffd93b"; c.fill();
        c.fillStyle = "#000000"; c.fillText(tw0.ko, W / 2, ty + 219);
      }
      if (G.flash > 0) { c.fillStyle = `rgba(255,30,60,${G.flash * 0.38})`; c.fillRect(-20, -20, W + 40, H + 40); }
      if (G.ended) {
        c.fillStyle = "rgba(0,0,0,0.5)"; c.fillRect(-20, -20, W + 40, H + 40);
        c.font = fontKo(Math.min(66, W / 9)); c.textAlign = "center";
        const t = G.win ? "미션 성공! 🎉" : "게임 오버 💥";
        c.lineWidth = 9; c.strokeStyle = "#000000"; c.strokeText(t, W / 2, H * 0.4);
        c.fillStyle = G.win ? "#ffe14d" : "#ff8a8a"; c.fillText(t, W / 2, H * 0.4);
      }
      c.restore();
    }
    function resize(): void {
      const r = box!.getBoundingClientRect();
      const first = G.W === 800 && G.H === 600;
      G.W = Math.max(300, r.width); G.H = Math.max(420, r.height);
      G.dpr = Math.min(2, window.devicePixelRatio || 1);
      cv!.width = Math.round(G.W * G.dpr); cv!.height = Math.round(G.H * G.dpr);
      cv!.style.width = G.W + "px"; cv!.style.height = G.H + "px";
      if (first) { G.sx = G.W / 2; G.stx = G.W / 2; }
      G.mets.forEach((m: Met) => { m.x = Math.min(Math.max(m.x, m.pw / 2 + 6), G.W - m.pw / 2 - 6); });
    }
    resize();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") { ro = new ResizeObserver(() => resize()); ro.observe(box); }
    window.addEventListener("resize", resize);
    const pd = (e: PointerEvent): void => { e.preventDefault(); const r = cv.getBoundingClientRect(); onTap(e.clientX - r.left, e.clientY - r.top); };
    const stop = (e: Event): void => { e.preventDefault(); };
    cv.addEventListener("pointerdown", pd, { passive: false });
    cv.addEventListener("touchstart", stop, { passive: false });
    cv.addEventListener("touchmove", stop, { passive: false });
    cv.addEventListener("gesturestart", stop, { passive: false });
    let last = performance.now();
    let raf = 0;
    const frame = (now: number): void => {
      raf = requestAnimationFrame(frame);
      let dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (pauseRef.current) dt = 0;
      update(dt); draw(now);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", resize);
      cv.removeEventListener("pointerdown", pd);
      cv.removeEventListener("touchstart", stop);
      cv.removeEventListener("touchmove", stop);
      cv.removeEventListener("gesturestart", stop);
    };
  }, []);

  const setP = (v: boolean): void => { pauseRef.current = v; setPaused(v); };
  return (
    <div ref={boxRef} style={{ position: "absolute", inset: 0, overflow: "hidden", touchAction: "none", userSelect: "none", WebkitUserSelect: "none" }}>
      <canvas ref={cvRef} style={{ display: "block", touchAction: "none" }} />
      <button onClick={() => { SFX.tap(); setP(true); }} style={{ position: "absolute", top: 12, right: 12, width: 60, height: 60, borderRadius: 18, border: "3px solid #fff", background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 28, fontWeight: 800, touchAction: "manipulation" }}>⏸</button>
      {paused && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <div style={{ color: "#fff", fontSize: 40, fontWeight: 800 }}>⏸ 잠깐 멈춤</div>
          <Btn label="▶ 계속하기" big onClick={() => { setP(false); }} />
          <Btn label="🏠 그만하고 메뉴로" color="#c9d6ff" shade="#7d8fc9" onClick={() => { setP(false); pRef.current.onQuit(); }} />
        </div>
      )}
    </div>
  );
}

/* ---------- 보스전: 소리만 듣고 철자 전체 ---------- */
type Tile = { id: number; ch: string; used: boolean };
function Boss(props: { words: Word[]; warn0: number; skin: number; h: number; onWord: (w: Word, ok: boolean) => void; onStar: (n: number) => void; onEnd: (r: Res) => void; onQuit: () => void }) {
  const pRef = useRef(props);
  pRef.current = props;
  const base = Math.max(0, Math.min(SKINS.length - 1, props.skin));
  const BR = useRef({
    queue: props.words.slice(), w: null as Word | null, tiles: [] as Tile[], filled: 0, tid: 0,
    hearts: 3, warn: Math.max(0, Math.min(2, props.warn0 || 0)), cur: base, recov: 0, wm: 0, hp: props.words.length, total: props.words.length,
    teach: null as Word | null, busy: true, ended: false, win: false, missed: new Set<string>(), gained: 0, score: 0,
    shake: -1, hit: false, msg: "", msgC: "#ffffff", flash: false, intro: true, paused: false, ring: "",
  });
  const B = BR.current;
  const [, force] = useState(0);
  const re = (): void => force((x: number) => x + 1);
  const timers = useRef<number[]>([]);
  const later = (ms: number, f: () => void): void => { timers.current.push(window.setTimeout(f, ms)); };
  (window as unknown as Record<string, unknown>).__swB = B;

  const nextWord = (): void => {
    const w = B.queue.shift() || null;
    B.w = w;
    if (!w) { win(); return; }
    B.filled = 0; B.wm = 0;
    const lw = w.en.toLowerCase();
    const prefer = lw.split("").map((ch: string) => CONF[ch] || "").join("");
    const ds = decoys("", 2, lw, prefer, () => true);
    B.tiles = shuffle([...lw.split(""), ...ds].map((ch: string) => ({ id: B.tid++, ch, used: false })));
    B.busy = false; re();
    sayWord(w);
  };
  const win = (): void => {
    B.ended = true; B.win = true; B.gained += 10; pRef.current.onStar(10); SFX.win(); re();
    later(1900, () => pRef.current.onEnd({ win: true, score: B.score, gained: B.gained, hearts: B.hearts, missed: Array.from(B.missed), warn: B.warn }));
  };
  const lose = (): void => {
    B.ended = true; B.win = false; SFX.lose(); re();
    later(1900, () => pRef.current.onEnd({ win: false, score: B.score, gained: B.gained, hearts: B.hearts, missed: Array.from(B.missed), warn: B.warn }));
  };
  useEffect(() => {
    SFX.level();
    later(1600, () => { B.intro = false; nextWord(); });
    return () => { timers.current.forEach((t: number) => window.clearTimeout(t)); };
  }, []);

  const say = (): void => { unlockAudio(); if (B.w && !B.ended) { SFX.tap(); sayWord(B.w); } };
  const tap = (t: Tile): void => {
    unlockAudio();
    const w = B.w;
    if (!w || B.busy || B.ended || B.paused || B.teach || B.intro || t.used) return;
    const lw = w.en.toLowerCase();
    if (t.ch === lw[B.filled]) {
      t.used = true; B.filled += 1;
      SFX.laser(); sayLetter(t.ch);
      B.recov += 1;
      if (B.recov >= 5) {
        B.recov = 0;
        if (B.cur < base) { B.cur += 1; SFX.level(); B.ring = "up"; B.msg = `우주선 회복! ${SKINS[B.cur].e} ⚡${SKINS[B.cur].pw}`; B.msgC = "#7dff9a"; later(1400, () => { B.ring = ""; re(); }); }
      }
      if (B.filled >= lw.length) {
        B.busy = true; B.hp -= 1; B.hit = true; SFX.boom(); SFX.ding();
        const clean = B.wm === 0;
        if (clean) { pRef.current.onWord(w, true); pRef.current.onStar(1); } else pRef.current.onStar(2);
        B.gained += 2; B.score += clean ? 20 : 10;
        B.msg = `${w.emo} ${w.en} = ${w.ko}  +⭐2`; B.msgC = "#ffffff";
        later(350, () => { B.hit = false; re(); });
        later(450, () => sayWord(w));
        later(1700, () => { B.msg = ""; nextWord(); });
      }
      re();
      return;
    }
    // wrong letter
    B.hearts -= 1; B.flash = true; SFX.buzz(); B.shake = t.id; B.recov = 0;
    B.warn += 1;
    if (B.warn >= 3 && B.hearts <= 0) B.warn = 2;
    else if (B.warn >= 3) {
      B.warn = 0;
      if (B.cur > 0) { B.cur -= 1; B.ring = "down"; B.msg = `우주선 다운그레이드! ${SKINS[B.cur].e} ⚡${SKINS[B.cur].pw}`; B.msgC = "#ff8a8a"; tone(400, 0.5, "sawtooth", 0.12, 120); later(1400, () => { B.ring = ""; re(); }); }
    }
    B.wm += 1;
    if (B.wm === 1) { B.missed.add(w.en); pRef.current.onWord(w, false); }
    later(300, () => { B.flash = false; B.shake = -1; re(); });
    if (B.hearts <= 0) { lose(); return; }
    if (B.wm >= 2) {
      B.busy = true;
      later(450, () => { B.teach = w; sayWord(w); re(); });
      later(2600, () => { B.teach = null; B.queue.push(w); nextWord(); });
    } else later(350, () => { if (B.w === w && !B.ended) sayWord(w); });
    re();
  };

  const vw = Math.max(320, window.innerWidth || 800);
  const u = Math.min(vw, props.h) / 100;
  const skin = SKINS[B.cur] || SKINS[0];
  const w = B.w;
  const tileS = Math.max(58, Math.min(u * 11, 92));
  const slotS = Math.max(40, Math.min(u * 8, 64, w ? (vw - 60) / Math.max(1, w.en.length) - 8 : 64));
  const overlay = { position: "absolute" as const, inset: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 18, textAlign: "center" as const };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(180deg,#081030 0%,#12296b 60%,#0f3c7d 100%)", touchAction: "manipulation" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "12px 12px 14px", gap: Math.max(6, u * 1.2) }}>
        <div style={{ width: "100%", boxSizing: "border-box", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, paddingRight: 70 }}>
          <div style={{ fontSize: 30 }}>{[0, 1, 2].map((i: number) => (i < B.hearts ? "❤️" : "🖤")).join("")}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#FFE600" }}>👾 보스전</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>⭐ +{B.gained}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#7fe9ff" }}>{skin.e} ⚡ 레이저 {skin.pw}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 18, fontWeight: 800, color: "#ffffff" }}>⚠️ 경고 {[0, 1, 2].map((i: number) => <span key={i} style={{ display: "inline-block", width: 18, height: 18, borderRadius: 9, border: "2px solid #fff", background: i < B.warn ? "#ff3b3b" : "rgba(255,255,255,0.25)" }} />)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: Math.max(70, Math.min(u * 18, 150)), lineHeight: 1, transform: B.hit ? "scale(0.85) rotate(-10deg)" : "none", filter: B.hit ? "brightness(2)" : "none", transition: "transform 0.15s" }}>{B.hit ? "💥" : "👾"}</div>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: B.total }).map((_: unknown, i: number) => <div key={i} style={{ width: Math.max(22, Math.min(u * 5, 40)), height: 16, borderRadius: 6, border: "2px solid #fff", background: i < B.hp ? "#ff3b3b" : "rgba(255,255,255,0.15)" }} />)}
          </div>
        </div>
        <div style={{ minHeight: 40, fontSize: Math.max(22, Math.min(u * 4, 34)), fontWeight: 900, color: B.msgC, textShadow: "0 3px 0 #000" }}>{B.msg}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {w && w.en.split("").map((ch: string, i: number) => (
            <div key={i} style={{ width: slotS, height: slotS * 1.15, borderRadius: 12, background: "#111111", border: i === B.filled ? "4px solid #FFE600" : "3px solid #ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: slotS * 0.8, fontWeight: 900, color: "#FFE600", WebkitTextFillColor: "#FFE600" }}>{i < B.filled ? ch : ""}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: Math.max(18, Math.min(u * 3, 24)), fontWeight: 800, color: "#ffffff" }}>소리를 듣고 철자를 순서대로 쏘세요!</div>
          <Btn label="🔊 다시 듣기" color="#0e7490" shade="#083344" text="#ffffff" onClick={say} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 1000 }}>
          {B.tiles.map((t: Tile) => (
            <button key={t.id} onClick={() => tap(t)} style={{ width: tileS, height: tileS, borderRadius: 18, background: B.shake === t.id ? "#7f1d1d" : "#111111", border: B.shake === t.id ? "5px solid #ff3b3b" : "4px solid #ffffff", color: "#FFE600", WebkitTextFillColor: "#FFE600", WebkitAppearance: "none", fontSize: tileS * 0.62, fontWeight: 900, fontFamily: "inherit", touchAction: "manipulation", visibility: t.used ? "hidden" : "visible", transform: B.shake === t.id ? "translateX(8px)" : "none", boxShadow: "0 5px 0 rgba(0,0,0,0.5)", padding: 0 }}>{t.ch}</button>
          ))}
        </div>
        <div style={{ fontSize: 56, lineHeight: 1, borderRadius: 40, boxShadow: B.ring === "down" ? "0 0 0 8px #ff3b3b" : B.ring === "up" ? "0 0 0 8px #7dff9a" : "none" }}>{skin.e}</div>
      </div>
      <button onClick={() => { SFX.tap(); B.paused = true; re(); }} style={{ position: "absolute", top: 12, right: 12, width: 60, height: 60, borderRadius: 18, border: "3px solid #fff", background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 28, fontWeight: 800, touchAction: "manipulation" }}>⏸</button>
      {B.flash && <div style={{ position: "absolute", inset: 0, background: "rgba(255,30,60,0.3)", pointerEvents: "none" }} />}
      {B.intro && <div style={{ ...overlay, background: "rgba(0,0,0,0.55)" }}><div style={{ fontSize: 120 }}>👾</div><div style={{ fontSize: 56, fontWeight: 900, color: "#FFE600", textShadow: "0 4px 0 #000" }}>보스 등장!</div><div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>소리만 듣고 철자를 처음부터 끝까지 쏴요</div></div>}
      {B.teach && (
        <div style={{ ...overlay, background: "rgba(0,0,0,0.7)" }}>
          <div style={{ background: "#ffffff", borderRadius: 30, border: "6px solid #ffd93b", padding: "18px 34px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#000000" }}>두 번 틀렸어요. 다시 배워요!</div>
            <div style={{ fontSize: 80 }}>{B.teach.emo}</div>
            <div style={{ ...EN, fontSize: 56 }}>{B.teach.en}</div>
            <div style={{ background: "#ffd93b", color: "#000000", WebkitTextFillColor: "#000000", fontSize: 32, fontWeight: 900, borderRadius: 12, padding: "2px 16px" }}>{B.teach.ko}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#000000" }}>이 단어는 보스전 끝에 다시 나와요</div>
          </div>
        </div>
      )}
      {B.ended && <div style={{ ...overlay, background: "rgba(0,0,0,0.6)" }}><div style={{ fontSize: 64, fontWeight: 900, color: B.win ? "#FFE600" : "#ff8a8a", textShadow: "0 4px 0 #000" }}>{B.win ? "보스 퇴치! 👑" : "게임 오버 💥"}</div>{B.win && <div style={{ fontSize: 30, fontWeight: 800, color: "#ffffff" }}>⭐ +10 보너스!</div>}</div>}
      {B.paused && (
        <div style={{ ...overlay, background: "rgba(0,0,0,0.8)" }}>
          <div style={{ color: "#fff", fontSize: 40, fontWeight: 800 }}>⏸ 잠깐 멈춤</div>
          <Btn label="▶ 계속하기" big onClick={() => { B.paused = false; re(); }} />
          <Btn label="🏠 그만하고 메뉴로" color="#c9d6ff" shade="#7d8fc9" onClick={() => { B.paused = false; pRef.current.onQuit(); }} />
        </div>
      )}
    </div>
  );
}

/* ---------- UI bits ---------- */
function Btn(p: { label: string; onClick: () => void; color?: string; shade?: string; text?: string; big?: boolean; disabled?: boolean; wide?: boolean }) {
  return (
    <button
      onClick={() => { if (!p.disabled) p.onClick(); }}
      style={{
        minHeight: p.big ? 74 : 58, padding: p.big ? "14px 30px" : "10px 20px", fontSize: p.big ? 28 : 21, fontWeight: 800,
        borderRadius: 22, border: "3px solid rgba(255,255,255,0.9)", background: p.color || "#ffd93b", color: p.text || "#3b1f00",
        boxShadow: `0 6px 0 ${p.shade || "#c48a00"}`, cursor: "pointer", opacity: p.disabled ? 0.4 : 1,
        width: p.wide ? "100%" : undefined, fontFamily: "inherit", touchAction: "manipulation",
        WebkitAppearance: "none", WebkitTextFillColor: p.text || "#3b1f00",
      }}
    >{p.label}</button>
  );
}

function makeChoices(w: Word, round: Word[]): Word[] {
  const others = shuffle(round.filter((x: Word) => x.en !== w.en && x.ko !== w.ko));
  const fill = shuffle(ALL.filter((x: Word) => x.en !== w.en && x.ko !== w.ko && !others.includes(x)));
  return shuffle([w, ...[...others, ...fill].slice(0, 2)]);
}

const EN = { display: "inline-block", background: "#111111", color: "#FFE600", WebkitTextFillColor: "#FFE600", fontWeight: 900, borderRadius: 14, padding: "2px 14px", textShadow: "0 2px 0 #000" };

type Screen = "home" | "list" | "study" | "check" | "ready" | "shoot" | "result" | "skins";
type Kind = "round" | "missed" | "review" | "boss";
type Cur = { u: number; r: number; words: Word[]; review: Word[]; kind: Kind };
type Chk = { list: Word[]; i: number; choices: Word[]; bad: string[]; good: string };

export default function App() {
  const theme = useGrokTheme();
  const init = useRef<{ s: Save; ok: boolean } | null>(null);
  if (!init.current) init.current = loadSave();
  const saveRef = useRef<Save>(init.current.s);
  const [S, setS] = useState<Save>(init.current.s);
  const [persistOk, setPersistOk] = useState<boolean>(init.current.ok);
  const [screen, setScreen] = useState<Screen>("home");
  const [cur, setCur] = useState<Cur | null>(null);
  const [listU, setListU] = useState<number>(0);
  const [idx, setIdx] = useState<number>(0);
  const [chk, setChk] = useState<Chk>({ list: [], i: 0, choices: [], bad: [], good: "" });
  const [res, setRes] = useState<(Res & { newSkin: number; prevBest: number; phase: number; rstars: number }) | null>(null);
  const [phase, setPhase] = useState<number>(1);
  const h1Ref = useRef<number>(3);
  const warnRef = useRef<number>(0);
  const [runKey, setRunKey] = useState<number>(0);
  const [retryFirst, setRetryFirst] = useState<string[]>([]);
  const [vh, setVh] = useState<number>(() => Math.max(560, window.innerHeight || 700));

  useEffect(() => {
    const f = (): void => setVh(Math.max(560, window.innerHeight || 700));
    window.addEventListener("resize", f);
    try { if (window.speechSynthesis) { pickVoice(); window.speechSynthesis.onvoiceschanged = () => pickVoice(); } } catch { /* none */ }
    const un = (): void => unlockAudio();
    window.addEventListener("touchend", un, true);
    window.addEventListener("click", un, true);
    if (init.current && init.current.ok) persist(saveRef.current);
    return () => { window.removeEventListener("resize", f); window.removeEventListener("touchend", un, true); window.removeEventListener("click", un, true); };
  }, []);

  const upd = (fn: (n: Save) => void): void => {
    const p = saveRef.current;
    const n: Save = { ...p, words: { ...p.words }, ustar: { ...p.ustar } };
    fn(n);
    saveRef.current = n;
    setPersistOk(persist(n));
    setS(n);
  };
  const onWord = (w: Word, ok: boolean): void => {
    upd((n: Save) => {
      const r = n.words[w.en] || { c: 0, m: 0, t: 0 };
      const now = Date.now(); const today = dayStart(now);
      let sl = r.s || 0; let nx = r.n;
      if (ok) { if (nx === undefined || nx <= now || sl === 0) { sl = Math.min(4, sl + 1); nx = today + INT[sl - 1] * DAY; } }
      else { sl = 0; nx = today + DAY; }
      n.words[w.en] = ok ? { c: r.c + 1, m: Math.max(0, r.m - 1), t: now, s: sl, n: nx } : { c: r.c, m: r.m + 1, t: now, s: sl, n: nx };
      if (ok) n.stars += 1;
    });
  };
  const onStar = (k: number): void => { upd((n: Save) => { n.stars += k; }); };
  const nowMs = Date.now();
  const dueList = Object.entries(S.words).filter(([en, r]: [string, Rec]) => !!MAP[en] && r.n !== undefined && r.n <= nowMs)
    .sort((a: [string, Rec], b: [string, Rec]) => b[1].m - a[1].m || (a[1].n || 0) - (b[1].n || 0));
  const startReview = (): void => {
    const words = dueList.slice(0, 8).map((e: [string, Rec]) => MAP[e[0]]);
    if (!words.length) return;
    setCur({ u: -2, r: 0, words, review: [], kind: "review" }); setRetryFirst([]);
    startShoot(1);
  };
  const unitCleared = (sv: Save, ui: number): boolean => UNITS[ui].rounds.every((_: Word[], ri: number) => (sv.ustar[ui + "-" + ri] || 0) > 0);
  const startBoss = (ui: number): void => {
    const ws = UNITS[ui].words;
    const rec = (w: Word): number => (saveRef.current.words[w.en] || { m: 0 }).m;
    const missed = shuffle(ws.filter((w: Word) => rec(w) > 0)).sort((a: Word, b: Word) => rec(b) - rec(a));
    const rest = shuffle(ws.filter((w: Word) => rec(w) === 0));
    const words = [...missed, ...rest].slice(0, 6);
    setCur({ u: ui, r: 0, words, review: [], kind: "boss" }); setRetryFirst([]);
    startShoot(3);
  };
  const pickReview = (ex: Set<string>): Word[] => {
    const ents = Object.entries(saveRef.current.words).filter(([en]: [string, Rec]) => !ex.has(en) && !!MAP[en]);
    const missed = ents.filter(([, r]: [string, Rec]) => r.m > 0).sort((a: [string, Rec], b: [string, Rec]) => b[1].m - a[1].m || a[1].t - b[1].t).slice(0, 4);
    const used = new Set(missed.map((e: [string, Rec]) => e[0]));
    const old = ents.filter(([en, r]: [string, Rec]) => !used.has(en) && r.c > 0).sort((a: [string, Rec], b: [string, Rec]) => a[1].t - b[1].t).slice(0, 6 - missed.length);
    return [...missed, ...old].map((e: [string, Rec]) => MAP[e[0]]);
  };
  const beginStudy = (c: Cur): void => {
    ac(); setCur(c); setIdx(0); setRetryFirst([]); setScreen("study"); sayWord(c.words[0]);
  };
  const startRound = (u: number, r: number): void => {
    const words = UNITS[u].rounds[r];
    beginStudy({ u, r, words, review: pickReview(new Set(words.map((w: Word) => w.en))), kind: "round" });
  };
  const missedList = Object.entries(S.words).filter(([en, r]: [string, Rec]) => r.m > 0 && !!MAP[en]).sort((a: [string, Rec], b: [string, Rec]) => b[1].m - a[1].m);
  const startMissed = (): void => {
    const words = missedList.slice(0, 8).map((e: [string, Rec]) => MAP[e[0]]);
    if (!words.length) return;
    const ex = new Set(words.map((w: Word) => w.en));
    const review = pickReview(ex).filter((w: Word) => (saveRef.current.words[w.en] || { m: 0 }).m === 0).slice(0, 4);
    beginStudy({ u: -1, r: 0, words, review, kind: "missed" });
  };
  const goCheck = (): void => {
    if (!cur) return;
    const list = shuffle(cur.words).slice(0, Math.min(4, cur.words.length));
    setChk({ list, i: 0, choices: makeChoices(list[0], cur.words), bad: [], good: "" });
    setScreen("check");
  };
  const answer = (w: Word): void => {
    if (!cur || chk.good) return;
    const q = chk.list[chk.i];
    if (w.en === q.en) {
      SFX.ding(); sayWord(q);
      const c0 = chk; const words = cur.words;
      setChk({ ...c0, good: w.en });
      window.setTimeout(() => {
        if (c0.i + 1 < c0.list.length) setChk({ list: c0.list, i: c0.i + 1, choices: makeChoices(c0.list[c0.i + 1], words), bad: [], good: "" });
        else setScreen("ready");
      }, 1000);
    } else {
      SFX.buzz();
      if (!chk.bad.length) onWord(q, false);
      setChk({ ...chk, bad: [...chk.bad, w.en] });
    }
  };
  const startShoot = (ph: number): void => {
    unlockAudio(); SFX.level(); setPhase(ph); setRunKey((k: number) => k + 1); setScreen("shoot");
  };
  const onEnd = (r: Res): void => {
    const prevStars = saveRef.current.stars - r.gained;
    const prevBest = saveRef.current.best;
    upd((n: Save) => {
      n.best = Math.max(n.best, r.score); n.games += 1;
      const today = dayStr(new Date());
      const y = new Date(); y.setDate(y.getDate() - 1);
      if (n.last !== today) { n.streak = n.last === dayStr(y) ? n.streak + 1 : 1; n.last = today; }
      if (r.win && cur && cur.kind === "round" && phase === 2) { const k = cur.u + "-" + cur.r; n.ustar[k] = Math.max(n.ustar[k] || 0, Math.min(h1Ref.current, r.hearts)); }
      if (r.win && cur && cur.kind === "boss") n.boss[String(cur.u)] = 1;
    });
    if (r.win && phase === 1) h1Ref.current = r.hearts;
    warnRef.current = r.warn;
    let ns = -1;
    SKINS.forEach((s: { need: number }, i: number) => { if (s.need > prevStars && s.need <= saveRef.current.stars) ns = i; });
    setRetryFirst(r.win ? [] : r.missed);
    setRes({ ...r, newSkin: ns, prevBest, phase, rstars: phase === 2 ? Math.min(h1Ref.current, r.hearts) : 0 });
    setScreen("result");
  };

  const todayS = dayStr(new Date());
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  const streak = S.last === todayS || S.last === dayStr(yd) ? S.streak : 0;
  const learned = Object.values(S.words).filter((r: Rec) => r.c > 0).length;
  const font = `"Apple SD Gothic Neo","Noto Sans KR",${theme.font.family},sans-serif`;

  const root = {
    position: "relative" as const, height: vh, width: "100%", overflow: "hidden", fontFamily: font, color: "#fff",
    background: "linear-gradient(160deg,#0a1433 0%,#12296b 55%,#0d3b78 100%)", borderRadius: 16,
    userSelect: "none" as const, WebkitUserSelect: "none" as const, WebkitTapHighlightColor: "transparent",
  };
  const scroll = { position: "absolute" as const, inset: 0, overflowY: "auto" as const, padding: "18px 16px 40px", WebkitOverflowScrolling: "touch" as const };
  const panel = { background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.25)", borderRadius: 24, padding: 16 };
  const chip = (bg: string) => ({ background: bg, color: "#000000", borderRadius: 999, padding: "8px 16px", fontWeight: 800, fontSize: 19 });
  const center = { position: "absolute" as const, inset: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 18, padding: 16, textAlign: "center" as const, overflowY: "auto" as const };
  const unitColors = ["#3ec1ff", "#ffd93b", "#4ade80", "#ff8fab", "#ffb347", "#5eead4"];
  const skin = SKINS[S.skin] || SKINS[0];

  const header = (title: string, back: () => void) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
      <Btn label="◀ 뒤로" color="#c9d6ff" shade="#7d8fc9" onClick={() => { SFX.tap(); back(); }} />
      <div style={{ fontSize: 28, fontWeight: 800 }}>{title}</div>
    </div>
  );

  let body: JSX.Element | null = null;

  if (screen === "home") {
    body = (
      <div style={scroll}>
        <div style={{ textAlign: "center", fontSize: 40, fontWeight: 900, letterSpacing: 1, textShadow: "0 4px 0 #ff5a5f, 0 8px 0 #1a0b4f" }}>🚀 우주 단어 슈팅 👾</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", margin: "16px 0" }}>
          <div style={chip("#ffd93b")}>⭐ 별 {S.stars}</div>
          <div style={chip("#5ee7ff")}>🏆 최고 {S.best}점</div>
          <div style={chip("#ff9f43")}>🔥 연속 {streak}일</div>
          <div style={chip("#4ade80")}>📚 맞힌 단어 {learned}/{ALL.length}</div>
        </div>
        <div style={{ ...panel, marginBottom: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🎁 부모님과 약속한 선물까지 ⭐ {S.stars % 100} / 100{S.stars >= 100 ? `  (벌써 ${Math.floor(S.stars / 100)}번 달성!)` : ""}</div>
          <div style={{ height: 26, borderRadius: 13, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${S.stars % 100}%`, background: "linear-gradient(90deg,#ffd93b,#ff9f43,#ff5a5f)", borderRadius: 13 }} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          {dueList.length > 0 && <Btn label={`📅 오늘의 복습 (${dueList.length}개)`} color="#4ade80" shade="#15803d" text="#000000" onClick={() => { SFX.tap(); startReview(); }} />}
          <Btn label={`${skin.e} 우주선 고르기`} color="#5eead4" shade="#0f766e" text="#000000" onClick={() => { SFX.tap(); setScreen("skins"); }} />
          {missedList.length > 0 && <Btn label={`❗ 틀린 단어 연습 (${missedList.length}개)`} color="#ff8a8a" shade="#c0392b" onClick={() => { SFX.tap(); startMissed(); }} />}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, margin: "4px 0 10px" }}>🪐 단원 고르기</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
          {UNITS.map((u: Unit, ui: number) => {
            const st = u.rounds.map((_: Word[], ri: number) => S.ustar[ui + "-" + ri] || 0);
            const cleared = st.filter((x: number) => x > 0).length;
            const nextR = st.findIndex((x: number) => x === 0);
            const col = ui < 12 ? unitColors[ui % 2] : unitColors[2 + ((ui - 12) % 4)];
            return (
              <div key={u.name} style={{ background: col, color: "#000000", borderRadius: 24, padding: 14, border: "3px solid #fff", boxShadow: "0 6px 0 rgba(0,0,0,0.25)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>{u.name}{S.boss[String(ui)] ? " 👑" : ""}</div>
                  <div style={{ fontSize: 26 }}>{u.words.slice(0, 3).map((w: Word) => w.emo).join("")}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#000000" }}>{u.theme} · 단어 {u.words.length}개 · ⭐ {st.reduce((a: number, b: number) => a + b, 0)}/{u.rounds.length * 3}</div>
                <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.55)", margin: "8px 0 10px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(cleared / u.rounds.length) * 100}%`, background: "#1d1a4d" }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {u.rounds.map((rw: Word[], ri: number) => (
                    <button key={ri} onClick={() => { SFX.tap(); startRound(ui, ri); }} style={{ minHeight: 56, minWidth: 74, padding: "6px 10px", borderRadius: 16, border: ri === nextR ? "4px solid #ff5a5f" : "3px solid #fff", background: st[ri] ? "#fff7c2" : "#ffffff", color: "#000000", WebkitTextFillColor: "#000000", WebkitAppearance: "none", fontWeight: 900, fontSize: 19, fontFamily: "inherit", touchAction: "manipulation" }}>
                      {ri + 1}판 ({rw.length})<br />{st[ri] ? "⭐".repeat(st[ri]) : (ri === nextR ? "▶ 시작" : "☆")}
                    </button>
                  ))}
                  {cleared === u.rounds.length && <button onClick={() => { SFX.tap(); startBoss(ui); }} style={{ minHeight: 56, padding: "6px 12px", borderRadius: 16, border: "3px solid #FFE600", background: "#111111", color: "#FFE600", WebkitTextFillColor: "#FFE600", WebkitAppearance: "none", fontWeight: 900, fontSize: 19, fontFamily: "inherit", touchAction: "manipulation" }}>{S.boss[String(ui)] ? "👑 보스 다시" : "👾 보스전"}</button>}
                  <button onClick={() => { SFX.tap(); setListU(ui); setScreen("list"); }} style={{ minHeight: 56, padding: "6px 12px", borderRadius: 16, border: "3px solid #fff", background: "#1d1a4d", color: "#ffffff", WebkitTextFillColor: "#ffffff", WebkitAppearance: "none", fontWeight: 900, fontSize: 19, fontFamily: "inherit", touchAction: "manipulation" }}>📖 단어 보기</button>
                </div>
                {cleared < u.rounds.length && <div style={{ marginTop: 8, fontSize: 16, fontWeight: 800, color: "#000000" }}>👾 모든 판을 깨면 보스전이 열려요</div>}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 20, fontSize: 17, fontWeight: 700, color: "#ffffff", textAlign: "center" }}>
          {persistOk ? "💾 기록이 이 기기 브라우저에 저장돼요." : "⚠️ 이 화면에서는 기록 저장이 막혀 있어요. 창을 닫으면 별과 기록이 처음으로 돌아가요."}
          {AU.ok === 1 ? " 🔊 원어민 발음(MP3)으로 들려줘요." : AU.ok === -1 ? " 🔊 원어민 MP3를 못 불러와서 기기 음성으로 읽어 줘요." : ""}
        </div>
      </div>
    );
  } else if (screen === "list") {
    const u = UNITS[listU];
    body = (
      <div style={scroll}>
        {header(`📖 ${u.name} 단어 (${u.theme})`, () => setScreen("home"))}
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: "#ffffff" }}>카드를 누르면 발음을 들려줘요. ✅ 맞힌 단어 · ❗ 틀린 적 있는 단어</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
          {u.words.map((w: Word) => {
            const r = S.words[w.en];
            return (
              <button key={w.en} onClick={() => { unlockAudio(); sayWord(w); }} style={{ minHeight: 170, borderRadius: 20, border: r && r.m > 0 ? "5px solid #ff5a5f" : r && r.c > 0 ? "5px solid #22c55e" : "5px solid #ffd93b", background: "#ffffff", color: "#000000", WebkitTextFillColor: "#000000", WebkitAppearance: "none", opacity: 1, fontFamily: "inherit", padding: 10, touchAction: "manipulation" }}>
                <div style={{ fontSize: 48 }}>{w.emo}</div>
                <div style={{ ...EN, fontSize: 32, lineHeight: 1.2, maxWidth: "100%", overflowWrap: "anywhere" }}>{w.en}</div>
                <div style={{ display: "inline-block", marginTop: 6, padding: "3px 12px", borderRadius: 10, background: "#ffd93b", fontSize: 22, fontWeight: 900, color: "#000000", WebkitTextFillColor: "#000000" }}>{w.ko}</div>
                <div style={{ fontSize: 18, marginTop: 4 }}>{r && r.m > 0 ? "❗" : ""}{r && r.c > 0 ? "✅" : ""}🔊</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  } else if (screen === "study" && cur) {
    const w = cur.words[idx];
    body = (
      <div style={center}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>📘 단어 공부 {idx + 1} / {cur.words.length} {cur.kind === "round" ? `· ${UNITS[cur.u].name} ${cur.r + 1}판` : "· 단어 다시 보기"}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {cur.words.map((x: Word, i: number) => <div key={x.en} style={{ width: 18, height: 18, borderRadius: 9, background: i <= idx ? "#ffd93b" : "rgba(255,255,255,0.3)" }} />)}
        </div>
        <div style={{ background: "#ffffff", color: "#000000", borderRadius: 32, padding: "22px 30px", minWidth: 280, maxWidth: 520, width: "90%", border: "5px solid #ffd93b", boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 110, lineHeight: 1.1 }}>{w.emo}</div>
          <div style={{ ...EN, fontSize: 64, letterSpacing: 1, padding: "4px 24px", margin: "6px 0" }}>{w.en}</div>
          <div><span style={{ display: "inline-block", background: "#ffd93b", color: "#000000", WebkitTextFillColor: "#000000", fontSize: 36, fontWeight: 900, borderRadius: 12, padding: "2px 16px" }}>{w.ko}</span></div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>소리를 듣고 소리 내어 따라 말해 봐요!</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {idx > 0 && <Btn label="◀ 이전" color="#c9d6ff" shade="#7d8fc9" onClick={() => { const i = idx - 1; setIdx(i); sayWord(cur.words[i]); }} />}
          <Btn label="🔊 다시 듣기" color="#5ee7ff" shade="#0e7490" onClick={() => { unlockAudio(); sayWord(w); }} />
          <Btn label={idx + 1 < cur.words.length ? "다음 ▶" : "확인 문제 ▶"} big onClick={() => {
            SFX.tap();
            if (idx + 1 < cur.words.length) { const i = idx + 1; setIdx(i); sayWord(cur.words[i]); } else goCheck();
          }} />
        </div>
        <div><Btn label="🏠 메뉴" color="rgba(255,255,255,0.25)" shade="rgba(0,0,0,0.3)" text="#fff" onClick={() => setScreen("home")} /></div>
      </div>
    );
  } else if (screen === "check" && cur && chk.list.length) {
    const q = chk.list[chk.i];
    body = (
      <div style={center}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>✏️ 확인 문제 {chk.i + 1} / {chk.list.length}</div>
        <div style={{ fontSize: 22 }}>이 뜻의 영어 단어는?</div>
        <div style={{ background: "#ffd93b", color: "#3b1f00", borderRadius: 28, padding: "18px 36px", border: "4px solid #fff" }}>
          <div style={{ fontSize: 70 }}>{q.emo}</div>
          <div style={{ fontSize: 44, fontWeight: 900 }}>{q.ko}</div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 720 }}>
          {chk.choices.map((c: Word) => {
            const bad = chk.bad.includes(c.en); const good = chk.good === c.en;
            return (
              <button key={c.en} onClick={() => { if (!bad) answer(c); }} style={{ flex: "1 1 180px", minHeight: 86, borderRadius: 24, border: "4px solid #fff", fontSize: 34, fontWeight: 900, fontFamily: "inherit", touchAction: "manipulation", background: good ? "#15803d" : bad ? "#555555" : "#111111", color: bad ? "#eeeeee" : "#FFE600", WebkitTextFillColor: bad ? "#eeeeee" : "#FFE600", WebkitAppearance: "none", textShadow: "0 2px 0 #000", boxShadow: "0 6px 0 rgba(0,0,0,0.3)", textDecoration: bad ? "line-through" : "none" }}>
                {good ? "⭕ " : bad ? "❌ " : ""}{c.en}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 18, minHeight: 26 }}>{chk.good ? "딩동댕! 잘했어요 🎉" : chk.bad.length ? "앗, 다시 골라 봐요!" : ""}</div>
      </div>
    );
  } else if (screen === "ready" && cur) {
    body = (
      <div style={center}>
        <div style={{ fontSize: 36, fontWeight: 900 }}>공부 끝! 이제 미션이에요 🚀</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 760 }}>
          {cur.words.map((w: Word) => <div key={w.en} style={{ ...chip("#111111"), color: "#FFE600", WebkitTextFillColor: "#FFE600", fontWeight: 900, fontSize: 22, border: "2px solid #FFE600" }}>{w.emo} {w.en}</div>)}
        </div>
        {cur.review.length > 0 && <div style={{ fontSize: 19 }}>+ 지난번 단어 {cur.review.length}개도 섞여서 나와요 (틀렸던 단어 먼저!)</div>}
        <div style={{ ...panel, fontSize: 18, lineHeight: 1.6, maxWidth: 620 }}>
          <b>미션 ① 소리 슈팅</b>: 🔊 소리를 듣고 맞는 영어 단어 운석을 터치!<br />
          <b>미션 ② 스펠링 조준</b>: 빈칸에 들어갈 글자 운석을 터치!<br />
          틀린 운석을 쏘거나 정답 운석이 바닥에 닿으면 ❤️ 하나가 깨져요.
        </div>
        <Btn label="🚀 미션 ① 시작!" big color="#ff5a5f" shade="#a61e22" text="#fff" onClick={() => startShoot(1)} />
        <Btn label="📘 단어 한 번 더 보기" color="#5ee7ff" shade="#0e7490" onClick={() => beginStudy(cur)} />
      </div>
    );
  } else if (screen === "shoot" && cur) {
    body = phase === 3
      ? <Boss key={runKey} warn0={warnRef.current} words={cur.words} skin={S.skin} h={vh} onWord={onWord} onStar={onStar} onEnd={onEnd} onQuit={() => setScreen("home")} />
      : <Shooter key={runKey} warn0={warnRef.current} mode={phase === 2 ? "spell" : "sound"} study={cur.words} review={cur.review} first={retryFirst} skin={S.skin} onWord={onWord} onEnd={onEnd} onQuit={() => setScreen("home")} />;
  } else if (screen === "result" && res && cur) {
    const missedW = res.missed.map((en: string) => MAP[en]).filter((w: Word | undefined) => !!w);
    body = (
      <div style={center}>
        <div style={{ fontSize: 46, fontWeight: 900 }}>{!res.win ? "💥 게임 오버" : res.phase === 1 ? "🎉 미션 ① 성공!" : res.phase === 3 ? "👑 보스 퇴치! 👑" : "🎉 미션 성공! 🎉"}</div>
        {res.win && res.phase === 2 && <div style={{ fontSize: 56 }}>{"⭐".repeat(res.rstars)}{"☆".repeat(3 - res.rstars)}</div>}
        {res.win && res.phase === 1 && <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>다음은 미션 ② 스펠링 조준! 빈칸에 들어갈 글자를 쏴요.</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          <div style={chip("#ffd93b")}>점수 {res.score}</div>
          <div style={chip("#4ade80")}>+⭐ {res.gained}</div>
          {res.score > res.prevBest && <div style={chip("#ff9f43")}>🏆 최고 기록!</div>}
          <div style={chip("#5ee7ff")}>🔥 연속 {S.streak}일</div>
        </div>
        {res.newSkin >= 0 && (
          <div style={{ ...panel, background: "rgba(255,217,59,0.25)", fontSize: 24, fontWeight: 800 }}>
            🎁 새 우주선 해금! {SKINS[res.newSkin].e} {SKINS[res.newSkin].n} · ⚡ 레이저 {SKINS[res.newSkin].pw} (방패를 더 빨리 부숴요!)
          </div>
        )}
        {missedW.length > 0 && (
          <div style={{ ...panel, maxWidth: 720 }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>다시 볼 단어 (누르면 발음)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {missedW.map((w: Word) => (
                <button key={w.en} onClick={() => sayWord(w)} style={{ ...chip("#111111"), color: "#FFE600", WebkitTextFillColor: "#FFE600", WebkitAppearance: "none", fontWeight: 900, fontSize: 21, border: "2px solid #FFE600", fontFamily: "inherit", minHeight: 50, touchAction: "manipulation" }}>{w.emo} {w.en} = {w.ko} 🔊</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {!res.win && missedW.length > 0 && <div style={{ width: "100%", fontSize: 20, fontWeight: 800, color: "#ffffff" }}>다시하기를 누르면 틀린 단어부터 다시 내려와요!</div>}
          {!res.win && <Btn label="🔁 다시하기" big color="#ff5a5f" shade="#a61e22" text="#fff" onClick={() => startShoot(res.phase)} />}
          {res.win && res.phase === 1 && <Btn label="✏️ 미션 ② 스펠링 조준 ▶" big onClick={() => { setRetryFirst([]); startShoot(2); }} />}
          {res.win && res.phase === 2 && cur.kind === "round" && unitCleared(S, cur.u) && !S.boss[String(cur.u)] && <Btn label="👾 보스전 도전! ▶" big color="#111111" shade="#000000" text="#FFE600" onClick={() => startBoss(cur.u)} />}
          {res.win && res.phase === 2 && cur.kind === "round" && cur.r + 1 < UNITS[cur.u].rounds.length && <Btn label="다음 판 ▶" big onClick={() => startRound(cur.u, cur.r + 1)} />}
          {res.win && res.phase === 2 && <Btn label="🔁 한 번 더 (미션 ①부터)" color="#ff8fab" shade="#be185d" onClick={() => { setRetryFirst([]); startShoot(1); }} />}
          {res.win && res.phase === 3 && <Btn label="🔁 보스 다시" color="#ff8fab" shade="#be185d" onClick={() => startBoss(cur.u)} />}
          {res.phase !== 1 && <Btn label="📘 단어 다시 공부" color="#5ee7ff" shade="#0e7490" onClick={() => beginStudy({ ...cur, kind: cur.kind === "boss" || cur.kind === "review" ? "missed" : cur.kind })} />}
          <Btn label="🏠 메뉴" color="#c9d6ff" shade="#7d8fc9" onClick={() => setScreen("home")} />
        </div>
      </div>
    );
  } else if (screen === "skins") {
    body = (
      <div style={scroll}>
        {header("🛸 우주선 고르기", () => setScreen("home"))}
        <div style={{ fontSize: 19, marginBottom: 14 }}>별을 모으면 새 우주선이 열려요! ⚡ 레이저가 셀수록 🛡️ 방패 단어를 빨리 부숴요. 지금 별 ⭐ {S.stars}개</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
          {SKINS.map((k: { n: string; e: string; need: number; c: string }, i: number) => {
            const open = S.stars >= k.need; const on = S.skin === i;
            return (
              <button key={k.n} onClick={() => { if (open) { SFX.ding(); upd((n: Save) => { n.skin = i; }); } else SFX.buzz(); }} style={{ minHeight: 170, borderRadius: 24, border: on ? `5px solid ${k.c}` : "3px solid #fff", background: open ? "#ffffff" : "rgba(255,255,255,0.15)", color: open ? "#000000" : "#fff", fontFamily: "inherit", padding: 12, touchAction: "manipulation", boxShadow: on ? `0 0 24px ${k.c}` : "none" }}>
                <div style={{ fontSize: 64, filter: open ? "none" : "grayscale(1) brightness(0.6)" }}>{k.e}</div>
                <div style={{ fontSize: 21, fontWeight: 900 }}>{k.n}</div>
                <div style={{ display: "inline-block", margin: "4px 0", padding: "2px 12px", borderRadius: 10, background: "#111111", color: "#FFE600", WebkitTextFillColor: "#FFE600", fontSize: 20, fontWeight: 900 }}>⚡ 레이저 {SKINS[i].pw}</div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{on ? "✅ 사용 중" : open ? "눌러서 타기" : `🔒 ⭐ ${k.need}개 필요`}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  } else {
    body = (
      <div style={center}>
        <Btn label="🏠 메뉴로" big onClick={() => setScreen("home")} />
      </div>
    );
  }

  return <div style={root}>{body}</div>;
}

