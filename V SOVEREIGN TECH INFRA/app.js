/* ==========================================
   M/S. V-SOVEREIGN TECH-INFRA — App JavaScript
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Language Initialization
  let currentLang = localStorage.getItem("preferredLang") || "en";
  document.documentElement.lang = currentLang;

  // 2. Dynamic Component Injection
  injectHeader();
  injectFooter();
  setActiveNavLink();

  // 3. Setup Interactive Elements
  setupMobileNav();
  setupLanguageToggle(currentLang);
  
  // 4. Initial Translation of Page Content
  translatePage(currentLang);

  // 5. Page-Specific Handlers
  if (document.getElementById("contact-form")) {
    setupContactForm();
  }
  if (document.querySelector(".project-filters")) {
    setupProjectFilters();
    setupProjectModals();
  }
});

/**
 * Resolve dot-notation path on the translation object.
 * e.g., getTranslation("home.hero_tagline", "en")
 */
function getTranslation(path, lang) {
  if (!window.translations || !window.translations[lang]) return null;
  const parts = path.split(".");
  let current = window.translations[lang];
  for (let part of parts) {
    if (current[part] === undefined) return null;
    current = current[part];
  }
  return current;
}

/**
 * Translates all elements on the page with data-i18n attributes
 */
function translatePage(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem("preferredLang", lang);

  // Translate standard text contents
  const translateElements = document.querySelectorAll("[data-i18n]");
  translateElements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    const text = getTranslation(key, lang);
    if (text !== null) {
      if (Array.isArray(text)) {
        // Handle list structures (e.g. services list bullets)
        // Clear children and recreate lists
        el.innerHTML = "";
        text.forEach(itemText => {
          const li = document.createElement("li");
          li.textContent = itemText;
          el.appendChild(li);
        });
      } else {
        el.textContent = text;
      }
    }
  });

  // Translate placeholders (e.g. input fields)
  const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
  placeholderElements.forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const text = getTranslation(key, lang);
    if (text !== null) {
      el.setAttribute("placeholder", text);
    }
  });

  // Translate select option labels
  const optionElements = document.querySelectorAll("option[data-i18n-option]");
  optionElements.forEach(el => {
    const key = el.getAttribute("data-i18n-option");
    const text = getTranslation(key, lang);
    if (text !== null) {
      el.textContent = text;
    }
  });

  // Dynamic meta title and description updates for SEO
  updateMetaTags(lang);
}

/**
 * Update page titles and descriptions based on current view and language
 */
function updateMetaTags(lang) {
  const path = window.location.pathname.toLowerCase();
  let titleKey = "meta.title_home";
  let descKey = "meta.description_home";

  if (path.includes("about")) {
    titleKey = "meta.title_about";
    descKey = "meta.description_about";
  } else if (path.includes("services")) {
    titleKey = "meta.title_services";
    descKey = "meta.description_services";
  } else if (path.includes("projects")) {
    titleKey = "meta.title_projects";
    descKey = "meta.description_projects";
  } else if (path.includes("contact")) {
    titleKey = "meta.title_contact";
    descKey = "meta.description_contact";
  }

  const newTitle = getTranslation(titleKey, lang);
  const newDesc = getTranslation(descKey, lang);

  if (newTitle) document.title = newTitle;
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && newDesc) {
    metaDesc.setAttribute("content", newDesc);
  }
}

/**
 * Returns reusable SVG markup for the company logo wordmark + icon
 */
function getLogoMarkup() {
  return `
    <a href="index.html" class="logo" id="logo-clickable">
      <div class="logo-icon">
        <!-- Abstract geometric upward-pointing structural columns representing growth & infra -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 20V10L12 4L20 10V20H15V14H9V20H4Z" fill="#FFFFFF" />
          <path d="M12 4V20" stroke="#E08E2E" stroke-width="2" />
        </svg>
      </div>
      <div class="logo-text">
        <span class="brand-main">V-SOVEREIGN</span>
        <span class="brand-sub">TECH-INFRA</span>
      </div>
    </a>
  `;
}

/**
 * Inject Navigation Header dynamically
 */
function injectHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  header.innerHTML = `
    <div class="container header-container">
      ${getLogoMarkup()}
      
      <nav class="main-nav" id="main-nav">
        <ul>
          <li data-page="index"><a href="index.html" data-i18n="nav.home">Home</a></li>
          <li data-page="about"><a href="about.html" data-i18n="nav.about">About Us</a></li>
          <li data-page="services"><a href="services.html" data-i18n="nav.services">Services</a></li>
          <li data-page="projects"><a href="projects.html" data-i18n="nav.projects">Projects</a></li>
          <li data-page="contact"><a href="contact.html" data-i18n="nav.contact">Contact</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <!-- Dual Language Toggle -->
        <div class="lang-toggle" id="lang-toggle-container">
          <button class="lang-btn" data-lang="en" id="lang-btn-en">EN</button>
          <button class="lang-btn" data-lang="te" id="lang-btn-te">తె</button>
        </div>
        
        <!-- Header Contact Action -->
        <a href="contact.html" class="btn btn-primary btn-sm" data-i18n="nav.cta">Get a Quote</a>
        
        <!-- Mobile Menu Toggle Button -->
        <button class="mobile-toggle" id="mobile-menu-toggle" aria-label="Toggle navigation">
          &#9776;
        </button>
      </div>
    </div>
  `;
}

/**
 * Inject Footer dynamically
 */
function injectFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo" style="margin-bottom: 20px;">
            <div class="logo-icon" style="background-color: var(--color-accent)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20V10L12 4L20 10V20H15V14H9V20H4Z" fill="#FFFFFF" />
                <path d="M12 4V20" stroke="#E08E2E" stroke-width="2" />
              </svg>
            </div>
            <div class="logo-text">
              <span class="brand-main" style="color: var(--color-white)">V-SOVEREIGN</span>
              <span class="brand-sub">TECH-INFRA</span>
            </div>
          </div>
          <p data-i18n="footer.legal_desc">
            M/S. V-SOVEREIGN TECH-INFRA is a registered Partnership Firm (At Will), established in June 2026. Registered Jurisdiction: Sri Sathya Sai District, AP.
          </p>
        </div>
        
        <div class="footer-col">
          <h3 data-i18n="footer.quick_links">Quick Links</h3>
          <ul class="footer-links">
            <li><a href="index.html" data-i18n="nav.home">Home</a></li>
            <li><a href="about.html" data-i18n="nav.about">About Us</a></li>
            <li><a href="services.html" data-i18n="nav.services">Services</a></li>
            <li><a href="projects.html" data-i18n="nav.projects">Projects</a></li>
            <li><a href="contact.html" data-i18n="nav.contact">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-col">
          <h3 data-i18n="footer.address_title">Registered Office</h3>
          <address class="footer-address" data-i18n="footer.address_detail">
            H.No. 6/57, Daduluru, Chandracherla, Kanaganapalli – 515641, Sri Sathya Sai District, Andhra Pradesh, India
          </address>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 M/S. V-SOVEREIGN TECH-INFRA. <span data-i18n="footer.rights">All rights reserved.</span></p>
        <p data-i18n="footer.developed_by">Built professionally.</p>
      </div>
    </div>
  `;
}

/**
 * Highlights active link in navigation drawer based on current page URL
 */
function setActiveNavLink() {
  const path = window.location.pathname.toLowerCase();
  const navItems = document.querySelectorAll("nav.main-nav li");
  
  navItems.forEach(li => {
    const page = li.getAttribute("data-page");
    const isHome = page === "index";
    const matchesHome = isHome && (path === "/" || path.endsWith("index.html") || path.endsWith("/") || path === "");
    const matchesOther = !isHome && path.includes(page);
    
    if (matchesHome || matchesOther) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  });
}

/**
 * Mobile navigation menu toggling triggers
 */
function setupMobileNav() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    toggle.innerHTML = nav.classList.contains("active") ? "&#x2715;" : "&#9776;";
  });
}

/**
 * Setup language selector controls
 */
function setupLanguageToggle(initialLang) {
  const btns = document.querySelectorAll(".lang-btn");
  
  // Set initial active button state
  btns.forEach(btn => {
    if (btn.getAttribute("data-lang") === initialLang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
    
    // Bind click trigger
    btn.addEventListener("click", () => {
      const selectedLang = btn.getAttribute("data-lang");
      
      // Update toggle buttons active state
      btns.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(`.lang-btn[data-lang="${selectedLang}"]`).forEach(b => b.classList.add("active"));
      
      // Execute UI translation refresh
      translatePage(selectedLang);
    });
  });
}

/**
 * Setup client side filters on Projects page
 */
function setupProjectFilters() {
  const filters = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      // Toggle active states
      filters.forEach(f => f.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");
      
      // Filter project cards in grid
      cards.forEach(card => {
        if (category === "all" || card.classList.contains(category)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/**
 * Setup detailed project modal view popup
 */
function setupProjectModals() {
  const viewBtns = document.querySelectorAll(".view-project-details");
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const footerCloseBtn = document.getElementById("modal-footer-close");

  if (!modal) return;

  // Setup click triggers to open
  viewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".project-card");
      const index = card.getAttribute("data-index");
      const category = card.getAttribute("data-category");
      const lang = document.documentElement.lang || "en";

      // Resolve keys from translations dictionary
      const title = getTranslation(`projects.p${index}_title`, lang);
      const desc = getTranslation(`projects.p${index}_desc`, lang);
      const scope = getTranslation(`projects.p${index}_scope`, lang);
      const loc = getTranslation(`projects.p${index}_loc`, lang);
      
      const categoryLabel = getTranslation(`projects.filter_${category}`, lang);

      // Populate text inside modal container
      document.getElementById("modal-title").textContent = title;
      document.getElementById("modal-field-vertical").textContent = categoryLabel;
      document.getElementById("modal-field-location").textContent = loc;
      document.getElementById("modal-field-scope").textContent = scope;

      modal.classList.add("active");
    });
  });

  // Setup close events
  const closeModal = () => modal.classList.remove("active");

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (footerCloseBtn) footerCloseBtn.addEventListener("click", closeModal);
  
  // Close on outside background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * Pre-populate and validate contact inquiries form
 */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const statusMsg = document.getElementById("form-status-message");

  // Read URL query params to auto-fill the dropdown if a service was specified
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get("service");
  if (serviceParam) {
    const dropdown = document.getElementById("contact-service");
    if (dropdown) dropdown.value = serviceParam;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const lang = document.documentElement.lang || "en";

    const name = document.getElementById("contact-name").value.trim();
    const phone = document.getElementById("contact-phone").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const service = document.getElementById("contact-service").value;
    const msg = document.getElementById("contact-message").value.trim();

    // Field validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\s\-()]{10,15}$/;

    if (!name || !phone || !email || !service || !msg || !emailRegex.test(email) || !phoneRegex.test(phone)) {
      statusMsg.style.color = "red";
      statusMsg.textContent = getTranslation("contact.validation_err", lang);
      return;
    }

    statusMsg.style.color = "green";
    statusMsg.textContent = lang === "en" ? "Sending inquiry..." : "విచారణ పంపుతోంది...";

    // Capture payload for submission
    const payload = {
      name: name,
      phone: phone,
      email: email,
      service: service,
      message: msg,
      _subject: "New Website Inquiry - M/S. V-SOVEREIGN TECH-INFRA"
    };

    // Asynchronous submit to FormSubmit AJAX endpoint
    fetch("https://formsubmit.co/ajax/vsovereigntechinfra@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Form submission failed");
    })
    .then(data => {
      statusMsg.style.color = "green";
      statusMsg.textContent = getTranslation("contact.success_msg", lang);
      
      // Hide all input fields and submit button to confirm success cleanly
      const formGroups = form.querySelectorAll(".form-group");
      formGroups.forEach(group => group.style.display = "none");
      
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.style.display = "none";
    })
    .catch(error => {
      console.error("Error submitting inquiry:", error);
      statusMsg.style.color = "red";
      statusMsg.textContent = lang === "en" 
        ? "Something went wrong. Please try again or contact us directly." 
        : "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా నేరుగా మమ్మల్ని సంప్రదించండి.";
    });
  });
}
