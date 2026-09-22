/* =========================================================
   ЭТЕРНИЯ — общий скрипт для всех страниц
   ========================================================= */

(function () {
  /* --- мобильное меню --- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* --- подсветка активного пункта меню --- */
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* --- вензельные уголки для .ornate элементов --- */
  document.querySelectorAll(".ornate").forEach((el) => {
    ["tl", "tr", "bl", "br"].forEach((pos) => {
      const span = document.createElement("span");
      span.className = "ornate-corner " + pos;
      el.appendChild(span);
    });
  });
})();
