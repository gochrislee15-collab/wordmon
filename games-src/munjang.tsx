import { useState, useEffect, useRef, useMemo } from "grok/canvas";
import type { CSSProperties } from "grok/canvas";

/* ---------- 12-week course (72 sentences) ---------- */
const SD = "1|I like apples.|나는 사과를 좋아해요.;1|I like dogs.|나는 강아지를 좋아해요.;1|I can swim.|나는 수영할 수 있어요.;1|I can run fast.|나는 빠르게 달릴 수 있어요.;1|The cat is small.|그 고양이는 작아요.;1|The dog is big.|그 강아지는 커요.;2|It is a red ball.|그것은 빨간 공이에요.;2|This is my blue bag.|이것은 나의 파란 가방이에요.;2|My yellow pencil is long.|내 노란 연필은 길어요.;2|This green book is new.|이 초록색 책은 새것이에요.;2|The white bird is pretty.|그 하얀 새는 예뻐요.;2|My mom and dad are happy.|우리 엄마와 아빠는 행복해요.;3|I have two eyes.|나는 눈이 두 개 있어요.;3|I have one nose and one mouth.|나는 코 하나와 입 하나가 있어요.;3|You have ten fingers.|너는 손가락이 열 개 있어.;3|She has long black hair.|그녀는 긴 검은 머리를 가졌어요.;3|He has a brother and a sister.|그는 형제와 자매가 한 명씩 있어요.;3|We have five friends.|우리는 친구가 다섯 명 있어요.;4|Do you like milk? Yes, I do.|우유 좋아하니? 응, 좋아해.;4|Do you like carrots? No, I don't.|당근 좋아하니? 아니, 안 좋아해.;4|I eat eggs and bread.|나는 달걀과 빵을 먹어요.;4|I drink cold water.|나는 차가운 물을 마셔요.;4|The chicken soup is hot.|그 닭고기 수프는 뜨거워요.;4|I am very hungry.|나는 너무 배고파요.;5|Can you jump high? Yes, I can.|높이 뛸 수 있니? 응, 할 수 있어.;5|Can you dance? No, I can't.|춤출 수 있니? 아니, 못 해.;5|I can sing a song well.|나는 노래를 잘 부를 수 있어요.;5|I can ride a bike, too.|나는 자전거도 탈 수 있어요.;5|Birds can fly in the sky.|새는 하늘에서 날 수 있어요.;5|We can play soccer together.|우리는 함께 축구를 할 수 있어요.;6|I want a toy robot.|나는 장난감 로봇을 갖고 싶어요.;6|I want an orange cap.|나는 주황색 모자를 갖고 싶어요.;6|How much is this shirt?|이 셔츠는 얼마예요?;6|These shoes are nice.|이 신발은 멋져요.;6|I want to buy a gift.|나는 선물을 사고 싶어요.;6|Thank you for the gift.|선물 고마워요.;7|Let's go to the park.|공원에 가자.;7|Let's walk to school.|학교에 걸어가자.;7|Please open the door.|문을 열어 주세요.;7|Stand up and sit down.|일어섰다가 앉아요.;7|Let's read books at the library.|도서관에서 책을 읽자.;7|Let's watch TV after dinner.|저녁 먹고 TV 보자.;8|What's this? It's a lion.|이건 뭐야? 사자야.;8|What's that? It's a funny monkey.|저건 뭐야? 웃긴 원숭이야.;8|Is it a rabbit? No, it isn't.|그거 토끼야? 아니, 아니야.;8|The brown bear is strong.|그 갈색 곰은 힘이 세요.;8|Horses and cows eat grass.|말과 소는 풀을 먹어요.;8|Who is she? She is my teacher.|그녀는 누구야? 우리 선생님이야.;9|Where is my cap? It's on the desk.|내 모자 어디 있어? 책상 위에 있어.;9|The ball is under the table.|공은 탁자 아래에 있어요.;9|The cookies are in the kitchen.|쿠키는 부엌에 있어요.;9|Where are you going now? I'm going home.|지금 어디 가니? 집에 가는 중이야.;9|The store is next to the bank.|가게는 은행 옆에 있어요.;9|Go straight and turn left.|곧장 가서 왼쪽으로 돌아요.;10|How many birds? Six birds.|새가 몇 마리야? 여섯 마리.;10|I have eight crayons and four erasers.|나는 크레용 여덟 개와 지우개 네 개가 있어요.;10|What time is it? It's nine.|몇 시야? 아홉 시야.;10|I get up at seven every morning.|나는 매일 아침 일곱 시에 일어나요.;10|I sleep early at night.|나는 밤에 일찍 자요.;10|What day is it today? It's Monday.|오늘 무슨 요일이야? 월요일이야.;11|I'm drawing a beautiful picture.|나는 예쁜 그림을 그리고 있어요.;11|She is washing her face.|그녀는 얼굴을 씻고 있어요.;11|They are making a snowman.|그들은 눈사람을 만들고 있어요.;11|Don't be late for class.|수업에 늦지 마.;11|It's rainy. Take your umbrella.|비가 와. 우산 가져가.;11|Brush your teeth before bed.|자기 전에 이를 닦아요.;12|I was sick yesterday.|나는 어제 아팠어요.;12|I went to the zoo with my friend.|나는 친구와 동물원에 갔어요.;12|I saw a tall giraffe.|나는 키 큰 기린을 봤어요.;12|We ate ice cream.|우리는 아이스크림을 먹었어요.;12|We had a great day.|우리는 멋진 하루를 보냈어요.;12|I cleaned my room last night.|나는 어젯밤에 내 방을 청소했어요.";
const THEMES = ["좋아하는 것·할 수 있는 것", "색깔과 물건", "몸과 가족", "음식", "할 수 있어요", "갖고 싶어요", "~하자", "동물", "어디에 있어요", "숫자와 시간", "~하고 있어요", "지난 일"];
type Sn = { wk: number; en: string; ko: string; w: string[] };
const SS: Sn[] = SD.split(";").map((x: string) => { const p = x.split("|"); return { wk: Number(p[0]), en: p[1], ko: p[2], w: p[1].split(" ").map((t: string) => t.replace(/[.,?!]/g, "")) }; });
type Day = { g: number; wk: number; d: number; si: number };
const DAYS: Day[] = [];
for (let w = 1; w <= 12; w++) for (let d = 1; d <= 7; d++) DAYS.push({ g: (w - 1) * 7 + d, wk: w, d, si: d < 7 ? (w - 1) * 6 + d - 1 : -1 });
const KEEP = /^(I|I'm|TV|Monday)$/;
const show = (t: string): string => (KEEP.test(t) ? t : t.toLowerCase());

function rng(seed: number): () => number { let a = seed | 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuf<T>(a: T[], R: () => number = Math.random): T[] { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const x = b[i]; b[i] = b[j]; b[j] = x; } return b; }
function hash(s: string): number { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function decoys(si: number, n: number): string[] {
  const s = SS[si]; const have = new Set(s.w.map(show)); const pool: string[] = [];
  SS.forEach((o: Sn) => { if (Math.abs(o.wk - s.wk) > 1) return; o.w.forEach((x: string) => { const l = show(x); if (!have.has(l) && pool.indexOf(l) < 0) pool.push(l); }); });
  return shuf(pool).slice(0, n);
}
function others(si: number, k: number): number[] { const wk = SS.map((_: Sn, i: number) => i).filter((i: number) => i !== si && SS[i].wk === SS[si].wk); return shuf(wk).slice(0, k); }

/* ---------- day steps ---------- */
type Step = { k: "b"; si: number; rd: number; lab: string } | { k: "rep"; si: number } | { k: "pick"; a: number; b: number } | { k: "quiz"; a: number; b: number } | { k: "boss"; si: number };
function stepsFor(g: number): Step[] {
  const D = DAYS[g - 1]; const st: Step[] = [];
  if (D.d < 7) {
    const si = D.si; const s2 = si > 0 ? si - 1 : si;
    st.push({ k: "b", si, rd: 1, lab: "오늘 문장" }, { k: "rep", si }, { k: "b", si, rd: 2, lab: "오늘 문장" }, { k: "pick", a: si, b: s2 }, { k: "b", si, rd: 3, lab: "오늘 문장" });
    if (s2 !== si) for (const rd of [1, 2, 3]) st.push({ k: "b", si: s2, rd, lab: "지난 문장" });
    st.push({ k: "quiz", a: si, b: s2 }, { k: "boss", si });
    return st;
  }
  const ws = shuf(SS.map((_: Sn, i: number) => i).filter((i: number) => SS[i].wk === D.wk), rng(g * 977));
  for (let k = 0; k < 3; k++) for (const rd of [2, 3]) st.push({ k: "b", si: ws[k], rd, lab: "복습 " + (k + 1) + "/3" });
  st.push({ k: "pick", a: ws[4], b: ws[5] }, { k: "quiz", a: ws[0], b: ws[1] }, { k: "boss", si: ws[3] });
  return st;
}
const stepName = (s: Step): string => s.k === "b" ? "🌉 " + s.lab + " · 다리 " + s.rd + "/3" + (s.rd === 3 ? " · 소리만" : "") : s.k === "rep" ? "🗣️ 따라 말하기" : s.k === "pick" ? "🎧 듣고 문장 고르기" : s.k === "quiz" ? "📖 문장 뜻 맞추기" : "🗿 대장전";

/* ---------- blocks / rewards ---------- */
const LESS: [string, string][] = [["참나무 판자", "#b8945f"], ["벽돌", "#a0523d"], ["유리", "#bfe9ff"], ["책장", "#8b5a2b"], ["모래", "#e8d9a0"], ["눈 블록", "#f4fbff"], ["얼음", "#8ec8ff"], ["호박", "#e8891c"], ["수박", "#5fa83a"], ["빨간 양털", "#d33333"], ["노란 양털", "#f2d33b"], ["파란 양털", "#3557d6"], ["사암", "#dccb8a"], ["이끼 돌", "#6f8f5a"], ["석영", "#eeeae2"], ["프리즈머린", "#5fb3a3"], ["점토", "#9fa4b0"], ["흑요석", "#2a1a3d"]];
const CHAMP: [string, string][] = [["다이아몬드 블록", "#5ee8e0"], ["금 블록", "#f6d040"], ["에메랄드 블록", "#3fd06b"], ["레드스톤 블록", "#c0261b"], ["청금석 블록", "#2457c5"], ["네더라이트 블록", "#4a3f3f"]];
const SPEC: [string, string][] = [["케이크", "#fff1e0"], ["표적", "#ee3333"], ["건초 더미", "#d9b13b"], ["비콘", "#99ffff"], ["TNT", "#dd3333"], ["발광석", "#ffd97a"]];
const ALLB: [string, string][] = LESS.concat(CHAMP, SPEC);
const itemFor = (D: Day): [string, string] => D.d < 7 ? LESS[((D.wk - 1) * 6 + D.d - 1) % LESS.length] : CHAMP[(D.wk - 1) % CHAMP.length];
const TEX: [string, string][] = [["#7d7d7d", "#969696"], ["#b8945f", "#9c7a48"], ["#36c2bb", "#2a9f99"], ["#e6bd3c", "#c9a12a"], ["#43b862", "#2f9e4f"], ["#c46a4a", "#a3533a"], ["#7b62c9", "#634dab"]];
function blkStyle(w: string, stone: boolean, solid?: string): CSSProperties {
  const t = solid ? [solid, solid] : stone ? ["#8a8a8a", "#727272"] : TEX[hash(w) % TEX.length];
  return { background: "repeating-conic-gradient(" + t[0] + " 0% 25%, " + t[1] + " 0% 50%)", backgroundSize: "14px 14px", border: "3px solid #1d1d1d", boxShadow: "inset 4px 4px 0 rgba(255,255,255,.35), inset -4px -4px 0 rgba(0,0,0,.35)", color: "#fff", textShadow: "2px 2px 0 #000, -1px -1px 0 #000", fontWeight: 900, fontFamily: "Arial, Helvetica, sans-serif" };
}

/* ---------- save ---------- */
type Prog = { g: number; i: number; m: number };
type Sv = { done: Record<string, number>; inv: Record<string, number>; sp: Record<string, number>; diff: string; all: boolean; prog: Prog | null };
const KEY = "munjangcraft.page.v1";
const DEF: Sv = { done: {}, inv: {}, sp: {}, diff: "easy", all: false, prog: null };
function loadSave(): { s: Sv; ok: boolean } {
  try { const ls = window.localStorage; const raw = ls.getItem(KEY); ls.setItem(KEY + ".probe", "1"); ls.removeItem(KEY + ".probe"); if (!raw) return { s: { ...DEF }, ok: true }; const p = JSON.parse(raw) as Partial<Sv>; return { s: { ...DEF, ...p, done: { ...(p.done || {}) }, inv: { ...(p.inv || {}) }, sp: { ...(p.sp || {}) } }, ok: true }; }
  catch { return { s: { ...DEF }, ok: false }; }
}
function persist(s: Sv): boolean { try { window.localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { return false; } }
const starsFor = (m: number, diff: string): number => diff === "normal" ? (m <= 2 ? 3 : m <= 6 ? 2 : 1) : (m <= 3 ? 3 : m <= 8 ? 2 : 1);

/* ---------- sound effects ---------- */
let AC: AudioContext | null = null;
function ac(): AudioContext | null {
  try { if (!AC) { const Wn = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }; const C = Wn.AudioContext || Wn.webkitAudioContext; if (!C) return null; AC = new C(); } if (AC.state === "suspended") void AC.resume(); return AC; } catch { return null; }
}
function tone(f: number, d: number, type: OscillatorType, g: number, f2?: number, delay?: number): void {
  const c = ac(); if (!c) return;
  try { const t = c.currentTime + 0.01 + (delay || 0); const o = c.createOscillator(); const v = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); v.gain.setValueAtTime(0, t); v.gain.linearRampToValueAtTime(g, t + 0.01); v.gain.exponentialRampToValueAtTime(0.0008, t + d); o.connect(v); v.connect(c.destination); o.start(t); o.stop(t + d + 0.05); } catch { /* ignore */ }
}
function noise(d: number, g: number, f: number): void {
  const c = ac(); if (!c) return;
  try { const b = c.createBuffer(1, Math.floor(c.sampleRate * d), c.sampleRate); const x = b.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / x.length); const s = c.createBufferSource(); s.buffer = b; const fl = c.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = f; const v = c.createGain(); v.gain.value = g; s.connect(fl); fl.connect(v); v.connect(c.destination); s.start(); } catch { /* ignore */ }
}
const SFX = {
  tap: (): void => tone(700, 0.06, "triangle", 0.1),
  place: (): void => { noise(0.12, 0.5, 900); tone(180, 0.1, "square", 0.08); },
  bad: (): void => { tone(160, 0.35, "sawtooth", 0.14, 90); },
  splash: (): void => { noise(0.6, 0.6, 1800); },
  ok: (): void => { tone(880, 0.12, "square", 0.08); tone(1320, 0.18, "square", 0.07, undefined, 0.1); },
  key: (): void => tone(1000, 0.05, "square", 0.06),
  win: (): void => { [523, 659, 784, 1047].forEach((f: number, i: number) => tone(f, 0.22, "square", 0.08, undefined, i * 0.1)); },
  star: (): void => tone(1568, 0.3, "triangle", 0.15, 2093),
  boss: (): void => { tone(90, 0.6, "sawtooth", 0.15, 60); noise(0.4, 0.4, 400); },
  heart0: (): void => { [392, 330, 262, 196].forEach((f: number, i: number) => tone(f, 0.3, "triangle", 0.14, undefined, i * 0.16)); },
};

/* ---------- speech (iPad: Samantha / Yuna) ---------- */
let VEN: SpeechSynthesisVoice | null = null; let VKO: SpeechSynthesisVoice | null = null;
function pickVoices(): void {
  try { const vs = window.speechSynthesis.getVoices(); const L = (v: SpeechSynthesisVoice): string => v.lang.replace("_", "-").toLowerCase();
    const us = vs.filter((v: SpeechSynthesisVoice) => L(v).indexOf("en-us") === 0); VEN = us.find((v: SpeechSynthesisVoice) => /samantha|ava|allison|aria|jenny|google us/i.test(v.name)) || us[0] || vs.find((v: SpeechSynthesisVoice) => L(v).indexOf("en") === 0) || null;
    const ko = vs.filter((v: SpeechSynthesisVoice) => L(v).indexOf("ko") === 0); VKO = ko.find((v: SpeechSynthesisVoice) => /yuna|sora|google|injoon|sunhi/i.test(v.name)) || ko[0] || null; } catch { /* none */ }
}
function say(text: string, ko?: boolean): Promise<void> {
  return new Promise((res: () => void) => {
    let done = false; const fin = (): void => { if (!done) { done = true; res(); } };
    try { const s = window.speechSynthesis; if (!s) { fin(); return; } if (!VEN && !VKO) pickVoices(); s.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = ko ? "ko-KR" : "en-US"; u.rate = ko ? 0.95 : 0.8; const v = ko ? VKO : VEN; if (v) u.voice = v;
      u.onend = fin; u.onerror = fin; window.setTimeout(fin, 1200 + text.length * (ko ? 200 : 120)); s.speak(u); } catch { fin(); }
  });
}
let UNLOCKED = false;
function unlock(): void {
  const c = ac(); try { if (c) { const b = c.createBuffer(1, 1, 22050); const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } } catch { /* ignore */ }
  if (!UNLOCKED) { UNLOCKED = true; try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; u.lang = "en-US"; window.speechSynthesis.speak(u); } catch { /* ignore */ } }
}

/* ---------- shared UI bits ---------- */
const FS = (a: number, b: number, c: number): string => "clamp(" + a + "px, " + b + "vmin, " + c + "px)";
const btn = (bg: string, extra?: CSSProperties): CSSProperties => ({ background: bg, color: "#fff", border: "4px solid #1d1d1d", boxShadow: "inset 3px 3px 0 rgba(255,255,255,.35), inset -3px -3px 0 rgba(0,0,0,.35)", textShadow: "2px 2px 0 #000", fontWeight: 900, fontSize: FS(18, 3.4, 30), padding: "10px 22px", minHeight: 56, minWidth: 56, cursor: "pointer", touchAction: "manipulation", fontFamily: "inherit", ...(extra || {}) });
const GREEN = "#3f9b2f", GREY = "#6d6d6d", BLUE = "#2f6fd0";
function Hearts(p: { n: number }): JSX.Element { return <div style={{ fontSize: FS(22, 4, 36), letterSpacing: 2 }}>{"❤️".repeat(Math.max(0, p.n))}{"🖤".repeat(Math.max(0, 3 - p.n))}</div>; }
function Meaning(p: { ko: string }): JSX.Element { return <div style={{ background: "rgba(255,255,255,.94)", border: "4px solid #333", padding: "6px 14px", fontSize: FS(18, 3.6, 32), fontWeight: 900, color: "#222", display: "flex", alignItems: "center", gap: 8 }}><span style={{ background: "#ffe066", border: "2px solid #333", fontSize: FS(13, 2.2, 18), padding: "0 6px" }}>뜻</span>{p.ko}<button onClick={() => { SFX.tap(); void say(p.ko, true); }} style={btn(GREY, { fontSize: FS(16, 2.8, 24), padding: "2px 10px", minHeight: 44, minWidth: 44 })}>🔊</button></div>; }

/* ---------- bridge (no hints: no glow, no role colours, no auto reveal) ---------- */
type It = { id: number; w: string; used: boolean };
function Bridge(p: { si: number; rd: number; boss: boolean; diff: string; lab: string; onMiss: () => void; onDone: () => void }): JSX.Element {
  const s = SS[p.si]; const n = s.w.length;
  const miss = useMemo((): number => { if (!p.boss) return -1; const c = s.w.map((w: string, i: number) => i).filter((i: number) => /^[A-Za-z]{3,8}$/.test(s.w[i]) && !/^(the|and|are|you|can|have|has|what|is)$/i.test(s.w[i])); const R = rng(p.si * 7 + 3); return c.length ? c[Math.floor(R() * c.length)] : 0; }, [p.si, p.boss]);
  const nd = p.boss ? (p.diff === "easy" ? 2 : 3) : p.rd === 1 ? 2 : p.diff === "easy" ? 3 : 4;
  const mk = (): It[] => shuf(s.w.map(show).filter((_: string, i: number) => i !== miss).concat(decoys(p.si, nd))).map((w: string, i: number) => ({ id: i, w, used: false }));
  const [items, setItems] = useState<It[]>(mk);
  const [cur, setCur] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3);
  const [hero, setHero] = useState<number>(-1);
  const [fall, setFall] = useState<boolean>(false);
  const [wrongTile, setWrongTile] = useState<string>("");
  const [shake, setShake] = useState<number>(-1);
  const [busy, setBusy] = useState<boolean>(false);
  const [fin, setFin] = useState<boolean>(false);
  const [typed, setTyped] = useState<string>("");
  const [kshake, setKshake] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const alive = useRef<boolean>(true);
  useEffect(() => { alive.current = true; if (p.boss) SFX.boss(); if (p.rd === 3 && !p.boss) void say(s.en); else void say(s.ko, true); return () => { alive.current = false; }; }, []);
  const later = (ms: number, f: () => void): void => { window.setTimeout(() => { if (alive.current) f(); }, ms); };
  const finish = (): void => { setFin(true); setHero(n); SFX.win(); later(500, () => { void say(s.en); }); };
  const advance = (c: number): void => { const nc = c + 1; setCur(nc); setHero(c); if (nc >= n) finish(); };
  const attempt = (it: It): void => {
    if (busy || fin || it.used || cur === miss) return; unlock();
    if (it.w === show(s.w[cur])) { SFX.place(); setItems((a: It[]) => a.map((x: It) => x.id === it.id ? { ...x, used: true } : x)); advance(cur); return; }
    SFX.bad(); p.onMiss(); setBusy(true); setShake(it.id); setWrongTile(it.w); setHero(cur);
    const left = hearts - 1; setHearts(left);
    later(450, () => { setFall(true); SFX.splash(); setWrongTile(""); });
    later(1300, () => { setFall(false); setHero(cur - 1); setShake(-1);
      if (left <= 0) { SFX.heart0(); setMsg("💔 하트가 다 떨어졌어! 이 다리를 처음부터 다시!"); later(1600, () => { setItems(mk()); setCur(0); setHero(-1); setHearts(3); setMsg(""); setBusy(false); }); }
      else setBusy(false); });
  };
  const typeKey = (k: string): void => {
    if (cur !== miss || fin) return; unlock(); const tgt = s.w[miss].toLowerCase();
    if (tgt[typed.length] === k) { SFX.key(); const t = typed + k; setTyped(t); if (t.length >= tgt.length) { SFX.place(); later(250, () => advance(miss)); } }
    else { SFX.bad(); setKshake(k); later(350, () => setKshake("")); }
  };
  const slotW = "min(" + Math.floor(64 / n) + "vw, 15vh)";
  const heroLeft = (i: number): string => (14 + (i + 0.5) * 72 / n) + "%";
  const bankBlock: CSSProperties = { background: "linear-gradient(#5fa83a 0 22%, #866043 22% 100%)", border: "3px solid #2d2d2d" };
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 10px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Hearts n={hearts} /><div style={{ background: "rgba(0,0,0,.55)", color: "#fff", border: "3px solid #111", padding: "4px 10px", fontWeight: 900, fontSize: FS(14, 2.6, 22) }}>{p.boss ? "🗿 돌 골렘" : "🌉 " + p.rd + "/3" + (p.rd === 3 ? " · 👂 소리만" : "")}</div></div>
        {(p.rd < 3 || p.boss) ? <Meaning ko={s.ko} /> : <div style={{ color: "#fff", fontWeight: 900, textShadow: "2px 2px 0 #000", fontSize: FS(16, 3, 26) }}>👂 잘 듣고 만들어 봐!</div>}
        <button onClick={() => { SFX.tap(); unlock(); void say(s.en); }} style={btn(GREY)}>🔊 문장 듣기</button>
      </div>
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <div style={{ position: "absolute", left: "14%", right: "14%", top: "52%", bottom: 0, background: "repeating-linear-gradient(90deg,#3d7fe0 0 18px,#4a8cf0 18px 36px)", opacity: 0.95 }} />
        <div style={{ position: "absolute", left: "22%", top: "64%", fontSize: FS(26, 6, 52), animation: "none" }}>🧟</div>
        <div style={{ position: "absolute", right: "24%", top: "60%", width: "3.2vmin", height: "9vmin", background: "#111", border: "2px solid #000" }}><div style={{ marginTop: "1.4vmin", textAlign: "center", color: "#d36bff", fontSize: "1.6vmin", fontWeight: 900 }}>▬ ▬</div></div>
        <div style={{ position: "absolute", left: 0, width: "14%", top: "38%", bottom: 0, ...bankBlock }} />
        <div style={{ position: "absolute", right: 0, width: "14%", top: "38%", bottom: 0, ...bankBlock }} />
        <div style={{ position: "absolute", left: "14%", right: "14%", top: "38%", display: "flex" }}>
          {s.w.map((w: string, i: number) => { const placed = i < cur || fin; const isMiss = i === miss; const showWrong = !placed && i === cur && wrongTile;
            return <div key={i} style={{ flex: 1, display: "flex", justifyContent: "center" }}><div style={{ width: slotW, height: slotW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS(13, Math.min(3.2, 26 / n), 26), ...(placed || (isMiss && i === cur) ? blkStyle(w, p.boss) : showWrong ? blkStyle(wrongTile, p.boss) : { border: "3px dashed rgba(255,255,255,.85)", background: "rgba(255,255,255,.15)" }), ...(isMiss && i === cur && !placed ? { boxShadow: "0 0 0 4px #fff36b" } : {}) }}>{placed ? show(w) : isMiss && i === cur ? (typed || "?") : showWrong ? wrongTile : ""}</div></div>; })}
        </div>
        <div style={{ position: "absolute", left: hero >= n ? "93%" : heroLeft(hero), top: fall ? "70%" : "38%", transform: "translate(-50%, -100%)" + (fall ? " rotate(25deg)" : ""), transition: fall ? "top .45s ease-in, transform .45s" : "left .4s ease, top .2s", fontSize: FS(34, 9, 80), opacity: fall ? 0.4 : 1, lineHeight: 1 }}>🧑‍🦱</div>
        {fall ? <div style={{ position: "absolute", left: heroLeft(cur), top: "60%", transform: "translateX(-50%)", fontSize: FS(30, 7, 60) }}>💦</div> : null}
        {p.boss ? <div style={{ position: "absolute", right: "2%", top: "10%", textAlign: "center" }}><div style={{ fontSize: FS(44, 12, 110), filter: fin ? "grayscale(1) opacity(.3)" : "none", transition: "filter 1s" }}>🗿</div><div style={{ width: "14vmin", height: 12, background: "#300", border: "2px solid #000" }}><div style={{ width: (100 * (1 - cur / n)) + "%", height: "100%", background: "#e03131" }} /></div></div> : null}
        {msg ? <div style={{ position: "absolute", left: "50%", top: "12%", transform: "translateX(-50%)", background: "rgba(0,0,0,.78)", color: "#fff", padding: "12px 20px", fontWeight: 900, fontSize: FS(18, 3.6, 30), border: "3px solid #000", textAlign: "center" }}>{msg}</div> : null}
        {fin ? <div style={{ position: "absolute", left: "50%", top: "6%", transform: "translateX(-50%)", textAlign: "center", width: "92%" }}><div style={{ display: "inline-block", background: "rgba(29,53,87,.9)", color: "#fff", border: "4px solid #0d1b2a", padding: "6px 18px", fontSize: FS(22, 5, 46), fontWeight: 900, fontFamily: "Arial, sans-serif" }}>{s.en}</div><div style={{ marginTop: 10 }}><button onClick={() => { SFX.tap(); p.onDone(); }} style={btn(GREEN)}>{p.boss ? "🗿💥 골렘을 물리쳤어! 다음 ▶" : "🌉 다리 완성! 다음 ▶"}</button></div></div> : null}
      </div>
      {cur === miss && !fin ? (
        <div style={{ background: "rgba(40,40,40,.9)", border: "4px solid #111", padding: 8, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: FS(16, 3, 26), marginBottom: 6 }}>⌨️ 빠진 단어를 쳐 보자! <button onClick={() => { SFX.tap(); void say(s.w[miss]); }} style={btn(GREY, { fontSize: FS(14, 2.6, 22), padding: "2px 12px", minHeight: 44 })}>🔊 단어</button></div>
          {["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((r: string) => <div key={r} style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4 }}>{r.split("").map((k: string) => <button key={k} onClick={() => typeKey(k)} style={{ ...btn(kshake === k ? "#c92a2a" : "#555", { padding: 0, fontSize: FS(16, 3.2, 28) }), width: "min(8.6vw, 64px)", minWidth: 30, height: "min(9vw, 60px)", minHeight: 44 }}>{k.toUpperCase()}</button>)}</div>)}
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, padding: 8, background: "rgba(40,40,40,.85)", borderTop: "4px solid #111", opacity: fin ? 0.4 : 1 }}>
          {items.map((it: It) => <button key={it.id} onClick={() => attempt(it)} disabled={it.used} style={{ ...blkStyle(it.w, p.boss), minWidth: "min(15vw, 120px)", height: "min(13vw, 84px)", minHeight: 56, fontSize: FS(16, 3.4, 30), padding: "0 10px", visibility: it.used ? "hidden" : "visible", transform: shake === it.id ? "translateX(6px) rotate(4deg)" : "none", transition: "transform .1s", touchAction: "manipulation" }}>{it.w}</button>)}
        </div>
      )}
    </div>
  );
}

/* ---------- repeat aloud x3 (no mic, countdown) ---------- */
function Repeat(p: { si: number; onDone: () => void }): JSX.Element {
  const s = SS[p.si]; const [k, setK] = useState<number>(0); const [ph, setPh] = useState<string>("listen"); const [t, setT] = useState<number>(0);
  const D = Math.max(2500, s.w.length * 650 * 1.5);
  useEffect(() => { let alive = true; let iv = 0; setPh("listen"); setT(0);
    void say(s.en).then(() => { if (!alive) return; setPh("turn"); const t0 = Date.now(); iv = window.setInterval(() => { const e = Date.now() - t0; setT(Math.min(1, e / D)); if (e >= D) { window.clearInterval(iv); setPh("ready"); SFX.ok(); } }, 100); });
    return () => { alive = false; window.clearInterval(iv); }; }, [k]);
  const lit = Math.floor(t * s.w.length * 1.15);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
      <div style={{ background: "rgba(255,255,255,.95)", border: "5px solid #333", padding: "18px 22px", textAlign: "center", maxWidth: 900, width: "100%" }}>
        <div style={{ fontWeight: 900, fontSize: FS(18, 3.6, 30), color: ph === "listen" ? BLUE : GREEN }}>{ph === "listen" ? "👂 " + (k + 1) + "번째 · 잘 들어 봐!" : "🗣️ 네 차례! 소리 내어 말해 봐 (" + (k + 1) + "/3)"}</div>
        <div style={{ fontSize: FS(26, 6, 56), fontWeight: 900, margin: "14px 0", fontFamily: "Arial, sans-serif" }}>{s.en.split(" ").map((w: string, i: number) => <span key={i} style={{ color: ph === "listen" ? "#333" : i < lit ? "#2b8a3e" : "#aaa", marginRight: "0.3em" }}>{w}</span>)}</div>
        <div style={{ color: "#666", fontWeight: 700, fontSize: FS(15, 2.8, 24) }}>{s.ko}</div>
        <div style={{ height: 14, background: "#ddd", margin: "14px 0", border: "2px solid #333" }}><div style={{ width: (t * 100) + "%", height: "100%", background: GREEN }} /></div>
        <div style={{ fontSize: FS(24, 4, 40), marginBottom: 10 }}>{[0, 1, 2].map((i: number) => <span key={i} style={{ opacity: i < k || (i === k && ph === "ready") ? 1 : 0.25 }}>🗣️</span>)}</div>
        <button disabled={ph !== "ready"} onClick={() => { SFX.tap(); if (k >= 2) p.onDone(); else setK(k + 1); }} style={btn(ph === "ready" ? GREEN : "#aaa")}>{ph === "ready" ? (k >= 2 ? "👏 잘 따라했어! 다음 ▶" : "다음 ▶") : "⏳"}</button>
      </div>
    </div>
  );
}

/* ---------- choice sections (3 hearts, lose all = restart section) ---------- */
type Opt = { t: string; ok: boolean; en: boolean };
type QI = { q: string; qen: boolean; sayEn?: string; opts: Opt[] };
function Choice(p: { title: string; items: QI[]; onMiss: () => void; onDone: () => void }): JSX.Element {
  const [i, setI] = useState<number>(0); const [h, setH] = useState<number>(3); const [bad, setBad] = useState<number[]>([]); const [good, setGood] = useState<number>(-1); const [busy, setBusy] = useState<boolean>(false); const [rs, setRs] = useState<number>(0); const [msg, setMsg] = useState<string>("");
  const it = p.items[i];
  useEffect(() => { setBad([]); setGood(-1); if (it.sayEn) void say(it.sayEn); }, [i, rs]);
  const tap = (k: number): void => {
    if (busy || good >= 0 || bad.indexOf(k) >= 0) return; unlock();
    if (it.opts[k].ok) { SFX.ok(); setGood(k); setBusy(true); window.setTimeout(() => { setBusy(false); if (i + 1 < p.items.length) setI(i + 1); else p.onDone(); }, 1000); return; }
    SFX.bad(); p.onMiss(); const nh = h - 1; setH(nh); setBad(bad.concat([k]));
    if (nh <= 0) { setBusy(true); SFX.heart0(); setMsg("💔 하트가 다 떨어졌어! 처음부터 다시 해 보자!"); window.setTimeout(() => { setMsg(""); setH(3); setI(0); setRs(rs + 1); setBusy(false); }, 1700); }
  };
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
      <div style={{ background: "rgba(255,255,255,.95)", border: "5px solid #333", padding: "14px 18px", textAlign: "center", maxWidth: 960, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Hearts n={h} /><div style={{ fontWeight: 900, fontSize: FS(16, 3, 26) }}>{p.title} · {i + 1}/{p.items.length}</div></div>
        <div style={{ margin: "12px 0", fontSize: it.qen ? FS(22, 5, 46) : FS(20, 4.4, 40), fontWeight: 900, fontFamily: it.qen ? "Arial, sans-serif" : "inherit" }}>{it.q}{it.sayEn ? <button onClick={() => { SFX.tap(); void say(it.sayEn || ""); }} style={btn(GREY, { marginLeft: 10, fontSize: FS(16, 3, 26), padding: "4px 14px" })}>🔊</button> : null}</div>
        {msg ? <div style={{ color: "#c92a2a", fontWeight: 900, fontSize: FS(18, 3.4, 28) }}>{msg}</div> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {it.opts.map((o: Opt, k: number) => <button key={k + "-" + rs} onClick={() => tap(k)} style={{ ...btn(good === k ? GREEN : bad.indexOf(k) >= 0 ? "#c92a2a" : BLUE, { fontSize: o.en ? FS(18, 3.8, 34) : FS(17, 3.4, 30), textAlign: "left" }), fontFamily: o.en ? "Arial, sans-serif" : "inherit", opacity: bad.indexOf(k) >= 0 ? 0.55 : 1, textDecoration: bad.indexOf(k) >= 0 ? "line-through" : "none" }}>{k + 1}. {o.t}</button>)}
        </div>
      </div>
    </div>
  );
}
function pickItems(a: number, b: number): QI[] { return [a, b].filter((x: number, i: number, arr: number[]) => arr.indexOf(x) === i).map((si: number) => ({ q: "🎧 잘 듣고, 들은 문장을 골라 봐!", qen: false, sayEn: SS[si].en, opts: shuf([si].concat(others(si, 2))).map((x: number) => ({ t: SS[x].en, ok: x === si, en: true })) })); }
function quizItems(a: number, b: number): QI[] { return [{ q: SS[a].en, qen: true, sayEn: SS[a].en, opts: shuf([a].concat(others(a, 2))).map((x: number) => ({ t: SS[x].ko, ok: x === a, en: false })) }, { q: SS[b].ko + "  → 영어로?", qen: false, opts: shuf([b].concat(others(b, 2))).map((x: number) => ({ t: SS[x].en, ok: x === b, en: true })) }]; }

/* ---------- app ---------- */
type Scr = "start" | "map" | "play" | "reward" | "inv";
type Rw = { st: number; item: [string, string]; sp: [string, string] | null; m: number; d: Day };
export default function App(): JSX.Element {
  const init = useRef<{ s: Sv; ok: boolean } | null>(null);
  if (!init.current) init.current = loadSave();
  const saveRef = useRef<Sv>(init.current.s);
  const [S, setS] = useState<Sv>(init.current.s);
  const [ok, setOk] = useState<boolean>(init.current.ok);
  const [scr, setScr] = useState<Scr>("start");
  const [wk, setWk] = useState<number>(1);
  const [g, setG] = useState<number>(1);
  const [steps, setSteps] = useState<Step[]>([]);
  const [si, setSi] = useState<number>(0);
  const [rk, setRk] = useState<number>(0);
  const mRef = useRef<number>(0);
  const [par, setPar] = useState<boolean>(false);
  const [conf, setConf] = useState<boolean>(false);
  const [rw, setRw] = useState<Rw | null>(null);
  const [vh, setVh] = useState<number>(() => Math.max(480, window.innerHeight || 700));
  useEffect(() => { const f = (): void => setVh(Math.max(480, window.innerHeight || 700)); window.addEventListener("resize", f); try { if (window.speechSynthesis) { pickVoices(); window.speechSynthesis.onvoiceschanged = () => pickVoices(); } } catch { /* none */ } return () => window.removeEventListener("resize", f); }, []);
  const upd = (fn: (n: Sv) => void): void => { const p = saveRef.current; const n: Sv = { ...p, done: { ...p.done }, inv: { ...p.inv }, sp: { ...p.sp } }; fn(n); saveRef.current = n; setOk(persist(n)); setS(n); };
  const isOpen = (x: number): boolean => S.all || x === 1 || !!S.done[String(x - 1)] || !!S.done[String(x)];
  const nextDay = (): number => { for (let x = 1; x <= 84; x++) if (!S.done[String(x)]) return x; return 84; };
  const startDay = (x: number): void => { unlock(); SFX.tap(); const st = stepsFor(x); setG(x); setSteps(st); const pr = S.prog && S.prog.g === x ? S.prog : null; setSi(pr ? Math.min(pr.i, st.length - 1) : 0); mRef.current = pr ? pr.m : 0; setRk(rk + 1); setScr("play"); };
  const finishDay = (): void => { const D = DAYS[g - 1]; const m = mRef.current; const st = starsFor(m, S.diff); const item = itemFor(D); let sp: [string, string] | null = null;
    upd((n: Sv) => { n.done[String(g)] = Math.max(n.done[String(g)] || 0, st); n.inv[item[0]] = (n.inv[item[0]] || 0) + 1; if (st === 3 && !n.sp[String(g)]) { sp = SPEC[(g - 1) % SPEC.length]; n.sp[String(g)] = 1; n.inv[sp[0]] = (n.inv[sp[0]] || 0) + 1; } n.prog = null; });
    setRw({ st, item, sp, m, d: D }); setScr("reward"); SFX.win(); for (let i = 0; i < st; i++) window.setTimeout(() => SFX.star(), 500 + i * 450); void say(st === 3 ? "별 세 개! 최고야!" : "새 블록을 얻었어!", true); };
  const next = (): void => { const ni = si + 1; if (ni >= steps.length) { finishDay(); return; } upd((n: Sv) => { n.prog = { g, i: ni, m: mRef.current }; }); setSi(ni); setRk(rk + 1); };
  const miss = (): void => { mRef.current += 1; };
  const goMap = (): void => { SFX.tap(); setPar(false); try { window.speechSynthesis.cancel(); } catch { /* none */ } setWk(DAYS[nextDay() - 1].wk); setScr("map"); };
  const step = steps[si];
  const items = useMemo((): QI[] => !step ? [] : step.k === "pick" ? pickItems(step.a, step.b) : step.k === "quiz" ? quizItems(step.a, step.b) : [], [g, si, rk]);
  const saveTag = <span style={{ fontWeight: 900, fontSize: FS(13, 2.4, 20), background: ok ? "rgba(255,255,255,.85)" : "#ffe3e3", color: ok ? "#2b8a3e" : "#c92a2a", border: "2px solid #333", padding: "2px 8px" }}>{ok ? "💾 저장됨" : "⚠️ 저장 안 됨 (이 브라우저는 기록을 못 남겨요)"}</span>;
  const root: CSSProperties = { position: "relative", width: "100%", height: vh, overflow: "hidden", userSelect: "none", WebkitUserSelect: "none", touchAction: "manipulation", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif", background: "linear-gradient(#79c2ff 0%, #a9dcff 55%, #79c2ff 100%)", color: "#222" };
  const D = DAYS[g - 1];
  return (
    <div style={root}>
      {scr === "start" ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: 16, textAlign: "center" }}>
          <div style={{ display: "flex", gap: 8 }}>{["I", "can", "build", "a", "bridge"].map((w: string) => <div key={w} style={{ ...blkStyle(w, false), padding: "14px 16px", fontSize: FS(18, 4, 34) }}>{w}</div>)}</div>
          <div style={{ fontSize: FS(34, 9, 84), fontWeight: 900, color: "#fff", textShadow: "4px 4px 0 #000" }}>⛏️ 문장크래프트</div>
          <div style={{ fontWeight: 800, fontSize: FS(16, 3, 26), color: "#1d3557" }}>단어 블록으로 문장 다리를 지어요 · 12주 72문장</div>
          <button onClick={() => { unlock(); SFX.win(); void say("문장크래프트에 온 걸 환영해!", true); setWk(DAYS[nextDay() - 1].wk); setScr("map"); }} style={btn(GREEN, { fontSize: FS(26, 6, 52), padding: "14px 60px" })}>시작 ▶</button>
          {saveTag}
        </div>
      ) : null}
      {scr === "map" ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 10, gap: 8, overflowY: "auto", touchAction: "pan-y" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <div style={{ fontSize: FS(20, 4.4, 38), fontWeight: 900, color: "#fff", textShadow: "3px 3px 0 #000" }}>⛏️ 문장크래프트</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{saveTag}<button onClick={() => { SFX.tap(); setScr("inv"); }} style={btn("#8b5a2b")}>🎒 블록</button><button onClick={() => { SFX.tap(); setConf(false); setPar(true); }} style={btn(GREY)}>⚙️</button></div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{Array.from({ length: 12 }, (_: unknown, i: number) => i + 1).map((w: number) => { const all = [1, 2, 3, 4, 5, 6, 7].every((d: number) => S.done[String((w - 1) * 7 + d)]); return <button key={w} onClick={() => { SFX.tap(); setWk(w); }} style={btn(w === wk ? "#e8891c" : all ? GREEN : "#555", { fontSize: FS(14, 2.6, 22), padding: "6px 12px", minHeight: 48 })}>{all ? "⭐" : ""}{w}주</button>; })}</div>
          <div style={{ fontWeight: 900, fontSize: FS(16, 3.2, 28), color: "#1d3557" }}>{wk}주차 · {THEMES[wk - 1]}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((d: number) => { const x = (wk - 1) * 7 + d; const Dy = DAYS[x - 1]; const op = isOpen(x); const st = S.done[String(x)] || 0; const resume = S.prog && S.prog.g === x;
              return <button key={d} onClick={() => { if (!op) { SFX.bad(); return; } startDay(x); }} style={{ ...btn(op ? (d === 7 ? "#b8860b" : "#5a8f3a") : "#777", { fontSize: FS(15, 2.8, 24), padding: 10, textAlign: "center", minHeight: 120 }), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, opacity: op ? 1 : 0.6 }}>
                <div>{op ? "" : "🔒 "}{d === 7 ? "🏆 복습" : d + "일차"}</div>
                <div style={{ fontSize: FS(12, 2.2, 18), fontWeight: 700 }}>{d === 7 ? "이번 주 문장 모두" : SS[Dy.si].ko}</div>
                <div>{st ? "⭐".repeat(st) + "☆".repeat(3 - st) : resume ? "▶ 이어 하기" : ""}</div>
              </button>; })}
          </div>
        </div>
      ) : null}
      {scr === "inv" ? (
        <div style={{ position: "absolute", inset: 0, padding: 12, overflowY: "auto", touchAction: "pan-y" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: FS(20, 4.4, 38), fontWeight: 900, color: "#fff", textShadow: "3px 3px 0 #000" }}>🎒 모은 블록 {ALLB.filter((b: [string, string]) => S.inv[b[0]]).length}/{ALLB.length}</div><button onClick={goMap} style={btn(GREY)}>🏠 지도</button></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10, marginTop: 12 }}>{ALLB.map((b: [string, string]) => { const c = S.inv[b[0]] || 0; return <div key={b[0]} style={{ background: "rgba(0,0,0,.45)", border: "3px solid #111", padding: 8, textAlign: "center", color: "#fff", fontWeight: 900 }}><div style={{ ...blkStyle(b[0], false, c ? b[1] : "#333"), width: 64, height: 64, margin: "0 auto" }} /><div style={{ marginTop: 6, fontSize: 14 }}>{c ? b[0] + (c > 1 ? " ×" + c : "") : "???"}</div></div>; })}</div>
        </div>
      ) : null}
      {scr === "play" && step ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "rgba(30,40,60,.85)", color: "#fff" }}>
            <button onClick={goMap} style={btn(GREY, { fontSize: FS(14, 2.6, 22), padding: "4px 12px", minHeight: 48 })}>🏠</button>
            <div style={{ fontWeight: 900, fontSize: FS(14, 2.8, 24), flex: 1 }}>{D.wk}주 {D.d < 7 ? D.d + "일차" : "🏆 복습"} · {stepName(step)}</div>
            <div style={{ display: "flex", gap: 3 }}>{steps.map((_: Step, i: number) => <i key={i} style={{ width: "1.6vmin", minWidth: 8, height: 10, background: i < si ? "#51cf66" : i === si ? "#ffd43b" : "#555", border: "1px solid #000", display: "block" }} />)}</div>
            <button onClick={() => { SFX.tap(); setConf(false); setPar(true); }} style={btn(GREY, { fontSize: FS(14, 2.6, 22), padding: "4px 12px", minHeight: 48 })}>⚙️</button>
          </div>
          <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
            {step.k === "b" ? <Bridge key={rk} si={step.si} rd={step.rd} boss={false} diff={S.diff} lab={step.lab} onMiss={miss} onDone={next} /> : null}
            {step.k === "boss" ? <Bridge key={rk} si={step.si} rd={1} boss={true} diff={S.diff} lab="대장전" onMiss={miss} onDone={next} /> : null}
            {step.k === "rep" ? <Repeat key={rk} si={step.si} onDone={next} /> : null}
            {step.k === "pick" || step.k === "quiz" ? <Choice key={rk} title={step.k === "pick" ? "🎧 듣고 고르기" : "📖 뜻 맞추기"} items={items} onMiss={miss} onDone={next} /> : null}
          </div>
        </div>
      ) : null}
      {scr === "reward" && rw ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
          <div style={{ background: "rgba(30,30,30,.9)", border: "5px solid #000", color: "#fff", padding: 22, textAlign: "center", maxWidth: 640, width: "100%" }}>
            <div style={{ fontSize: FS(22, 4.6, 40), fontWeight: 900 }}>{rw.d.d === 7 ? "🏆 챔피언 블록을 얻었어!" : "🎁 새 블록을 얻었어!"}</div>
            <div style={{ fontSize: FS(40, 10, 90), margin: "8px 0" }}>{"⭐".repeat(rw.st)}{"☆".repeat(3 - rw.st)}</div>
            <div style={{ ...blkStyle(rw.item[0], false, rw.item[1]), width: 110, height: 110, margin: "0 auto" }} />
            <div style={{ fontWeight: 900, fontSize: FS(18, 3.6, 30), marginTop: 8 }}>{rw.item[0]}</div>
            <div style={{ marginTop: 6, fontSize: FS(15, 2.8, 24) }}>{rw.m === 0 ? "실수 없이 완벽해! 🎯" : "오늘 실수 " + rw.m + "번" + (rw.st < 3 ? " · " + (S.diff === "normal" ? 2 : 3) + "번 이하면 별 3개!" : "")}</div>
            {rw.sp ? <div style={{ marginTop: 10, fontWeight: 900, color: "#ffe066", fontSize: FS(16, 3, 26) }}>✨ 별 3개 특별 보상: {rw.sp[0]}</div> : null}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}><button onClick={() => { SFX.tap(); setScr("inv"); }} style={btn("#8b5a2b")}>🎒 블록 보기</button><button onClick={goMap} style={btn(GREEN)}>🗺️ 지도로</button></div>
            <div style={{ marginTop: 10 }}>{saveTag}</div>
          </div>
        </div>
      ) : null}
      {par ? (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12, zIndex: 50 }}>
          <div style={{ background: "#f1f1f1", border: "5px solid #222", padding: 18, maxWidth: 620, width: "100%", display: "flex", flexDirection: "column", gap: 12, fontWeight: 800, fontSize: FS(15, 2.8, 22) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b style={{ fontSize: FS(18, 3.6, 30) }}>⚙️ 부모님 설정</b><button onClick={() => { SFX.tap(); setPar(false); }} style={btn(GREY)}>닫기</button></div>
            <div>난이도: <button onClick={() => upd((n: Sv) => { n.diff = "easy"; })} style={btn(S.diff === "easy" ? GREEN : "#999", { padding: "6px 16px" })}>쉬움</button> <button onClick={() => upd((n: Sv) => { n.diff = "normal"; })} style={btn(S.diff === "normal" ? GREEN : "#999", { padding: "6px 16px" })}>보통</button></div>
            <div style={{ fontSize: FS(13, 2.2, 17), fontWeight: 600 }}>문장마다 다리 3번 (가짜 블록 섞기 · 마지막은 소리만) · 정답은 보여 주지 않아요 · 별 3개: 쉬움 실수 3번 이하 / 보통 2번 이하</div>
            {scr === "play" ? <button onClick={() => { setPar(false); next(); }} style={btn("#e8891c")}>⏭️ 지금 단계 건너뛰기 (부모님)</button> : null}
            <div>모든 날 열기: <button onClick={() => upd((n: Sv) => { n.all = !n.all; })} style={btn(S.all ? GREEN : "#999", { padding: "6px 16px" })}>{S.all ? "켜짐" : "꺼짐"}</button></div>
            <div>{saveTag}</div>
            <button onClick={() => { if (!conf) { setConf(true); return; } upd((n: Sv) => { n.done = {}; n.inv = {}; n.sp = {}; n.prog = null; }); setConf(false); setPar(false); setScr("map"); }} style={btn("#c92a2a")}>{conf ? "정말 지울까요? 한 번 더 누르면 지워져요" : "기록 모두 지우기"}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

