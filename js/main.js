(function () {
  "use strict";

  /* ---------------- Header scroll state ---------------- */
  var header = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y > 60) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    if (y > 700) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    navToggle.classList.remove("open");
    mobileNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", function () {
    var isOpen = mobileNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMobileNav);
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------------- CTA preset -> contact form ---------------- */
  var interestSelect = document.getElementById("fInterest");
  document.querySelectorAll("[data-preset]").forEach(function (el) {
    el.addEventListener("click", function () {
      var preset = el.getAttribute("data-preset");
      if (!interestSelect || !preset) return;
      for (var i = 0; i < interestSelect.options.length; i++) {
        if (interestSelect.options[i].text.indexOf(preset) !== -1) {
          interestSelect.selectedIndex = i;
          break;
        }
      }
    });
  });

  /* ---------------- Contact form ---------------- */
  var form = document.getElementById("contactForm");
  var formSuccess = document.getElementById("formSuccess");

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;

    var nameField = document.getElementById("fName");
    if (!nameField.value.trim()) {
      nameField.classList.add("invalid");
      valid = false;
    } else {
      nameField.classList.remove("invalid");
    }

    var emailField = document.getElementById("fEmail");
    if (!emailPattern.test(emailField.value.trim())) {
      emailField.classList.add("invalid");
      valid = false;
    } else {
      emailField.classList.remove("invalid");
    }

    if (!valid) return;

    // NOTE: This is a static front-end only. Wire this up to a form backend
    // (e.g. Formspree, EmailJS, or a server endpoint) to actually deliver submissions.
    formSuccess.hidden = false;
    form.reset();
    setTimeout(function () {
      formSuccess.hidden = true;
    }, 6000);
  });

  /* ---------------- Mortgage calculator ---------------- */
  var priceInput = document.getElementById("calcPrice");
  var downInput = document.getElementById("calcDown");
  var rateInput = document.getElementById("calcRate");
  var priceVal = document.getElementById("calcPriceVal");
  var downVal = document.getElementById("calcDownVal");
  var rateVal = document.getElementById("calcRateVal");
  var resultEl = document.getElementById("calcResult");
  var termBtns = document.querySelectorAll(".term-btn");
  var term = 30;

  function fmtMoney(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function calc() {
    var price = parseFloat(priceInput.value);
    var downPct = parseFloat(downInput.value);
    var rate = parseFloat(rateInput.value);
    var downAmt = price * (downPct / 100);
    var principal = price - downAmt;
    var monthlyRate = rate / 100 / 12;
    var numPayments = term * 12;

    var payment;
    if (monthlyRate === 0) {
      payment = principal / numPayments;
    } else {
      payment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    priceVal.textContent = fmtMoney(price);
    downVal.textContent = downPct + "% · " + fmtMoney(downAmt);
    rateVal.textContent = rate.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") + "%";
    resultEl.innerHTML = fmtMoney(payment) + "<span>/mo</span>";
  }

  [priceInput, downInput, rateInput].forEach(function (el) {
    el.addEventListener("input", calc);
  });

  termBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      termBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      term = parseInt(btn.getAttribute("data-term"), 10);
      calc();
    });
  });

  calc();

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
