/**
 * Solo Leveling System Terminal (Guild Communication CLI)
 * Implements interactive commands: contact --email, contact --socials, stats, quests, etc.
 */

class SystemTerminal {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.history = [];
    this.historyIndex = -1;

    this.email = 'shoaibshah.dev@gmail.com';
    this.github = 'https://github.com/shoaibshah';
    this.linkedin = 'https://linkedin.com/in/mohammedshoaibshah';
    this.twitter = 'https://twitter.com/shoaibshah_dev';

    this.bindEvents();
    this.printWelcome();
  }

  bindEvents() {
    if (!this.input) return;

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.executeCommand(cmd);
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });

    // Delegate quick action chips
    document.querySelectorAll('[data-terminal-cmd]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-terminal-cmd');
        if (cmd) {
          if (this.input) this.input.value = cmd;
          this.executeCommand(cmd);
          if (window.systemAudio) window.systemAudio.playClick();
        }
      });
    });
  }

  printWelcome() {
    this.appendHtml(`
      <div class="text-xs text-gray-400 mb-2">
        <span class="text-system-cyan font-bold">[THE MONARCH SYSTEM KERNEL v4.12.0]</span><br>
        Guild Communication Subsystem initialized.<br>
        Type <span class="text-system-cyan font-bold">help</span> to list commands or <span class="text-system-cyan font-bold">contact --email</span> to transmit.
      </div>
    `);
  }

  appendHtml(html) {
    if (!this.output) return;
    const div = document.createElement('div');
    div.className = 'terminal-line mb-1.5 leading-relaxed';
    div.innerHTML = html;
    this.output.appendChild(div);
    this.output.scrollTop = this.output.scrollHeight;
  }

  executeCommand(rawCmd) {
    const cmd = rawCmd.trim();
    const args = cmd.toLowerCase().split(/\s+/);
    const main = args[0];

    // Log the command line
    this.appendHtml(`
      <div class="flex items-center space-x-2 text-gray-300">
        <span class="text-system-cyan font-bold">hunter@system:~$</span>
        <span class="text-white">${this.escapeHtml(cmd)}</span>
      </div>
    `);

    if (window.systemAudio) window.systemAudio.playClick();

    switch (main) {
      case 'help':
      case '?':
        this.appendHtml(`
          <div class="text-gray-300 pl-2 space-y-1 my-2 border-l-2 border-system-cyan">
            <div><span class="text-system-cyan font-semibold">contact --email</span>    : Reveal verified communication transmission link & copy</div>
            <div><span class="text-system-cyan font-semibold">contact --socials</span>  : Display Hunter Guild coordinates (GitHub, LinkedIn, X)</div>
            <div><span class="text-system-cyan font-semibold">stats</span>              : Query Player attributes, level, and agility benchmarks</div>
            <div><span class="text-system-cyan font-semibold">quests</span>             : Inspect S-Rank and A-Rank active/completed quest logs</div>
            <div><span class="text-system-cyan font-semibold">skills</span>             : View player inventory and mastery rank</div>
            <div><span class="text-system-cyan font-semibold">athlete</span>            : Access District 100m/200m sprinting agility records</div>
            <div><span class="text-system-cyan font-semibold">clear</span>              : Wipe terminal stream buffer</div>
            <div><span class="text-purple-400 font-semibold">sudo awaken</span>         : Invoke the Shadow Monarch Awakening sequence</div>
          </div>
        `);
        break;

      case 'contact':
        if (args[1] === '--email' || args[1] === '-e' || !args[1]) {
          if (window.systemAudio) window.systemAudio.playAlert();
          this.appendHtml(`
            <div class="p-3 my-2 bg-obsidian-900 border border-system-cyan rounded shadow-system-glow">
              <div class="text-xs text-gray-400 uppercase tracking-widest">[SYSTEM NOTICE: TRANSMISSION CO-ORDINATES UNLOCKED]</div>
              <div class="flex items-center justify-between flex-wrap gap-2 mt-1">
                <span class="text-system-cyan font-bold text-sm tracking-wider">${this.email}</span>
                <button onclick="navigator.clipboard.writeText('${this.email}'); alert('Player email copied to clipboard!');" 
                  class="px-2.5 py-1 text-xs bg-cyan-950 border border-system-cyan text-system-cyan hover:bg-system-cyan hover:text-black transition rounded font-mono">
                  [COPY EMAIL]
                </button>
              </div>
            </div>
          `);
        } else if (args[1] === '--socials' || args[1] === '-s') {
          this.appendHtml(`
            <div class="my-2 space-y-1.5 pl-2 border-l-2 border-purple-500 text-sm">
              <div><span class="text-gray-400">GitHub:</span> <a href="${this.github}" target="_blank" class="text-system-cyan hover:underline">${this.github}</a></div>
              <div><span class="text-gray-400">LinkedIn:</span> <a href="${this.linkedin}" target="_blank" class="text-system-cyan hover:underline">${this.linkedin}</a></div>
              <div><span class="text-gray-400">Twitter:</span> <a href="${this.twitter}" target="_blank" class="text-system-cyan hover:underline">${this.twitter}</a></div>
            </div>
          `);
        } else {
          this.appendHtml(`<div class="text-red-400">Unknown flag '${args[1]}'. Try <span class="text-system-cyan">contact --email</span> or <span class="text-system-cyan">contact --socials</span></div>`);
        }
        break;

      case 'stats':
        this.appendHtml(`
          <div class="p-3 my-2 bg-obsidian-900 border border-purple-500 rounded text-xs space-y-1 text-gray-300">
            <div class="text-purple-400 font-bold tracking-wider">[PLAYER ATTRIBUTE MATRIX]</div>
            <div>NAME: Mohammed Shoaib Shah | LEVEL: 20</div>
            <div>CLASS: Shadow Backend Monarch | GUILD: Trinity Academy of Engineering</div>
            <div class="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-800">
              <div>• STR: 88 (Spring Boot / Distributed Engines)</div>
              <div>• AGI: 99 [MAX] (District 100m/200m Sprinter)</div>
              <div>• INT: 96 (Apache Kafka / Distributed Streams)</div>
              <div>• VIT: 92 (Docker / Kubernetes / Resilience)</div>
              <div>• SEN: 90 (AI/ML Data Pipelines / Observability)</div>
            </div>
          </div>
        `);
        break;

      case 'quests':
        this.appendHtml(`
          <div class="my-2 space-y-1 text-xs text-gray-300">
            <div><span class="text-system-cyan font-bold">[RANK S]</span> Distributed Event-Driven Pipeline (Kafka + Go + Spring Boot)</div>
            <div><span class="text-system-cyan font-bold">[RANK S]</span> High-Throughput Microservices Engine (Spring Boot 3 + PostgreSQL)</div>
            <div><span class="text-purple-400 font-bold">[RANK A]</span> Low-Latency Go Micro-Broker (GoLang + gRPC + Concurrency)</div>
            <div><span class="text-purple-400 font-bold">[RANK A]</span> Intelligent Cloud Ops & ML Pipeline (Python + Docker + AWS)</div>
          </div>
        `);
        break;

      case 'skills':
        this.appendHtml(`
          <div class="my-2 text-xs text-gray-300 space-y-1">
            <div><span class="text-system-cyan">[S-RANK]</span> Java (Spring Boot, Spring Security, JPA/Hibernate, Microservices)</div>
            <div><span class="text-system-cyan">[S-RANK]</span> GoLang (Goroutines, Channels, gRPC, Low-Latency Workers)</div>
            <div><span class="text-system-cyan">[S-RANK]</span> Apache Kafka (High-Throughput Streams, Partitioning, Pub/Sub)</div>
            <div><span class="text-purple-400">[A-RANK]</span> DevOps & Cloud (Docker, Kubernetes, AWS, CI/CD, Terraform)</div>
            <div><span class="text-purple-400">[A-RANK]</span> AI / Machine Learning (Data Pipelines, Model Serving)</div>
          </div>
        `);
        break;

      case 'athlete':
        this.appendHtml(`
          <div class="p-3 my-2 bg-obsidian-900 border border-yellow-500/50 rounded text-xs space-y-1.5 text-gray-300">
            <div class="text-yellow-400 font-bold tracking-wider">⚡ [PHYSICAL AGILITY PROFILE: DISTRICT SPRINTER]</div>
            <div>Event Specialization: 100m Sprint & 200m Sprint</div>
            <div>Affiliation: Trinity Academy of Engineering Athletics Delegation</div>
            <div>Athletic Trait: Explosive Acceleration, High-Pressure Composure, Relentless Work Ethic</div>
            <div class="text-gray-400 text-[11px] italic">"Sprint discipline transfers directly into high-throughput, low-latency software architecture."</div>
          </div>
        `);
        break;

      case 'clear':
        if (this.output) this.output.innerHTML = '';
        this.printWelcome();
        break;

      case 'sudo':
        if (args[1] === 'awaken' || args[1] === 'arise') {
          if (window.systemAudio) window.systemAudio.playAwakening();
          this.appendHtml(`
            <div class="p-4 my-2 bg-purple-950/60 border-2 border-purple-500 rounded text-center animate-pulse">
              <div class="text-lg font-bold text-purple-300 tracking-widest font-display">"ARISE."</div>
              <div class="text-xs text-system-cyan mt-1">[SHADOW MONARCH DOMAIN EXPANDED]</div>
              <div class="text-[11px] text-gray-300 mt-2">All backend services summoned. Distributed nodes under player control.</div>
            </div>
          `);
        } else {
          this.appendHtml(`<div class="text-red-400">Permission denied: Player is not in sudoers file. Try <span class="text-purple-400">sudo awaken</span></div>`);
        }
        break;

      default:
        this.appendHtml(`
          <div class="text-red-400 text-xs">
            Command not recognized: '<span class="text-white">${this.escapeHtml(cmd)}</span>'. Type <span class="text-system-cyan cursor-pointer underline" onclick="document.getElementById('terminal-input').value='help'; document.getElementById('terminal-input').dispatchEvent(new KeyboardEvent('keydown', {'key':'Enter'}));">help</span> for available commands.
          </div>
        `);
        break;
    }
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.systemTerminal = new SystemTerminal();
});
