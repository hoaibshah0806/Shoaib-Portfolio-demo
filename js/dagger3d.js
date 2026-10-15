/**
 * 3D Interactive Shadow Monarch Dagger Canvas
 * Ultra-high performance 3D rendered blade with glowing runes, shadow aura, and mouse parallax.
 */

class Dagger3DCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = 460;
    this.height = this.canvas.height = 460;
    
    this.rotation = { x: 0, y: 0, z: -0.45 };
    this.targetRotation = { x: 0, y: 0 };
    this.hover = false;
    this.auraRadius = 130;
    this.time = 0;

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    const container = this.canvas.parentElement;
    if (!container) return;

    container.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      this.targetRotation.y = (x / (rect.width / 2)) * 0.45;
      this.targetRotation.x = -(y / (rect.height / 2)) * 0.35;
    });

    container.addEventListener('mouseenter', () => {
      this.hover = true;
      if (window.systemAudio) window.systemAudio.playClick();
    });

    container.addEventListener('mouseleave', () => {
      this.hover = false;
      this.targetRotation.x = 0;
      this.targetRotation.y = 0;
    });

    container.addEventListener('click', () => {
      if (window.systemAudio) window.systemAudio.playAlert();
      this.pulseAura();
    });
  }

  pulseAura() {
    this.auraRadius = 220;
  }

  animate() {
    this.time += 0.035;
    
    // Smooth interpolation to target tilt
    this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.08;
    this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.08;

    // Hover aura expansion
    const targetAura = this.hover ? 190 : 130;
    this.auraRadius += (targetAura - this.auraRadius) * 0.06;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();

    const cx = this.width / 2;
    const cy = this.height / 2 + Math.sin(this.time) * 10; // Gentle floating

    // 1. Draw Swirling Shadow Aura & Mana Clouds
    this.drawShadowAura(cx, cy);

    // 2. Transform into 3D isometric view
    this.ctx.translate(cx, cy);
    this.ctx.rotate(this.rotation.z);
    this.ctx.transform(
      Math.cos(this.rotation.y),
      Math.sin(this.rotation.x) * 0.3,
      -Math.sin(this.rotation.y) * 0.3,
      Math.cos(this.rotation.x),
      0, 0
    );

    // 3. Draw Shadow Dagger
    this.drawDagger();

    this.ctx.restore();
    requestAnimationFrame(() => this.animate());
  }

  drawShadowAura(cx, cy) {
    const grad = this.ctx.createRadialGradient(cx, cy, 30, cx, cy, this.auraRadius);
    if (this.hover) {
      grad.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
      grad.addColorStop(0.4, 'rgba(147, 51, 234, 0.55)');
      grad.addColorStop(0.8, 'rgba(59, 7, 100, 0.25)');
      grad.addColorStop(1, 'transparent');
    } else {
      grad.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
      grad.addColorStop(0.5, 'rgba(107, 33, 168, 0.35)');
      grad.addColorStop(1, 'transparent');
    }

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.auraRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Floating electric spark particles around blade
    for (let i = 0; i < 6; i++) {
      const angle = this.time * 1.5 + (i * Math.PI) / 3;
      const dist = 60 + Math.sin(this.time * 2 + i) * 35;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;

      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      this.ctx.fillStyle = i % 2 === 0 ? '#00E5FF' : '#C084FC';
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = i % 2 === 0 ? '#00E5FF' : '#9333EA';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  drawDagger() {
    this.ctx.save();

    // Blade Tip & Edge Coordinates (Kamish's Wrath Curved Fang)
    // Blade Length: ~260px
    const tip = { x: 0, y: -155 };
    const hilt = { x: 0, y: 70 };
    const handleEnd = { x: 0, y: 155 };

    // --- Left Blade Face (Obsidian Deep Shadow) ---
    this.ctx.beginPath();
    this.ctx.moveTo(tip.x, tip.y);
    this.ctx.quadraticCurveTo(-38, -60, -26, hilt.y);
    this.ctx.lineTo(0, hilt.y - 10);
    this.ctx.closePath();
    
    const leftGrad = this.ctx.createLinearGradient(-35, 0, 0, 0);
    leftGrad.addColorStop(0, '#0d0d17');
    leftGrad.addColorStop(0.5, '#1e1b4b');
    leftGrad.addColorStop(1, '#00E5FF');
    this.ctx.fillStyle = leftGrad;
    this.ctx.fill();

    // --- Right Blade Face (Gleaming Metallic Cyan / Obsidian) ---
    this.ctx.beginPath();
    this.ctx.moveTo(tip.x, tip.y);
    this.ctx.quadraticCurveTo(34, -50, 24, hilt.y);
    this.ctx.lineTo(0, hilt.y - 10);
    this.ctx.closePath();

    const rightGrad = this.ctx.createLinearGradient(0, 0, 30, 0);
    rightGrad.addColorStop(0, '#00E5FF');
    rightGrad.addColorStop(0.4, '#090a14');
    rightGrad.addColorStop(1, '#6B21A8');
    this.ctx.fillStyle = rightGrad;
    this.ctx.fill();

    // --- Center Spine (Glowing Rune Line) ---
    this.ctx.beginPath();
    this.ctx.moveTo(tip.x, tip.y);
    this.ctx.lineTo(0, hilt.y - 10);
    this.ctx.strokeStyle = '#00E5FF';
    this.ctx.lineWidth = 2.5;
    this.ctx.shadowColor = '#00E5FF';
    this.ctx.shadowBlur = this.hover ? 20 : 10;
    this.ctx.stroke();

    // --- Shadow Monarch Glowing Runes on Blade ---
    this.drawRunes();

    // --- Crossguard / Hilt ---
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#9333EA';
    this.ctx.beginPath();
    this.ctx.moveTo(-45, hilt.y);
    this.ctx.lineTo(-20, hilt.y - 12);
    this.ctx.lineTo(0, hilt.y - 4);
    this.ctx.lineTo(20, hilt.y - 12);
    this.ctx.lineTo(45, hilt.y);
    this.ctx.lineTo(30, hilt.y + 14);
    this.ctx.lineTo(-30, hilt.y + 14);
    this.ctx.closePath();
    this.ctx.fillStyle = '#0F0926';
    this.ctx.fill();
    this.ctx.strokeStyle = '#00E5FF';
    this.ctx.lineWidth = 1.8;
    this.ctx.stroke();

    // Guard Gem (Heart of the Monarch)
    this.ctx.beginPath();
    this.ctx.arc(0, hilt.y + 4, 6, 0, Math.PI * 2);
    this.ctx.fillStyle = '#00E5FF';
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#00E5FF';
    this.ctx.fill();

    // --- Grip / Handle ---
    this.ctx.shadowBlur = 0;
    this.ctx.beginPath();
    this.ctx.rect(-7, hilt.y + 14, 14, handleEnd.y - hilt.y - 28);
    this.ctx.fillStyle = '#06060c';
    this.ctx.fill();
    this.ctx.strokeStyle = '#6B21A8';
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();

    // Handle wrap lines
    for (let r = hilt.y + 20; r < handleEnd.y - 20; r += 9) {
      this.ctx.beginPath();
      this.ctx.moveTo(-7, r);
      this.ctx.lineTo(7, r + 5);
      this.ctx.strokeStyle = '#00E5FF55';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    }

    // --- Pommel Skull / Spire ---
    this.ctx.beginPath();
    this.ctx.moveTo(-10, handleEnd.y - 14);
    this.ctx.lineTo(0, handleEnd.y);
    this.ctx.lineTo(10, handleEnd.y - 14);
    this.ctx.closePath();
    this.ctx.fillStyle = '#1e103a';
    this.ctx.fill();
    this.ctx.strokeStyle = '#00E5FF';
    this.ctx.lineWidth = 1.5;
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = '#00E5FF';
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawRunes() {
    this.ctx.save();
    this.ctx.font = 'bold 9px "Orbitron", monospace';
    this.ctx.fillStyle = '#00E5FF';
    this.ctx.shadowBlur = this.hover ? 16 : 8;
    this.ctx.shadowColor = '#00E5FF';
    this.ctx.textAlign = 'center';
    
    // Ancient system runes vertically on the blade
    const runes = ['SYSTEM', 'ARISE', 'MONARCH', 'SHOAIB'];
    const runeY = [-100, -65, -30, 5];
    
    runes.forEach((rune, i) => {
      this.ctx.fillText(rune, 0, runeY[i]);
    });
    this.ctx.restore();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Dagger3DCanvas('dagger-canvas');
});
