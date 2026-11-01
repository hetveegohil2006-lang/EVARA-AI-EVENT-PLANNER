/**
 * EVARA Private Concierge — Interactive Video Tour & Platform Walkthrough
 * Orchestrates video playback, simulated interactive chapters, and user help modals.
 */

const EVARA_TOUR = {
  isPlaying: false,
  currentTime: 0,
  duration: 80, // 80 seconds total walkthrough
  currentChapter: 0,
  timer: null,

  chapters: [
    {
      id: 0,
      title: "Curated Gathering Architecture",
      subtitle: "Planning high-stakes celebrations with bespoke precision",
      time: 0,
      duration: 20,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvjZQItqiS8GJ3QchcKVAHePoS18FihFoH1Bmagr6yAPsLwUNiaxnltiY05dq-UurSr80BIpwmOKL3jPnyYoXYdsPfPIXJNsN_6sKyeKCKjB0uDR_aNi4DL_TsyTYqfqXcERQgGBqON19SarToHP3WzG3aKCMYv5pRwp_oRi9XCg9-pshuKy12_etdLmsvishFmK-dZ_9cFKs7kNF5HYbWn5yNgrkb50F5Epk53kc",
      features: [
        "Select exclusive venues (Tuscan Estates, Amalfi Villas, Cap d'Antibes)",
        "Automated budget modeling calibrated in Indian Rupees (₹) & Euros (€)",
        "Milestone calendar scheduling with multi-host permissions"
      ]
    },
    {
      id: 1,
      title: "Dual Concierge AI — Aria & Julian",
      subtitle: "Autonomous intelligence for aesthetics, acoustics, and contracts",
      time: 20,
      duration: 20,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRlbWQJd7ix7X_HIBg4iwVHRQ2tfxZEQ9PlMHfoC2TtLGvtJgdn93WzONEIasNIGhLKaD7rSvu9wLmuiRRgkC-gldG34BdpZ8HV_SFQoewlkFGcmvXRqEonsxFuhXX-wh2HsZeSfkB6AaT2qAa06Za85AL0z4w61LmL0_YixPd2V49eRmx7oaSCxS__G0qZMvbHZG_EZrHLf6ecBb2rQOmRX3uefAwqkWACy7ft4k",
      features: [
        "Aria curates sommeliers, heirloom floral palettes, and table etiquette",
        "Julian manages staging acoustics, vendor contracts, and security escrows",
        "Instant contextual advice with one-click budget integration"
      ]
    },
    {
      id: 2,
      title: "Liquid Escrow & Instant UPI/QR",
      subtitle: "Transparent financial pooling with milestone vendor releases",
      time: 40,
      duration: 20,
      image: "https://lh3.googleusercontent.com/aida/AEtjO1UjnlLoNkAWwFXJi85ltTqCugoqKdkeXWryS6zryuQ-dRFP6W1cwLJXeDgquNJHgq-SXiC33m3IDRhb1oU75tz2VpDp8qBlwxF9AIVm6B7OB47rH_1bD8NSDvJm8O-Le4wMmU1Ju-xFhSCXOcpmks16vxmljnq_JK-0vtaafawqshIPj9Vb6UyY4PViwtNdGEdktSDhC6Ho3yoEICdh3CQHVnxmdQqcAUnCP5bSC42p",
      features: [
        "Generate sovereign QR codes for guest tier contributions & deposits",
        "Real-time liquidity progress against target budget allocations",
        "Milestone-gated escrow releases ensure complete vendor accountability"
      ]
    },
    {
      id: 3,
      title: "Guest Registry & Bespoke Invitations",
      subtitle: "Flawless guest journeys from bespoke monogram invites to suite check-in",
      time: 60,
      duration: 20,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvjZQItqiS8GJ3QchcKVAHePoS18FihFoH1Bmagr6yAPsLwUNiaxnltiY05dq-UurSr80BIpwmOKL3jPnyYoXYdsPfPIXJNsN_6sKyeKCKjB0uDR_aNi4DL_TsyTYqfqXcERQgGBqON19SarToHP3WzG3aKCMYv5pRwp_oRi9XCg9-pshuKy12_etdLmsvishFmK-dZ_9cFKs7kNF5HYbWn5yNgrkb50F5Epk53kc",
      features: [
        "Curate RSVP statuses, dietary nuances, and villa room assignments",
        "Export guest dossiers and passcodes formatted for on-site concierge",
        "Generate bespoke monogrammed digital invitations with private RSVP keys"
      ]
    }
  ],

  init() {
    this.updateChapterUI(0);
    this.setupListeners();
  },

  setupListeners() {
    // Check if custom video file exists
    const video = document.getElementById('evaraTourVideo');
    if (video) {
      video.addEventListener('timeupdate', () => {
        if (!isNaN(video.duration) && video.duration > 0) {
          this.currentTime = video.currentTime;
          this.duration = video.duration;
          this.syncProgress();
        }
      });
      video.addEventListener('ended', () => {
        this.isPlaying = false;
        this.updatePlayBtnState();
      });
      video.addEventListener('error', () => {
        // Fall back gracefully to interactive simulation
        console.info('Custom video file not mounted. Running interactive visual walkthrough.');
        const stage = document.getElementById('evaraSimStage');
        if (stage) stage.style.display = 'block';
        if (video) video.style.display = 'none';
      });
    }
  },

  togglePlay() {
    const video = document.getElementById('evaraTourVideo');
    const hasVideoFile = video && video.src && !video.src.endsWith('#') && video.readyState >= 2;

    this.isPlaying = !this.isPlaying;
    this.updatePlayBtnState();

    if (hasVideoFile) {
      if (this.isPlaying) {
        video.play().catch(() => this.runSimulation());
      } else {
        video.pause();
      }
    } else {
      // Run interactive simulation mode
      if (this.isPlaying) {
        this.startSimulation();
      } else {
        this.pauseSimulation();
      }
    }
  },

  startSimulation() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.currentTime += 0.5;
      if (this.currentTime >= this.duration) {
        this.currentTime = 0;
      }
      this.syncProgress();

      // Check current chapter
      const chapterIdx = Math.floor(this.currentTime / 20) % 4;
      if (chapterIdx !== this.currentChapter) {
        this.updateChapterUI(chapterIdx);
      }
    }, 500);
  },

  pauseSimulation() {
    clearInterval(this.timer);
  },

  selectChapter(idx) {
    this.currentChapter = idx;
    this.currentTime = idx * 20;
    this.updateChapterUI(idx);
    this.syncProgress();

    const video = document.getElementById('evaraTourVideo');
    if (video && video.duration) {
      video.currentTime = (idx / 4) * video.duration;
    }
  },

  updateChapterUI(idx) {
    this.currentChapter = idx;
    const ch = this.chapters[idx];
    if (!ch) return;

    // Highlight active chapter tab
    document.querySelectorAll('.video-chapter-tab').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });

    // Update overlay text in simulation stage
    const titleEl = document.getElementById('simChapterTitle');
    const subtitleEl = document.getElementById('simChapterSubtitle');
    const featuresEl = document.getElementById('simChapterFeatures');
    const bgEl = document.getElementById('evaraSimStage');

    if (titleEl) titleEl.textContent = ch.title;
    if (subtitleEl) subtitleEl.textContent = ch.subtitle;
    if (bgEl) bgEl.style.backgroundImage = `url('${ch.image}')`;

    if (featuresEl) {
      featuresEl.innerHTML = ch.features.map(f => `
        <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span class="material-symbols-outlined" style="font-size: 16px; color: var(--tertiary-gold);">check_circle</span>
          <span style="font-size: 13px; color: rgba(255,255,255,0.9);">${f}</span>
        </li>
      `).join('');
    }
  },

  syncProgress() {
    const pct = (this.currentTime / this.duration) * 100;
    const bar = document.getElementById('videoProgressBar');
    if (bar) bar.style.width = `${pct}%`;

    const timeEl = document.getElementById('videoTimecode');
    if (timeEl) {
      const curM = Math.floor(this.currentTime / 60);
      const curS = Math.floor(this.currentTime % 60);
      const durM = Math.floor(this.duration / 60);
      const durS = Math.floor(this.duration % 60);
      timeEl.textContent = `${curM}:${curS < 10 ? '0' : ''}${curS} / ${durM}:${durS < 10 ? '0' : ''}${durS}`;
    }
  },

  updatePlayBtnState() {
    const playIcon = document.getElementById('videoPlayIcon');
    const bigPlayBtn = document.getElementById('videoBigPlayBtn');
    if (playIcon) {
      playIcon.textContent = this.isPlaying ? 'pause' : 'play_arrow';
    }
    if (bigPlayBtn) {
      bigPlayBtn.style.display = this.isPlaying ? 'none' : 'flex';
    }
  },

  seek(event) {
    const rail = document.getElementById('videoProgressRail');
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.currentTime = Math.max(0, Math.min(pos * this.duration, this.duration));
    const chIdx = Math.floor((this.currentTime / this.duration) * 4);
    this.updateChapterUI(Math.min(chIdx, 3));
    this.syncProgress();

    const video = document.getElementById('evaraTourVideo');
    if (video && video.duration) {
      video.currentTime = pos * video.duration;
    }
  },

  toggleFullscreen() {
    const container = document.getElementById('videoShowcaseContainer');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(e => console.warn(e));
    } else {
      document.exitFullscreen?.();
    }
  },

  loadCustomVideo(url) {
    const video = document.getElementById('evaraTourVideo');
    const simStage = document.getElementById('evaraSimStage');
    if (!video || !url) return;
    video.src = url;
    video.style.display = 'block';
    if (simStage) simStage.style.display = 'none';
    video.load();
    this.togglePlay();
    App?.toast?.('Custom video source loaded', 'video_camera_front');
  }
};

// Global modal triggers
function openVideoTourModal() {
  const modal = document.getElementById('videoTourModal');
  if (modal) {
    modal.classList.add('open');
    if (!EVARA_TOUR.isPlaying) EVARA_TOUR.togglePlay();
  }
}

function closeVideoTourModal() {
  const modal = document.getElementById('videoTourModal');
  if (modal) {
    modal.classList.remove('open');
    if (EVARA_TOUR.isPlaying) EVARA_TOUR.togglePlay();
  }
}

// Attach globally
window.EVARA_TOUR = EVARA_TOUR;
window.openVideoTourModal = openVideoTourModal;
window.closeVideoTourModal = closeVideoTourModal;

document.addEventListener('DOMContentLoaded', () => {
  EVARA_TOUR.init();
});

