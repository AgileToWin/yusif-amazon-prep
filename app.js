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
  curve: 'Curve Balls',
  closing: 'Closing Questions',
};

function componentForQuestion(q) {
  if (q.component === 'ask') return 'Ask';
  if (q.component === 'curve') return 'Curve';
  if (q.component === 'situational') return 'Situational';
  if (q.lp) return 'Behavioral';
  if (q.topic) return 'Technical';
  return '—';
}

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
  savedTakes: JSON.parse(localStorage.getItem('saved_takes') || '[]'),
  gamificationOn: localStorage.getItem('gamificationOn') !== 'false',
  intentLoaded: {},
  pendingTrimType: null,
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
  document.getElementById('goto-progress').addEventListener('click', () => { renderProgress(); showScreen('progress'); });
  document.getElementById('goto-storybank').addEventListener('click', () => { renderStoryBank(); showScreen('storybank'); });
  document.getElementById('confidence-detail-btn').addEventListener('click', toggleConfidenceBreakdown);
  document.getElementById('open-settings-home').addEventListener('click', openDrawer);

  // Progress / Story Bank / Closing screens — nav + print
  document.getElementById('back-from-progress').addEventListener('click', () => showScreen(state.gamificationOn ? 'home' : 'tracks'));
  document.getElementById('back-from-storybank').addEventListener('click', () => showScreen(state.gamificationOn ? 'home' : 'tracks'));
  document.getElementById('back-from-closing').addEventListener('click', () => showScreen('tracks'));
  document.getElementById('print-progress').addEventListener('click', () => window.print());
  document.getElementById('print-storybank').addEventListener('click', () => window.print());
  document.getElementById('print-closing').addEventListener('click', () => window.print());

  // Drawer navigation links
  document.getElementById('drawer-goto-home').addEventListener('click', () => { closeDrawer(); if (state.user) { renderHome(); showScreen('home'); }});
  document.getElementById('drawer-goto-tracks').addEventListener('click', () => { closeDrawer(); showScreen('tracks'); });
  document.getElementById('drawer-goto-progress').addEventListener('click', () => { closeDrawer(); renderProgress(); showScreen('progress'); });
  document.getElementById('drawer-goto-storybank').addEventListener('click', () => { closeDrawer(); renderStoryBank(); showScreen('storybank'); });
  document.getElementById('drawer-goto-closing').addEventListener('click', () => { closeDrawer(); renderClosing(); showScreen('closing'); });
  document.getElementById('drawer-goto-curve').addEventListener('click', () => { closeDrawer(); _startTrackNow('curve'); });

  // Save the take
  document.getElementById('save-take-btn').addEventListener('click', saveCurrentTake);

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
  document.getElementById('bulletproof-btn').addEventListener('click', composeBulletproofAnswer);
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      // Tag the next coach response as trim/punchier so we render side-by-side
      const promptText = chip.dataset.prompt || '';
      if (/trim|under 90|cut/i.test(promptText)) state.pendingTrimType = 'trim';
      else if (/punchier|sharper verbs|tighter sentences/i.test(promptText)) state.pendingTrimType = 'punchier';
      else state.pendingTrimType = null;
      document.getElementById('chat-input').value = promptText;
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

// Per-round integration: each session simulates a complete interview slot.
// R1/R2/R3 weave in curve balls mid-session and closing questions at the end.
// Tech and standalone (curve/closing) tracks return their raw questions.
const CURVE_BALLS_BY_ROUND = {
  r1: ['curve-silence-test', 'curve-ego-check'],
  r2: ['curve-precision-trap', 'curve-technical-pivot'],
  r3: ['curve-provocation-background', 'curve-same-question-twice', 'curve-impossible-choice'],
};
const CLOSING_BY_ROUND = {
  r1: ['closing-90days', 'closing-wish-known'],
  r2: ['closing-biggest-change', 'closing-oncall-rhythm'],
  r3: ['closing-promotion-path', 'closing-redesign-workflow'],
};

function questionsForRound(round) {
  // Non-integrated tracks return their raw set
  if (round === 'tech' || round === 'closing' || round === 'curve') {
    return state.questions.filter(q => q.round === round);
  }

  // Integrated rounds (r1/r2/r3): weave curves into the middle, closings at the end
  const primary = state.questions.filter(q => q.round === round);
  const curveIds = CURVE_BALLS_BY_ROUND[round] || [];
  const closingIds = CLOSING_BY_ROUND[round] || [];
  const curves = curveIds.map(id => state.questions.find(q => q.id === id)).filter(Boolean);
  const closings = closingIds.map(id => state.questions.find(q => q.id === id)).filter(Boolean);

  if (curves.length === 0 && closings.length === 0) return primary;

  // Place curves at roughly 1/3 and 2/3 of the primary block (and a 3rd in R3 near end)
  const ordered = [];
  primary.forEach((q, i) => {
    ordered.push(q);
    const oneThird = Math.floor(primary.length / 3);
    const twoThirds = Math.floor((primary.length * 2) / 3);
    if (i === oneThird - 1 && curves[0]) ordered.push(curves[0]);
    if (i === twoThirds - 1 && curves[1]) ordered.push(curves[1]);
    if (i === primary.length - 2 && curves[2]) ordered.push(curves[2]); // R3 only
  });
  // Closings at the very end
  closings.forEach(q => ordered.push(q));
  return ordered;
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
  ['loading', 'login', 'denied', 'home', 'tracks', 'drill', 'progress', 'storybank', 'closing'].forEach(s => {
    const el = document.getElementById('screen-' + s);
    if (el) el.hidden = (s !== name);
  });
  const ribbon = document.getElementById('countdown-ribbon');
  if (ribbon) ribbon.hidden = ['login', 'denied', 'loading'].includes(name);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

// ============= TRACK / DRILL =============
function startTrack(round) {
  // Closing questions go to the dedicated browse screen (read-only, no coach loop)
  if (round === 'closing') {
    renderClosing();
    showScreen('closing');
    return;
  }
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
  if (state.intentLoading) return; // already in progress

  state.intentLoading = true;
  const content = document.getElementById('intent-content');
  content.classList.add('loading');
  content.textContent = 'Reading the question…';

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

    if (!resp.ok) {
      const errBody = await resp.json().catch(() => ({}));
      const errMsg = errBody.error || `HTTP ${resp.status}`;
      const details = errBody.details ? ` (${String(errBody.details).substring(0, 120)})` : '';
      throw new Error(errMsg + details);
    }

    const data = await resp.json();
    content.classList.remove('loading');
    content.innerHTML = renderMarkdown(data.reply || '—');
    state.intentLoaded[q.id] = data.reply;
  } catch (e) {
    console.warn('intent fetch failed', e);
    content.classList.remove('loading');
    content.innerHTML = `<em>Couldn't load right now: ${escapeHtml(e.message)}.</em> <button class="link-btn retry-intent-btn" style="display:inline; width:auto; color:var(--accent); padding:4px 8px;">Try again</button>`;
    const retryBtn = content.querySelector('.retry-intent-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        delete state.intentLoaded[q.id];
        loadIntentForCurrentQuestion();
      });
    }
  } finally {
    state.intentLoading = false;
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
    let label = q.lp || q.topic;
    if (!label) {
      if (q.component === 'ask') label = 'Their turn — ask';
      else if (q.component === 'curve') label = 'Curve';
      else label = 'Question';
    }
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

  // Component label
  const compName = componentForQuestion(q);
  const compEl = document.getElementById('q-component');
  compEl.textContent = compName;
  compEl.className = 'tag tag-component ' + compName.toLowerCase();

  // Bar Raiser badge — visible on R3 questions and curve balls (composure tests are Bar Raiser energy)
  const isBarRaiserStyle = (state.currentRound === 'r3' && q.round !== 'closing')
    || q.round === 'curve';
  document.getElementById('q-barraiser').hidden = !isBarRaiserStyle;

  // Save take button hidden by default for new question
  const saveBtn = document.getElementById('save-take-btn');
  if (saveBtn) { saveBtn.hidden = true; saveBtn.classList.remove('saved'); saveBtn.textContent = '💾 Save this take to your Story Bank'; }

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
  document.getElementById('bulletproof-row').hidden = true;

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
    const isCurveBall = q.round === 'curve' || q.component === 'curve';
    const curveBallFraming = isCurveBall
      ? '\n\n**This is a CURVE-BALL question — a composure test, not a content test.** The interviewer is throwing this to see how I react when destabilized. Grade my composure, framing, emotional intelligence, and refusal-to-take-the-bait. Did I stay warm under provocation? Did I avoid defensiveness? Did I push back when appropriate? Composure > content here.'
      : '';
    const resp = await fetch(COACH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'initial',
        question: q.text + curveBallFraming,
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
    document.getElementById('bulletproof-row').hidden = false;

    // Show Save Take button if scores look strong
    maybeShowSaveTakeButton(parsed.scores);
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

    // If this was a trim/punchier chip click, render side-by-side Trim Tape
    if (state.pendingTrimType) {
      renderTrimTapeInElement(coachEl, state.pendingTrimType, parsed.prose);
      state.pendingTrimType = null;
    } else {
      coachEl.innerHTML = renderMarkdown(parsed.prose);
    }
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

// ============= TRIM TAPE (side-by-side original vs trimmed) =============
function wordsAndTime(text) {
  const cleaned = (text || '').trim();
  const words = cleaned ? cleaned.split(/\s+/).length : 0;
  const seconds = Math.round((words / 150) * 60);
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const timeStr = mm > 0 ? `${mm}m ${ss}s` : `${ss}s`;
  return { words, seconds, timeStr };
}

function renderTrimTapeInElement(el, trimType, trimmedProse) {
  const originalAnswer = document.getElementById('answer-text').value.trim();
  // Coach's WHY prefix may end with a colon line, then the rewrite. Try to split.
  let why = '', rewritten = trimmedProse;
  const colonSplit = trimmedProse.split(/\n\n/);
  if (colonSplit.length >= 2 && colonSplit[0].length < 220) {
    why = colonSplit[0];
    rewritten = colonSplit.slice(1).join('\n\n');
  }
  const origStats = wordsAndTime(originalAnswer);
  const newStats = wordsAndTime(rewritten);
  const deltaSec = Math.max(0, origStats.seconds - newStats.seconds);
  const deltaStr = deltaSec >= 60 ? `${Math.floor(deltaSec/60)}m ${deltaSec%60}s` : `${deltaSec}s`;
  const label = trimType === 'punchier' ? 'Punchier rewrite' : 'Trimmed to ≤90s';

  el.innerHTML = `
    ${why ? `<div style="margin-bottom: 12px; color: var(--text-soft); font-size: 14px;">${renderMarkdown(why)}</div>` : ''}
    <div class="trim-tape">
      <div class="tape-side original">
        <div class="tape-label">Your original</div>
        <div class="tape-content">${escapeHtml(originalAnswer || '(no answer recorded)')}</div>
        <div class="tape-meta"><span>${origStats.words} words</span><span>≈ ${origStats.timeStr}</span></div>
      </div>
      <div class="tape-side trimmed">
        <div class="tape-label">${label}</div>
        <div class="tape-content">${escapeHtml(rewritten || '—')}</div>
        <div class="tape-meta"><span>${newStats.words} words</span><span>≈ ${newStats.timeStr}</span></div>
      </div>
    </div>
    ${deltaSec > 0 ? `<div class="tape-delta">${origStats.timeStr} → ${newStats.timeStr} · saved ${deltaStr}</div>` : ''}
  `;
}

// ============= BULLETPROOF ANSWER (the closing synthesis) =============
async function composeBulletproofAnswer() {
  if (state.coachBusy) return;
  if (state.conversation.length === 0) return;

  const list = questionsForRound(state.currentRound);
  const q = list[state.currentIdx];
  if (!q) return;

  state.coachBusy = true;
  const btn = document.getElementById('bulletproof-btn');
  if (btn) btn.disabled = true;

  const isTechnical = !!q.topic;
  const isCurve = q.round === 'curve' || q.component === 'curve';
  const lengthHint = isTechnical
    ? '≤2 minutes spoken (~200–250 words)'
    : '≤90 seconds spoken (~140–160 words)';
  const checklist = isCurve
    ? `- Lead with the response pattern, not a fact recital
- Name what the interviewer is testing (composure / refusal-to-take-the-bait / honest gap)
- Optional pushback — but warm, never defensive
- One acknowledgment of the difficulty of the question
- One closing line that ends with stability, not apology`
    : `- One named person (not "the team")
- One quantified outcome (number, %, $, time, scale)
- One honest gap (what I'd do differently)
- One explicit LP bridge sentence at the end
- One warmth moment (a feeling, a reaction, a quote)`;

  const synthPrompt = `**SYNTHESIS REQUEST.** Take everything we've worked through in this conversation — my original answer, your grading, and every rewrite or improvement you've given me — and compose ONE final BULLETPROOF version I can speak in the room.

It must:
- Sound like ME. Not corporate polish, not AI-flavoured. My actual voice.
- ${lengthHint}. Hard ceiling. Cut anything that doesn't earn its space.
- Open with the strongest sentence — usually the result, the customer outcome, or the headline of the story.
- Hit STAR cleanly WITHOUT naming the parts out loud.
- Include:
${checklist}
- Land naturally — feel lived-in, not rehearsed.

Output EXACTLY this format (use these literal labels so my client can parse):

THE_ANSWER:
[the speakable paragraph — no markdown, no bullets, just a clean paragraph I can almost read off the page]

WHY_IT_WORKS:
[1–2 sentences explaining what makes this version land — specifically what changed from my original. Speak directly to me, second person.]

Nothing else. No preamble, no closing remarks, no probing questions.`;

  // Render the loading card BEFORE the network call
  const history = document.getElementById('chat-history');
  const card = document.createElement('div');
  card.className = 'bulletproof-card loading';
  card.innerHTML = `
    <div class="bulletproof-card-head">
      <span class="bulletproof-card-label">✨ Composing your bulletproof answer</span>
      <span class="bulletproof-card-stats">…</span>
    </div>
    <div class="bulletproof-card-answer" style="color: var(--text-muted); font-style: italic;">
      The coach is pulling everything we've worked on into one final version.
    </div>
  `;
  history.appendChild(card);
  card.scrollIntoView({ behavior: 'smooth', block: 'end' });

  // Push the synth request to conversation history
  state.conversation.push({ role: 'user', content: synthPrompt });

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

    const { theAnswer, whyItWorks } = parseBulletproofResponse(parsed.prose);
    const stats = wordsAndTime(theAnswer);

    card.classList.remove('loading');
    card.innerHTML = `
      <div class="bulletproof-card-head">
        <span class="bulletproof-card-label">✨ Your bulletproof answer</span>
        <span class="bulletproof-card-stats">${stats.words} words · ≈ ${stats.timeStr}</span>
      </div>
      <div class="bulletproof-card-answer">${escapeHtml(theAnswer)}</div>
      ${whyItWorks ? `<div class="bulletproof-card-rationale"><strong>Why it works:</strong> ${escapeHtml(whyItWorks)}</div>` : ''}
      <div class="bulletproof-card-actions">
        <button class="bp-copy">📋 Copy</button>
        <button class="secondary bp-speak">🔊 Hear it</button>
        <button class="secondary bp-save">💾 Save to Story Bank</button>
      </div>
    `;
    card.querySelector('.bp-copy').addEventListener('click', (e) => {
      navigator.clipboard.writeText(theAnswer).then(() => {
        e.target.textContent = '✓ Copied';
        setTimeout(() => e.target.textContent = '📋 Copy', 1300);
      });
    });
    card.querySelector('.bp-speak').addEventListener('click', () => speak(theAnswer));
    card.querySelector('.bp-save').addEventListener('click', (e) => {
      saveBulletproofAsTake(theAnswer, whyItWorks);
      e.target.textContent = '✓ Saved';
      e.target.disabled = true;
    });
  } catch (e) {
    console.error('bulletproof composition failed', e);
    card.classList.remove('loading');
    card.innerHTML = `<div class="bulletproof-card-answer" style="color: var(--danger);"><em>Couldn't compose: ${escapeHtml(e.message)}.</em></div>`;
  } finally {
    state.coachBusy = false;
    if (btn) btn.disabled = false;
    card.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

function parseBulletproofResponse(prose) {
  // Match labels with or without bold formatting around them
  const answerRe = /(?:\*\*)?THE_ANSWER:?(?:\*\*)?\s*\n?([\s\S]*?)(?=\n\s*(?:\*\*)?WHY_IT_WORKS|\n*$)/i;
  const whyRe = /(?:\*\*)?WHY_IT_WORKS:?(?:\*\*)?\s*\n?([\s\S]*?)$/i;
  const aMatch = prose.match(answerRe);
  const wMatch = prose.match(whyRe);
  const theAnswer = (aMatch ? aMatch[1] : prose).trim();
  const whyItWorks = wMatch ? wMatch[1].trim() : '';
  return { theAnswer, whyItWorks };
}

function saveBulletproofAsTake(answerText, rationale) {
  const list = questionsForRound(state.currentRound);
  const q = list[state.currentIdx];
  if (!q) return;
  const take = {
    timestamp: new Date().toISOString(),
    questionId: q.id,
    questionText: q.text,
    round: state.currentRound,
    lp: q.lp || null,
    topic: q.topic || null,
    component: componentForQuestion(q),
    answer: answerText,
    scores: state.lastScores || null,
    coachReply: rationale ? `Why it works: ${rationale}` : '',
    bulletproof: true,
  };
  state.savedTakes.push(take);
  localStorage.setItem('saved_takes', JSON.stringify(state.savedTakes));
}

// ============= SAVE THE TAKE =============
function maybeShowSaveTakeButton(scores) {
  const btn = document.getElementById('save-take-btn');
  if (!btn || !scores) return;
  const vals = Object.values(scores).filter(v => typeof v === 'number');
  if (vals.length === 0) return;
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  if (avg >= 4.0) {
    btn.hidden = false;
  }
}

function saveCurrentTake() {
  const list = questionsForRound(state.currentRound);
  const q = list[state.currentIdx];
  if (!q) return;
  const coachReply = (state.conversation.find(m => m.role === 'assistant') || {}).content || '';
  const take = {
    timestamp: new Date().toISOString(),
    questionId: q.id,
    questionText: q.text,
    round: state.currentRound,
    lp: q.lp || null,
    topic: q.topic || null,
    component: componentForQuestion(q),
    answer: document.getElementById('answer-text').value,
    scores: state.lastScores || null,
    coachReply,
  };
  state.savedTakes.push(take);
  localStorage.setItem('saved_takes', JSON.stringify(state.savedTakes));
  const btn = document.getElementById('save-take-btn');
  if (btn) {
    btn.classList.add('saved');
    btn.textContent = '✓ Saved to Story Bank';
    btn.disabled = true;
  }
}

// ============= PROGRESS SCREEN =============
function renderProgress() {
  // Stats
  document.getElementById('stat-reps').textContent = state.sessionLog.length;
  const dateSet = new Set();
  state.sessionLog.forEach(a => {
    if (a.timestamp) dateSet.add(a.timestamp.slice(0, 10));
  });
  document.getElementById('stat-days').textContent = dateSet.size;
  document.getElementById('stat-takes').textContent = state.savedTakes.length;

  // Rubric heatmap — avg per dimension
  const heatmap = document.getElementById('rubric-heatmap');
  heatmap.innerHTML = '';
  RUBRIC.forEach(dim => {
    let sum = 0, count = 0;
    state.sessionLog.forEach(a => {
      if (a.scores && typeof a.scores[dim.id] === 'number') {
        sum += a.scores[dim.id]; count++;
      }
    });
    const avg = count > 0 ? sum / count : 0;
    const pct = (avg / 5) * 100;
    const row = document.createElement('div');
    row.className = 'heatmap-row';
    row.innerHTML = `
      <div class="heatmap-name">${dim.name}</div>
      <div class="heatmap-bar-track"><div class="heatmap-bar-fill" style="width: ${pct}%"></div></div>
      <div class="heatmap-score">${count > 0 ? avg.toFixed(1) : '—'}<span class="denom"> / 5</span></div>
    `;
    heatmap.appendChild(row);
  });

  // LP mastery (full)
  const masteryGrid = document.getElementById('mastery-grid-full');
  const tiers = computeMastery();
  masteryGrid.innerHTML = '';
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
    masteryGrid.appendChild(item);
  });

  // Recent activity (last 10)
  const activityList = document.getElementById('activity-list');
  activityList.innerHTML = '';
  const recent = state.sessionLog.slice(-10).reverse();
  if (recent.length === 0) {
    activityList.innerHTML = '<li class="activity-empty">No reps yet. Start a session to see activity here.</li>';
  } else {
    recent.forEach(a => {
      const li = document.createElement('li');
      li.className = 'activity-item';
      const ts = new Date(a.timestamp);
      const dateStr = ts.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      const scoresHtml = a.scores
        ? Object.entries(a.scores)
            .filter(([, v]) => typeof v === 'number')
            .map(([k, v]) => `<span title="${k}">${v}</span>`).join(' · ')
        : '<span style="color: var(--text-muted);">no scores</span>';
      li.innerHTML = `
        <div>
          <div class="activity-q">${escapeHtml((a.questionText || '').substring(0, 120))}${(a.questionText || '').length > 120 ? '…' : ''}</div>
          <div class="activity-meta">${dateStr} · ${TRACK_NAMES[a.round] || a.round} · ${a.lp || a.topic || ''}</div>
        </div>
        <div class="activity-scores">${scoresHtml}</div>
      `;
      activityList.appendChild(li);
    });
  }

  // Re-attempt queue
  const reattemptList = document.getElementById('reattempt-list');
  reattemptList.innerHTML = '';
  const reattempts = state.sessionLog.filter(a => a.reattempt).slice(-10).reverse();
  if (reattempts.length === 0) {
    reattemptList.innerHTML = '<li class="activity-empty">No questions marked for re-attempt. Use the checkbox after a session.</li>';
  } else {
    reattempts.forEach(a => {
      const li = document.createElement('li');
      li.className = 'reattempt-item';
      const ts = new Date(a.timestamp);
      const dateStr = ts.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      li.innerHTML = `
        <div>
          <div class="reattempt-q">${escapeHtml((a.questionText || '').substring(0, 140))}${(a.questionText || '').length > 140 ? '…' : ''}</div>
          <div class="reattempt-meta">${TRACK_NAMES[a.round] || a.round} · ${a.lp || a.topic || ''} · marked ${dateStr}</div>
        </div>
      `;
      reattemptList.appendChild(li);
    });
  }
}

// ============= STORY BANK SCREEN =============
function renderStoryBank() {
  const list = document.getElementById('storybank-list');
  const sub = document.getElementById('storybank-sub');
  list.innerHTML = '';
  if (state.savedTakes.length === 0) {
    list.innerHTML = `
      <div class="bank-empty">
        <strong>Your Story Bank is empty.</strong>
        Saved takes appear here when your coach feedback averages 4.0 or higher.
        Open a track, give a strong answer, then tap "Save this take" in the coach panel.
      </div>
    `;
    sub.textContent = '';
    return;
  }
  sub.textContent = `${state.savedTakes.length} saved take${state.savedTakes.length === 1 ? '' : 's'} — the answers the panel would write down.`;

  // Group by LP/topic
  const groups = {};
  state.savedTakes.forEach(t => {
    const key = t.lp || t.topic || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  Object.entries(groups).forEach(([key, takes]) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'bank-group';
    groupEl.innerHTML = `<div class="bank-group-label">${escapeHtml(key)} — ${takes.length} take${takes.length === 1 ? '' : 's'}</div>`;
    takes.reverse().forEach((t, idx) => {
      const card = document.createElement('div');
      card.className = 'bank-card';
      const scoresHtml = t.scores
        ? Object.entries(t.scores)
            .filter(([, v]) => typeof v === 'number')
            .map(([k, v]) => `<span title="${k}">${k}: ${v}</span>`).join(' · ')
        : '';
      const ts = new Date(t.timestamp);
      const dateStr = ts.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      card.innerHTML = `
        <div class="bank-card-q">${escapeHtml(t.questionText)}</div>
        <div class="bank-card-a">${escapeHtml(t.answer || '(no answer recorded)')}</div>
        <div class="bank-card-meta">
          <div class="bank-card-scores">${scoresHtml}</div>
          <div class="bank-card-actions">
            <button data-bank-copy="${escapeHtml(t.answer || '')}">Copy</button>
            <button data-bank-delete="${t.timestamp}">Delete</button>
          </div>
        </div>
        <div class="bank-card-meta" style="margin-top: 8px;">
          <span style="font-size: 11px;">${dateStr} · ${escapeHtml(TRACK_NAMES[t.round] || t.round)}</span>
        </div>
      `;
      groupEl.appendChild(card);
    });
    list.appendChild(groupEl);
  });

  // Wire copy + delete buttons
  list.querySelectorAll('[data-bank-copy]').forEach(b => {
    b.addEventListener('click', () => {
      navigator.clipboard.writeText(b.dataset.bankCopy).then(() => {
        const original = b.textContent;
        b.textContent = '✓ Copied';
        setTimeout(() => b.textContent = original, 1200);
      });
    });
  });
  list.querySelectorAll('[data-bank-delete]').forEach(b => {
    b.addEventListener('click', () => {
      if (!confirm('Delete this saved take?')) return;
      state.savedTakes = state.savedTakes.filter(t => t.timestamp !== b.dataset.bankDelete);
      localStorage.setItem('saved_takes', JSON.stringify(state.savedTakes));
      renderStoryBank();
    });
  });
}

// ============= CLOSING QUESTIONS SCREEN =============
function renderClosing() {
  const list = document.getElementById('closing-list');
  list.innerHTML = '';
  const closingQs = state.questions.filter(q => q.round === 'closing');
  closingQs.forEach(q => {
    const li = document.createElement('li');
    li.className = 'closing-card';
    li.innerHTML = `
      <div class="closing-q">${escapeHtml(q.text)}</div>
      <div class="closing-context"><strong>When to ask:</strong> ${escapeHtml(q.context || '')}</div>
      ${q.strongAnswer ? `<div class="closing-tip">${escapeHtml(q.strongAnswer)}</div>` : ''}
      <div class="closing-actions">
        <button data-closing-speak="${escapeHtml(q.text)}">🔊 Hear it</button>
        <button data-closing-copy="${escapeHtml(q.text)}">Copy</button>
      </div>
    `;
    list.appendChild(li);
  });
  list.querySelectorAll('[data-closing-speak]').forEach(b => {
    b.addEventListener('click', () => speak(b.dataset.closingSpeak));
  });
  list.querySelectorAll('[data-closing-copy]').forEach(b => {
    b.addEventListener('click', () => {
      navigator.clipboard.writeText(b.dataset.closingCopy).then(() => {
        const original = b.textContent;
        b.textContent = '✓ Copied';
        setTimeout(() => b.textContent = original, 1200);
      });
    });
  });
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
