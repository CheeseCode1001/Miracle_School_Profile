// ============ GSAP & MOTION SETUP ============

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>'"]/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[match];
    });
}

// Wait for all scripts to load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  initMobileMenu();
  initHeaderScroll();
  initStaggerHeadings();
  initScrollReveal();
  initCounters();
  initGallery();
  initFAQ();
  initDonationAmounts();
  initSmoothScroll();
  initProjects();
  initPrograms();
  initPartnerForm();
  initDonationForm();
  initContactForm();
  
  // Custom added functions
  initThemeSwitcher();
  initPlannerModal();
});

// Re-initialize lucide icons after page fully loads (backup)
window.addEventListener('load', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// ============ MOBILE MENU ============
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ============ HEADER SCROLL ============
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ============ TEXT STAGGER ANIMATION (GSAP) ============
function initStaggerHeadings() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const headings = document.querySelectorAll('h1.stagger-text, h2.stagger-text');

  headings.forEach(heading => {
    // Split text into words, then characters
    const text = heading.textContent;
    heading.innerHTML = '';

    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('word-wrap');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'hidden';
      wordSpan.style.verticalAlign = 'top';

      const chars = word.split('');
      chars.forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.classList.add('char');
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        wordSpan.appendChild(charSpan);
      });

      heading.appendChild(wordSpan);

      // Add space between words
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.display = 'inline-block';
        heading.appendChild(space);
      }
    });

    const allChars = heading.querySelectorAll('.char');

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(allChars,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    } else {
      gsap.fromTo(allChars,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.3
        }
      );
    }
  });
}

// ============ SCROLL REVEAL ============
function initScrollReveal() {
  if (typeof gsap === 'undefined') return;

  const reveals = document.querySelectorAll('.reveal, .work-card, .about-grid');

  if (typeof ScrollTrigger !== 'undefined') {
    reveals.forEach(el => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  } else {
    // Fallback: IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
  }
}

// ============ COUNTER ANIMATION ============
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

// ============ FAQ ACCORDION ============
function initFAQ() {}
function initDonationAmounts() {}
function initProjects() {}
function initPrograms() {}
function initPartnerForm() {}
function initDonationForm() {}
function initGallery() {}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href') === '#') return;
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============ CONTACT FORM ============
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    if (!name.value.trim()) {
      document.getElementById('nameError').style.display = 'block';
      document.getElementById('nameError').innerText = 'Name cannot be empty';
      valid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      document.getElementById('emailError').style.display = 'block';
      document.getElementById('emailError').innerText = 'Please enter a valid email address';
      valid = false;
    }
    
    const phoneRegex = /^\d+$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value)) {
      document.getElementById('phoneError').style.display = 'block';
      document.getElementById('phoneError').innerText = 'Phone number must contain only digits';
      valid = false;
    }
    
    if (!message.value.trim()) {
      document.getElementById('messageError').style.display = 'block';
      document.getElementById('messageError').innerText = 'Message cannot be empty';
      valid = false;
    }
    
    if (valid) {
      alert('Form submitted successfully!');
      contactForm.reset();
    }
  });
}

// ============ THEME SWITCHER ============
function initThemeSwitcher() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  function setTheme(mode) {
    if (mode === 'dark') {
      body.classList.add('dark');
      if (themeToggle) themeToggle.innerHTML = '<i data-lucide="moon"></i>';
    } else {
      body.classList.remove('dark');
      if (themeToggle) themeToggle.innerHTML = '<i data-lucide="sun"></i>';
    }
    localStorage.setItem('site-theme', mode);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  const savedTheme = localStorage.getItem('site-theme') || 'light';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(body.classList.contains('dark') ? 'light' : 'dark');
    });
  }
}

// ============ PLANNER MODAL ============
function initPlannerModal() {
  const addBtn = document.getElementById('addActivityBtn');
  const modal = document.getElementById('plannerModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const plannerForm = document.getElementById('plannerForm');
  const taskList = document.getElementById('taskList');
  const modalTitle = document.querySelector('.modal-title');

  if (!addBtn || !modal || !plannerForm) return;

  let tasks = [];
  let editingId = null;

  // Render Tasks
  function renderTasks() {
    const emptyState = document.getElementById('emptyState');
    if (tasks.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      taskList.style.display = 'none';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      taskList.style.display = 'block';
    }

    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      if (task.status === 'Completed') li.classList.add('completed');
      
      li.innerHTML = `
        <div class="task-details" style="flex: 1;">
          <div style="font-weight: 500; font-size: 1.1rem; margin-bottom: 0.4rem;">
            ${escapeHTML(task.title)}
            <span style="font-size: 0.75rem; padding: 0.2rem 0.5rem; background: var(--surface-strong); border-radius: 4px; margin-left: 0.5rem; font-weight: normal;">${escapeHTML(task.status)}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 0.4rem;">
            ${task.date ? `<strong>Date:</strong> ${escapeHTML(task.date)}` : ''} 
            ${task.time ? `&nbsp;&nbsp;<strong>Time:</strong> ${escapeHTML(task.time)}` : ''}
          </div>
          <div style="font-size: 0.9rem; color: var(--muted);">${escapeHTML(task.description)}</div>
        </div>
        <div class="task-actions" style="display: flex; gap: 0.5rem;">
          <button class="edit-btn" data-id="${task.id}" title="Edit"><i data-lucide="edit"></i></button>
          <button class="delete-btn" data-id="${task.id}" title="Delete"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      taskList.appendChild(li);
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Attach Edit Listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.getAttribute('data-id'));
        openEditModal(id);
      });
    });

    // Attach Delete Listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.getAttribute('data-id'));
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
      });
    });
  }

  function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    editingId = id;
    if(modalTitle) modalTitle.textContent = 'Edit Activity';
    
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescInput = document.getElementById('taskDesc');
    const taskDateInput = document.getElementById('taskDate');
    const taskTimeInput = document.getElementById('taskTime');
    const taskStatusInput = document.getElementById('taskStatus');

    if(taskTitleInput) taskTitleInput.value = task.title;
    if(taskDescInput) taskDescInput.value = task.description;
    if(taskDateInput) taskDateInput.value = task.date;
    if(taskTimeInput) taskTimeInput.value = task.time;
    if(taskStatusInput) taskStatusInput.value = task.status;
    
    modal.classList.add('active');
  }

  addBtn.addEventListener('click', () => {
    editingId = null;
    if(modalTitle) modalTitle.textContent = 'Add New Activity';
    plannerForm.reset();
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  plannerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescInput = document.getElementById('taskDesc');
    const taskDateInput = document.getElementById('taskDate');
    const taskTimeInput = document.getElementById('taskTime');
    const taskStatusInput = document.getElementById('taskStatus');

    const title = taskTitleInput ? taskTitleInput.value.trim() : '';
    const description = taskDescInput ? taskDescInput.value.trim() : '';
    const date = taskDateInput ? taskDateInput.value : '';
    const time = taskTimeInput ? taskTimeInput.value : '';
    const status = taskStatusInput ? taskStatusInput.value : 'Not Started';
    
    if (title) {
      if (editingId !== null) {
        // Update existing
        const task = tasks.find(t => t.id === editingId);
        if (task) {
          task.title = title;
          task.description = description;
          task.date = date;
          task.time = time;
          task.status = status;
        }
      } else {
        // Create new
        tasks.push({
          id: Date.now(),
          title,
          description,
          date,
          time,
          status
        });
      }
      
      plannerForm.reset();
      modal.classList.remove('active');
      renderTasks();
    }
  });

  // tasks.push({
  //   id: Date.now(),
  //   title: "Final Web Project",
  //   description: "Complete all the requirements for COS 106 including the responsiveness and full CRUD planner.",
  //   date: "2026-07-15",
  //   time: "23:59",
  //   status: "In Progress"
  // });
  renderTasks();
}
