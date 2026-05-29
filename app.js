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
  { id: 'clarity', name: 'Clarity & Pacing',    hint: 'Concise, asks clarifying Qs' },
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

  bindEvents();
}

function bindEvents() {
  document.getElementById('signin-btn').addEventListener('click', signInWithGitHub);
  document.getElementById('signout-btn-denied').addEventListener('click', signOut);

  document.querySelectorAll('.track-card').forEach(card => {
    card.addEventListener('click', () => startTrack(card.dataset.round));
  });
  document.getElementById('open-settings').addEventListener('click', openDrawer);
  document.getElementById('open-settings-drill').addEventListener('click', openDrawer);

  document.getElementById('back-to-tracks').addEventListener('click', leaveDrill);
  document.getElementById('speak-q').addEventListener('click', speakQuestion);
  document.getElementById('mic-toggle').addEventListener('click', toggleMic);
  document.getElementById('focus-textarea').addEventListener('click', () => document.getElementById('answer-text').focus());
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
    loadQuestionsAndShowTracks();
  } else {
    document.getElementById('denied-user').textContent = ghUsername || email || 'Unknown';
    showScreen('denied');
  }
}

function renderUserPill() {
  const span = document.getElementById('user-name');
  const img = document.getElementById('user-avatar');
  const firstName = (state.user.displayName || '').split(' ')[0] || state.user.ghUsername;
  span.textContent = firstName;
  if (state.user.photoURL) {
    img.src = state.user.photoURL;
    img.hidden = false;
  } else {
    img.hidden = true;
  }
}

// ============= QUESTIONS =============
async function loadQuestionsAndShowTracks() {
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
  showScreen('tracks');
}

function questionsForRound(round) {
  return state.questions.filter(q => q.round === round);
}

// ============= SCREEN ROUTING =============
function showScreen(name) {
  state.screen = name;
  ['loading', 'login', 'denied', 'tracks', 'drill'].forEach(s => {
    const el = document.getElementById('screen-' + s);
    if (el) el.hidden = (s !== name);
  });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

// ============= TRACK / DRILL =============
function startTrack(round) {
  state.currentRound = round;
  state.currentIdx = 0;
  document.getElementById('track-name').textContent = TRACK_NAMES[round];
  showScreen('drill');
  renderSidebarQuestionList();
  renderQuestion();
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
  resetTimer();
  resetRecording();

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
      answer: document.getElementById('answer-text').value,
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

  try {
    const token = await getIdToken();
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
      }),
    });

    if (!resp.ok) {
      const err = await safeJson(resp);
      throw new Error(err.error || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    state.conversation = [
      { role: 'user', content: `**Question I was asked:**\n${q.text}\n\n**My answer (spoken/transcribed):**\n${answer}\n\nGrade me.` },
      { role: 'assistant', content: data.reply },
    ];
    document.getElementById('coach-feedback').innerHTML = renderMarkdown(data.reply);
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
      }),
    });

    if (!resp.ok) {
      state.conversation.pop();
      const err = await safeJson(resp);
      throw new Error(err.error || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    state.conversation.push({ role: 'assistant', content: data.reply });
    coachEl.innerHTML = renderMarkdown(data.reply);
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
  const preferred = [
    'Samantha (Premium)', 'Evan (Premium)', 'Ava (Premium)', 'Allison (Premium)',
    'Samantha', 'Karen', 'Daniel',
    'Google US English',
    'Microsoft Aria Online (Natural) - English (United States)',
    'Microsoft Jenny Online (Natural) - English (United States)',
  ];
  for (const name of preferred) {
    const voice = state.availableVoices.find(v => v.name === name);
    if (voice) return voice;
  }
  return state.availableVoices.find(v => v.lang && v.lang.startsWith('en-US'))
      || state.availableVoices.find(v => v.lang && v.lang.startsWith('en'))
      || state.availableVoices[0];
}

function populateVoiceDropdown() {
  const select = document.getElementById('voice-select');
  if (!select) return;
  const previous = select.value;
  select.innerHTML = '';
  const enVoices = state.availableVoices.filter(v => v.lang && v.lang.startsWith('en'));
  const best = pickBestVoice();
  enVoices.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.name;
    const cloud = v.localService === false ? ' ☁️' : '';
    opt.textContent = `${v.name} (${v.lang})${cloud}`;
    select.appendChild(opt);
  });
  if (previous && enVoices.find(v => v.name === previous)) {
    select.value = previous;
  } else if (best) {
    select.value = best.name;
  }
}

function getSelectedVoice() {
  const sel = document.getElementById('voice-select');
  if (sel && sel.value) {
    const v = state.availableVoices.find(x => x.name === sel.value);
    if (v) return v;
  }
  return pickBestVoice();
}

function speakQuestion() {
  const text = document.getElementById('q-text').textContent;
  if (!text) return;
  speak(text);
}

function speak(text) {
  const processed = preprocessForTTS(text);
  const utt = new SpeechSynthesisUtterance(processed);
  const voice = getSelectedVoice();
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
