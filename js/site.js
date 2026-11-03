
/* =========================================================
   UK ACADEMY OF EPIDEMIOLOGY SCIENCES
   UKAES OFFICIAL WEBSITE

   Global JavaScript
   File: js/site.js

   Features:
   - Automatic copyright year
   - Active navigation highlighting
   - Responsive mobile navigation
   - Contact form email preparation
   - Accessibility enhancements
   - Safe initialization across pages

   Compatible with GitHub Pages
   ========================================================= */

"use strict";

/* =========================================================
   1. INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  initializeCopyrightYear();

  initializeActiveNavigation();

  initializeMobileNavigation();

  initializeContactForm();

});


/* =========================================================
   2. AUTOMATIC COPYRIGHT YEAR
   ========================================================= */

function initializeCopyrightYear() {

  const currentYear = new Date().getFullYear();

  const yearElements = document.querySelectorAll(
    "#year, [data-year]"
  );

  yearElements.forEach(function (element) {

    element.textContent = currentYear;

  });

}


/* =========================================================
   3. ACTIVE NAVIGATION
   ========================================================= */

function initializeActiveNavigation() {

  const path = window.location.pathname;

  let currentPage = path.split("/").pop();

  if (!currentPage) {
    currentPage = "index.html";
  }

  currentPage = currentPage.toLowerCase();

  const navigationLinks = document.querySelectorAll(
    ".nav-links a"
  );

  navigationLinks.forEach(function (link) {

    const linkURL = new URL(
      link.getAttribute("href"),
      window.location.href
    );

    const linkPage = linkURL.pathname
      .split("/")
      .pop()
      .toLowerCase();

    if (linkPage === currentPage) {

      link.classList.add("active");

      link.setAttribute(
        "aria-current",
        "page"
      );

    } else {

      link.classList.remove("active");

      link.removeAttribute("aria-current");

    }

  });

}


/* =========================================================
   4. RESPONSIVE MOBILE NAVIGATION
   ========================================================= */

function initializeMobileNavigation() {

  const menuToggle = document.querySelector(
    "#menuToggle, .menu-toggle"
  );

  const mainNav = document.querySelector(
    "#mainNav, #main-navigation, .nav-links"
  );

  if (!menuToggle || !mainNav) {
    return;
  }

  const mobileBreakpoint = window.matchMedia(
    "(max-width: 850px)"
  );

  function setMenuState(isOpen) {

    mainNav.classList.toggle(
      "open",
      isOpen
    );

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.textContent = isOpen
      ? "✕ Close"
      : "☰ Menu";

  }

  /* Initial state */

  setMenuState(false);

  /* Toggle menu */

  menuToggle.addEventListener(
    "click",
    function () {

      const isOpen = mainNav.classList.contains(
        "open"
      );

      setMenuState(!isOpen);

    }
  );

  /* Close menu after navigation */

  mainNav.addEventListener(
    "click",
    function (event) {

      if (event.target.closest("a")) {

        setMenuState(false);

      }

    }
  );

  /* Escape key closes mobile menu */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        mainNav.classList.contains("open")
      ) {

        setMenuState(false);

        menuToggle.focus();

      }

    }
  );

  /* Reset menu on desktop */

  function handleBreakpointChange(event) {

    if (!event.matches) {

      setMenuState(false);

    }

  }

  if (mobileBreakpoint.addEventListener) {

    mobileBreakpoint.addEventListener(
      "change",
      handleBreakpointChange
    );

  } else if (mobileBreakpoint.addListener) {

    mobileBreakpoint.addListener(
      handleBreakpointChange
    );

  }

}


/* =========================================================
   5. CONTACT FORM

   This website is hosted on GitHub Pages.

   GitHub Pages does not provide a
   built-in email submission backend.

   The form generates a mailto URL
   and opens the visitor's email app.

   The visitor must send the email.
   ========================================================= */

function initializeContactForm() {

  const contactForm = document.getElementById(
    "contactForm"
  );

  if (!contactForm) {
    return;
  }

  /* Department email addresses */

  const recipients = {

    general: "info@ukaes.org",

    research: "research@ukaes.org",

    education: "education@ukaes.org",

    appointments: "appointments@ukaes.org"

  };

  contactForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      /* Native form validation */

      if (!contactForm.reportValidity()) {
        return;
      }

      /* Read form values */

      const fullName = getFieldValue(
        "fullName"
      );

      const email = getFieldValue(
        "email"
      );

      const organisation = getFieldValue(
        "organisation"
      );

      const enquiryType = getFieldValue(
        "enquiryType"
      );

      const subject = getFieldValue(
        "subject"
      );

      const message = getFieldValue(
        "message"
      );

      /* Validate required values */

      if (
        !fullName ||
        !email ||
        !subject ||
        !message
      ) {

        alert(
          "Please complete all required fields."
        );

        return;

      }

      /* Choose appropriate department */

      const recipient = Object.prototype.hasOwnProperty.call(
        recipients,
        enquiryType
      )
        ? recipients[enquiryType]
        : recipients.general;

      /* Prepare email subject */

      const emailSubject =
        "UKAES Enquiry: " + subject;

      /* Prepare email body */

      const emailBody = [

        "UK Academy of Epidemiology Sciences",

        "Website Enquiry",

        "",

        "Full Name: " + fullName,

        "Email Address: " + email,

        "Institution / Organisation: " +
          (organisation || "Not provided"),

        "Enquiry Category: " + enquiryType,

        "",

        "Message:",

        message,

        "",

        "---------------------------------",

        "Prepared via the UKAES website.",

        "https://ukaes.org"

      ].join("\n");

      /* Encode URL parameters */

      const mailtoURL =
        "mailto:" + recipient +
        "?subject=" +
        encodeURIComponent(emailSubject) +
        "&body=" +
        encodeURIComponent(emailBody);

      /* Open visitor's email application */

      window.location.href = mailtoURL;

      /*
       Important:

       Do not show a "message sent"
       confirmation here.

       The browser only opens the
       email application.

       The visitor must manually
       send the prepared email.
      */

    }
  );

}


/* =========================================================
   6. HELPER FUNCTION
   ========================================================= */

function getFieldValue(elementId) {

  const element = document.getElementById(
    elementId
  );

  if (!element) {
    return "";
  }

  return element.value.trim();

}


/* =========================================================
   END OF UKAES GLOBAL JAVASCRIPT
   ========================================================= */
