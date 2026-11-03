/* iPad audio: unlock on the first tap, then play committed MP3s. speechSynthesis is only a fallback. */
(function () {
  const player = new Audio();
  player.preload = "auto";
  let ctx = null;
  let unlocked = false;

  function ensureCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function unlock() {
    ensureCtx();
    if (unlocked) return;
    const silent = new Audio("audio/silence.mp3");
    silent.volume = 1;
    const p = silent.play();
    unlocked = true;
    if (p && p.catch) p.catch(function () { unlocked = false; });
  }

  function speak(text) {
    if (!text || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.82;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  function playUrl(url, fallbackText) {
    return new Promise(function (resolve) {
      let done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        resolve(ok);
      }
      player.onended = function () { finish(true); };
      player.onerror = function () {
        if (fallbackText) speak(fallbackText);
        finish(false);
      };
      try {
        player.src = url;
        const p = player.play();
        if (p && p.then) {
          p.then(function () {}).catch(function () {
            if (fallbackText) speak(fallbackText);
            finish(false);
          });
        }
      } catch (err) {
        if (fallbackText) speak(fallbackText);
        finish(false);
      }
    });
  }

  function stop() {
    try { player.pause(); } catch (e) { /* ignore */ }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function playWord(id, spoken) {
    return playUrl("audio/w/" + id + ".mp3", spoken);
  }

  function playSentence(id, spoken) {
    return playUrl("audio/s/" + id + ".mp3", spoken);
  }

  function playLetter(ch) {
    if (!ch || ch === "'") {
      sfx("tick");
      return Promise.resolve(false);
    }
    const name = ch.toUpperCase();
    return playUrl("audio/ph/" + ch.toLowerCase() + ".mp3", name);
  }

  function sfx(kind) {
    const ac = ensureCtx();
    if (!ac) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g);
    g.connect(ac.destination);
    const now = ac.currentTime;
    if (kind === "bad") {
      o.type = "square";
      o.frequency.setValueAtTime(160, now);
      o.frequency.exponentialRampToValueAtTime(90, now + 0.18);
      g.gain.setValueAtTime(0.04, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      o.start(now);
      o.stop(now + 0.2);
    } else if (kind === "fever") {
      o.type = "sawtooth";
      o.frequency.setValueAtTime(440, now);
      o.frequency.exponentialRampToValueAtTime(880, now + 0.22);
      g.gain.setValueAtTime(0.035, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      o.start(now);
      o.stop(now + 0.28);
    } else if (kind === "tick") {
      o.type = "square";
      o.frequency.setValueAtTime(700, now);
      g.gain.setValueAtTime(0.03, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      o.start(now);
      o.stop(now + 0.06);
    } else {
      o.type = "triangle";
      o.frequency.setValueAtTime(523, now);
      o.frequency.exponentialRampToValueAtTime(784, now + 0.12);
      g.gain.setValueAtTime(0.05, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      o.start(now);
      o.stop(now + 0.24);
    }
  }

  window.WMAudio = { unlock, playWord, playSentence, playLetter, sfx, stop, speak };
})();
