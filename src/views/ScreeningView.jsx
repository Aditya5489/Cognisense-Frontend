import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AudioWaveform from '../components/AudioWaveform';
import ClockDial from '../components/ClockDial';
import picnicScene from '../assets/picnic-scene.png';
import {
  MATH_VARIANTS,
  MEMORY_VARIANTS,
  CLOCK_VARIANTS,
  SHAPE_VARIANTS,
  STORY_VARIANTS
} from '../utils/constants';

export default function ScreeningView() {
  const {
    user,
    screeningStep,
    setScreeningStep,
    screeningAnswers,
    setScreeningAnswers,
    sessionSetIdx,
    isAnalyzing,
    analysisError,
    completeScreening
  } = useApp();

  const totalSteps = 12;
  const currentSetIdx = sessionSetIdx % 6;
  const currentMath = MATH_VARIANTS[currentSetIdx];
  const currentMemoryWords = MEMORY_VARIANTS[currentSetIdx];
  const currentClock = CLOCK_VARIANTS[currentSetIdx];
  const currentShape = SHAPE_VARIANTS[currentSetIdx];
  const currentStory = STORY_VARIANTS[currentSetIdx];
  const reading_Passage="The old lighthouse stood at the edge of the cliff, its light sweeping over the dark water every few seconds. Fishermen relied on it to find their way home safely, especially on foggy nights when the coastline was hard to see."

  // Timers & Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [activeRecordingField, setActiveRecordingField] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [fluencyTimeLeft, setFluencyTimeLeft] = useState(60);
  const [animalInput, setAnimalInput] = useState('');
  const [recallInput, setRecallInput] = useState('');

  // Media recording & Web Speech API refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Fluency timer (Task 3)
  useEffect(() => {
    let timer;
    if (screeningStep === 3 && fluencyTimeLeft > 0) {
      timer = setInterval(() => {
        setFluencyTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [screeningStep, fluencyTimeLeft]);

  // Recording counter
  useEffect(() => {
    let recTimer;
    if (isRecording) {
      recTimer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(recTimer);
  }, [isRecording]);

  // Show the words-to-memorize for this session's variant. This is the
  // *prompt* the user needs to remember, not an answer — it's fine for it to
  // come straight from the variant. Answer fields (math, clock, shape,
  // story) are intentionally NOT seeded here: they must only ever reflect
  // what the user actually enters, never a pre-filled "correct" value.
  useEffect(() => {
    setScreeningAnswers((prev) => ({
      ...prev,
      wordsLearned: currentMemoryWords
    }));
  }, [currentSetIdx, currentMemoryWords, setScreeningAnswers]);

  // Voice recording & transcription handler
  const startRecording = (fieldKey) => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setActiveRecordingField(fieldKey);

    // Browser Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript + ' ';
          }
          if (fieldKey === 'speech1') {
            setScreeningAnswers((prev) => ({ ...prev, pictureDescription: text.trim() }));
          } else if (fieldKey === 'speech2') {
            setScreeningAnswers((prev) => ({ ...prev, readingPassageText: text.trim() }));
          } else if (fieldKey === 'speech3') {
            setScreeningAnswers((prev) => ({ ...prev, dailyRoutineText: text.trim() }));
          }
        };
        recognition.onerror = (e) => console.warn('SpeechRecognition error:', e);
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition error:', err);
      }
    }

    // MediaRecorder audio blob capture
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Data = reader.result?.toString().split(',')[1] || '';
              setScreeningAnswers((prev) => ({
                ...prev,
                audioClips: {
                  ...(prev.audioClips || {}),
                  [fieldKey]: base64Data
                }
              }));
            };
            reader.readAsDataURL(audioBlob);
            stream.getTracks().forEach((track) => track.stop());
          };

          mediaRecorder.start(250);
        })
        .catch((err) => {
          console.warn('Mic permission error / unavailable:', err.message);
        });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setActiveRecordingField(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
      mediaRecorderRef.current = null;
    }
  };

  const toggleRecording = (fieldKey) => {
    if (isRecording && activeRecordingField === fieldKey) {
      stopRecording();
    } else {
      if (isRecording) stopRecording();
      startRecording(fieldKey);
    }
  };

  const addAnimal = () => {
    if (!animalInput.trim()) return;
    setScreeningAnswers((prev) => ({
      ...prev,
      animalsNamed: [...(prev.animalsNamed || []), animalInput.trim()]
    }));
    setAnimalInput('');
  };

  const addRecalledWord = () => {
    if (!recallInput.trim()) return;
    setScreeningAnswers((prev) => ({
      ...prev,
      recalledWords: [...(prev.recalledWords || []), recallInput.trim()]
    }));
    setRecallInput('');
  };

  const nextStep = () => {
    stopRecording();
    if (screeningStep < totalSteps) {
      setScreeningStep((s) => s + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    stopRecording();
    if (screeningStep > 1) {
      setScreeningStep((s) => s - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Processing Overlay
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0E0D1A] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-secondary animate-spin"></div>
          <div
            className="absolute inset-3 rounded-full border-4 border-secondary/20 border-t-primary-container animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '2s' }}
          ></div>
          <span className="material-symbols-outlined text-secondary text-[48px] animate-pulse">neurology</span>
        </div>

        <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-white mb-2 font-semibold">
          Processing Cognitive Telemetry
        </h2>
        <p className="font-body-md text-body-md text-white/70 max-w-md mb-6 leading-relaxed">
          Aggregating acoustic cadence, semantic density, and visuospatial coordinates across the CogniSense AI ensemble...
        </p>

        <div className="w-full max-w-md bg-white/5 rounded-2xl p-4 border border-white/10 font-mono text-[12px] space-y-1.5 text-left text-white/80">
          <div className="flex justify-between text-secondary-fixed">
            <span>&gt; Acoustic features (MFCC, jitter, pause)</span>
            <span>85 features</span>
          </div>
          <div className="flex justify-between text-primary-fixed">
            <span>&gt; Linguistic analysis (TTR, word density)</span>
            <span>calculated</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>&gt; Ensemble ML model</span>
            <span>evaluating probability</span>
          </div>
          <div className="flex justify-between text-secondary pt-1 border-t border-white/10 font-bold">
            <span>&gt; Scoring with ML ensemble</span>
            <span className="animate-pulse">Active Session</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">
      <div className="relative w-full max-w-5xl mx-auto px-margin-mobile lg:px-margin py-space-md">
        {/* Top Assessment Meta Bar */}
        <div className="w-full bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(26,25,45,0.04)] p-space-sm sm:px-space-md mb-space-md border border-white/60">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                <span className="font-semibold uppercase tracking-wide">Assessment in Progress</span>
              </span>
              <span className="text-tertiary hidden sm:inline">•</span>
              <span className="font-label-sm text-label-sm text-on-surface font-mono font-medium">
                Variant Set #{currentSetIdx + 1}
              </span>
              <span className="text-tertiary hidden sm:inline">•</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
                <span>Answers save as you go</span>
              </span>
            </div>

            <div className="flex items-center gap-space-xs self-end lg:self-auto">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Step <strong className="text-on-surface">{screeningStep}</strong> of {totalSteps}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-primary-container to-secondary transition-all duration-300 rounded-full"
              style={{ width: `${(screeningStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Error notification if submission failed */}
        {analysisError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-amber-600">warning</span>
            <span>{analysisError}</span>
          </div>
        )}

        {/* MAIN STEP CONTENT CONTAINER */}
        <div className="w-full bg-surface-container-lowest/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5 border border-white/80 min-h-[480px] flex flex-col justify-between">
          {/* ================= STEP 1: AUDITORY VERBAL LEARNING ================= */}
          {screeningStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 1 · Auditory Verbal Learning
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Remember these 5 words
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Listen carefully or read the 5 words below. You will be asked to recall them later in the session.
                </p>
              </div>

              {/* Word Capsules */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-4">
                {currentMemoryWords.map((word, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-surface-container-high/60 border border-primary/20 text-center shadow-sm flex flex-col items-center justify-center hover:scale-105 transition-transform"
                  >
                    <span className="text-[12px] font-mono text-tertiary mb-1">Word #{idx + 1}</span>
                    <span className="font-headline-sm text-[20px] font-bold text-primary tracking-wide capitalize">
                      {word}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-secondary-fixed/10 border border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">record_voice_over</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Practice repeating all 5 words aloud to calibrate acoustic baseline cadence.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRecording('speech_practice')}
                  className={`px-4 py-2 rounded-full font-label-sm text-label-sm flex items-center gap-2 transition-all ${
                    isRecording && activeRecordingField === 'speech_practice'
                      ? 'bg-error text-white animate-pulse'
                      : 'bg-secondary text-white hover:bg-secondary/90'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                  <span>
                    {isRecording && activeRecordingField === 'speech_practice'
                      ? `Recording (${recordingSeconds}s)...`
                      : 'Practice Aloud'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: ORIENTATION QUESTIONS ================= */}
          {screeningStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 2 · Temporal & Spatial Orientation
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Orientation questions
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Select or confirm your current date, season, and location awareness.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface mb-1.5 font-medium">
                    What is the current year?
                  </label>
                  <select
                    value={screeningAnswers.orientation.year}
                    onChange={(e) =>
                      setScreeningAnswers({
                        ...screeningAnswers,
                        orientation: { ...screeningAnswers.orientation, year: e.target.value }
                      })
                    }
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface outline-none"
                  >
                    <option value="" disabled>Select year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface mb-1.5 font-medium">
                    What day of the week is today?
                  </label>
                  <select
                    value={screeningAnswers.orientation.dayOfWeek}
                    onChange={(e) =>
                      setScreeningAnswers({
                        ...screeningAnswers,
                        orientation: { ...screeningAnswers.orientation, dayOfWeek: e.target.value }
                      })
                    }
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface outline-none"
                  >
                    <option value="" disabled>Select day</option>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-sm text-label-sm text-on-surface mb-1.5 font-medium">
                    Where are you completing this check-in? (City / Location)
                  </label>
                  <input
                    type="text"
                    value={screeningAnswers.orientation.location}
                    onChange={(e) =>
                      setScreeningAnswers({
                        ...screeningAnswers,
                        orientation: { ...screeningAnswers.orientation, location: e.target.value }
                      })
                    }
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface outline-none"
                    placeholder="e.g. Hyderabad / Home"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: NAME SOME ANIMALS ================= */}
          {screeningStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 3 · Category Verbal Fluency
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Name as many animals as you can
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Type or say them aloud. You have 60 seconds. Naming 10+ is standard for baseline fluency.
                </p>
              </div>

              {/* Timer Bar */}
              <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                    {fluencyTimeLeft}s
                  </div>
                  <div>
                    <span className="font-label-md text-label-md text-on-surface font-semibold block">
                      Time Remaining
                    </span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">
                      Continuous fluency telemetry active
                    </span>
                  </div>
                </div>
                <span className="text-secondary font-semibold font-mono text-[14px]">
                  {screeningAnswers.animalsNamed?.length || 0} animals entered
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={animalInput}
                  onChange={(e) => setAnimalInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAnimal())}
                  placeholder="Type an animal (e.g. Tiger, Elephant) and press Enter..."
                  className="flex-1 h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface outline-none"
                />
                <button
                  type="button"
                  onClick={addAnimal}
                  className="px-5 rounded-xl bg-primary text-white font-medium"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {screeningAnswers.animalsNamed?.map((animal, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-sm font-medium border border-primary/20"
                  >
                    {animal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 4: MONEY MATH ================= */}
          {screeningStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 4 · Executive Math & Working Calculation
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Practical money calculation
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Tests mental flexibility and multi-step arithmetic reasoning.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-white/60 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px] mt-0.5">payments</span>
                  <div>
                    <p className="font-body-lg text-body-lg text-on-surface font-medium leading-relaxed">
                      {currentMath.q}
                    </p>
                    <p className="font-body-sm text-on-surface-variant text-sm mt-1">
                      Calculate the total amount spent, and the remaining balance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
                    Total Spent:
                  </label>
                  <input
                    type="text"
                    value={screeningAnswers.mathSpent}
                    onChange={(e) =>
                      setScreeningAnswers({ ...screeningAnswers, mathSpent: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface font-semibold outline-none"
                    placeholder="e.g. 700"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
                    Remaining Balance:
                  </label>
                  <input
                    type="text"
                    value={screeningAnswers.mathRemaining}
                    onChange={(e) =>
                      setScreeningAnswers({ ...screeningAnswers, mathRemaining: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface font-semibold outline-none"
                    placeholder="e.g. 300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: CLOCK DRAWING ================= */}
          {screeningStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 5 · Visuospatial Executive Clock Drawing
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Draw an analog clock showing {currentClock.display}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Draw numbers 1 through 12 and place the hour and minute hands to read{' '}
                  <strong className="text-primary font-bold">{currentClock.display}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                {/* Draggable clock face */}
                <div className="relative rounded-3xl bg-white p-3 shadow-md border-2 border-surface-container-high">
                  <ClockDial
                    hourAngle={screeningAnswers.clockHourAngle}
                    minuteAngle={screeningAnswers.clockMinuteAngle}
                    onChange={({ hourAngle, minuteAngle }) =>
                      setScreeningAnswers({ ...screeningAnswers, clockHourAngle: hourAngle, clockMinuteAngle: minuteAngle })
                    }
                  />
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-64">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Drag the thick hour hand and the thinner minute hand to set the time.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setScreeningAnswers({ ...screeningAnswers, clockHourAngle: 0, clockMinuteAngle: 0 })
                    }
                    className="p-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors flex items-center justify-center gap-1.5 text-sm"
                    title="Reset hands"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    <span>Reset hands</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 6: SHAPE DISCRIMINATION ================= */}
          {screeningStep === 6 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 6 · Geometric Shape Discrimination
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold capitalize">
                  Identify the {currentShape.identify}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Select the shape corresponding to the requested geometry, then verify the largest shape.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
                {[
                  { name: 'triangle', label: 'Triangle', sides: 3, icon: 'change_history' },
                  { name: 'circle', label: 'Circle', sides: 0, icon: 'circle' },
                  { name: 'square', label: 'Square', sides: 4, icon: 'square' },
                  { name: 'hexagon', label: 'Hexagon', sides: 6, icon: 'hexagon' }
                ].map((shape, idx) => {
                  const isSelected = screeningAnswers.selectedShape?.toLowerCase() === shape.name;
                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        setScreeningAnswers({ ...screeningAnswers, selectedShape: shape.name })
                      }
                      className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-fixed/20 shadow-md scale-105'
                          : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[44px] text-primary">
                        {shape.icon}
                      </span>
                      <span className="font-headline-sm text-[16px] font-semibold text-on-surface">
                        {shape.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface mb-2 font-medium">
                  Which shape appears largest in volume?
                </label>
                <div className="flex gap-4">
                  {['circle', 'triangle', 'square'].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer text-sm capitalize">
                      <input
                        type="radio"
                        name="largestShape"
                        value={s}
                        checked={screeningAnswers.largestShape?.toLowerCase() === s}
                        onChange={() => setScreeningAnswers({ ...screeningAnswers, largestShape: s })}
                        className="accent-primary"
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 7: STORY COMPREHENSION ================= */}
          {screeningStep === 7 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 7 · Story Comprehension & Auditory Memory
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Read or listen to the short story
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-white/60 leading-relaxed font-body-md text-on-surface">
                "{currentStory.passage}"
              </div>

              <div className="space-y-4">
                {currentStory.questions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-2">
                    <p className="font-label-md text-label-md text-on-surface font-semibold">
                      Question {qIdx + 1}: {q.label}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {q.options.map((opt) => {
                        const currentAns = screeningAnswers.storyAnswers?.[qIdx];
                        const isChosen = currentAns?.toLowerCase() === opt.toLowerCase();
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => {
                              const nextArr = [...(screeningAnswers.storyAnswers || [])];
                              nextArr[qIdx] = opt;
                              setScreeningAnswers({ ...screeningAnswers, storyAnswers: nextArr });
                            }}
                            className={`p-2.5 rounded-xl border text-sm capitalize transition-all ${
                              isChosen
                                ? 'bg-secondary text-white font-medium border-secondary shadow-sm'
                                : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 8: DELAYED WORD RECALL ================= */}
          {screeningStep === 8 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 8 · Delayed Free Recall
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Recall the 5 words from earlier
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Enter or speak as many of the 5 words from Task 1 as you can remember.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={recallInput}
                  onChange={(e) => setRecallInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRecalledWord())}
                  placeholder="Type a recalled word and press Enter..."
                  className="flex-1 h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface outline-none"
                />
                <button
                  type="button"
                  onClick={addRecalledWord}
                  className="px-5 rounded-xl bg-primary text-white font-medium"
                >
                  Add
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {screeningAnswers.recalledWords?.map((word, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-surface-container-high/60 border border-secondary/30 text-center shadow-sm"
                  >
                    <span className="text-[11px] font-mono text-secondary block mb-1">Recalled #{idx + 1}</span>
                    <span className="font-label-lg font-bold text-on-surface capitalize">{word}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 9: READ THIS PASSAGE ALOUD ================= */}
          {screeningStep === 9 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 9 · Acoustic Reading Cadence & Prosody
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Read this passage aloud
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  CogniSense records voice audio to measure pauses, pitch variation, and speech tempo.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-surface-container-low/70 border border-white/70 font-body-lg text-body-lg text-on-surface leading-loose shadow-inner">
                "{reading_Passage}"
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-white/50">
                <div className="w-48 sm:w-72">
                  <AudioWaveform
                    height={24}
                    barCount={24}
                    isActive={isRecording && activeRecordingField === 'speech2'}
                    color="#22c3b6"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toggleRecording('speech2')}
                  className={`px-6 py-2.5 rounded-full font-label-md text-label-md flex items-center gap-2 shadow-sm ${
                    isRecording && activeRecordingField === 'speech2'
                      ? 'bg-error text-white animate-pulse'
                      : 'bg-primary-container text-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                  <span>
                    {isRecording && activeRecordingField === 'speech2'
                      ? `Recording (${recordingSeconds}s)... Stop`
                      : 'Record Passage Aloud'}
                  </span>
                </button>
              </div>
              <div className="p-6 rounded-3xl bg-surface-container-low/70 border border-white/70 font-body-lg text-body-lg text-on-surface leading-loose shadow-inner">
                "{screeningAnswers.readingPassageText}"
              </div>
            </div>
          )}

          {/* ================= STEP 10: DESCRIBE THIS PICTURE ================= */}
          {screeningStep === 10 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 10 · Visual Scene Description
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Describe what you see in this picture
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Mention people, actions, and details taking place in the illustration.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-md border border-white/60">
                  <img
                    src={picnicScene}
                    alt="A family picnicking in a park: a mother, father and two children sit on a checkered blanket eating sandwiches while a kite flies off into the trees and a dog runs away with a sandwich"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="w-full md:w-1/2 space-y-3">
                  <button
                    type="button"
                    onClick={() => toggleRecording('speech1')}
                    className={`w-full py-3 rounded-full font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm ${
                      isRecording && activeRecordingField === 'speech1'
                        ? 'bg-error text-white animate-pulse'
                        : 'bg-secondary text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                    <span>
                      {isRecording && activeRecordingField === 'speech1'
                        ? `Recording (${recordingSeconds}s)... Stop`
                        : 'Record Spoken Description'}
                    </span>
                  </button>

                  <textarea
                    rows={4}
                    value={screeningAnswers.pictureDescription}
                    onChange={(e) =>
                      setScreeningAnswers({ ...screeningAnswers, pictureDescription: e.target.value })
                    }
                    className="w-full p-3 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-body-sm text-on-surface outline-none"
                    placeholder="Describe what you see in the illustration..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 11: DESCRIBE YOUR DAILY ROUTINE ================= */}
          {screeningStep === 11 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 11 · Procedural Sequence Description
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  Describe your typical morning routine
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Sequencing practiced events tests procedural memory and executive temporal ordering.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleRecording('speech3')}
                  className={`px-6 py-2.5 rounded-full font-label-md text-label-md flex items-center gap-2 shadow-sm ${
                    isRecording && activeRecordingField === 'speech3'
                      ? 'bg-error text-white animate-pulse'
                      : 'bg-primary text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                  <span>
                    {isRecording && activeRecordingField === 'speech3'
                      ? `Recording (${recordingSeconds}s)... Stop`
                      : 'Speak Routine Aloud'}
                  </span>
                </button>
              </div>

              <textarea
                rows={4}
                value={screeningAnswers.dailyRoutineText}
                onChange={(e) =>
                  setScreeningAnswers({ ...screeningAnswers, dailyRoutineText: e.target.value })
                }
                className="w-full p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-body-sm text-on-surface outline-none"
                placeholder="Describe your morning routine steps..."
              />
            </div>
          )}

          {/* ================= STEP 12: READY TO SUBMIT ================= */}
          {screeningStep === 12 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Task 12 · Assessment Summary & Ingestion
                </span>
                <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-semibold">
                  All check-in tasks completed
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Your speech transcripts and cognitive metrics are packaged for evaluation by the CogniSense ensemble model.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  `Task 1: Auditory Verbal Learning (${screeningAnswers.wordsLearned?.length || 5} words)`,
                  `Task 2: Orientation (${screeningAnswers.orientation.dayOfWeek}, ${screeningAnswers.orientation.year})`,
                  `Task 3: Category Fluency (${screeningAnswers.animalsNamed?.length || 0} animals)`,
                  `Task 4: Practical Calculation (Spent: ${screeningAnswers.mathSpent}, Rem: ${screeningAnswers.mathRemaining})`,
                  `Task 5: Visuospatial Clock (${currentClock.display})`,
                  `Task 6: Shape Discrimination (${screeningAnswers.selectedShape})`,
                  'Task 7: Story Comprehension',
                  `Task 8: Delayed Free Recall (${screeningAnswers.recalledWords?.length || 0} words)`,
                  'Task 9: Reading Cadence & Prosody',
                  'Task 10: Visual Scene Description',
                  'Task 11: Procedural Routine Sequence'
                ].map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low/60 border border-white/50 text-[13px] font-medium text-on-surface"
                  >
                    <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-high/60 flex items-center justify-between gap-4 border border-white/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
                  <div className="text-left">
                    <span className="font-label-md text-label-md text-on-surface font-semibold block">
                      Ensemble Endpoint: /api/assess
                    </span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">
                      Scored by the ensemble ML model on submission
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-secondary font-bold px-3 py-1 rounded-full bg-secondary-fixed/30">
                  Ready to Evaluate
                </span>
              </div>
            </div>
          )}

          {/* BOTTOM STEP NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between pt-8 border-t border-outline-variant/30 mt-8">
            <button
              type="button"
              disabled={screeningStep === 1}
              onClick={prevStep}
              className="px-6 py-3 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Previous</span>
            </button>

            {screeningStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={completeScreening}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-container to-secondary text-white font-label-lg text-label-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
              >
                <span>Submit & Run AI Evaluation</span>
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
