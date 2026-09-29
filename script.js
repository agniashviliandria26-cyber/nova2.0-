/**
 * ===================================================================
 * CHANGELA - INTERACTIVE JAVASCRIPT ENGINE
 * Handles: Particle Canvas, Theme Toggle, Smooth Scrollspy,
 * 3D Parallax Tilt, Filterable Grid, Modal Dialogs,
 * Form Validation, Animated Counters, and Toast Notifications
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. THEME SWITCHER (DARK / LIGHT)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('changela-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('changela-theme', newTheme);
      showToast(newTheme === 'dark' ? '🌙 მუქი რეჟიმი გააქტიურდა' : '☀️ ნათელი რეჟიმი გააქტიურდა', 'info');
    });
  }

  // ==========================================
  // 2. NAVBAR SCROLL EFFECT & MOBILE MENU
  // ==========================================
  const navbar = document.getElementById('navbar');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, #m-cta-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      mobileToggleBtn.setAttribute('aria-expanded', !isExpanded);
      mobileToggleBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('open');
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('open');
      }
    });
  }

  // ==========================================
  // 3. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHT)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ==========================================
  // 4. PARTICLES CANVAS ANIMATION
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 55);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(0, 240, 255, ${this.alpha * 0.7})`
          : `rgba(37, 99, 235, ${this.alpha * 0.4})`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawLines = () => {
      const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = isDark
              ? `rgba(0, 240, 255, ${lineAlpha})`
              : `rgba(37, 99, 235, ${lineAlpha * 0.6})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawLines();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });
  }

  // ==========================================
  // 5. 3D PARALLAX TILT FOR HERO SHOWCASE
  // ==========================================
  const heroVisualContainer = document.getElementById('hero-visual-container');
  const heroCard3D = document.getElementById('hero-card-3d');

  if (heroVisualContainer && heroCard3D) {
    heroVisualContainer.addEventListener('mousemove', (e) => {
      const rect = heroVisualContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 12;

      heroCard3D.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroVisualContainer.addEventListener('mouseleave', () => {
      heroCard3D.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ==========================================
  // 6. ANIMATED NUMBER COUNTERS
  // ==========================================
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1800; // ms
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString('en-US');
          clearInterval(timer);
        } else {
          counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString('en-US');
        }
      }, stepTime);
    });
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        runCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const heroMetrics = document.querySelector('.hero-metrics-grid');
  if (heroMetrics) {
    counterObserver.observe(heroMetrics);
  }

  // ==========================================
  // 7. ABOUT SECTION INTERACTIVE TABS
  // ==========================================
  const aboutTabs = document.querySelectorAll('.about-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  aboutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      // Update tab active state
      aboutTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panel visibility
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ==========================================
  // 8. FEATURES CATEGORY FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const featureCards = document.querySelectorAll('.feature-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      featureCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // ==========================================
  // 9. FEATURE DETAILS MODAL
  // ==========================================
  const featureModal = document.getElementById('feature-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalActionBtn = document.getElementById('modal-action-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalTag = document.getElementById('modal-tag');
  const modalBodyText = document.getElementById('modal-body-text');
  const modalHighlights = document.getElementById('modal-highlights');
  const detailButtons = document.querySelectorAll('.feature-details-btn');

  // Feature detailed data dictionary
  const featureData = {
    '1': {
      title: 'ულტრა-სწრაფი სისწრაფე',
      tag: 'წარმადობა & ოპტიმიზაცია',
      desc: 'ჩვენი სისტემა დაფუძნებულია განაწილებულ CDN ქსელზე 300+ ლოკაციით მსოფლიოში. კოდის ავტომატური მინიფიკაცია, ჭკვიანი ქეშირება და Brotli შეკუმშვა უზრუნველყოფს გვერდის ჩატვირთვას 50 მილიწამზე ნაკლებ დროში.',
      highlights: [
        'გლობალური Anycast CDN ქსელი',
        'HTTP/3 და QUIC პროტოკოლების სრული მხარდაჭერა',
        'Lighthouse 100/100 წარმადობის ქულა'
      ]
    },
    '2': {
      title: 'ჭკვიანი AI ავტომატიზაცია',
      tag: 'ხელოვნური ინტელექტი',
      desc: 'უახლესი ნეირონული ქსელები და ენობრივი მოდელები ჩაშენებულია თქვენს ყოველდღიურ სამუშაო პროცესებში. სისტემა სწავლობს თქვენი გუნდის ჩვევებს და ავტომატურად ახორციელებს რუტინულ ოპერაციებს.',
      highlights: [
        'ავტომატური რეპორტინგი და ანალიტიკური შეჯამება',
        'პროგნოზირებადი მომხმარებლის ქცევის მოდელირება',
        'მორგებადი AI აგენტები კონკრეტული ამოცანებისთვის'
      ]
    },
    '3': {
      title: 'საბანკო დონის უსაფრთხოება',
      tag: 'კიბერუსაფრთხოება',
      desc: 'Zero-Trust არქიტექტურა გულისხმობს, რომ არცერთი მოთხოვნა არ ითვლება სანდოდ ავთენტიფიკაციის გარეშე. თქვენი მონაცემები დაშიფრულია როგორც ტრანზიტში, ისე შენახვისას.',
      highlights: [
        'End-to-End 256-ბიტიანი AES შიფრაცია',
        'SOC2 Type II და ISO/IEC 27001 სერთიფიკაცია',
        'ავტომატური DDoS დაცვა 15 Tbps+ სიმძლავრით'
      ]
    },
    '4': {
      title: 'ლაივ მონაცემთა ანალიზი',
      tag: 'მონაცემთა მეცნიერება',
      desc: 'დააკვირდით თქვენი ბიზნესის მეტრიკებს მილიწამების სიზუსტით. მორგებადი ინტერაქტიული ვიჯეტები და გრაფიკები გაძლევთ სრულ კონტროლს პროცესებზე.',
      highlights: [
        'მყისიერი Webhook და WebSocket სინქრონიზაცია',
        'მრავალგანზომილებიანი ფილტრაცია და ექსპორტი',
        'ავტომატური შეტყობინებები კრიტიკულ ცვლილებებზე'
      ]
    },
    '5': {
      title: 'უნივერსალური API & ინტეგრაციები',
      tag: 'დეველოპმენტი',
      desc: 'ჩვენი API შექმნილია დეველოპერებისთვის. სრული დოკუმენტაცია, SDK პოპულარული ენებისთვის (JavaScript, Python, Go, PHP) და მზა ინტეგრაციები წამებში.',
      highlights: [
        'RESTful და GraphQL მოქნილი ენდფოინთები',
        '100+ პოპულარულ CRM და ERP სერვისთან ინტეგრაცია',
        '99.99% API ხელმისაწვდომობის SLA'
      ]
    },
    '6': {
      title: '24/7 პერსონალური სერვისი',
      tag: 'პრემიუმ მხარდაჭერა',
      desc: 'ჩვენთან არ გიწევთ ბოტებთან უსასრულო ლოდინი. თქვენ გყავთ პირადი ტექნიკური მენეჯერი და გამოცდილი ინჟინრების გუნდი, რომლებიც მზად არიან დაგეხმაროთ.',
      highlights: [
        'საშუალო რეაგირების დრო 15 წუთზე ნაკლები',
        'ტექნიკური აუდიტი და კონსულტაციები უფასოდ',
        'პერსონალური Slack/Discord არხი თქვენი გუნდისთვის'
      ]
    }
  };

  const openFeatureModal = (featureId) => {
    const data = featureData[featureId];
    if (!data || !featureModal) return;

    modalTitle.textContent = data.title;
    modalTag.textContent = data.tag;
    modalBodyText.textContent = data.desc;

    modalHighlights.innerHTML = data.highlights
      .map(hl => `<div class="modal-hl-item"><i class="fa-solid fa-circle-check"></i> <span>${hl}</span></div>`)
      .join('');

    featureModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeFeatureModal = () => {
    if (featureModal) {
      featureModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-feature');
      openFeatureModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeFeatureModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeFeatureModal);
  if (modalActionBtn) {
    modalActionBtn.addEventListener('click', () => {
      closeFeatureModal();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Close modal when clicking backdrop
  if (featureModal) {
    featureModal.addEventListener('click', (e) => {
      if (e.target === featureModal) closeFeatureModal();
    });
  }

  // ==========================================
  // 10. CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const agreeCheckbox = document.getElementById('agree-terms');
  const charCounter = document.getElementById('char-counter');
  const submitBtn = document.getElementById('submit-btn');
  const successModal = document.getElementById('success-modal');
  const successModalCloseBtn = document.getElementById('success-modal-close-btn');

  // Character Counter for textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      charCounter.textContent = `${length} / 500`;
    });
  }

  // Email regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      const nameVal = nameInput.value.trim();
      const nameError = document.getElementById('name-error');
      if (nameVal.length < 2) {
        nameInput.classList.add('error');
        nameError.classList.add('show');
        isValid = false;
      } else {
        nameInput.classList.remove('error');
        nameError.classList.remove('show');
      }

      // Validate Email
      const emailVal = emailInput.value.trim();
      const emailError = document.getElementById('email-error');
      if (!isValidEmail(emailVal)) {
        emailInput.classList.add('error');
        emailError.classList.add('show');
        isValid = false;
      } else {
        emailInput.classList.remove('error');
        emailError.classList.remove('show');
      }

      // Validate Message
      const messageVal = messageInput.value.trim();
      const messageError = document.getElementById('message-error');
      if (messageVal.length < 10) {
        messageInput.classList.add('error');
        messageError.classList.add('show');
        isValid = false;
      } else {
        messageInput.classList.remove('error');
        messageError.classList.remove('show');
      }

      // Validate Terms Checkbox
      const termsError = document.getElementById('terms-error');
      if (!agreeCheckbox.checked) {
        termsError.classList.add('show');
        isValid = false;
      } else {
        termsError.classList.remove('show');
      }

      if (!isValid) return;

      // Simulate sending state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';

        // Open Success Modal
        if (successModal) {
          successModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
        showToast('✅ შეტყობინება წარმატებით გაიგზავნა!', 'success');
      }, 1200);
    });
  }

  if (successModalCloseBtn && successModal) {
    successModalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // 11. CLICK TO COPY EMAIL
  // ==========================================
  const emailBox = document.getElementById('contact-email-box');
  const copyEmailText = document.getElementById('copy-email-text');

  if (emailBox && copyEmailText) {
    emailBox.addEventListener('click', () => {
      const email = copyEmailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast(`📋 ${email} დაკოპირდა ბუფერში!`, 'success');
      }).catch(() => {
        showToast('❌ კოპირება ვერ მოხერხდა', 'info');
      });
    });

    // Keyboard accessibility for copy box
    emailBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        emailBox.click();
      }
    });
  }

  // ==========================================
  // 12. NEWSLETTER FORM
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = newsletterEmail.value.trim();
      if (isValidEmail(emailVal)) {
        newsletterForm.reset();
        showToast('🎉 მადლობა გამოწერისთვის! სიახლეებს მალე მიიღებთ.', 'success');
      } else {
        showToast('გთხოვთ შეიყვანოთ სწორი ელ-ფოსტის მისამართი', 'info');
      }
    });
  }

  // ==========================================
  // 13. SCROLL TO TOP BUTTON
  // ==========================================
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 14. TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info';
    toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3500);
  }

  // Close modals on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFeatureModal();
      if (successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

});
