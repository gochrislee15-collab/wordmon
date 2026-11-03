/* Procedural sticker creatures. Colors come from each word; evolution adds aura and a crown. */
(function () {
  function mix(hex, amt) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const f = (c) => Math.max(0, Math.min(255, Math.round(c + (255 - c) * amt)));
    return "#" + [f(r), f(g), f(b)].map((n) => n.toString(16).padStart(2, "0")).join("");
  }

  function body(shape, col, belly) {
    if (shape === 1) {
      return `<rect x="42" y="78" width="116" height="108" rx="46" fill="${col}" stroke="#141414" stroke-width="5"/>
        <ellipse cx="100" cy="142" rx="36" ry="28" fill="${belly}"/>`;
    }
    if (shape === 2) {
      return `<ellipse cx="100" cy="96" rx="40" ry="34" fill="${col}" stroke="#141414" stroke-width="5"/>
        <ellipse cx="100" cy="146" rx="58" ry="48" fill="${col}" stroke="#141414" stroke-width="5"/>
        <ellipse cx="100" cy="156" rx="30" ry="22" fill="${belly}"/>`;
    }
    if (shape === 3) {
      return `<path d="M100 62 C146 62 168 96 162 132 C156 176 132 196 100 196 C68 196 40 174 40 134 C40 92 62 62 100 62 Z" fill="${col}" stroke="#141414" stroke-width="5"/>
        <ellipse cx="100" cy="150" rx="32" ry="24" fill="${belly}"/>`;
    }
    return `<ellipse cx="100" cy="128" rx="64" ry="60" fill="${col}" stroke="#141414" stroke-width="5"/>
      <ellipse cx="100" cy="146" rx="34" ry="26" fill="${belly}"/>`;
  }

  function face(hungry) {
    const mouth = hungry
      ? `<path d="M78 158 Q100 146 122 158" fill="none" stroke="#141414" stroke-width="5" stroke-linecap="round"/>
         <path d="M70 96 L84 104" stroke="#141414" stroke-width="4" stroke-linecap="round"/>
         <path d="M130 96 L116 104" stroke="#141414" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M78 156 Q100 174 122 156" fill="none" stroke="#141414" stroke-width="5" stroke-linecap="round"/>`;
    return `
      <ellipse cx="78" cy="118" rx="16" ry="18" fill="#fff" stroke="#141414" stroke-width="4"/>
      <ellipse cx="122" cy="118" rx="16" ry="18" fill="#fff" stroke="#141414" stroke-width="4"/>
      <circle cx="82" cy="122" r="6" fill="#141414"/>
      <circle cx="126" cy="122" r="6" fill="#141414"/>
      <circle cx="84" cy="118" r="2.2" fill="#fff"/>
      <circle cx="128" cy="118" r="2.2" fill="#fff"/>
      <circle cx="66" cy="140" r="8" fill="#ffb3c0"/>
      <circle cx="134" cy="140" r="8" fill="#ffb3c0"/>
      ${mouth}`;
  }

  function crown() {
    return `<polygon points="62,70 74,46 86,68 100,40 114,68 126,46 138,70" fill="#FFE600" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="100" cy="40" r="4" fill="#fff" stroke="#141414" stroke-width="2"/>`;
  }

  function creature(word, opts) {
    const o = opts || {};
    const stage = o.stage || 1;
    const col = word.col || "#ffd43b";
    const belly = mix(col, 0.45);
    const uid = (word.id || "m") + "-" + stage + (o.silhouette ? "s" : "c");
    const aura = stage >= 2 && !o.silhouette
      ? `<circle cx="100" cy="124" r="${stage >= 3 ? 90 : 84}" fill="none" stroke="#FFE600" stroke-width="${stage >= 3 ? 8 : 5}" opacity="0.95"/>
         <circle cx="46" cy="70" r="5" fill="#fff"/><circle cx="158" cy="78" r="4" fill="#FFE600"/><circle cx="150" cy="46" r="3" fill="#fff"/>`
      : "";
    const disc = `<circle cx="100" cy="118" r="98" fill="#ffffff"/>`;
    if (o.silhouette) {
      return `<svg class="mon-svg" viewBox="0 0 200 230" role="img" aria-label="아직 모르는 워드몬">
        ${disc}
        <ellipse cx="100" cy="132" rx="62" ry="58" fill="#141414"/>
        <circle cx="70" cy="176" r="14" fill="#141414"/>
        <circle cx="130" cy="176" r="14" fill="#141414"/>
      </svg>`;
    }
    const emo = word.emo || "✨";
    return `<svg class="mon-svg" viewBox="0 0 200 230" role="img" aria-label="${word.en || "워드몬"}">
      <defs><filter id="sh-${uid}"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/></filter></defs>
      ${disc}
      ${aura}
      <g filter="url(#sh-${uid})">
        ${stage >= 3 ? crown() : ""}
        <ellipse class="limb limb-a" cx="64" cy="150" rx="16" ry="12" fill="${col}" stroke="#141414" stroke-width="4"/>
        <ellipse class="limb limb-b" cx="136" cy="150" rx="16" ry="12" fill="${col}" stroke="#141414" stroke-width="4"/>
        ${body(word.shape || 0, col, belly)}
        <ellipse class="foot foot-l" cx="74" cy="188" rx="16" ry="10" fill="${mix(col, 0.2)}" stroke="#141414" stroke-width="4"/>
        <ellipse class="foot foot-r" cx="126" cy="188" rx="16" ry="10" fill="${mix(col, 0.2)}" stroke="#141414" stroke-width="4"/>
        ${face(!!o.hungry)}
        <text x="100" y="168" text-anchor="middle" font-size="34">${emo}</text>
      </g>
    </svg>`;
  }

  function boss(hurt) {
    const crack = hurt
      ? `<path d="M100 70 L110 100 L96 108 L112 140" fill="none" stroke="#FFE600" stroke-width="4"/>`
      : "";
    return `<svg class="mon-svg boss-svg" viewBox="0 0 240 200" role="img" aria-label="망각몬">
      <ellipse cx="120" cy="168" rx="70" ry="12" fill="#000" opacity="0.35"/>
      <path d="M40 110 C20 40 90 20 120 36 C150 16 220 40 200 110 C230 150 170 180 120 168 C70 184 10 150 40 110 Z" fill="#1a1a1a" stroke="#ffffff" stroke-width="5"/>
      <ellipse cx="86" cy="96" rx="18" ry="20" fill="#fff"/>
      <ellipse cx="154" cy="96" rx="18" ry="20" fill="#fff"/>
      <circle cx="90" cy="100" r="7" fill="#141414"/>
      <circle cx="158" cy="100" r="7" fill="#141414"/>
      <path d="M78 78 L96 86" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M162 78 L144 86" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M92 132 Q120 118 148 132" fill="none" stroke="#ff2d2d" stroke-width="6" stroke-linecap="round"/>
      ${crack}
      <text x="36" y="58" font-size="20">🔤</text>
      <text x="184" y="64" font-size="20">✨</text>
    </svg>`;
  }

  window.WMArt = { creature, boss, mix };
})();
