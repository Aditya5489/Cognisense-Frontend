export const MATH_VARIANTS = [
  { q: '₹1000 budget: apples ₹200, tricycle ₹500', spent: '700', rem: '300' },
  { q: '₹800 budget: bag ₹350, bottle ₹150', spent: '500', rem: '300' },
  { q: '₹1200 budget: vegetables ₹450, medicine ₹300', spent: '750', rem: '450' },
  { q: '₹600 budget: book ₹120, pen set ₹80', spent: '200', rem: '400' },
  { q: '₹2000 budget: phone repair ₹900, groceries ₹350', spent: '1250', rem: '750' },
  { q: '₹500 budget: shirt ₹180, socks ₹70', spent: '250', rem: '250' }
];

export const MEMORY_VARIANTS = [
  ['apple', 'pen', 'tie', 'house', 'car'],
  ['flower', 'watch', 'book', 'cake', 'fish'],
  ['lemon', 'key', 'hat', 'magnet', 'moon'],
  ['grapes', 'scissors', 'guitar', 'globe', 'elephant'],
  ['coconut', 'bulb', 'target', 'wave', 'trophy'],
  ['mango', 'clock', 'umbrella', 'chair', 'train']
];

export const CLOCK_VARIANTS = [
  { display: '10:50', h_target: 330, m_target: 300 },
  { display: '3:15', h_target: 97, m_target: 90 },
  { display: '6:30', h_target: 195, m_target: 180 },
  { display: '9:00', h_target: 270, m_target: 0 },
  { display: '12:45', h_target: 22, m_target: 270 },
  { display: '7:20', h_target: 220, m_target: 120 }
];

export const SHAPE_VARIANTS = [
  { identify: 'triangle', largest: 'circle' },
  { identify: 'circle', largest: 'triangle' },
  { identify: 'square', largest: 'circle' },
  { identify: 'triangle', largest: 'square' },
  { identify: 'circle', largest: 'square' },
  { identify: 'square', largest: 'triangle' }
];

export const STORY_VARIANTS = [
  {
    passage:
      'Arthur visited the neighborhood market early on Saturday morning. He purchased three fresh baskets of produce before taking the morning bus to meet his family.',
    questions: [
      { label: 'Where did Arthur visit on Saturday morning?', answerKey: 'market', options: ['market', 'hospital', 'library', 'park'] },
      { label: 'How many baskets of produce did he purchase?', answerKey: 'three', options: ['two', 'three', 'four', 'six'] },
      { label: 'What transportation did he take?', answerKey: 'bus', options: ['bus', 'auto', 'train', 'bicycle'] }
    ]
  },
  {
    passage:
      'Sunita walked to the community hospital after breakfast. She waited two hours to consult with the physician and returned home in an auto.',
    questions: [
      { label: 'Where did Sunita walk after breakfast?', answerKey: 'hospital', options: ['hospital', 'market', 'station', 'park'] },
      { label: 'How long did she wait to consult the physician?', answerKey: 'two hours', options: ['two hours', 'three hours', 'one hour', 'four hours'] },
      { label: 'How did she return home?', answerKey: 'auto', options: ['auto', 'bus', 'train', 'bicycle'] }
    ]
  },
  {
    passage:
      'Ramesh walked to the city library in the afternoon. He selected four mystery books and discussed them with librarian Mrs Sharma before leaving.',
    questions: [
      { label: 'Where did Ramesh go in the afternoon?', answerKey: 'library', options: ['library', 'market', 'hospital', 'park'] },
      { label: 'How many books did he select?', answerKey: 'four', options: ['three', 'four', 'five', 'six'] },
      { label: 'Who did he discuss the books with?', answerKey: 'Mrs Sharma', options: ['Mrs Sharma', 'Clara', 'Mr Davis', 'Sister'] }
    ]
  },
  {
    passage:
      'Kavita arrived at the railway station to meet the evening express from Chennai. Her sister stepped off the train carrying two suitcases.',
    questions: [
      { label: 'Where did Kavita go in the evening?', answerKey: 'railway station', options: ['railway station', 'airport', 'bus stop', 'market'] },
      { label: 'Where did the evening express arrive from?', answerKey: 'Chennai', options: ['Chennai', 'Delhi', 'Mumbai', 'Hyderabad'] },
      { label: 'Who stepped off the train?', answerKey: 'sister', options: ['sister', 'brother', 'friend', 'cousin'] }
    ]
  },
  {
    passage:
      'On Sunday morning, the family watched five lively birds playing outside the window before turning on the television to watch news.',
    questions: [
      { label: 'On which day did this take place?', answerKey: 'Sunday', options: ['Sunday', 'Saturday', 'Monday', 'Friday'] },
      { label: 'How many birds did they watch?', answerKey: 'five', options: ['three', 'four', 'five', 'six'] },
      { label: 'What did they turn on afterwards?', answerKey: 'television', options: ['television', 'radio', 'computer', 'music player'] }
    ]
  },
  {
    passage:
      'Vikram spent his afternoon in the botanical park. He noticed six blooming orchid pots near the fountain before riding his bicycle home.',
    questions: [
      { label: 'Where did Vikram spend his afternoon?', answerKey: 'park', options: ['park', 'market', 'library', 'garden'] },
      { label: 'How many orchid pots were near the fountain?', answerKey: 'six', options: ['four', 'five', 'six', 'eight'] },
      { label: 'What did he ride back home?', answerKey: 'bicycle', options: ['bicycle', 'bus', 'auto', 'car'] }
    ]
  }
];

// No seeded demo history — a new or logged-out session starts with none.
// Real records only ever come from the backend via loadHistory()/completeScreening().
export const initialHistoryRecords = [];

export const normalizeUser = (u = {}) => {
  const fullName = u.full_name || u.fullName || u.name || '';
  const caretakerName = u.caretaker_name || u.caretakerName || u.carePartner || '';
  return {
    ...u,
    id: u.id ? `#${u.id}` : '',
    numericId: u.id,
    name: fullName,
    fullName,
    email: u.email || '',
    age: u.age || '',
    phone: u.phone || '',
    caretakerName,
    carePartner: caretakerName,
    caretakerPhone: u.caretaker_phone || u.caretakerPhone || '',
    avatar: u.avatar || null,
    isLoggedIn: false
  };
};

// Turns a raw /api/assess or /api/history response into display-ready fields.
// Only ever derives values from real backend fields (or honest, clearly-generic
// copy) — never fabricates clinician names, protocol IDs, or per-case notes
// that the backend never actually computed.
export const formatAssessmentRecord = (r) => {
  const rawRisk = r.riskLevel || (r.overallRisk > 65 ? 'High' : r.overallRisk > 35 ? 'Moderate' : 'Low');
  const riskTier = rawRisk.toLowerCase();
  const dateObj = r.date ? new Date(r.date) : new Date();
  const dateFormatted = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : r.date || 'Recent';
  const timeFormatted = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  // A short, honest plain-language note keyed only on the real risk tier —
  // not a fabricated per-case clinical observation.
  const genericNote =
    riskTier === 'low'
      ? "Your speech and cognitive answers didn't show notable signs of concern this time."
      : riskTier === 'moderate'
      ? 'A few answers stood out. It may be worth mentioning this check-in to a doctor, especially if you notice a pattern over time.'
      : "This result suggests it's worth discussing with a doctor soon. One screening result on its own isn't a diagnosis.";

  return {
    ...r,
    id: String(r.id ?? `local-${Date.now()}`),
    clinicalIndex: r.overallRisk ?? r.clinicalIndex ?? 0,
    overallRisk: r.overallRisk ?? r.clinicalIndex ?? 0,
    speechScore: r.speechScore ?? 0,
    visuospatialScore: r.cognitiveScore ?? r.visuospatialScore ?? 0,
    cognitiveScore: r.cognitiveScore ?? r.visuospatialScore ?? 0,
    riskLevel: rawRisk,
    riskTier,
    riskLabel: r.riskLabel || `${rawRisk} risk`,
    dementiaProb: r.dementiaProb ?? null,
    modelUsed: r.modelUsed || 'ensemble',
    date: dateFormatted,
    time: timeFormatted,
    // "protocol" here just labels the tool, not a fabricated per-case ID
    protocol: 'CogniSense speech & cognitive check-in',
    notes: genericNote
  };
};
