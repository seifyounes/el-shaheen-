// ============================================================
// AL-SHAHEEN — Site interactions + AR/EN language toggle
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initMobileNav();
  initContactForm();
});

// ----- LANGUAGE TOGGLE -----------------------------------------
function initLanguage() {
  // Cache the original (Arabic) HTML for every translatable element on first load.
  document.querySelectorAll("[data-en]").forEach(el => {
    if (!el.hasAttribute("data-ar")) {
      el.setAttribute("data-ar", el.innerHTML);
    }
  });
  // Cache attributes (placeholder, title, alt, page <title>)
  document.querySelectorAll("[data-en-attr]").forEach(el => {
    const attr = el.getAttribute("data-en-attr");
    const enVal = el.getAttribute("data-en-value");
    const original = el.getAttribute(attr) || "";
    el.setAttribute("data-ar-value", original);
    // store english fallback so we can swap
    if (!enVal) el.setAttribute("data-en-value", original);
  });

  const saved = localStorage.getItem("lang") || "ar";
  setLanguage(saved);

  const btn = document.querySelector(".lang-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const current = document.documentElement.lang || "ar";
      setLanguage(current === "ar" ? "en" : "ar");
    });
  }
}

function setLanguage(lang) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === "ar" ? "rtl" : "ltr";

  // Swap inner HTML for translatable elements
  document.querySelectorAll("[data-en]").forEach(el => {
    const ar = el.getAttribute("data-ar");
    const en = el.getAttribute("data-en");
    el.innerHTML = lang === "en" ? en : ar;
  });

  // Swap attributes (placeholder/alt/title)
  document.querySelectorAll("[data-en-attr]").forEach(el => {
    const attr = el.getAttribute("data-en-attr");
    const ar = el.getAttribute("data-ar-value");
    const en = el.getAttribute("data-en-value");
    if (attr) el.setAttribute(attr, lang === "en" ? en : ar);
  });

  // Page <title>
  const titleEl = document.querySelector("title");
  if (titleEl && titleEl.dataset.en) {
    titleEl.textContent = lang === "en" ? titleEl.dataset.en : titleEl.dataset.ar || titleEl.textContent;
  }

  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && metaDesc.dataset.en) {
    metaDesc.setAttribute("content", lang === "en" ? metaDesc.dataset.en : metaDesc.dataset.ar);
  }

  // Toggle button label: shows the OTHER language
  const btn = document.querySelector(".lang-toggle");
  if (btn) btn.textContent = lang === "ar" ? "EN" : "AR";

  localStorage.setItem("lang", lang);
}

// ----- MOBILE NAV ----------------------------------------------
function initMobileNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.textContent = nav.classList.contains("open") ? "✕" : "☰";
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.textContent = "☰";
  }));
}

// ----- CONTACT FORM --------------------------------------------
function initContactForm() {
  const form = document.querySelector("form[data-contact]");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const msg = form.querySelector(".form-msg");
    const lang = document.documentElement.lang || "ar";
    if (msg) {
      msg.style.display = "block";
      msg.textContent = lang === "en"
        ? "Your message has been sent successfully. We'll get back to you soon."
        : "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.";
    }
    form.reset();
  });
}
