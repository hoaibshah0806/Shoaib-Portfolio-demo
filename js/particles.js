/**
 * Solo Leveling Shadow Monarch Particle System
 * Realistic rising dark mana particles and electric blue sparks.
 */

class ShadowParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 55;
    this.mouse = { x: -1000, y: -1000, radius: 140 };
    
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle(bottomOnly = false) {
    const isElectric = Math.random() > 0.65;
    const isPurple = !isElectric;
    
    return {
      x: Math.random() * this.canvas.width,
      y: bottomOnly ? this.canvas.height + Math.random() * 20 : Math.random() * this.canvas.height,
      size: isElectric ? Math.random() * 2.2 + 0.8 : Math.random() * 4.5 + 2.0,
      speedY: -(Math.random() * 1.2 + 0.4),
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.65 + 0.25,
      maxOpacity: Math.random() * 0.75 + 0.25,
      fadeSpeed: Math.random() * 0.008 + 0.003,
      type: isElectric ? 'cyan' : 'purple',
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.05 + 0.02
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Pulse size & opacity
      p.pulse += p.pulseSpeed;
      const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.15;

      // Mouse repulsion/attraction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.mouse.radius) {
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        p.x -= (dx / distance) * force * 2.5;
        p.y -= (dy / distance) * force * 2.5;
      }

      // Move particle upwards (rising mana)
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.pulse) * 0.3;

      // Draw particle
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2);

      if (p.type === 'cyan') {
        // Electric Blue Spark
        this.ctx.fillStyle = `rgba(0, 229, 255, ${Math.min(1, Math.max(0, currentOpacity))})`;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00E5FF';
      } else {
        // Deep Shadow Purple Mana
        this.ctx.fillStyle = `rgba(147, 51, 234, ${Math.min(1, Math.max(0, currentOpacity * 0.75))})`;
        this.ctx.shadowBlur = 18;
        this.ctx.shadowColor = '#6B21A8';
      }

      this.ctx.fill();
      this.ctx.restore();

      // Reset when particle goes above screen
      if (p.y < -20) {
        this.particles[i] = this.createParticle(true);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new ShadowParticles('shadow-particles-canvas');
});
