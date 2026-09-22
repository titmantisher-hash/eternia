/* =========================================================
   ЭТЕРНИЯ — интерактивная карта
   ========================================================= */

(function () {
  const frame = document.querySelector(".map-frame");
  const img = document.querySelector(".map-image");
  const panelInner = document.querySelector(".panel-inner");
  const placeholder = document.querySelector(".panel-placeholder");
  const content = document.querySelector(".panel-content");
  const closeBtn = document.querySelector(".panel-close");

  if (!frame || !img) return;

  /* --- маленькие sigil-иконки для крупных точек --- */
  const SIGIL_ICON = {
    valoria: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="6" stroke="var(--violet-bright)" stroke-width="1.6"/>
      <g stroke="var(--umber-glow)" stroke-width="1.6">
        <path d="M20 4v6M20 30v6M4 20h6M30 20h6M8.8 8.8l4.2 4.2M27 27l4.2 4.2M31.2 8.8L27 13M13 27l-4.2 4.2"/>
      </g>
    </svg>`,
    sylvania: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6c5 4 8 8 8 13a8 8 0 0 1-16 0c0-5 3-9 8-13Z" stroke="var(--violet-bright)" stroke-width="1.6"/>
      <path d="M20 27v9M20 36c-3 0-5-2-6-4M20 36c3 0 5-2 6-4" stroke="var(--umber-glow)" stroke-width="1.6"/>
    </svg>`,
    aquilla: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6c6 0 10 4 10 9 0 4-2 6-4 8 2 1 3 3 3 5 0 4-4 6-9 6s-9-2-9-6c0-2 1-4 3-5-2-2-4-4-4-8 0-5 4-9 10-9Z" stroke="var(--violet-bright)" stroke-width="1.6"/>
      <path d="M14 33q6-4 12 0" stroke="var(--umber-glow)" stroke-width="1.6"/>
    </svg>`,
    khortul: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="24" r="4.5" stroke="var(--violet-bright)" stroke-width="1.6"/>
      <path d="M16 22C10 16 10 9 14 5M24 22c6-6 6-13 2-17" stroke="var(--umber-glow)" stroke-width="1.6"/>
      <path d="M20 8V4M13 9l-3-3M27 9l3-3" stroke="var(--umber-glow)" stroke-width="1.4"/>
    </svg>`
  };

  const MINOR_ICON = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8l4 8-8 4 8 4-4 8-4-8 8-4-8-4z" stroke="var(--umber-glow)" stroke-width="1.6"/>
  </svg>`;

  /* --- подгоняем контейнер под реальные пропорции картинки --- */
  function applyAspect() {
    if (img.naturalWidth && img.naturalHeight) {
      frame.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    }
  }
  if (img.complete) applyAspect();
  img.addEventListener("load", applyAspect);

  /* --- рендер точек --- */
  const markersLayer = document.createElement("div");
  markersLayer.className = "markers-layer";
  markersLayer.style.position = "absolute";
  markersLayer.style.inset = "0";
  frame.appendChild(markersLayer);

  let activeBtn = null;

  ETERNIA_REGIONS.forEach((place) => {
    const btn = document.createElement("button");
    btn.className = "marker" + (place.kind === "minor" ? " minor" : "");
    btn.style.left = place.x + "%";
    btn.style.top = place.y + "%";
    btn.setAttribute("aria-label", place.name);
    btn.dataset.id = place.id;

    const icon = place.kind === "minor" ? MINOR_ICON : (SIGIL_ICON[place.sigil] || "");

    btn.innerHTML = `
      <span class="label">${place.name}</span>
      <span class="dot">${icon}</span>
    `;

    btn.addEventListener("click", () => {
      if (activeBtn) activeBtn.classList.remove("active");
      btn.classList.add("active");
      activeBtn = btn;
      openPanel(place);
    });

    markersLayer.appendChild(btn);
  });

  /* --- боковая панель --- */
  function openPanel(place) {
    if (placeholder) placeholder.style.display = "none";
    content.classList.add("active");

    const isMajor = place.kind === "major";

    content.innerHTML = `
      <button class="panel-close" aria-label="Закрыть">&times;</button>
      <span class="panel-eyebrow">${isMajor ? (place.epithet || "") : (place.tag || "")}</span>
      <h2>${place.name}</h2>
      ${isMajor ? `<span class="panel-realm-tag">Государство</span>` : `<span class="panel-realm-tag">Особая зона</span>`}

      <div class="panel-field">
        <span class="label">Общие сведения</span>
        <p class="value">${place.summary}</p>
      </div>

      ${isMajor ? `
        <div class="panel-field">
          <span class="label">Население</span>
          <p class="value">${place.population}</p>
        </div>
        <div class="panel-field">
          <span class="label">Правительство</span>
          <p class="value">${place.government}</p>
        </div>
        <div class="panel-field">
          <span class="label">Правитель</span>
          <p class="value">${place.ruler.title} ${place.ruler.name}</p>
          <a class="panel-link" href="rulers.html#${place.id}">Читать профиль →</a>
        </div>
        <div class="panel-field">
          <span class="label">Экспорт</span>
          <p class="value">${place.exports}</p>
        </div>
        <div class="panel-field">
          <span class="label">Импорт</span>
          <p class="value">${place.imports}</p>
        </div>
      ` : `
        <div class="panel-danger">
          <span class="label">Опасность</span>
          <p class="value">${place.danger}</p>
        </div>
      `}
    `;

    // переустановим обработчик закрытия (кнопка перерисована)
    content.querySelector(".panel-close").addEventListener("click", closePanel);

    if (window.innerWidth < 880) {
      panelInner.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function closePanel() {
    content.classList.remove("active");
    content.innerHTML = "";
    if (placeholder) placeholder.style.display = "";
    if (activeBtn) { activeBtn.classList.remove("active"); activeBtn = null; }
  }

  if (closeBtn) closeBtn.addEventListener("click", closePanel);

  /* =========================================================
     Режим калибровки: ?calibrate в адресной строке.
     Клик по карте выводит проценты X/Y для правки map-data.js
     ========================================================= */
  if (new URLSearchParams(location.search).has("calibrate")) {
    frame.classList.add("calibrating");
    const readout = document.createElement("div");
    readout.className = "calibrate-readout";
    readout.textContent = "Кликни по карте, чтобы узнать x / y (%)";
    frame.appendChild(readout);

    frame.addEventListener("click", (e) => {
      const rect = frame.getBoundingClientRect();
      const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
      const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
      readout.textContent = `x: ${x}  y: ${y}`;
      console.log(`x: ${x}, y: ${y}`);
    });
  }
})();
