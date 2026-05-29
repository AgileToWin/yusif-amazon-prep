// ============= FIREBASE CONFIG (reused from yusif-dashboard project) =============
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCtko-1pZA1VXSPKT9iscASaohhQTExFjo",
  authDomain: "yusif-dashboard.firebaseapp.com",
  databaseURL: "https://yusif-dashboard-default-rtdb.firebaseio.com",
  projectId: "yusif-dashboard",
  storageBucket: "yusif-dashboard.firebasestorage.app",
  messagingSenderId: "170972277087",
  appId: "1:170972277087:web:0819c5220f36957f8beeea"
};

// AI coach worker endpoint
const COACH_URL = 'https://yusif-prep-coach.projects-websynk.workers.dev';

// 6-day prep window — keyed by local date string
const INTERVIEW_DATE = '2026-06-03';
const DAILY_MISSIONS = {
  '2026-05-29': {
    day: 1,
    label: 'Crash course',
    title: 'Day 1 — Crash course',
    desc: 'Get familiar with all 8 LPs. Aim for at least one rep on each. Don\'t worry about scores yet — just get reps and start hearing yourself answer.',
    targetTrack: 'r1',
  },
  '2026-05-30': {
    day: 2,
    label: 'Anchor stories',
    title: 'Day 2 — Build your anchor stories',
    desc: 'For each LP, build a story you could speak in your sleep. Target: Warm tier or above on 5 LPs. Use the 💛 humanity chip on every story.',
    targetTrack: 'r1',
  },
  '2026-05-31': {
    day: 3,
    label: 'Heat test',
    title: 'Day 3 — Heat test',
    desc: 'Round 1 live with humanity reps. Name a teammate in every answer. Aim for ≥4/5 on Warmth across the board.',
    targetTrack: 'r1',
  },
  '2026-06-01': {
    day: 4,
    label: 'Probing reps',
    title: 'Day 4 — Probing reps',
    desc: 'Round 2 + the LPs you scored lowest on yesterday. Trim every answer to under 90 seconds. Use ✂️ on anything over.',
    targetTrack: 'r2',
  },
  '2026-06-02': {
    day: 5,
    label: 'Hostile drills',
    title: 'Day 5 — Bar Raiser dress rehearsal',
    desc: 'Round 3 once. Re-attempt the three you scored worst on. Light taper after — sleep early.',
    targetTrack: 'r3',
  },
  '2026-06-03': {
    day: 6,
    label: 'Interview day',
    title: 'Today\'s the day.',
    desc: 'Read your hook out loud. Breathe. You\'re an engineer who switched from rocks to networks. You belong in this room. Go.',
    targetTrack: null,
  },
};

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function daysUntilInterview() {
  const today = new Date(todayKey() + 'T00:00:00');
  const target = new Date(INTERVIEW_DATE + 'T00:00:00');
  const diffMs = target - today;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function currentMission() {
  const key = todayKey();
  if (DAILY_MISSIONS[key]) return DAILY_MISSIONS[key];
  // Before window starts: lean into crash course. After interview: retrospective.
  const days = daysUntilInterview();
  if (days > 5) {
    return { day: 0, label: 'Get warm', title: 'Get warm', desc: 'You\'re ahead of schedule. Pick any round to start building reps.', targetTrack: 'r1' };
  }
  if (days < 0) {
    return { day: 7, label: 'Retrospective', title: 'After the interview', desc: 'Review your strongest takes. Save what worked.', targetTrack: null };
  }
  return DAILY_MISSIONS[todayKey()];
}

// Hardcoded allowlist (same identities as dashboard).
const ALLOWLIST = {
  yusif:   ['MYNazir', 'naziryusif8', 'naziryusif8@gmail.com'],
  partner: ['AgileToWin', 'SeaDevelopers', 'kingfifisaxon@proton.me'],
};

const TRACK_NAMES = {
  tech: 'Tech Drill',
  r1:   'Round 1 · Friendly',
  r2:   'Round 2 · Mixed',
  r3:   'Round 3 · Bar Raiser',
};

const RUBRIC = [
  { id: 'tech',    name: 'Technical Accuracy',  hint: 'Facts right, depth matches' },
  { id: 'star',    name: 'STAR Structure',      hint: 'Clear S/T/A/R, no rambling' },
  { id: 'quant',   name: 'Quantification',      hint: 'Numbers, %, $, time, scale' },
  { id: 'probe',   name: 'Probing Resilience',  hint: 'Survives 3 follow-ups' },
  { id: 'lp',      name: 'LP Alignment',        hint: 'Demonstrates the LP, not adjacent' },
  { id: 'warmth',  name: 'Warmth & Composure',  hint: 'Would they want to work with you?' },
];

const LP_LIST = [
  'Customer Obsession', 'Ownership', 'Earn Trust', 'Learn & Be Curious',
  'Dive Deep', 'Bias for Action', 'Insist on Highest Standards', 'Deliver Results'
];

const ACRONYM_MAP = {
  'OTDR': 'O.T.D.R.', 'VFL': 'V.F.L.', 'OSPF': 'O.S.P.F.', 'BGP': 'B.G.P.',
  'OSI': 'O.S.I.', 'CRC': 'C.R.C.', 'DNS': 'D.N.S.', 'DHCP': 'D.H.C.P.',
  'TCP': 'T.C.P.', 'UDP': 'U.D.P.', 'IP': 'I.P.', 'MAC': 'mack',
  'AWS': 'A.W.S.', 'CCNA': 'C.C.N.A.', 'SOP': 'S.O.P.', 'SOPs': 'S.O.P.s',
  'PCI DSS': 'P.C.I. D.S.S.', 'API': 'A.P.I.', 'APIs': 'A.P.I.s', 'SIEM': 'seem',
  'PuTTY': 'putty', 'SMF': 'S.M.F.', 'MMF': 'M.M.F.', 'PoE': 'P.O.E.',
  'ESD': 'E.S.D.', 'PPE': 'P.P.E.', 'LP': 'L.P.', 'LPs': 'L.P.s',
  'TPM': 'T.P.M.', 'TPMs': 'T.P.M.s', 'JunOS': 'June O.S.', 'IOS': 'I.O.S.',
  'CLI': 'C.L.I.', 'STAR': 'star', 'MITRE': 'mitre', 'NIC': 'nick',
  'VLAN': 'V.L.A.N.', 'LAN': 'L.A.N.', 'WAN': 'W.A.N.', 'ARP': 'arp',
  'CIDR': 'cider', 'VLSM': 'V.L.S.M.', 'RJ45': 'R.J. 45',
  'dBm': 'D.B.M.', 'dB': 'D.B.', 'F1': 'F. one', 'P1': 'P. one',
};

// ============= STATE =============
const state = {
  screen: 'loading',
  user: null,
  questions: [],
  currentRound: null,
  currentIdx: 0,
  reviewMode: false,
  conversation: [],
  coachBusy: false,
  tone: 'friendly',
  availableVoices: [],
  recognition: null,
  recognitionActive: false,
  mediaRecorder: null,
  recordedChunks: [],
  recordingUrl: null,
  timerInterval: null,
  timerStart: null,
  sessionLog: JSON.parse(localStorage.getItem('session_log') || '[]'),
  gamificationOn: localStorage.getItem('gamificationOn') !== 'false', // default ON
  intentLoaded: {}, // questionId -> true when intent already fetched
};

// ============= INIT =============
function init() {
  firebase.initializeApp(FIREBASE_CONFIG);
  firebase.auth().onAuthStateChanged(handleAuthStateChange);

  if (typeof speechSynthesis !== 'undefined') {
    loadVoices();
    if ('onvoiceschanged' in speechSynthesis) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  applyGamificationMode();
  bindEvents();
}

function applyGamificationMode() {
  document.body.classList.toggle('mode-calm', !state.gamificationOn);
  const trainingBtn = document.getElementById('mode-training');
  const calmBtn = document.getElementById('mode-calm');
  const hint = document.getElementById('mode-hint');
  if (trainingBtn) trainingBtn.classList.toggle('active', state.gamificationOn);
  if (calmBtn) calmBtn.classList.toggle('active', !state.gamificationOn);
  if (hint) hint.textContent = state.gamificationOn
    ? 'Daily mission, confidence score, and mastery layers on.'
    : 'Just questions and feedback. Stats keep recording silently.';
}

function setGamification(on) {
  state.gamificationOn = on;
  localStorage.setItem('gamificationOn', on ? 'true' : 'false');
  applyGamificationMode();
  // If turning off while on Home, jump to Tracks. If turning on while on Tracks, no jump (user is mid-session).
  if (!on && state.screen === 'home') showScreen('tracks');
}

function bindEvents() {
  document.getElementById('signin-btn').addEventListener('click', signInWithGitHub);
  document.getElementById('signout-btn-denied').addEventListener('click', signOut);

  // Home (Training mode entry)
  document.getElementById('mission-begin').addEventListener('click', beginTodaysMission);
  document.getElementById('goto-tracks').addEventListener('click', () => showScreen('tracks'));
  document.getElementById('confidence-detail-btn').addEventListener('click', toggleConfidenceBreakdown);
  document.getElementById('open-settings-home').addEventListener('click', openDrawer);

  // Tracks
  document.querySelectorAll('.track-card').forEach(card => {
    card.addEventListener('click', () => startTrack(card.dataset.round));
  });
  document.getElementById('open-settings').addEventListener('click', openDrawer);
  document.getElementById('open-settings-drill').addEventListener('click', openDrawer);

  // Mode toggle (kill switch)
  document.querySelectorAll('.mode-control button').forEach(b => {
    b.addEventListener('click', () => setGamification(b.dataset.mode === 'training'));
  });

  // Intent reveal
  const intentEl = document.getElementById('intent-reveal');
  if (intentEl) {
    intentEl.addEventListener('toggle', () => {
      if (intentEl.open) loadIntentForCurrentQuestion();
    });
  }

  // Brief modal
  document.getElementById('close-brief').addEventListener('click', closeBriefModal);
  document.getElementById('begin-from-brief').addEventListener('click', () => {
    closeBriefModal();
    if (state.pendingTrack) {
      _startTrackNow(state.pendingTrack);
      state.pendingTrack = null;
    }
  });

  document.getElementById('back-to-tracks').addEventListener('click', leaveDrill);
  document.getElementById('speak-q').addEventListener('click', speakQuestion);
  document.getElementById('mic-toggle').addEventListener('click', toggleMic);
  document.getElementById('focus-textarea').addEventListener('click', () => document.getElementById('answer-text').focus());
  document.getElementById('answer-text').addEventListener('input', updateAnswerStats);
  document.getElementById('play-audio').addEventListener('click', playRecording);
  document.getElementById('submit-answer').addEventListener('click', submitAnswer);
  document.getElementById('save-next').addEventListener('click', saveAndNext);

  document.getElementById('chat-send').addEventListener('click', sendChatMessage);
  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('chat-input').value = chip.dataset.prompt;
      sendChatMessage();
    });
  });

  document.getElementById('close-drawer').addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  document.getElementById('signout-btn').addEventListener('click', signOut);
  document.getElementById('export-log').addEventListener('click', exportLog);
  document.getElementById('clear-session').addEventListener('click', clearSession);
  document.getElementById('test-voice').addEventListener('click', testVoice);

  document.querySelectorAll('.seg-control button').forEach(b => {
    b.addEventListener('click', () => setTone(b.dataset.tone));
  });
}

// ============= AUTH =============
function signInWithGitHub() {
  const provider = new firebase.auth.GithubAuthProvider();
  provider.addScope('read:user');

  const errEl = document.getElementById('login-error');
  errEl.hidden = true;

  firebase.auth().signInWithPopup(provider).catch(error => {
    if (error.code === 'auth/popup-closed-by-user') {
      errEl.textContent = 'Sign-in popup was closed. Try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errEl.textContent = 'Popup was blocked. Allow popups for this site and try again.';
    } else {
      errEl.textContent = `Sign-in failed: ${error.message || error.code}`;
    }
    errEl.hidden = false;
  });
}

function signOut() {
  firebase.auth().signOut();
  closeDrawer();
}

function handleAuthStateChange(user) {
  if (!user) {
    state.user = null;
    showScreen('login');
    return;
  }

  const ghUsername = (user.reloadUserInfo && user.reloadUserInfo.screenName) || user.displayName || '';
  const email = (user.email || '').toLowerCase();
  const lookups = [ghUsername.toLowerCase(), email].filter(Boolean);

  const yusifMatch = ALLOWLIST.yusif.some(id => lookups.includes(id.toLowerCase()));
  const partnerMatch = ALLOWLIST.partner.some(id => lookups.includes(id.toLowerCase()));

  if (yusifMatch || partnerMatch) {
    state.user = {
      ghUsername: ghUsername || email,
      displayName: user.displayName || ghUsername || email,
      photoURL: user.photoURL || null,
      role: yusifMatch ? 'yusif' : 'partner',
    };
    renderUserPill();
    loadQuestionsAndShowEntry();
  } else {
    document.getElementById('denied-user').textContent = ghUsername || email || 'Unknown';
    showScreen('denied');
  }
}

function renderUserPill() {
  const firstName = (state.user.displayName || '').split(' ')[0] || state.user.ghUsername;
  ['', '-home'].forEach(suffix => {
    const span = document.getElementById('user-name' + suffix);
    const img = document.getElementById('user-avatar' + suffix);
    if (span) span.textContent = firstName;
    if (img) {
      if (state.user.photoURL) { img.src = state.user.photoURL; img.hidden = false; }
      else img.hidden = true;
    }
  });
}

// ============= QUESTIONS =============
async function loadQuestionsAndShowEntry() {
  if (state.questions.length === 0) {
    try {
      const res = await fetch('questions.json');
      if (!res.ok) throw new Error('fetch failed');
      state.questions = await res.json();
    } catch (e) {
      console.warn('questions.json missing or invalid', e);
      state.questions = [];
    }
  }
  // Training mode → Home. Calm mode → Tracks directly.
  if (state.gamificationOn) {
    renderCountdownRibbon();
    renderHome();
    showScreen('home');
  } else {
    showScreen('tracks');
  }
}

function questionsForRound(round) {
  return state.questions.filter(q => q.round === round);
}

// ============= COUNTDOWN RIBBON =============
function renderCountdownRibbon() {
  const ribbon = document.getElementById('countdown-ribbon');
  if (!ribbon) return;
  const days = daysUntilInterview();
  let text;
  if (days > 1) text = `${days} days until Wednesday. You've got this.`;
  else if (days === 1) text = 'Tomorrow is interview day. One more solid session, then sleep.';
  else if (days === 0) text = "It's today. Read your hook. Breathe.";
  else if (days === -1) text = 'Interview was yesterday. Save your strongest takes.';
  else text = '';
  ribbon.textContent = text;
}

// ============= HOME SCREEN =============
function renderHome() {
  renderCountdownRibbon();
  renderConfidence();
  renderMission();
  renderMastery();
  renderStreak();
}

function renderMission() {
  const m = currentMission();
  document.getElementById('mission-title').textContent = m.title;
  document.getElementById('mission-desc').textContent = m.desc;
  const btn = document.getElementById('mission-begin');
  if (m.targetTrack) {
    btn.hidden = false;
    btn.textContent = `Begin ${TRACK_NAMES[m.targetTrack] || m.targetTrack} →`;
  } else {
    btn.hidden = true;
  }
}

function beginTodaysMission() {
  const m = currentMission();
  if (!m.targetTrack) return;
  startTrack(m.targetTrack);
}

// ============= CONFIDENCE SCORE =============
function renderConfidence() {
  const breakdown = computeConfidence();
  const numEl = document.getElementById('confidence-number');
  if (breakdown.total === null) {
    numEl.innerHTML = '—';
    document.getElementById('confidence-trend').textContent = 'No reps yet. Begin your first mission.';
    return;
  }
  numEl.innerHTML = `${breakdown.total}<span class="denom"> / 100</span>`;
  const trendEl = document.getElementById('confidence-trend');
  if (breakdown.delta > 0) {
    trendEl.textContent = `↑ ${breakdown.delta} since your first session`;
    trendEl.classList.add('up');
  } else if (breakdown.delta < 0) {
    trendEl.textContent = `↓ ${Math.abs(breakdown.delta)} since your first session — re-attempt your weak spots`;
    trendEl.classList.remove('up');
  } else {
    trendEl.textContent = `${breakdown.totalAttempts} reps so far`;
    trendEl.classList.remove('up');
  }
}

function toggleConfidenceBreakdown() {
  const panel = document.getElementById('confidence-breakdown');
  const btn = document.getElementById('confidence-detail-btn');
  const isHidden = panel.hidden;
  if (isHidden) {
    const b = computeConfidence();
    panel.innerHTML = `
      <div class="breakdown-row"><span class="name">LP coverage (25%)</span><span class="val">${b.coverage}/100</span></div>
      <div class="breakdown-row"><span class="name">Average rubric (40%)</span><span class="val">${b.average}/100</span></div>
      <div class="breakdown-row"><span class="name">Improvement (15%)</span><span class="val">${b.improvement}/100</span></div>
      <div class="breakdown-row"><span class="name">Warmth & humanity (20%)</span><span class="val">${b.warmth}/100</span></div>
    `;
    panel.hidden = false;
    btn.textContent = 'Hide breakdown ▴';
  } else {
    panel.hidden = true;
    btn.textContent = 'Show breakdown ▾';
  }
}

function computeConfidence() {
  const attempts = state.sessionLog.filter(a => a.scores && Object.values(a.scores).some(v => v !== null && v !== undefined));
  if (attempts.length === 0) {
    return { total: null, coverage: 0, average: 0, improvement: 0, warmth: 0, delta: 0, totalAttempts: 0 };
  }

  // Coverage — % of 8 LPs with at least 1 rep at score >= 3 on LP dimension
  const lpReps = {};
  attempts.forEach(a => {
    const lp = a.lp || (state.questions.find(q => q.id === a.questionId) || {}).lp;
    if (lp && a.scores.lp != null && a.scores.lp >= 3) lpReps[lp] = true;
  });
  const coverage = Math.round((Object.keys(lpReps).length / 8) * 100);

  // Average — mean of all sub-scores
  let scoreSum = 0, scoreCount = 0;
  attempts.forEach(a => {
    Object.values(a.scores).forEach(v => {
      if (typeof v === 'number') { scoreSum += v; scoreCount++; }
    });
  });
  const avgRaw = scoreCount > 0 ? scoreSum / scoreCount : 0;
  const average = Math.round((avgRaw / 5) * 100);

  // Improvement — last 3 attempts avg vs first 3 attempts avg
  let improvement = 50; // neutral
  if (attempts.length >= 6) {
    const first3 = attempts.slice(0, 3);
    const last3 = attempts.slice(-3);
    const avg = arr => {
      let s = 0, c = 0;
      arr.forEach(a => Object.values(a.scores).forEach(v => {
        if (typeof v === 'number') { s += v; c++; }
      }));
      return c > 0 ? s / c : 0;
    };
    const delta = avg(last3) - avg(first3);
    improvement = Math.max(0, Math.min(100, 50 + Math.round(delta * 25)));
  }

  // Warmth — average of warmth scores
  let wSum = 0, wCount = 0;
  attempts.forEach(a => {
    if (typeof a.scores.warmth === 'number') { wSum += a.scores.warmth; wCount++; }
  });
  const warmth = wCount > 0 ? Math.round((wSum / wCount / 5) * 100) : 0;

  const total = Math.round(coverage * 0.25 + average * 0.40 + improvement * 0.15 + warmth * 0.20);

  // Delta from first attempt to current (approximation of progress)
  const firstAttemptScore = attempts[0].scores;
  const firstAvg = (() => {
    const vals = Object.values(firstAttemptScore).filter(v => typeof v === 'number');
    return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
  })();
  const recentAvg = avgRaw;
  const deltaInt = Math.round((recentAvg - firstAvg) * 20);

  return {
    total, coverage, average, improvement, warmth,
    delta: deltaInt, totalAttempts: attempts.length
  };
}

// ============= LP MASTERY =============
function computeMastery() {
  const tiers = {};
  LP_LIST.forEach(lp => {
    tiers[lp] = { reps: 0, avg: 0, tier: 'cold' };
  });
  state.sessionLog.forEach(a => {
    const lp = a.lp || (state.questions.find(q => q.id === a.questionId) || {}).lp;
    if (!lp || !tiers[lp]) return;
    if (!a.scores || typeof a.scores.lp !== 'number') return;
    tiers[lp].reps += 1;
    tiers[lp].sum = (tiers[lp].sum || 0) + a.scores.lp;
    tiers[lp].avg = tiers[lp].sum / tiers[lp].reps;
  });
  Object.keys(tiers).forEach(lp => {
    const t = tiers[lp];
    if (t.reps >= 4 && t.avg >= 4.5) t.tier = 'reflexive';
    else if (t.reps >= 3 && t.avg >= 4.0) t.tier = 'sharp';
    else if (t.reps >= 2 && t.avg >= 3.0) t.tier = 'warm';
    else t.tier = 'cold';
  });
  return tiers;
}

function renderMastery() {
  const tiers = computeMastery();
  const grid = document.getElementById('mastery-grid');
  grid.innerHTML = '';
  LP_LIST.forEach(lp => {
    const t = tiers[lp];
    const item = document.createElement('div');
    item.className = 'mastery-item';
    item.innerHTML = `
      <div class="mastery-dot ${t.tier}" title="${t.tier}"></div>
      <div class="mastery-text">
        <div class="mastery-name">${lp}</div>
        <div class="mastery-tier">${t.tier}${t.reps > 0 ? ' · ' + t.reps + ' rep' + (t.reps === 1 ? '' : 's') : ''}</div>
      </div>
    `;
    grid.appendChild(item);
  });
}

// ============= STREAK =============
function computeStreak() {
  if (state.sessionLog.length === 0) return { days: 0, lastRepText: 'No reps yet' };

  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const repDates = new Set();
  state.sessionLog.forEach(a => {
    if (a.timestamp) repDates.add(dateKey(new Date(a.timestamp)));
  });

  // Last-rep text (always shown)
  const lastTs = state.sessionLog[state.sessionLog.length - 1].timestamp;
  const lastDate = new Date(lastTs);
  const diffMin = Math.round((Date.now() - lastDate) / 60000);
  let lastRepText;
  if (diffMin < 1) lastRepText = 'just now';
  else if (diffMin < 60) lastRepText = `${diffMin} min ago`;
  else if (diffMin < 60 * 24) lastRepText = `${Math.round(diffMin / 60)} hr ago`;
  else lastRepText = `${Math.round(diffMin / (60 * 24))} day ago`;

  // Streak: walk back from today/yesterday counting consecutive days with reps
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!repDates.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!repDates.has(dateKey(cursor))) {
      return { days: 0, lastRepText };
    }
  }
  let streak = 0;
  while (repDates.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { days: streak, lastRepText };
}

function renderStreak() {
  const s = computeStreak();
  const numEl = document.getElementById('streak-num');
  const lastEl = document.getElementById('streak-last');
  if (s.days === 0) {
    numEl.textContent = 'Start a streak today';
  } else {
    numEl.textContent = `🔥 ${s.days}-day streak`;
  }
  lastEl.textContent = `Last rep: ${s.lastRepText}`;
}

// ============= SCREEN ROUTING =============
function showScreen(name) {
  state.screen = name;
  ['loading', 'login', 'denied', 'home', 'tracks', 'drill'].forEach(s => {
    const el = document.getElementById('screen-' + s);
    if (el) el.hidden = (s !== name);
  });
  // Countdown ribbon visible on home/tracks/drill, hidden on login/denied/loading
  const ribbon = document.getElementById('countdown-ribbon');
  if (ribbon) ribbon.hidden = ['login', 'denied', 'loading'].includes(name);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

// ============= TRACK / DRILL =============
function startTrack(round) {
  // In Training mode, show the pre-session brief first; then start.
  if (state.gamificationOn) {
    state.pendingTrack = round;
    showBriefModal(round);
  } else {
    _startTrackNow(round);
  }
}

function _startTrackNow(round) {
  state.currentRound = round;
  state.currentIdx = 0;
  document.getElementById('track-name').textContent = TRACK_NAMES[round];
  showScreen('drill');
  renderSidebarQuestionList();
  renderQuestion();
}

// ============= PRE-SESSION BRIEF =============
async function showBriefModal(round) {
  const modal = document.getElementById('brief-modal');
  const trackLabel = document.getElementById('brief-track-label');
  const title = document.getElementById('brief-title');
  const content = document.getElementById('brief-content');
  trackLabel.textContent = TRACK_NAMES[round] || round;
  const mission = currentMission();
  title.textContent = mission.day > 0 && mission.day < 7 ? mission.title : `${TRACK_NAMES[round]}`;
  content.textContent = 'Loading your pre-session brief…';
  content.classList.add('loading');
  modal.hidden = false;

  try {
    const token = await getIdToken();
    const totalQuestions = questionsForRound(round).length;
    const resp = await fetch(COACH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'brief',
        round,
        roundLabel: TRACK_NAMES[round],
        totalQuestions,
        gamification: state.gamificationOn,
        day: { number: mission.day, label: mission.label },
      }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    content.classList.remove('loading');
    content.innerHTML = renderMarkdown(data.reply || '—');
  } catch (e) {
    console.warn('brief generation failed', e);
    content.classList.remove('loading');
    content.innerHTML = `<em>(Couldn't load the brief. You're still good to go.)</em>\n\n` +
      `<strong>${TRACK_NAMES[round]}</strong> — ${questionsForRound(round).length} questions.\n` +
      (round === 'r1' ? 'Friendly tone. Lead with the hook on Q1. Aim for ~75–90 sec per answer.' :
       round === 'r2' ? 'Mixed register. Probing follow-ups. Trim every answer to under 90 sec.' :
       round === 'r3' ? 'Bar Raiser energy. Stacked probing. Stay calm.' :
       'Fundamentals drill. Walk through your reasoning out loud.');
  }
}

function closeBriefModal() {
  document.getElementById('brief-modal').hidden = true;
}

// ============= INTENT REVEAL =============
async function loadIntentForCurrentQuestion() {
  const list = questionsForRound(state.currentRound);
  const q = list[state.currentIdx];
  if (!q) return;
  if (state.intentLoaded[q.id]) return; // already loaded this session

  const content = document.getElementById('intent-content');
  content.classList.add('loading');
  content.textContent = 'Loading…';

  try {
    const token = await getIdToken();
    const resp = await fetch(COACH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'intent',
        question: q.text,
        lpHint: q.lp || null,
        topic: q.topic || null,
      }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    content.classList.remove('loading');
    content.innerHTML = renderMarkdown(data.reply || '—');
    state.intentLoaded[q.id] = data.reply;
  } catch (e) {
    console.warn('intent fetch failed', e);
    content.classList.remove('loading');
    content.innerHTML = `<em>(Couldn't load the preview right now.)</em>`;
  }
}

// ============= SIDEBAR =============
function isQuestionCompleted(qId) {
  return state.sessionLog.some(entry =>
    entry.round === state.currentRound && entry.questionId === qId
  );
}

function renderSidebarQuestionList() {
  const list = questionsForRound(state.currentRound);
  const container = document.getElementById('sidebar-questions');
  if (!container) return;
  container.innerHTML = '';

  list.forEach((q, idx) => {
    const li = document.createElement('li');
    li.className = 'q-item';
    li.dataset.idx = idx;
    const label = q.lp || q.topic || 'Question';
    const previewText = (q.text || '').substring(0, 56).trim();
    li.innerHTML = `
      <span class="q-num">${idx + 1}</span>
      <div class="q-info">
        <div class="q-label">${escapeHtml(label)}</div>
        <div class="q-preview">${escapeHtml(previewText)}${q.text && q.text.length > 56 ? '…' : ''}</div>
      </div>
    `;
    li.addEventListener('click', () => {
      stopMicAndRecording();
      stopTimer();
      state.currentIdx = idx;
      renderQuestion();
    });
    container.appendChild(li);
  });

  updateSidebarProgress();
}

function updateSidebarProgress() {
  const list = questionsForRound(state.currentRound);
  const items = document.querySelectorAll('#sidebar-questions .q-item');
  items.forEach((item, idx) => {
    const q = list[idx];
    item.classList.remove('current', 'done', 'pending');
    if (idx === state.currentIdx) item.classList.add('current');
    else if (q && isQuestionCompleted(q.id)) item.classList.add('done');
    else item.classList.add('pending');
  });

  const total = list.length;
  const completed = list.filter(q => isQuestionCompleted(q.id)).length;
  const nameEl = document.getElementById('sidebar-round-name');
  if (nameEl) nameEl.textContent = TRACK_NAMES[state.currentRound] || '';
  const countEl = document.getElementById('sidebar-progress-count');
  if (countEl) countEl.textContent = `${completed} of ${total} done`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function leaveDrill() {
  stopMicAndRecording();
  stopTimer();
  showScreen('tracks');
}

function renderQuestion() {
  const list = questionsForRound(state.currentRound);
  const q = list[state.currentIdx];
  const total = list.length || 1;

  document.getElementById('q-progress').textContent = `Question ${Math.min(state.currentIdx + 1, total)} of ${total}`;
  document.getElementById('progress-fill').style.width = `${((state.currentIdx + 1) / total) * 100}%`;

  if (!q) {
    document.getElementById('q-text').textContent = 'No questions available in this track.';
    return;
  }

  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-lp').textContent = q.lp || q.topic || '—';
  document.getElementById('q-time').textContent = q.timeHint || '~90s';

  // Reset question view
  const ta = document.getElementById('answer-text');
  ta.value = '';
  ta.readOnly = false;
  ta.classList.remove('locked');
  document.getElementById('reattempt').checked = false;
  state.conversation = [];
  state.lastScores = null;
  // Reset intent reveal panel for this new question
  const intentEl = document.getElementById('intent-reveal');
  const intentContent = document.getElementById('intent-content');
  if (intentEl) intentEl.open = false;
  if (intentContent) {
    if (state.intentLoaded[q.id]) {
      intentContent.classList.remove('loading');
      intentContent.innerHTML = renderMarkdown(state.intentLoaded[q.id]);
    } else {
      intentContent.classList.remove('loading');
      intentContent.textContent = 'Tap to load the preview.';
    }
  }
  resetTimer();
  resetRecording();
  updateAnswerStats();

  // Reset review view
  document.getElementById('coach-feedback').innerHTML = '';
  document.getElementById('coach-error').hidden = true;
  document.getElementById('chat-history').innerHTML = '';
  document.getElementById('chat-input').value = '';
  document.getElementById('chat-input-row').hidden = true;
  document.getElementById('chat-prompts').hidden = true;

  document.getElementById('question-view').hidden = false;
  document.getElementById('review-view').hidden = true;
  state.reviewMode = false;

  updateSidebarProgress();
}

// ============= SUBMIT / SAVE-NEXT =============
async function submitAnswer() {
  stopMicAndRecording();
  stopTimer();

  const ta = document.getElementById('answer-text');
  ta.readOnly = true;
  ta.classList.add('locked');
  document.getElementById('locked-answer-text').textContent = ta.value || '(no answer recorded)';

  document.getElementById('question-view').hidden = true;
  document.getElementById('review-view').hidden = false;
  state.reviewMode = true;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  await requestInitialCoach();
}

function saveAndNext() {
  const list = questionsForRound(state.currentRound);
  const q = list[state.currentIdx];
  if (q) {
    state.sessionLog.push({
      timestamp: new Date().toISOString(),
      user: (state.user && state.user.ghUsername) || 'unknown',
      round: state.currentRound,
      questionId: q.id,
      questionText: q.text,
      lp: q.lp || null,
      topic: q.topic || null,
      answer: document.getElementById('answer-text').value,
      scores: state.lastScores || null,
      conversation: state.conversation,
      reattempt: document.getElementById('reattempt').checked,
    });
    localStorage.setItem('session_log', JSON.stringify(state.sessionLog));
  }

  if (state.currentIdx < list.length - 1) {
    state.currentIdx++;
    renderQuestion();
  } else {
    showScreen('tracks');
  }
}

// ============= COACH (AI) =============
async function getIdToken() {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error('Not signed in');
  return await user.getIdToken();
}

function renderMarkdown(text) {
  let html = String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return html;
}

function setCoachStatus(text, busy) {
  const el = document.getElementById('coach-status');
  el.textContent = text;
  el.classList.toggle('thinking', !!busy);
}

function showCoachError(message) {
  const el = document.getElementById('coach-error');
  el.textContent = message;
  el.hidden = false;
}

async function requestInitialCoach() {
  const list = questionsForRound(state.currentRound);
  const q = list[state.currentIdx];
  if (!q) return;

  const answer = document.getElementById('answer-text').value.trim();
  setCoachStatus('Reading your answer…', true);
  document.getElementById('coach-feedback').innerHTML = '';
  document.getElementById('coach-error').hidden = true;
  state.coachBusy = true;
  state.lastScores = null;

  try {
    const token = await getIdToken();
    const cachedIntent = state.intentLoaded[q.id] || null;
    const resp = await fetch(COACH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'initial',
        question: q.text,
        answer: answer || '(the candidate gave no answer)',
        rubric: RUBRIC,
        lpHint: q.lp || null,
        topic: q.topic || null,
        intent: cachedIntent,
        gamification: state.gamificationOn,
      }),
    });

    if (!resp.ok) {
      const err = await safeJson(resp);
      throw new Error(err.error || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const parsed = parseReplyAndScores(data.reply || '');
    state.lastScores = parsed.scores;

    // Personal-best detection — only when gamification on
    let pbLine = '';
    if (state.gamificationOn && parsed.scores) {
      const pbs = detectPersonalBests(parsed.scores, q.lp, q.topic);
      if (pbs.length) {
        pbLine = `<div class="personal-best-line">${pbs.join(' · ')}</div>`;
      }
    }

    state.conversation = [
      { role: 'user', content: `**Question I was asked:**\n${q.text}\n\n**My answer (spoken/transcribed):**\n${answer}\n\nGrade me.` },
      { role: 'assistant', content: data.reply },
    ];
    document.getElementById('coach-feedback').innerHTML = pbLine + renderMarkdown(parsed.prose);
    setCoachStatus('Done.', false);

    document.getElementById('chat-input-row').hidden = false;
    document.getElementById('chat-prompts').hidden = false;
  } catch (e) {
    console.error('coach request failed', e);
    showCoachError(`Couldn't reach the coach: ${e.message}. Try refreshing your sign-in (sign out and back in) — the token may have expired.`);
    setCoachStatus('Offline.', false);
  } finally {
    state.coachBusy = false;
  }
}

// Extract the fenced ```json-scores block from the reply.
function parseReplyAndScores(reply) {
  const fence = /```json-scores\s*\n([\s\S]*?)\n```/i;
  const match = reply.match(fence);
  if (!match) return { prose: reply, scores: null };
  let scores = null;
  try {
    scores = JSON.parse(match[1]);
  } catch (e) {
    console.warn('could not parse scores JSON', e, match[1]);
  }
  const prose = reply.replace(fence, '').trimEnd();
  return { prose, scores };
}

function detectPersonalBests(currentScores, lp, topic) {
  if (!currentScores || !state.sessionLog.length) return [];
  const priorAttempts = state.sessionLog.filter(a => {
    if (!a.scores) return false;
    if (lp) return a.lp === lp;
    if (topic) return a.topic === topic;
    return false;
  });
  if (priorAttempts.length === 0) return []; // no prior comparable attempts
  const messages = [];
  RUBRIC.forEach(dim => {
    const cur = currentScores[dim.id];
    if (typeof cur !== 'number') return;
    const priorMax = priorAttempts.reduce((max, a) => {
      const v = a.scores[dim.id];
      return typeof v === 'number' && v > max ? v : max;
    }, 0);
    if (cur > priorMax && cur >= 4) {
      messages.push(`📈 Best ${dim.name} yet — up from ${priorMax} to ${cur}.`);
    }
  });
  return messages.slice(0, 2); // cap at 2 to avoid spam
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || state.coachBusy) return;
  if (state.conversation.length === 0) return;

  input.value = '';
  state.coachBusy = true;

  // Push user message to history + render
  state.conversation.push({ role: 'user', content: text });
  appendChatMsg('user', text);
  appendChatMsg('coach', '', true); // placeholder for streaming feel
  const coachEl = document.querySelector('.chat-msg.coach:last-of-type');

  try {
    const token = await getIdToken();
    const resp = await fetch(COACH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'followup',
        rubric: RUBRIC,
        history: state.conversation,
        gamification: state.gamificationOn,
      }),
    });

    if (!resp.ok) {
      state.conversation.pop();
      const err = await safeJson(resp);
      throw new Error(err.error || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const parsed = parseReplyAndScores(data.reply);
    state.conversation.push({ role: 'assistant', content: data.reply });
    coachEl.innerHTML = renderMarkdown(parsed.prose);
  } catch (e) {
    console.error('chat request failed', e);
    coachEl.innerHTML = `<em>Couldn't reach the coach: ${e.message}</em>`;
  } finally {
    state.coachBusy = false;
    coachEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

function appendChatMsg(role, text, thinking) {
  const history = document.getElementById('chat-history');
  const el = document.createElement('div');
  el.className = `chat-msg ${role}`;
  if (thinking) {
    el.innerHTML = '<em style="color: var(--text-muted);">Coach is thinking…</em>';
  } else {
    el.innerHTML = renderMarkdown(text);
  }
  history.appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

async function safeJson(resp) {
  try { return await resp.json(); } catch (_) { return {}; }
}

// ============= TTS =============
function preprocessForTTS(text) {
  let out = text;
  const keys = Object.keys(ACRONYM_MAP).sort((a, b) => b.length - a.length);
  for (const acronym of keys) {
    const escaped = acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(^|[^A-Za-z0-9])' + escaped + '(?=[^A-Za-z0-9]|$)', 'g');
    out = out.replace(re, (m, pre) => pre + ACRONYM_MAP[acronym]);
  }
  return out;
}

function loadVoices() {
  state.availableVoices = speechSynthesis.getVoices();
  populateVoiceDropdown();
}

function pickBestVoice() {
  const all = state.availableVoices;
  // Tier 1: explicitly preferred high-quality voices
  const preferred = [
    'Evan (Enhanced)', 'Ava (Enhanced)', 'Samantha (Enhanced)',
    'Noelle (Enhanced)', 'Zoe (Enhanced)', 'Reed (Enhanced)',
    'Allison (Enhanced)', 'Susan (Enhanced)', 'Tom (Enhanced)',
    'Evan (Premium)', 'Ava (Premium)', 'Samantha (Premium)',
    'Evan', 'Ava', 'Samantha',
    'Karen', 'Daniel', 'Moira',
    'Google US English',
    'Microsoft Aria Online (Natural) - English (United States)',
  ];
  for (const name of preferred) {
    const voice = all.find(v => v.name === name);
    if (voice) return voice;
  }
  // Tier 2: any Enhanced/Premium/Siri voice in English
  const enhanced = all.find(v =>
    /Enhanced|Premium|Siri|Natural/i.test(v.name) && v.lang && v.lang.startsWith('en')
  );
  if (enhanced) return enhanced;
  return all.find(v => v.lang && v.lang.startsWith('en-US'))
      || all.find(v => v.lang && v.lang.startsWith('en'))
      || all[0];
}

const OPENAI_VOICES = [
  ['openai:echo',    '🎙 OpenAI · Echo (warm, masculine)'],
  ['openai:nova',    '🎙 OpenAI · Nova (friendly, bright)'],
  ['openai:onyx',    '🎙 OpenAI · Onyx (deep, authoritative)'],
  ['openai:shimmer', '🎙 OpenAI · Shimmer (soft, calm)'],
  ['openai:alloy',   '🎙 OpenAI · Alloy (neutral)'],
  ['openai:fable',   '🎙 OpenAI · Fable (expressive)'],
];

function populateVoiceDropdown() {
  const select = document.getElementById('voice-select');
  if (!select) return;
  const previous = select.value;
  select.innerHTML = '';

  // System voices first (sorted: Enhanced/Premium on top)
  const enVoices = state.availableVoices
    .filter(v => v.lang && v.lang.startsWith('en'))
    .slice()
    .sort((a, b) => {
      const aQ = /Enhanced|Premium|Siri|Natural/i.test(a.name) ? 0 : 1;
      const bQ = /Enhanced|Premium|Siri|Natural/i.test(b.name) ? 0 : 1;
      if (aQ !== bQ) return aQ - bQ;
      return a.name.localeCompare(b.name);
    });
  const best = pickBestVoice();
  enVoices.forEach(v => {
    const opt = document.createElement('option');
    opt.value = `system:${v.name}`;
    const cloud = v.localService === false ? ' ☁️' : '';
    const star = /Enhanced|Premium|Siri|Natural/i.test(v.name) ? ' ✨' : '';
    opt.textContent = `${v.name} (${v.lang})${cloud}${star}`;
    select.appendChild(opt);
  });

  // Separator
  const sep = document.createElement('option');
  sep.disabled = true;
  sep.textContent = '──── cloud (needs OpenAI key) ────';
  select.appendChild(sep);

  // OpenAI options
  OPENAI_VOICES.forEach(([val, label]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label;
    select.appendChild(opt);
  });

  // Default selection
  const defaultValue = best ? `system:${best.name}` : (enVoices[0] ? `system:${enVoices[0].name}` : 'openai:echo');
  if (previous && [...select.options].some(o => o.value === previous)) {
    select.value = previous;
  } else {
    select.value = defaultValue;
  }
}

function getSelectedSystemVoice() {
  const sel = document.getElementById('voice-select');
  if (sel && sel.value && sel.value.startsWith('system:')) {
    const name = sel.value.replace('system:', '');
    const v = state.availableVoices.find(x => x.name === name);
    if (v) return v;
  }
  return pickBestVoice();
}

function speakQuestion() {
  const text = document.getElementById('q-text').textContent;
  if (!text) return;
  speak(text);
}

async function speak(text) {
  const sel = document.getElementById('voice-select');
  const value = sel ? sel.value : '';

  if (value && value.startsWith('openai:')) {
    const voice = value.split(':')[1];
    const ok = await speakWithOpenAI(text, voice);
    if (ok) return;
    // fall through to browser TTS if OpenAI failed
  }
  speakWithBrowserTTS(text);
}

async function speakWithOpenAI(text, voice) {
  try {
    const token = await getIdToken();
    const processed = preprocessForTTS(text);
    const resp = await fetch(COACH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'tts',
        text: processed,
        voice,
        tone: state.tone,
      }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      console.warn('OpenAI TTS failed, falling back to browser TTS:', err);
      return false;
    }
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
    return true;
  } catch (e) {
    console.warn('OpenAI TTS exception, falling back:', e);
    return false;
  }
}

function speakWithBrowserTTS(text) {
  const processed = preprocessForTTS(text);
  const utt = new SpeechSynthesisUtterance(processed);
  const voice = getSelectedSystemVoice();
  if (voice) utt.voice = voice;
  if (state.tone === 'skeptical') {
    utt.rate = 1.0; utt.pitch = 0.85;
  } else {
    utt.rate = 0.92; utt.pitch = 1.0;
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(utt);
}

function testVoice() {
  speak('Walk me through your background. Start wherever you would like.');
}

function setTone(tone) {
  state.tone = tone;
  document.querySelectorAll('.seg-control button').forEach(b => {
    b.classList.toggle('active', b.dataset.tone === tone);
  });
}

// ============= STT + RECORDING =============
function setupRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert('Voice input is not supported in this browser. Try Chrome, Edge, or Safari.');
    return null;
  }
  const rec = new SR();
  rec.continuous = true;
  rec.interimResults = false;
  rec.lang = 'en-US';
  rec.onresult = (event) => {
    const ta = document.getElementById('answer-text');
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const text = event.results[i][0].transcript.trim();
        if (text) ta.value = (ta.value ? ta.value.trimEnd() + ' ' : '') + text;
      }
    }
  };
  rec.onerror = (e) => console.warn('STT error', e);
  rec.onend = () => {
    if (state.recognitionActive) {
      try { rec.start(); } catch (_) {}
    }
  };
  return rec;
}

async function toggleMic() {
  const btn = document.getElementById('mic-toggle');
  const label = document.getElementById('mic-label');

  if (state.recognitionActive) {
    stopMicAndRecording();
    btn.classList.remove('active');
    label.textContent = 'Speak';
    stopTimer();
    return;
  }

  // START STT
  if (!state.recognition) state.recognition = setupRecognition();
  if (!state.recognition) return;
  state.recognitionActive = true;
  try { state.recognition.start(); } catch (_) {}

  // START RECORDING in parallel
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.recordedChunks = [];
    state.mediaRecorder = new MediaRecorder(stream);
    state.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size) state.recordedChunks.push(e.data);
    };
    state.mediaRecorder.onstop = () => {
      const blob = new Blob(state.recordedChunks, { type: 'audio/webm' });
      if (state.recordingUrl) URL.revokeObjectURL(state.recordingUrl);
      state.recordingUrl = URL.createObjectURL(blob);
      document.getElementById('play-audio').hidden = false;
      stream.getTracks().forEach(t => t.stop());
    };
    state.mediaRecorder.start();
  } catch (e) {
    console.warn('Audio recording not available', e);
  }

  btn.classList.add('active');
  label.textContent = 'Stop';
  startTimer();
}

function stopMicAndRecording() {
  if (state.recognitionActive && state.recognition) {
    state.recognitionActive = false;
    try { state.recognition.stop(); } catch (_) {}
  }
  if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
    state.mediaRecorder.stop();
  }
  const btn = document.getElementById('mic-toggle');
  const label = document.getElementById('mic-label');
  if (btn) btn.classList.remove('active');
  if (label) label.textContent = 'Speak';
}

function playRecording() {
  if (!state.recordingUrl) return;
  const audio = new Audio(state.recordingUrl);
  audio.play();
}

function resetRecording() {
  if (state.recordingUrl) URL.revokeObjectURL(state.recordingUrl);
  state.recordingUrl = null;
  state.recordedChunks = [];
  if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
    state.mediaRecorder.stop();
  }
  const play = document.getElementById('play-audio');
  if (play) play.hidden = true;
}

// ============= ANSWER STATS (word count + speaking time estimate) =============
// Assumes ~150 words/min spoken pace (typical interview cadence).
function updateAnswerStats() {
  const stats = document.getElementById('answer-stats');
  if (!stats) return;
  const text = document.getElementById('answer-text').value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  stats.classList.remove('warn', 'ok');
  if (words === 0) {
    stats.textContent = '';
    return;
  }
  const seconds = Math.round((words / 150) * 60);
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const timeStr = mm > 0 ? `${mm}m ${ss}s` : `${ss}s`;
  let prefix = '';
  if (seconds <= 90) {
    stats.classList.add('ok');
  } else if (seconds <= 130) {
    // sweet spot tail — no warn yet
  } else {
    stats.classList.add('warn');
    prefix = '⚠ ';
  }
  stats.textContent = `${prefix}${words} words · ≈ ${timeStr} spoken`;
}

// ============= TIMER =============
function startTimer() {
  if (state.timerInterval) return;
  state.timerStart = Date.now();
  state.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.timerStart) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${mm}:${ss}`;
  }, 250);
}
function stopTimer() {
  if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
}
function resetTimer() {
  stopTimer();
  document.getElementById('timer').textContent = '00:00';
}

// ============= DRAWER =============
function openDrawer() {
  document.getElementById('drawer').hidden = false;
}
function closeDrawer() {
  document.getElementById('drawer').hidden = true;
}

// ============= EXPORT / CLEAR =============
function exportLog() {
  const blob = new Blob([JSON.stringify(state.sessionLog, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yn-prep-session-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearSession() {
  if (!confirm('Clear all saved attempts in this browser?')) return;
  state.sessionLog = [];
  localStorage.removeItem('session_log');
}

// ============= BOOT =============
init();
