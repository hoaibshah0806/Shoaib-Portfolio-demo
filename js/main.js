/**
 * Main Application Orchestrator
 * Integrates GSAP ScrollTrigger, Typewriter, Bento Hover Spotlight, and XP rewards.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Register GSAP ScrollTrigger
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    initGsapAnimations();
  }

  initTypewriter();
  initBentoSpotlight();
  initQuestSystem();
  initSplineToggle();
  initStatCounters();
});

/**
 * Typewriter effect for Hero section System Notice
 */
function initTypewriter() {
  const el = document.getElementById('hero-typewriter');
  if (!el) return;

  const text = '[System Notice: Player Mohammed Shoaib Shah has logged in.]';
  let index = 0;
  el.textContent = '';

  function typeNext() {
    if (index < text.length) {
      el.textContent += text.charAt(index);
      index++;
      // Subtle audio feedback on certain characters
      if (index % 4 === 0 && window.systemAudio) {
        window.systemAudio.playClick();
      }
      setTimeout(typeNext, 45);
    } else {
      // Awakening notification chime upon completion
      if (window.systemAudio) {
        window.systemAudio.playAlert();
      }
    }
  }

  setTimeout(typeNext, 500);
}

/**
 * GSAP ScrollTrigger Animations
 */
function initGsapAnimations() {
  // 1. Hero Content Entrance
  gsap.from('.hero-badge', {
    opacity: 0,
    y: -25,
    duration: 0.9,
    ease: 'power3.out'
  });

  gsap.from('.hero-title', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  });

  gsap.from('.hero-cta-group', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.5,
    ease: 'power2.out'
  });

  // 2. Status Window Scroll-triggered Pop-up
  gsap.from('#status-window', {
    scrollTrigger: {
      trigger: '#status-window',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    scale: 0.88,
    opacity: 0,
    y: 45,
    duration: 1.1,
    ease: 'back.out(1.4)',
    onStart: () => {
      if (window.systemAudio) window.systemAudio.playAlert();
      animateStatGauges();
    }
  });

  // 3. Bento Box Inventory Cards Staggered Reveal
  gsap.from('.bento-card', {
    scrollTrigger: {
      trigger: '#inventory',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 35,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power2.out'
  });

  // 4. Quest Log - Slide in from Left and Right Alternately!
  const questCards = document.querySelectorAll('.quest-item');
  questCards.forEach((card, i) => {
    const isEven = i % 2 === 0;
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: isEven ? -80 : 80,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    });
  });

  // 5. System Terminal Reveal
  gsap.from('#terminal-container', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out'
  });
}

/**
 * Animate the Stat Window attribute gauge progress bars
 */
function animateStatGauges() {
  document.querySelectorAll('[data-stat-width]').forEach((bar) => {
    const targetWidth = bar.getAttribute('data-stat-width');
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 200);
  });
}

/**
 * Bento Box mouse spotlight / particle glow tracking inside each card
 */
function initBentoSpotlight() {
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach((card) => {
    const spotlight = card.querySelector('.spotlight');
    if (!spotlight) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.left = `${x}px`;
      spotlight.style.top = `${y}px`;
    });
  });
}

/**
 * Quest Acceptance and XP Counter System
 */
let totalPlayerXp = 48500;
function initQuestSystem() {
  const questBtns = document.querySelectorAll('.btn-accept-quest');
  const xpCounterEl = document.getElementById('player-xp-counter');
  const alertToast = document.getElementById('system-toast');
  const toastMessage = document.getElementById('toast-message');

  questBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const questTitle = btn.getAttribute('data-quest-name') || 'Quest';
      const xpReward = parseInt(btn.getAttribute('data-quest-xp') || '2500', 10);

      // Play Level up / Quest fanfare sound
      if (window.systemAudio) {
        window.systemAudio.playQuestAccept();
      }

      // Increment XP
      totalPlayerXp += xpReward;
      if (xpCounterEl) {
        xpCounterEl.textContent = totalPlayerXp.toLocaleString();
        xpCounterEl.classList.add('text-system-cyan', 'scale-110');
        setTimeout(() => xpCounterEl.classList.remove('scale-110'), 300);
      }

      // Update button status
      btn.innerHTML = `<span class="flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4"></i> QUEST ACTIVE</span>`;
      btn.classList.remove('btn-system');
      btn.classList.add('bg-cyan-900/60', 'text-cyan-200', 'border-cyan-400', 'pointer-events-none');
      if (window.lucide) window.lucide.createIcons();

      // Show System Toast
      if (alertToast && toastMessage) {
        toastMessage.innerHTML = `[SYSTEM]: Quest Accepted: <strong class="text-system-cyan">${questTitle}</strong>. <strong>+${xpReward} XP</strong> added to player profile!`;
        alertToast.classList.remove('translate-y-24', 'opacity-0');
        alertToast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
          alertToast.classList.add('translate-y-24', 'opacity-0');
          alertToast.classList.remove('translate-y-0', 'opacity-100');
        }, 4500);
      }
    });
  });
}

/**
 * 3D Dagger vs Spline 3D Viewer Switcher
 */
function initSplineToggle() {
  const btnDagger = document.getElementById('toggle-view-dagger');
  const btnSpline = document.getElementById('toggle-view-spline');
  const containerDagger = document.getElementById('dagger-3d-view');
  const containerSpline = document.getElementById('spline-3d-view');

  if (!btnDagger || !btnSpline || !containerDagger || !containerSpline) return;

  btnDagger.addEventListener('click', () => {
    btnDagger.classList.add('bg-system-cyan/20', 'border-system-cyan', 'text-white');
    btnDagger.classList.remove('text-gray-400');
    btnSpline.classList.remove('bg-system-cyan/20', 'border-system-cyan', 'text-white');
    btnSpline.classList.add('text-gray-400');

    containerDagger.classList.remove('hidden');
    containerSpline.classList.add('hidden');
    if (window.systemAudio) window.systemAudio.playClick();
  });

  btnSpline.addEventListener('click', () => {
    btnSpline.classList.add('bg-system-cyan/20', 'border-system-cyan', 'text-white');
    btnSpline.classList.remove('text-gray-400');
    btnDagger.classList.remove('bg-system-cyan/20', 'border-system-cyan', 'text-white');
    btnDagger.classList.add('text-gray-400');

    containerSpline.classList.remove('hidden');
    containerDagger.classList.add('hidden');
    if (window.systemAudio) window.systemAudio.playClick();
  });
}

/**
 * Animated dynamic stat counters (HP/MP)
 */
function initStatCounters() {
  const mpEl = document.getElementById('nav-mp-counter');
  if (!mpEl) return;

  let currentMp = 98400;
  setInterval(() => {
    // Subtle mana fluctuation
    const delta = (Math.random() - 0.45) * 80;
    currentMp = Math.min(100000, Math.max(95000, currentMp + delta));
    mpEl.textContent = `${Math.floor(currentMp).toLocaleString()} / 100,000`;
  }, 2500);
}
