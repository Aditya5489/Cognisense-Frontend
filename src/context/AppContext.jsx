import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { getToken, setToken, clearToken } from '../services/api';
import { initialHistoryRecords, normalizeUser, formatAssessmentRecord } from '../utils/constants';

const AppContext = createContext();

// A genuinely blank screening session — nothing pre-answered, nothing
// pre-filled with a "correct" value. wordsLearned/orientation defaults are
// re-populated per-step from the real variant data as the user progresses,
// not seeded with fake transcripts or answer keys.
function blankScreeningAnswers() {
  return {
    wordsLearned: [],
    orientation: {
      year: '',
      dayOfWeek: '',
      location: ''
    },
    animalsNamed: [],
    mathSpent: '',
    mathRemaining: '',
    clockHourAngle: 0,
    clockMinuteAngle: 0,
    selectedShape: '',
    largestShape: '',
    storyAnswers: ['', '', ''],
    recalledWords: [],
    readingPassageText: '',
    pictureDescription: '',
    dailyRoutineText: '',
    audioClips: {
      speech1: '',
      speech2: '',
      speech3: ''
    }
  };
}

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(() => normalizeUser({}));
  const [historyRecords, setHistoryRecords] = useState(initialHistoryRecords);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [backendConnected, setBackendConnected] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Screening flow state matching Backend.py schemas
  const [screeningStep, setScreeningStep] = useState(1);
  const [sessionSetIdx, setSessionSetIdx] = useState(0);
  const [screeningAnswers, setScreeningAnswers] = useState(() => blankScreeningAnswers());

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load history from Backend. Always reflects the real response — including
  // a real empty array — so a genuinely new user never keeps stale/fake
  // records left over from before login.
  const loadHistory = useCallback(async () => {
    try {
      const data = await api.getHistory();
      const formatted = Array.isArray(data?.history) ? data.history.map(formatAssessmentRecord) : [];
      setHistoryRecords(formatted);
      setSelectedRecord(formatted[0] || null);
    } catch (err) {
      console.warn('Could not load backend history:', err.message);
      setHistoryRecords([]);
      setSelectedRecord(null);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        await api.checkHealth();
        setBackendConnected(true);
      } catch (e) {
        console.warn('Cognisense Backend is offline at http://localhost:5050', e.message);
        setBackendConnected(false);
      }

      const token = getToken();
      if (token) {
        try {
          const meData = await api.getMe();
          if (meData && meData.user) {
            setUser(normalizeUser({ ...meData.user, isLoggedIn: true }));
            await loadHistory();
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          clearToken();
          setUser((prev) => ({ ...prev, isLoggedIn: false }));
        }
      } else {
        setUser((prev) => ({ ...prev, isLoggedIn: false }));
      }
    };

    initSession();
  }, [loadHistory]);

  const login = async (email, password) => {
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const res = await api.login({ email, password });
      if (res && res.token && res.user) {
        setToken(res.token);
        const normalized = normalizeUser({ ...res.user, isLoggedIn: true });
        setUser(normalized);
        await loadHistory();
        setIsAuthLoading(false);
        return { success: true, user: normalized };
      }
      throw new Error('Unexpected login response');
    } catch (err) {
      setIsAuthLoading(false);
      const msg = err.message || 'Login failed';
      setAuthError(msg);
      throw err;
    }
  };

  const signup = async (userData) => {
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const res = await api.signup(userData);
      if (res && res.token && res.user) {
        setToken(res.token);
        const normalized = normalizeUser({ ...res.user, isLoggedIn: true });
        setUser(normalized);
        setHistoryRecords([]);
        setIsAuthLoading(false);
        return { success: true, user: normalized };
      }
      throw new Error('Unexpected signup response');
    } catch (err) {
      setIsAuthLoading(false);
      const msg = err.message || 'Registration failed';
      setAuthError(msg);
      throw err;
    }
  };

  const logout = () => {
    clearToken();
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    navigate('home');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.updateProfile(profileData);
      if (res && res.user) {
        const normalized = normalizeUser({ ...res.user, isLoggedIn: true });
        setUser(normalized);
        return normalized;
      }
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  const startNewScreening = () => {
    setScreeningStep(1);
    setIsAnalyzing(false);
    setAnalysisError('');
    setScreeningAnswers(blankScreeningAnswers());
    const nextSet = Math.floor(Math.random() * 6);
    setSessionSetIdx(nextSet);
    navigate('screening');
  };

  const completeScreening = async () => {
    setIsAnalyzing(true);
    setAnalysisError('');

    const payload = {
      transcripts: {
        speech1: screeningAnswers.pictureDescription || '',
        speech2: screeningAnswers.readingPassageText || '',
        speech3: screeningAnswers.dailyRoutineText || ''
      },
      cognitiveAnswers: {
        dayOfWeek: screeningAnswers.orientation.dayOfWeek || '',
        currentYear: String(screeningAnswers.orientation.year || ''),
        location: screeningAnswers.orientation.location || '',
        // No fallback to a "correct" value here — an unanswered field must be
        // submitted as genuinely blank/untouched, or it silently scores as
        // if the user answered correctly without doing anything.
        mathSpent: String(screeningAnswers.mathSpent ?? ''),
        mathRemaining: String(screeningAnswers.mathRemaining ?? ''),
        animals: screeningAnswers.animalsNamed || [],
        objectRecall: screeningAnswers.recalledWords || [],
        clockHourAngle: Number(screeningAnswers.clockHourAngle ?? 0),
        clockMinuteAngle: Number(screeningAnswers.clockMinuteAngle ?? 0),
        shapeClicked: (screeningAnswers.selectedShape || '').toLowerCase(),
        largestShape: (screeningAnswers.largestShape || '').toLowerCase(),
        storyAnswers: screeningAnswers.storyAnswers || ['', '', '']
      },
      audioClips: screeningAnswers.audioClips || {},
      sessionMeta: {
        setIdx: sessionSetIdx
      }
    };

    try {
      const backendResult = await api.submitAssessment(payload);
      const formatted = formatAssessmentRecord(backendResult);

      setHistoryRecords((prev) => [formatted, ...prev]);
      setSelectedRecord(formatted);
      setIsAnalyzing(false);
      navigate('result');
    } catch (err) {
      // IMPORTANT: never fabricate a fake "Low risk" result when the real
      // assessment call fails — that would show a made-up score as if it
      // were real. Surface the error and let the user retry instead.
      console.error('Backend /api/assess error:', err.message);
      setAnalysisError(
        err.message || 'Could not reach the CogniSense server. Please check your connection and try again.'
      );
      setIsAnalyzing(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        user,
        setUser,
        login,
        signup,
        logout,
        updateProfile,
        isAuthLoading,
        authError,
        setAuthError,
        backendConnected,
        historyRecords,
        setHistoryRecords,
        loadHistory,
        selectedRecord,
        setSelectedRecord,
        screeningStep,
        setScreeningStep,
        screeningAnswers,
        setScreeningAnswers,
        sessionSetIdx,
        setSessionSetIdx,
        isAnalyzing,
        analysisError,
        startNewScreening,
        completeScreening
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
export default AppContext;
