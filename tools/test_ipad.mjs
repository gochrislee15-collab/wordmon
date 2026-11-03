import { createRequire } from "module";
const require = createRequire("/tmp/pwtest/package.json");
const puppeteer = require("puppeteer-core");

const url = process.argv[2] || "http://127.0.0.1:8765/index.html";
const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--autoplay-policy=no-user-gesture-required"]
});

const page = await browser.newPage();
await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const errors = [];
const audio = [];
page.on("pageerror", (err) => errors.push("pageerror " + err.message));
page.on("console", (msg) => { if (msg.type() === "error") errors.push("console " + msg.text()); });
page.on("response", (res) => {
  const u = res.url();
  if (u.includes("/audio/")) audio.push(res.status() + " " + u.split("/audio/")[1]);
});

function fail(msg) {
  console.error("FAIL", msg);
  console.error("errors", errors);
  console.error("audio", audio.slice(-12));
  process.exitCode = 1;
}

await page.goto(url, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector("[data-act=chapters]");
const title = await page.$eval("h1.title", (el) => el.textContent);
if (!title.includes("어휘")) fail("missing title " + title);
const save1 = await page.$eval(".save-mark", (el) => el.textContent.trim());
if (save1 !== "💾") fail("save mark " + save1);

const yellow = await page.$eval("button.btn-yellow", (el) => getComputedStyle(el).color);
const bg = await page.$eval("button.btn-yellow", (el) => getComputedStyle(el).backgroundColor);
console.log("yellow button", yellow, bg);
if (yellow.includes("128") && yellow.includes("0, 128")) fail("purple button");

await page.click("[data-act=chapters]");
await page.waitForSelector("[data-act=open-chapter]");
await page.click("[data-act=open-chapter][data-i='0']");
await page.waitForSelector("[data-act=open-node]");
await page.tap("[data-act=open-node]");

await page.waitForSelector("[data-act=learn-go]", { timeout: 30000 });
const learnWord = await page.$eval(".en-chip .en", (el) => el.textContent.trim());
const learnColor = await page.$eval(".en-chip .en", (el) => getComputedStyle(el).color);
const learnBg = await page.$eval(".en-chip", (el) => getComputedStyle(el).backgroundColor);
console.log("learn", learnWord, learnColor, "on", learnBg);
if (learnWord.toLowerCase() !== "cat") fail("learn word " + learnWord);
await page.click("[data-act=learn-go]");

await page.waitForSelector("button.word-opt");
const opts = await page.$$eval("button.word-opt", (els) => els.map((el) => ({ id: el.dataset.id, text: el.textContent.trim() })));
console.log("opts", opts.map((o) => o.text).join(","));
const wrong = opts.find((o) => o.id !== "cat");
if (!wrong) fail("no decoy");
await page.click(`button.word-opt[data-id="${wrong.id}"]`);
await page.waitForFunction(() => document.querySelector(".hearts") && document.querySelector(".hearts").textContent.includes("♡"));
const heartsAfterWrong = await page.$eval(".hearts", (el) => el.textContent);
console.log("hearts", heartsAfterWrong);
const revealed = await page.$$eval("button.word-opt", (els) => els.map((el) => el.className));
if (revealed.some((c) => /correct|hint|answer/.test(c))) fail("answer hinted " + revealed.join("|"));

await page.click("button.word-opt[data-id=cat]");
await page.waitForSelector("[data-act=next]", { timeout: 8000 });
await page.click("[data-act=next]");
await page.waitForSelector("button.tile");

async function clickTile(ch) {
  const handle = await page.evaluateHandle((letter) => {
    const buttons = Array.from(document.querySelectorAll("button.tile"));
    return buttons.find((b) => b.textContent.trim().toLowerCase() === letter) || null;
  }, ch);
  const el = handle.asElement();
  if (!el) throw new Error("missing tile " + ch);
  await el.click();
}

const tiles = await page.$$eval("button.tile", (els) => els.map((el) => el.textContent.trim().toLowerCase()));
const bad = tiles.find((t) => t !== "c");
console.log("tiles", tiles.join(""));
if (!bad) fail("no decoy tile");
const heartsBefore = await page.$eval(".hearts", (el) => el.textContent);
await clickTile(bad);
await page.waitForFunction((prev) => {
  const now = document.querySelector(".hearts");
  return now && now.textContent !== prev && now.textContent.includes("♡");
}, {}, heartsBefore);
await clickTile("c");
await clickTile("a");
await clickTile("t");
await page.waitForSelector("[data-act=next]", { timeout: 8000 });
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("wordmon-save-v1")));
if (!saved.words.cat || !saved.words.cat.rescued) fail("cat not rescued " + JSON.stringify(saved.words.cat));
if (!saved.words.cat.jailed) fail("mistake did not jail");
if (!(saved.gold > 0)) fail("no gold");
console.log("save", { gold: saved.gold, jailed: saved.words.cat.jailed, rescued: saved.words.cat.rescued, learned: saved.words.cat.learned, combo: saved.combo });

await page.click("[data-act=map]");
await page.click("[data-act=chapters]");
await page.click("[data-act=home]");
await page.waitForSelector("[data-act=dex]");
await page.click("[data-act=dex]");
await page.waitForFunction(() => document.body.innerText.includes("cat"));
await page.click("[data-act=home]");
await page.click("[data-act=settings]");
await page.click("[data-act=set-diff][data-v=hard]");
await page.reload({ waitUntil: "domcontentloaded" });
const diff = await page.evaluate(() => JSON.parse(localStorage.getItem("wordmon-save-v1")).settings.difficulty);
if (diff !== "hard") fail("settings not saved " + diff);
const mark = await page.$eval(".save-mark", (el) => el.textContent.trim());
if (mark !== "💾") fail("save after reload " + mark);

await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
if (!(await page.$("[data-act=chapters]"))) await page.click("[data-act=home]");
await page.waitForSelector("[data-act=chapters]");
const homeText = await page.$eval("#app", (el) => el.innerText);
if (!homeText.includes("망각의 감옥")) fail("portrait home missing jail");

await page.setViewport({ width: 1024, height: 768, isMobile: true, hasTouch: true });
await page.click("[data-act=settings]");
await page.click("[data-act=unlock-all]");
await page.click("[data-act=home]");
await page.click("[data-act=chapters]");
await page.waitForFunction(() => document.body.innerText.includes("움직임 나라") && document.body.innerText.includes("달려라"));
const blanks = await page.evaluate(() => ({
  run: window.WM_DATA.words.run.blank,
  swim: window.WM_DATA.words.swim.blank,
  eat: window.WM_DATA.words.eat.blank,
  drink: window.WM_DATA.words.drink.blank,
  verb: window.WM_DATA.words.run.verb
}));
console.log("verb blanks", JSON.stringify(blanks));
if (blanks.run !== "I can ___." || blanks.swim !== "Let's ___!" || blanks.drink !== "Let's ___!" || !blanks.verb) {
  fail("verb blanks " + JSON.stringify(blanks));
}
const verbBtn = await page.evaluateHandle(() => {
  return Array.from(document.querySelectorAll("[data-act=open-chapter]")).find((el) => el.innerText.includes("달려라")) || null;
});
const verbEl = verbBtn.asElement();
if (!verbEl) fail("no verb chapter button");
await verbEl.click();
await page.waitForSelector("[data-act=open-node]");
await page.click("[data-act=open-node]");
await page.waitForSelector(".act-run", { timeout: 8000 });
const anim = await page.$eval(".act-run .mon", (el) => getComputedStyle(el).animationName);
console.log("run animation", anim);
if (!anim || anim === "none") fail("run has no action animation");
await page.screenshot({ path: "/tmp/verb-run.png" });
const learnSentence = await page.$eval(".panel", (el) => el.innerText);
if (!learnSentence.includes("I can run.")) fail("learn sentence missing " + learnSentence);

const catAudio = audio.filter((line) => line.includes("w/cat.mp3") || line.includes("s/cat.mp3") || line.includes("ph/"));
console.log("audio sample", catAudio.slice(0, 8));
const catWord = audio.find((line) => line.startsWith("200 ") && line.includes("w/cat.mp3"));
if (!catWord) fail("cat mp3 did not load " + audio.filter((l) => l.includes("cat")).join(" | "));

if (errors.length) fail("page errors " + errors.join("\n"));
console.log("PASS");
await browser.close();
