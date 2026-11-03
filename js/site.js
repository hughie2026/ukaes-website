
/* ============================================================
   UKAES OFFICIAL WEBSITE
   UK Academy of Epidemiology Sciences

   GLOBAL JAVASCRIPT
   Version 2.0

   Design system: New UKAES Website
   CSS dependency: css/styles.css

   Features:
   1. Mobile navigation
   2. Active page navigation
   3. Header scroll state
   4. Back to top
   5. Contact form validation
   6. Email application support
   7. Automatic copyright year
   8. Accessibility support

   No external JavaScript libraries.
   ============================================================ */

(function () {

  "use strict";


  /* ==========================================================
     01. GLOBAL SETTINGS
     ========================================================== */

  const UKAES = {
    mobileBreakpoint: 820,
    scrollThreshold: 120
  };


  const SELECTORS = {
    header: ".ukaes-header",
    navigation: ".ukaes-navigation",
    menuToggle: ".ukaes-mobile-toggle",
    navLinks: ".ukaes-navigation a",
    backToTop: ".ukaes-back-to-top",
    contactForm: ".ukaes-form",
    copyrightYear: ".ukaes-current-year"
  };


  /* ==========================================================
     02. DOM READY
     ========================================================== */

  function ready(callback) {

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        callback,
        { once: true }
      );
    } else {
      callback();
    }

  }


  /* ==========================================================
     03. MOBILE NAVIGATION
     ========================================================== */

  function initNavigation() {

    const navigation =
      document.querySelector(SELECTORS.navigation);

    const toggle =
      document.querySelector(SELECTORS.menuToggle);

    if (!navigation || !toggle) {
      return;
    }

    if (!navigation.id) {
      navigation.id = "ukaes-primary-navigation";
    }

    toggle.setAttribute("aria-controls", navigation.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");

    function isMobile() {
      return window.matchMedia(
        `(max-width: ${UKAES.mobileBreakpoint}px)`
      ).matches;
    }

    function openMenu() {

      navigation.classList.add("is-open");

      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation");

    }

    function closeMenu() {

      navigation.classList.remove("is-open");

      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");

    }

    function toggleMenu() {

      const isOpen =
        navigation.classList.contains("is-open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }

    }

    toggle.addEventListener("click", toggleMenu);

    // Close navigation after selecting a page.

    navigation.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        if (isMobile()) {
          closeMenu();
        }

      });

    });

    // Close navigation with Escape.

    document.addEventListener("keydown", function (event) {

      if (event.key === "Escape") {

        if (navigation.classList.contains("is-open")) {

          closeMenu();
          toggle.focus();

        }

      }

    });

    // Close when clicking outside the navigation.

    document.addEventListener("click", function (event) {

      if (!isMobile()) {
        return;
      }

      if (
        navigation.classList.contains("is-open") &&
        !navigation.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        closeMenu();
      }

    });

    // Reset mobile navigation when returning to desktop.

    window.addEventListener("resize", function () {

      if (!isMobile()) {
        closeMenu();
      }

    });

  }


  /* ==========================================================
     04. ACTIVE PAGE NAVIGATION
     ========================================================== */

  function initActiveNavigation() {

    const links =
      document.querySelectorAll(SELECTORS.navLinks);

    if (!links.length) {
      return;
    }

    function normalizePath(path) {

      let result = path.replace(/\/+$/, "");

      if (result === "" || result === "/") {
        return "/index.html";
      }

      if (!result.endsWith(".html")) {
        result += "/index.html";
      }

      return result;

    }

    const currentPath =
      normalizePath(window.location.pathname);

    links.forEach(function (link) {

      let target;

      try {

        target = new URL(
          link.getAttribute("href"),
          window.location.origin
        );

      } catch (error) {

        return;

      }

      if (target.origin !== window.location.origin) {
        return;
      }

      const targetPath =
        normalizePath(target.pathname);

      const isCurrent =
        targetPath === currentPath;

      if (isCurrent) {

        link.classList.add("is-active");

        link.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        link.classList.remove("is-active");

        link.removeAttribute(
          "aria-current"
        );

      }

    });

  }


  /* ==========================================================
     05. HEADER SCROLL STATE
     ========================================================== */

  function initHeaderScroll() {

    const header =
      document.querySelector(SELECTORS.header);

    if (!header) {
      return;
    }

    let ticking = false;

    function updateHeader() {

      const scrolled =
        window.scrollY > UKAES.scrollThreshold;

      header.classList.toggle(
        "is-scrolled",
        scrolled
      );

      ticking = false;

    }

    window.addEventListener(
      "scroll",
      function () {

        if (!ticking) {

          window.requestAnimationFrame(
            updateHeader
          );

          ticking = true;

        }

      },
      { passive: true }
    );

    updateHeader();

  }


  /* ==========================================================
     06. BACK TO TOP
     ========================================================== */

  function initBackToTop() {

    const button =
      document.querySelector(SELECTORS.backToTop);

    if (!button) {
      return;
    }

    button.hidden = true;

    function updateButton() {

      button.hidden =
        window.scrollY < 350;

    }

    window.addEventListener(
      "scroll",
      updateButton,
      { passive: true }
    );

    button.addEventListener("click", function () {

      const reducedMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "instant" : "smooth"
      });

    });

    updateButton();

  }


  /* ==========================================================
     07. CONTACT FORM
     ========================================================== */

  function initContactForm() {

    const forms =
      document.querySelectorAll(SELECTORS.contactForm);

    if (!forms.length) {
      return;
    }

    forms.forEach(function (form) {

      const status =
        form.querySelector("[data-form-status]");

      function showStatus(message, success) {

        if (!status) {
          return;
        }

        status.textContent = message;

        status.setAttribute("role", "status");

        status.setAttribute(
          "aria-live",
          "polite"
        );

        status.dataset.state =
          success ? "success" : "error";

      }

      form.addEventListener("submit", function (event) {

        event.preventDefault();

        // Native HTML form validation.

        if (!form.reportValidity()) {
          return;
        }

        // An explicit recipient must be configured
        // before the email function can operate.

        const recipient =
          form.dataset.recipient;

        if (!recipient) {

          showStatus(
            "The contact form has not been configured yet. Please contact the Academy through its published email address.",
            false
          );

          return;

        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {

          showStatus(
            "The contact email address is not configured correctly.",
            false
          );

          return;

        }

        const formData =
          new FormData(form);

        const subject =
          form.dataset.subject ||
          "Website Enquiry - UKAES";

        const lines = [];

        formData.forEach(function (value, key) {

          if (key === "website") {
            return;
          }

          lines.push(
            key + ": " + String(value)
          );

        });

        const body =
          lines.join("\n");

        const mailto =
          "mailto:" + encodeURIComponent(recipient) +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);

        showStatus(
          "Opening your email application. Please review and send your message there.",
          true
        );

        window.location.href = mailto;

      });

    });

  }


  /* ==========================================================
     08. AUTOMATIC COPYRIGHT YEAR
     ========================================================== */

  function initCopyrightYear() {

    const elements =
      document.querySelectorAll(
        SELECTORS.copyrightYear
      );

    const currentYear =
      new Date().getFullYear();

    elements.forEach(function (element) {

      element.textContent = currentYear;

    });

  }


  /* ==========================================================
     09. EXTERNAL LINKS
     ========================================================== */

  function initExternalLinks() {

    const links =
      document.querySelectorAll("a[target='_blank']");

    links.forEach(function (link) {

      const rel =
        new Set(
          (link.getAttribute("rel") || "")
            .split(/\s+/)
            .filter(Boolean)
        );

      rel.add("noopener");
      rel.add("noreferrer");

      link.setAttribute(
        "rel",
        Array.from(rel).join(" ")
      );

    });

  }


  /* ==========================================================
     10. INITIALIZE WEBSITE
     ========================================================== */

  function init() {

    initNavigation();

    initActiveNavigation();

    initHeaderScroll();

    initBackToTop();

    initContactForm();

    initCopyrightYear();

    initExternalLinks();

  }


  /* ==========================================================
     11. START
     ========================================================== */

  ready(init);


})();
