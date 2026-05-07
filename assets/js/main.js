// ============================================================
// AL-SHAHEEN — interactions, animations, AR/EN language toggle
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  autoApplyReveals();
  initLanguage();
  initMobileNav();
  initContactForm();
  initRevealAnimations();
  initHeaderScroll();
  initScrollTopButton();
});

// ----- AUTO-APPLY REVEAL CLASSES -------------------------------
function autoApplyReveals() {
  document.querySelectorAll(".grid, .steps").forEach(p => {
    if (!p.classList.contains("stagger")) p.classList.add("stagger");
  });
  const sel = [
    "section .section-head",
    "section .grid > *",
    "section .steps > *",
    "section .split > *",
    "section .contact-grid > *",
    ".cta-strip h2",
    ".cta-strip p",
    ".cta-strip .btn",
  ].join(",");
  document.querySelectorAll(sel).forEach(el => {
    if (!el.classList.contains("reveal") && !el.classList.contains("no-reveal")) {
      el.classList.add("reveal");
    }
  });
}

// ----- LANGUAGE TOGGLE -----------------------------------------
function initLanguage() {
  document.querySelectorAll("[data-en]").forEach(el => {
    if (!el.hasAttribute("data-ar")) {
      el.setAttribute("data-ar", el.innerHTML);
    }
  });
  document.querySelectorAll("[data-en-attr]").forEach(el => {
    const attr = el.getAttribute("data-en-attr");
    const enVal = el.getAttribute("data-en-value");
    const original = el.getAttribute(attr) || "";
    el.setAttribute("data-ar-value", original);
    if (!enVal) el.setAttribute("data-en-value", original);
  });

  const saved = localStorage.getItem("lang") || "ar";
  setLanguage(saved, false);

  const btn = document.querySelector(".lang-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const current = document.documentElement.lang || "ar";
      setLanguage(current === "ar" ? "en" : "ar", true);
    });
  }
}

function setLanguage(lang, animated) {
  const html = document.documentElement;

  const apply = () => {
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-en]").forEach(el => {
      const ar = el.getAttribute("data-ar");
      const en = el.getAttribute("data-en");
      el.innerHTML = lang === "en" ? en : ar;
    });

    document.querySelectorAll("[data-en-attr]").forEach(el => {
      const attr = el.getAttribute("data-en-attr");
      const ar = el.getAttribute("data-ar-value");
      const en = el.getAttribute("data-en-value");
      if (attr) el.setAttribute(attr, lang === "en" ? en : ar);
    });

    const titleEl = document.querySelector("title");
    if (titleEl && titleEl.dataset.en) {
      titleEl.textContent = lang === "en" ? titleEl.dataset.en : titleEl.dataset.ar || titleEl.textContent;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.dataset.en) {
      metaDesc.setAttribute("content", lang === "en" ? metaDesc.dataset.en : metaDesc.dataset.ar);
    }
    const btn = document.querySelector(".lang-toggle");
    if (btn) btn.textContent = lang === "ar" ? "EN" : "AR";

    localStorage.setItem("lang", lang);
  };

  if (animated) {
    document.body.classList.add("switching");
    setTimeout(() => {
      apply();
      requestAnimationFrame(() => {
        document.body.classList.remove("switching");
      });
    }, 220);
  } else {
    apply();
  }
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

// ----- SCROLL REVEAL -------------------------------------------
function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  elements.forEach(el => observer.observe(el));
}

// ----- HEADER SCROLL EFFECT ------------------------------------
function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;
  let ticking = false;
  function update() {
    if (window.scrollY > 12) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

// ----- SCROLL-TO-TOP BUTTON ------------------------------------
function initScrollTopButton() {
  const btn = document.createElement("button");
  btn.className = "scroll-top";
  btn.setAttribute("aria-label", "Scroll to top");
  btn.innerHTML = "↑";
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(btn);

  let ticking = false;
  function update() {
    btn.classList.toggle("show", window.scrollY > 600);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}
