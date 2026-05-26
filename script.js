/* =====================================================
   PORTFOLIO — JAVASCRIPT
   Custom cursor, scroll reveal, counter animation,
   sticky navbar, smooth interactions
===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Sticky Navbar ────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ─── Mobile Nav Toggle ────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const btnBook   = document.querySelector('.btn-book');

  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // ─── Scroll Reveal ────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.about-grid, .portfolio-item, .exp-item, .work-card, .blog-card, .exp-header, .cta-content, .contact-heading, .contact-sub, .btn-book-large, .section-header-row'
  );
  
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ─── Counter Animation ────────────────────────────
  function animateCounter(el, target, prefix = '+', suffix = '') {
    const duration = 1800;
    const start = performance.now();
    
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(ease * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Hero stats counters
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const statsSection = document.querySelector('.hero-stats');
  
  let heroCountersDone = false;
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !heroCountersDone) {
      heroCountersDone = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target);
        animateCounter(el, target, '+');
      });
    }
  }, { threshold: 0.5 });
  
  if (statsSection) heroObserver.observe(statsSection);

  // About big stat
  const bigNumber = document.querySelector('.big-number[data-target]');
  let bigCounterDone = false;
  const bigObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !bigCounterDone) {
      bigCounterDone = true;
      if (bigNumber) animateCounter(bigNumber, parseInt(bigNumber.dataset.target), '', '');
    }
  }, { threshold: 0.5 });

  const aboutSection = document.querySelector('.about');
  if (aboutSection) bigObserver.observe(aboutSection);

  // ─── Smooth Scroll ────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          navToggle?.classList.remove('active');
        }
      }
    });
  });

  // ─── Portfolio hover radial gradient ─────────────
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const overlay = item.querySelector('.portfolio-overlay');
      if (overlay) {
        overlay.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(34,34,34,0.5), rgba(34,34,34,0.3))`;
      }
    });
  });

  // ─── Experience items staggered ───────────────────
  const expItems = document.querySelectorAll('.exp-item');
  expItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
  });

  // ─── Scroll down button ────────────────────────────
  const scrollBtn = document.getElementById('hero-scroll');
  scrollBtn?.addEventListener('click', () => {
    const about = document.getElementById('about');
    about?.scrollIntoView({ behavior: 'smooth' });
  });

  // ─── Tilt effect on work cards ────────────────────
  const workCards = document.querySelectorAll('.work-card, .blog-card');
  workCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });

  // ─── Page load fade ───────────────────────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);

  // ─── Active nav link highlight ────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinkEls.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = '#222222';
        link.style.fontWeight = '500';
      } else {
        link.style.fontWeight = '400';
      }
    });
  }, { passive: true });

  // ─── Portfolio Modal Manager ─────────────────────────
  const projectModal = document.getElementById('project-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalBody = document.getElementById('modal-body');

  const projectDetails = {
    'symfonos5': {
      category: 'Penetration Testing',
      title: '🔐 Penetration Testing Lab Completed — Symfonos 5',
      image: 'symfonos5.jpg',
      linkText: 'Explore TryHackMe Profile ↗',
      linkUrl: 'https://tryhackme.com/p/Diken2221',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Role</span>
            <span class="modal-meta-value">Security Auditor / Pentester</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Environment</span>
            <span class="modal-meta-value">TryHackMe Vuln Machine</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Focus Area</span>
            <span class="modal-meta-value">Offensive Security &amp; PrivEsc</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Tools Leveraged</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">Nmap</span>
              <span class="modal-tech-badge">Dirb</span>
              <span class="modal-tech-badge">LDAPSearch</span>
              <span class="modal-tech-badge">SSH</span>
              <span class="modal-tech-badge">GTFOBins</span>
            </div>
          </div>
        </div>

        <p>Successfully performed a full attack chain against the <strong>Symfonos 5</strong> vulnerable machine, progressing systematically from initial network reconnaissance to root-level system access. This lab served as a rigorous test of offensive methodology and privilege escalation techniques.</p>

        <h3>Key Stages of the Assessment</h3>
        
        <h4>1. Enumeration &amp; Service Discovery</h4>
        <p>Initiated the engagement with comprehensive <code>Nmap</code> scanning to map active services. Identified several exposed ports including HTTP (Web Server), LDAP (Directory Services), and SMB (File Sharing).</p>

        <h4>2. LDAP Authentication Bypass</h4>
        <p>Discovered a misconfigured LDAP service allowing anonymous bind directory queries. Extracted a full user list and administrative configuration structures using targeted <code>ldapsearch</code> commands.</p>

        <h4>3. Local File Inclusion (LFI) Exploitation</h4>
        <p>Probed the web application running on HTTP and identified a Local File Inclusion (LFI) vulnerability. Exploited the input parameter to bypass basic validation filters, allowing readable system files extraction like <code>/etc/passwd</code>.</p>

        <h4>4. SSH Foothold Acquisition</h4>
        <p>Chained the LFI vulnerability with credential logs extracted from LDAP and file directories to identify valid SSH user credentials. Logged into the target system via SSH, establishing a secure low-privilege shell foothold.</p>

        <h4>5. Privilege Escalation via GTFOBins</h4>
        <p>Conducted local system enumeration to discover SUID binaries. Located a system binary with elevated permissions that had known execution weaknesses. Exploited the binary using custom <code>GTFOBins</code> shell escape instructions to spawn a fully interactive administrative <code>root</code> shell.</p>

        <h3>Key Takeaways &amp; Hardening</h3>
        <ul>
          <li><strong>Secure authentication mechanisms:</strong> Ensure LDAP services are configured to deny anonymous binding and require secure channel authentication.</li>
          <li><strong>Proper input validation:</strong> Sanitize all web inputs strictly to protect against directory traversal and LFI attacks.</li>
          <li><strong>Principle of least privilege:</strong> Audit and restrict SUID permissions on administrative system binaries to eliminate privilege escalation vectors.</li>
          <li><strong>Continuous security hardening:</strong> Patch systems regularly and disable unneeded services to minimize the attack surface.</li>
        </ul>
      `
    },
    'spam-detection': {
      category: 'Machine Learning',
      title: '📧 Email Spam Detection via Machine Learning & NLP',
      image: 'spam_detection.jpg',
      linkText: 'View Github Repository ↗',
      linkUrl: 'https://github.com/diken2221',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Role</span>
            <span class="modal-meta-value">ML &amp; NLP Developer</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Dataset</span>
            <span class="modal-meta-value">Enron &amp; Public SMS/Email Corpora</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Target Metric</span>
            <span class="modal-meta-value">98.2% Precision (Min False Positives)</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Tech Stack</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">Python</span>
              <span class="modal-tech-badge">Scikit-Learn</span>
              <span class="modal-tech-badge">NLTK</span>
              <span class="modal-tech-badge">Pandas</span>
              <span class="modal-tech-badge">TF-IDF</span>
            </div>
          </div>
        </div>

        <p>Built a robust, production-capable text classifier pipeline designed to filter out spam emails while strictly avoiding false positives (preventing legitimate emails from getting lost). Leveraged advanced Natural Language Processing (NLP) techniques and supervised machine learning classifiers.</p>

        <h3>System Pipeline &amp; Features</h3>

        <h4>1. NLP Preprocessing &amp; Text Tokenization</h4>
        <p>Converted raw, noisy email text strings into clean structures. Implemented case-folding, removed HTML fragments, eliminated stopwords, and applied Porter Stemming via the NLTK library to reduce words to their core semantic roots (e.g., "running" to "run").</p>

        <h4>2. Feature Engineering &amp; TF-IDF Weights</h4>
        <p>Transformed processed words into quantitative numerical features using Term Frequency-Inverse Document Frequency (TF-IDF) vectorization. Evaluated character ratios, blacklisted keyword frequency, and uppercase count patterns to construct robust classifier inputs.</p>

        <h4>3. Supervised Classifiers &amp; Optimization</h4>
        <p>Trained and cross-validated multiple candidate models including <strong>Multinomial Naive Bayes</strong>, <strong>Support Vector Classifiers (SVC)</strong>, and <strong>Random Forest</strong>. Optimized hyperparameters to achieve high performance across training and validation sets.</p>

        <h4>4. High-Precision Evaluation Results</h4>
        <p>Prioritized precision over recall to maintain high usability (i.e. zero false positives). The Naive Bayes model emerged as the top performer, delivering a precision rate of <strong>98.2%</strong> and a recall rate of <strong>94.5%</strong>.</p>

        <h3>Core Outcomes &amp; Insights</h3>
        <ul>
          <li>Enhanced understanding of text vector space modeling and high-dimensional sparse matrix operations.</li>
          <li>Learned the architectural differences of supervised algorithms in handling high-dimensional text datasets.</li>
          <li>Implemented clean code practices to package the NLP pipeline into reusable modular modules for direct integration.</li>
        </ul>
      `
    },
    'trackmyplate': {
      category: 'AI & Web Applications',
      title: '🌟 TrackMyPlate — AI Food Photo Analysis & Calorie Tracker',
      image: 'trackmyplate.png',
      linkText: 'View Github Repository ↗',
      linkUrl: 'https://github.com/diken2221',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Role</span>
            <span class="modal-meta-value">Fullstack &amp; AI Engineer</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">API Latency</span>
            <span class="modal-meta-value">&lt; 400ms Response Time</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Main Feature</span>
            <span class="modal-meta-value">Groq + Llama 3 Vision + WebGL Live2D</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Tech Stack</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">Llama 3 Vision</span>
              <span class="modal-tech-badge">Groq Cloud API</span>
              <span class="modal-tech-badge">Live2D Web SDK</span>
              <span class="modal-tech-badge">IndexedDB</span>
              <span class="modal-tech-badge">Chart.js</span>
            </div>
          </div>
        </div>

        <p>Created an innovative macro-tracking web application designed to eliminate manual food logging friction. Users upload photos of their plates, and multi-modal AI immediately parses ingredients, portion weights, and macronutrient content, rendering a responsive web dashboard with a virtual interactive health coach.</p>

        <h3>Technical Architecture Features</h3>

        <h4>1. Ultra-fast Llama 3 Vision Integration</h4>
        <p>Leveraged the advanced multi-modal Llama 3 Vision model running over Groq's high-speed inference cloud. Programmed structured prompt systems returning strict, verified JSON datasets containing parsed ingredients, estimated weights, protein, carbs, fats, and total calories in under 400ms.</p>

        <h4>2. WebGL Live2D Interactive Avatar Coach</h4>
        <p>Integrated the Live2D Web SDK to display a beautiful virtual health coach. The character dynamically tracks mouse movement, blinks, changes facial expressions based on food health scores, and communicates via text-to-speech to provide interactive macro advice.</p>

        <h4>3. Local Browser Database &amp; Data Visualization</h4>
        <p>Engineered offline data persistence using browser-native <strong>IndexedDB</strong> to store meals, user profiles, and daily goals. Leveraged <strong>Chart.js</strong> to render smooth, animated weekly macros and calorie progression graphs.</p>

        <h3>Key Accomplishments &amp; Learning Outcomes</h3>
        <ul>
          <li>Mastered vision-language API engineering, structured prompt constraints, and validation systems.</li>
          <li>Optimized rendering pipelines for the WebGL-based Live2D avatar, ensuring 60FPS fluid interactions on mobile screens.</li>
          <li>Created a clean, dark, responsive user interface utilizing CSS grid layers and micro-interactions.</li>
        </ul>
      `
    },
    'attendo': {
      category: 'Biometrics / Firebase',
      title: '📋 Attendo — Face Recognition &amp; Geolocation Attendance System',
      image: 'attendo_ui.png',
      linkText: 'View Github Repository ↗',
      linkUrl: 'https://github.com/diken2221',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Role</span>
            <span class="modal-meta-value">Lead Web Developer</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Framework</span>
            <span class="modal-meta-value">Single-File Serverless Prototype</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Database</span>
            <span class="modal-meta-value">Firebase Firestore</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Libraries</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">face-api.js</span>
              <span class="modal-tech-badge">Tailwind CSS</span>
              <span class="modal-tech-badge">Chart.js</span>
              <span class="modal-tech-badge">Firebase v11</span>
            </div>
          </div>
        </div>

        <p><strong>Attendo</strong> is a fully functional web-based attendance management system that automates student attendance tracking using Face Recognition and Geolocation verification. It runs entirely as a high-performance browser-native prototype, syncing real-time records.</p>

        <h3>Core Architecture &amp; Tech Stack</h3>
        
        <h4>1. Client-Side Face Recognition</h4>
        <p>Leveraged <code>face-api.js</code> to perform face authentication locally within the client browser. Students register and verify identity by scanning their faces via the web camera stream, eliminating external server processing lag.</p>

        <h4>2. Geolocation Spoof Prevention</h4>
        <p>Implemented HTML5 Geolocation validation requiring students to be within <strong>500 meters</strong> of the faculty member to mark attendance, successfully blocking remote proxy log-ins.</p>

        <h4>3. Real-time Firebase Sync</h4>
        <p>Integrated Firebase Firestore to establish real-time listeners. Timetables, sessions, and roster presence lists synchronize immediately across admin, faculty, and student dashboard layouts.</p>

        <h4>4. Analytics and Visual Reporting</h4>
        <p>Integrated <code>Chart.js</code> to render real-time visualizations. Faculty and admin accounts can view attendance trends, department breakdowns, and performance hierarchies, with options to export directly as PDF and CSV formats.</p>

        <h3>Features &amp; User Roles</h3>
        <ul>
          <li><strong>Admin Dashboard:</strong> Manage student rosters, faculty accounts, timetables, and system-wide configurations.</li>
          <li><strong>Faculty Controls:</strong> Open lecture sessions, view student presence live, schedule timetables, and toggle auto-start states.</li>
          <li><strong>Student Portal:</strong> Scan face to log in, view personal attendance logs, and mark attendance in active lectures.</li>
        </ul>
      `
    },
    'webchat': {
      category: 'Web Apps / WebSockets',
      title: '💬 WebChat — Real-time Messaging Web Application',
      image: 'webchat_ui.png',
      linkText: 'View Github Repository ↗',
      linkUrl: 'https://github.com/diken2221',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Role</span>
            <span class="modal-meta-value">Frontend &amp; DB Architect</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Backend</span>
            <span class="modal-meta-value">Firebase v11.6.1</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Format</span>
            <span class="modal-meta-value">Single-Page Application (SPA)</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Features</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">Google Auth</span>
              <span class="modal-tech-badge">QR Scanning</span>
              <span class="modal-tech-badge">Disappearing Msgs</span>
              <span class="modal-tech-badge">Firestore Listeners</span>
            </div>
          </div>
        </div>

        <p><strong>WebChat</strong> is a fully-featured, real-time messaging application built as a single-page HTML file. It provides a modern, clean interface for one-on-one conversations, group chats, and contact management using Firebase as its backend.</p>

        <h3>Application Features &amp; Capabilities</h3>
        
        <h4>1. Authentication &amp; Profile Generation</h4>
        <p>Integrated Google Sign-in for secure login. Upon registration, users are automatically assigned a unique 6-character WebChat ID alongside a dynamically rendered local QR code for fast friending.</p>

        <h4>2. Real-time Messaging Sync</h4>
        <p>Leveraged Firestore real-time collection listeners to synchronize messages with zero latency. Features username aliases for group chats, live unread message counters, seen receipts, and batch deletion pipelines.</p>

        <h4>3. Social and Nickname Controls</h4>
        <p>Enabled direct friend requests, custom contact nicknames, group creation, QR scanning, disappearing message schedules (90 seconds, 24 hours, or 7 days), and selective user blocking.</p>

        <h4>4. Rich UI UX Interactions</h4>
        <p>Styled with Tailwind CSS. Includes disappearing message indicators, animated text bubbles, toast notifications, right-click custom context menus (copy, forward, share), and double-click to reply to messages.</p>

        <h3>Core Takeaways</h3>
        <ul>
          <li>Optimized Firebase batch operations for local data deletion and state cleanup.</li>
          <li>Mastered Firestore listener scaling and real-time state management in vanilla JS.</li>
          <li>Designed a highly modern, fully responsive UI from a single HTML document structure.</li>
        </ul>
      `
    },
    'breast-cancer': {
      category: 'Deep Learning / PyTorch',
      title: '🎗️ Breast Cancer Classification PyTorch Neural Network',
      image: 'breast_cancer_dl.png',
      linkText: 'View Github Repository ↗',
      linkUrl: 'https://github.com/diken2221/Breast-Cancer-Prediction-using-Deep-Learning',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Role</span>
            <span class="modal-meta-value">Deep Learning Engineer</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Framework</span>
            <span class="modal-meta-value">PyTorch &amp; Python</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Model Type</span>
            <span class="modal-meta-value">Binary Classifier NN</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Libraries</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">PyTorch</span>
              <span class="modal-tech-badge">Scikit-Learn</span>
              <span class="modal-tech-badge">Pandas</span>
              <span class="modal-tech-badge">Matplotlib</span>
            </div>
          </div>
        </div>

        <p>This project focuses on building a breast cancer classification model using PyTorch, where the main goal was to understand the full machine learning workflow—not just training a model, but handling real medical data properly and analyzing network behaviors.</p>

        <h3>Technical Workflow Stages</h3>
        
        <h4>1. Medical Data Preprocessing</h4>
        <p>Loaded and scaled real-world medical diagnostic parameters using Scikit-Learn's StandardScaler. Split datasets into training and testing arrays, maintaining clean class balance limits.</p>

        <h4>2. Neural Network from Scratch</h4>
        <p>Designed a custom feedforward neural network architecture in PyTorch. Defined layer connections, input dimension limits, ReLU activation functions, and Sigmoid probability distributions.</p>

        <h4>3. Propagation and Gradient Tuning</h4>
        <p>Constructed complete training loops implementing forward passes, Binary Cross-Entropy (BCE) loss calculations, backward passes to compute gradients, and optimizer parameter updates using the Adam optimizer.</p>

        <h4>4. Validation &amp; Boundary Analysis</h4>
        <p>Analyzed model predictions against test sets, evaluating classification confusion matrices. Tracked overall precision to recognize exactly where the model generalizes well and where model boundaries fail.</p>

        <h3>Project Notes</h3>
        <ul>
          <li><strong>Educational focus:</strong> Developed strictly for educational purposes, focusing on PyTorch modular designs.</li>
          <li><strong>Not for clinical use:</strong> This model is strictly a research project and is not intended for active clinical medical diagnostics.</li>
        </ul>
      `
    },
    'active-directory': {
      category: 'SysAdmin / Security',
      title: '🖥️ Active Directory System Management &amp; Security Hardening Practical',
      image: 'active_directory_lab.png',
      linkText: 'Explore TryHackMe Profile ↗',
      linkUrl: 'https://tryhackme.com/p/Diken2221',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Role</span>
            <span class="modal-meta-value">Systems Administrator</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Environment</span>
            <span class="modal-meta-value">Windows Server 2022 Lab</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Deployment</span>
            <span class="modal-meta-value">Domain Controller Deployment</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Focus Areas</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">Active Directory</span>
              <span class="modal-tech-badge">Group Policies</span>
              <span class="modal-tech-badge">DNS &amp; DHCP</span>
              <span class="modal-tech-badge">Server Hardening</span>
              <span class="modal-tech-badge">TryHackMe Validated</span>
            </div>
          </div>
        </div>

        <p>Designed and deployed an enterprise-grade systems engineering lab focused on Windows Server Active Directory (AD DS) setup, domain organization policies, network services configuration, and robust security hardening. <strong>This network security deployment practical is validated under TryHackMe security training frameworks.</strong></p>

        <h3>Core Engineering Tasks</h3>
        
        <h4>1. Domain Controller Deployment</h4>
        <p>Configured Windows Server 2022 to host a centralized Active Directory Domain Services (AD DS) controller. Programmed secure core network infrastructures including localized DNS zones and structured DHCP scope mappings.</p>

        <h4>2. Organizational Units &amp; User Roster</h4>
        <p>Structured secure Organizational Unit (OU) trees in the directory. Created distinct department objects, populated standard user groups, and configured administrative permission tiers (enforcing strict separation between standard users and Domain Admins).</p>

        <h4>3. Security Hardening via Group Policies (GPOs)</h4>
        <p>Designed and applied rigorous Group Policy Objects (GPOs) across the forest:
          <ul>
            <li>Enforced strict account lockout thresholds and password complexity parameters.</li>
            <li>Disabled insecure protocols (SMBv1, LLMNR, NetBIOS) to protect against local network spoofing.</li>
            <li>Configured granular audit policy logs tracking domain login events and permission modifications.</li>
            <li>Locked down user client workstations by restricting unauthorized administrative command access.</li>
          </ul>
        </p>

        <h4>4. Workstation Domain Joining</h4>
        <p>Secured local network client setups, joining guest Windows workstations to the centralized AD domain, and validating administrative GPO inheritance blocks.</p>

        <h3>TryHackMe Verification</h3>
        <p>✔️ This lab forms a core milestone of my systems administrator learning journey, fully integrated with TryHackMe network auditing modules to practice configuration assessments and active directory domain vulnerability scanning techniques.</p>
      `
    },
    'score-predictor': {
      category: 'Machine Learning',
      title: '📊 Student Score Predictor using Linear Regression',
      image: 'score_predictor.png',
      linkText: 'View Github Repository ↗',
      linkUrl: 'https://github.com/diken2221',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Role</span>
            <span class="modal-meta-value">Data Scientist</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Algorithm</span>
            <span class="modal-meta-value">Ordinary Least Squares Regression</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Library</span>
            <span class="modal-meta-value">Scikit-Learn (Python)</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Tech Stack</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">Python</span>
              <span class="modal-tech-badge">Scikit-Learn</span>
              <span class="modal-tech-badge">Pandas</span>
              <span class="modal-tech-badge">NumPy</span>
            </div>
          </div>
        </div>

        <p>Built a simple, efficient supervised machine learning model that predicts a student's exam score based on daily study hours using Linear Regression from scikit-learn, demonstrating robust regression foundations.</p>

        <h3>Technical Highlights</h3>
        
        <h4>1. Pandas Data Pipeline</h4>
        <p>Implemented structured data loading, formatting, and feature parsing using Python's Pandas. Handled missing records and scaled metrics cleanly for model input.</p>

        <h4>2. Linear Regression Model Training</h4>
        <p>Trained an ordinary least squares linear regression model via Scikit-Learn, mapping the relationship coefficient between study duration features and test results.</p>

        <h4>3. Safe Output Validation Rules</h4>
        <p>Engineered mathematical validation filters to cap predictions at a maximum score of <code>100</code>, successfully avoiding infinite regression predictions on excessive input hours.</p>

        <h4>4. Real-time User Input Predictions</h4>
        <p>Developed a clean, interactive Python terminal script prompting user inputs for daily study hours and immediately outputting the validated predicted test score.</p>
      `
    },
    'thm-portfolio': {
      category: 'Cybersecurity / CTFs',
      title: '🚩 TryHackMe Cybersecurity CTF Labs solved portfolio',
      image: 'project4.png',
      linkText: 'Explore TryHackMe Profile ↗',
      linkUrl: 'https://tryhackme.com/p/Diken2221',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Platform</span>
            <span class="modal-meta-value">TryHackMe (15+ Rooms Solved)</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Focus Area</span>
            <span class="modal-meta-value">Penetration Testing &amp; CTFs</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Username</span>
            <span class="modal-meta-value">Diken2221</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Skills Leveraged</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">Enumeration</span>
              <span class="modal-tech-badge">PrivEsc</span>
              <span class="modal-tech-badge">Wireshark</span>
              <span class="modal-tech-badge">Nmap / Metasploit</span>
            </div>
          </div>
        </div>

        <p>An extensive, hands-on portfolio showcasing 15+ completed TryHackMe cybersecurity training rooms, capture the flag challenges, system audits, and offensive security learning labs.</p>

        <h3>Core Cybersecurity Domains Practiced</h3>
        
        <h4>1. Offensive Enumeration and Discovery</h4>
        <p>Completed multiple boxes requiring systematic port scanning, directory brute-forcing, server fingerprinting, and SMB/LDAP anonymous bind auditing.</p>

        <h4>2. Privilege Escalation (PrivEsc) Labs</h4>
        <p>Practiced Linux SUID binary abuses, cron job manipulation, Windows registry exploits, local security authority attacks, and GTFOBins escapes to systematically elevate privileges to administrative root levels.</p>

        <h4>3. Defensive Auditing &amp; Monitoring</h4>
        <p>Audited firewall logging rules, analyzed network packet captures via Wireshark, mapped active vulnerabilities, and researched secure configuration baselines.</p>
      `
    },
    'camphish': {
      category: 'Cybersecurity / Phishing',
      title: '🎣 CamPhish v2.0 — Geolocation &amp; Web Camera Phishing Awareness Tool',
      image: 'camphish_ui.png',
      linkText: 'View Github Repository ↗',
      linkUrl: 'https://github.com/diken2221',
      htmlContent: `
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="modal-meta-label">Role</span>
            <span class="modal-meta-value">Security Tool Adaptation Developer</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Environment</span>
            <span class="modal-meta-value">Windows / macOS / Linux Compatibility</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Tunneling Services</span>
            <span class="modal-meta-value">Ngrok &amp; Cloudflare Tunnels (TryCloudflare)</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">Tech Stack</span>
            <div class="modal-tech-badge-container">
              <span class="modal-tech-badge">Bash Scripting</span>
              <span class="modal-tech-badge">PHP Server</span>
              <span class="modal-tech-badge">JavaScript API</span>
              <span class="modal-tech-badge">Ngrok / Cloudflared</span>
            </div>
          </div>
        </div>

        <p><strong>CamPhish v2.0</strong> is an advanced, highly modular cybersecurity education and simulation script designed to demonstrate the critical importance of web camera permissions and browser geolocation data privacy in social engineering vectors.</p>

        <h3>Core Engineering Adjustments</h3>
        
        <h4>1. Native Windows Cross-Compatibility Layer</h4>
        <p>Developed full compatibility checks supporting Windows environment terminals (MINGW, MSYS, CYGWIN). Engineered custom Windows process management overrides using native <code>taskkill</code> parameters to replace Linux command loops, achieving clean cross-system execution.</p>

        <h4>2. Integrated Cloudflared &amp; Ngrok Tunnels</h4>
        <p>Programmed automatic architecture detection loops identifying CPU environments (x86_64, Arm64, i386, macOS Apple Silicon). Automatically downloads, extracts, configures, and invokes localized Cloudflared or Ngrok tunnel executables, generating active forwarding links instantly.</p>

        <h4>3. Geolocation &amp; Biometric Simulation Streams</h4>
        <p>Constructed a local PHP web hosting loop deploying simulated game templates (Head Controlled Game) or online business meetings (Online Meeting). Leveraged browser Geolocation APIs to demonstrate latitude, longitude, and accuracy coordinates extraction.</p>

        <h4>4. High-Fidelity Signal Handler Loops</h4>
        <p>Engineered comprehensive signal traps (trapping <code>SIGINT / Ctrl+C</code>) executing immediate environment teardowns: killing background PHP processes, terminating active tunnels, and cleaning local logs to prevent configuration leaks.</p>

        <h3>Key Objectives &amp; Hardening Takeaways</h3>
        <ul>
          <li>Demonstrates how easily multiple browser APIs (geolocation, video streams) can be combined to map physical assets if users grant broad site permissions.</li>
          <li>Reinforces the absolute need to enforce HTTPS protocols and review site access prompt limits carefully.</li>
        </ul>
      `
    }
  };

  function openModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalImage.src = data.image;
    modalImage.alt = data.title;
    
    let bodyHtml = data.htmlContent;
    if (data.linkUrl) {
      bodyHtml += `
        <div style="text-align: left; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px;">
          <a href="${data.linkUrl}" target="_blank" rel="noopener" class="modal-btn-action">
            ${data.linkText}
          </a>
        </div>
      `;
    }
    modalBody.innerHTML = bodyHtml;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  // Bind click listeners to grid items and work cards
  const portfolioGridItems = document.querySelectorAll('.portfolio-item, .work-card');
  portfolioGridItems.forEach(item => {
    const projectId = item.dataset.project;
    if (projectId) {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(projectId);
      });
    }
  });

  // ─── All Works Overlay Manager ─────────────────────
  const allWorksOverlay = document.getElementById('all-works-overlay');
  const overlayBackdrop = document.getElementById('overlay-backdrop');
  const overlayCloseBtn = document.getElementById('overlay-close-btn');
  
  // Triggers
  const navAllWorkLink = document.querySelector('.nav-link[href="#works"]');
  const btnExplore = document.getElementById('btn-explore');
  const ctaExploreAll = document.getElementById('cta-explore-all');

  function openAllWorksOverlay() {
    allWorksOverlay.classList.add('active');
    allWorksOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overlay-open');
  }

  function closeAllWorksOverlay() {
    allWorksOverlay.classList.remove('active');
    allWorksOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overlay-open');
  }

  // Bind click triggers
  navAllWorkLink?.addEventListener('click', (e) => {
    e.preventDefault(); // prevent anchor jump
    openAllWorksOverlay();
  });
  
  btnExplore?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAllWorksOverlay();
  });

  ctaExploreAll?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAllWorksOverlay();
  });

  overlayCloseBtn?.addEventListener('click', closeAllWorksOverlay);
  overlayBackdrop?.addEventListener('click', closeAllWorksOverlay);

  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  // Extend keyboard listener to close active layer on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('active')) {
        closeModal();
      } else if (allWorksOverlay && allWorksOverlay.classList.contains('active')) {
        closeAllWorksOverlay();
      }
    }
  });

  console.log('%c✦ Diken Mangukiya Portfolio', 'color: #222; font-size: 16px; font-weight: bold;');
  console.log('%cDesigned with ♥ — UI/UX Design Wizard', 'color: #7B7B7B; font-size: 12px;');
});

