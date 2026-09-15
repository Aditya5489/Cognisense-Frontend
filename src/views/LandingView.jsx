import { useState } from 'react';
import { useApp } from '../context/AppContext';
import AudioWaveform from '../components/AudioWaveform';
import BrainImage from '../assets/Brain.png';

export default function LandingView() {
  const { startNewScreening } = useApp();
  const [activeDimension, setActiveDimension] = useState('Memory');

  const dimensions = [
    { name: 'Working Memory', level: 'Stable', bars: [true, true, true, true, false], color: 'primary-container' },
    { name: 'Language & Cadence', level: 'Optimal', bars: [true, true, true, true, false], color: 'secondary' },
    { name: 'Executive Attention', level: 'Refined', bars: [true, true, true, false, false], color: 'primary-container' },
    { name: 'Delayed Recall', level: 'Strong', bars: [true, true, true, true, false], color: 'secondary' }
  ];

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      {/* Background Ambient Synapse Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-container/10 blur-[130px]"></div>
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-secondary-fixed/20 blur-[140px]"></div>
        <div className="absolute -bottom-40 right-1/4 w-[550px] h-[550px] rounded-full bg-surface-container-high/60 blur-[130px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin pt-space-md md:pt-space-xl">
        {/* SECTION 1: HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-gutter items-center min-h-[640px] relative">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Glowing Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-md shadow-sm mb-space-md border border-white/60">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="font-label-sm text-label-sm font-semibold tracking-wide text-on-surface">
                AI-powered speech & cognition screening
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display-hero text-headline-lg-mobile md:text-display-hero text-on-surface tracking-tight leading-tight mb-space-md">
              Understand your mind,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-secondary">
                one check-in at a time.
              </span>
            </h1>

            {/* Body Copy */}
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-lg leading-relaxed">
              CogniSense uses adaptive machine learning to analyze speech cadence, acoustic phonetics, and cognitive micro-tasks—identifying subtle shifts through a peaceful, entirely private check-in.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-space-sm mb-space-xl w-full sm:w-auto">
              <button
                onClick={startNewScreening}
                className="px-space-lg py-3.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-[0_12px_32px_rgba(108,92,231,0.38)] hover:shadow-[0_16px_40px_rgba(108,92,231,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                <span>Start a free check-in</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <a
                href="#how-it-works"
                className="px-space-md py-3.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-xl text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-secondary text-[20px]">play_circle</span>
                <span>See how it works</span>
              </a>
            </div>

            {/* Trust Indicators Row */}
            <div className="grid grid-cols-3 gap-3 pt-space-md w-full max-w-lg border-t border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">10–15 min</span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant leading-none mt-0.5">Quick check-in</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">neurology</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">83 features</span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant leading-none mt-0.5">Voice + Cognition</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">Private</span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant leading-none mt-0.5">HIPAA-ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hero Visual (Cognition Dish + 3D Brain + Waveform + Orbiting Cards) */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[480px] lg:min-h-[560px]">
            {/* Circular Frosted Glass Cognition Dish */}
            <div className="relative w-full max-w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-surface-container-high/60 via-surface-container-lowest/80 to-secondary-fixed/20 backdrop-blur-2xl shadow-[0_24px_64px_rgba(26,25,45,0.08)] flex items-center justify-center overflow-hidden border border-white/60">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-container/15 via-transparent to-secondary/20 pointer-events-none"></div>
              <div className="absolute w-72 h-72 rounded-full bg-primary-container/20 blur-3xl -top-10 -right-10 pointer-events-none"></div>
              <div className="absolute w-60 h-60 rounded-full bg-secondary-fixed/30 blur-3xl -bottom-10 -left-10 pointer-events-none"></div>

              {/* Head Silhouette SVG framing */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-25" fill="none" viewBox="0 0 480 480">
                <path d="M150 420 C150 355 165 315 178 285 C190 260 186 220 178 190 C165 150 178 95 230 70 C275 48 335 65 355 110 C368 135 370 160 365 180 C360 196 375 205 388 214 C400 224 392 245 370 250 C355 255 345 268 342 288 C335 328 348 385 355 420 Z" fill="#6C5CE7" fillOpacity="0.18" stroke="#6C5CE7" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>

              {/* Radial neural glow */}
              <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-primary-container/30 via-surface-tint/20 to-secondary/30 blur-2xl pointer-events-none animate-pulse"></div>

              {/* 3D Brain Asset */}
              <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                <img
                  src={BrainImage}
                  alt="CogniSense 3D Translucent Neural Brain Model"
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_16px_32px_rgba(83,65,205,0.22)] transition-transform duration-700 hover:scale-105"
                  style={{ maskImage: 'radial-gradient(circle at center, black 65%, transparent 98%)', WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 98%)' }}
                />
              </div>

              {/* Speech Cadence Waveform stream tag */}
              <div className="absolute bottom-8 left-6 z-20 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface">
                  <span className="font-label-sm text-secondary font-bold">Speech Cadence:</span>
                  <span>2.3 wps</span>
                </div>
                <svg className="w-12 h-3.5" viewBox="0 0 50 14" fill="none">
                  <path d="M0 7 Q12.5 0, 25 7 T50 7" stroke="#006a63" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              {/* Lexical Density tag */}
              <div className="absolute top-10 right-8 z-20 flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/50">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-sm text-[11px] font-semibold text-on-surface tracking-wide">
                  Lexical Density: <span className="text-primary font-bold">0.72</span>
                </span>
              </div>

              {/* Pause Ratio tag */}
              <div className="absolute top-24 left-6 z-20 flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/50">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                <span className="font-label-sm text-[11px] font-semibold text-on-surface tracking-wide">
                  Pause Ratio: <span className="text-secondary font-bold">0.14</span>{' '}
                  <span className="text-secondary text-[10px] font-normal">[Stable]</span>
                </span>
              </div>

              {/* Multi-modal Telemetry tag */}
              <div className="absolute bottom-20 right-6 z-20 flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/50">
                <span className="material-symbols-outlined text-secondary text-[14px]">stream</span>
                <span className="font-label-sm text-[11px] font-semibold text-on-surface tracking-wide">
                  Multi-modal Telemetry: <span className="text-secondary font-medium">Active stream</span>
                </span>
              </div>
            </div>

            {/* Orbiting Glass Cards */}
            <div className="absolute -top-4 -left-2 sm:left-4 bg-surface-container-lowest/85 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_12px_28px_rgba(26,25,45,0.08)] -rotate-3 z-20 max-w-[190px] border border-white/60">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-label-sm text-[12px] font-semibold text-on-surface">Memory Working</span>
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                <span className="w-2.5 h-2.5 rounded-sm bg-secondary"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-surface-container-lowest/85 backdrop-blur-xl p-4 rounded-2xl shadow-[0_16px_32px_rgba(26,25,45,0.08)] rotate-2 z-20 border border-white/60">
              <div className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">
                Sequence Latency
              </div>
              <div className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
                <span className="text-on-surface-variant font-normal">2 → 4 → 8 →</span>
                <span className="text-secondary font-bold px-1.5 py-0.5 rounded bg-secondary-fixed/30">[ 16 ]</span>
              </div>
              <span className="font-body-sm text-[11px] text-secondary font-medium">98.2% baseline speed</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: AI ANALYSIS CONSOLE */}
        <section className="my-space-xl rounded-3xl bg-[#131224] text-on-primary p-space-md sm:p-space-lg lg:p-space-xl shadow-2xl relative overflow-hidden">
          <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-secondary/15 blur-[100px] pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-primary-container/20 blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center relative z-10">
            {/* Terminal Column (Left) */}
            <div className="lg:col-span-6 bg-[#0E0D1A]/90 rounded-2xl p-space-md font-mono text-[13px] leading-relaxed shadow-inner border border-white/10">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error/70 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-secondary-fixed/50 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-secondary inline-block"></span>
                  <span className="text-white/60 text-[12px] ml-2 font-sans font-medium">terminal — cognisense-engine-v4</span>
                </div>
                <span className="text-[11px] text-secondary-fixed bg-secondary-fixed/10 px-2 py-0.5 rounded">
                  LIVE INGESTION
                </span>
              </div>

              <div className="space-y-1.5 text-white/90">
                <p className="text-secondary-fixed font-bold">&gt; CogniSense AI --stream active</p>
                <p className="text-white/50">&gt; analyzing check-in acoustic packet #4082...</p>
                <div className="py-1"></div>
                <div className="flex justify-between text-white/80">
                  <span className="text-white/40">speech_rate</span>
                  <span className="text-secondary-fixed">2.3 wps <span className="text-white/40">[normal cadences]</span></span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span className="text-white/40">pause_ratio</span>
                  <span className="text-white/90">0.14 <span className="text-secondary">(stable variance)</span></span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span className="text-white/40">lexical_features</span>
                  <span className="text-white/90">31 semantic density units</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span className="text-white/40">phonetic_entropy</span>
                  <span className="text-white/90">0.84 bits</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span className="text-white/40">active_ensemble</span>
                  <span className="text-secondary-fixed">RF + SVM + LogReg weighted</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span className="text-white/40">telemetry_status</span>
                  <span className="text-secondary-fixed animate-pulse">analyzing 83 features synchronously</span>
                </div>
              </div>

              {/* Micro Visualizer Bar */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                <span>Lossless Buffer: 99.8%</span>
                <div className="flex gap-1 h-3 items-end">
                  <span className="w-1 bg-secondary h-2 rounded-full"></span>
                  <span className="w-1 bg-secondary h-3 rounded-full"></span>
                  <span className="w-1 bg-secondary h-1 rounded-full"></span>
                  <span className="w-1 bg-primary-container h-2.5 rounded-full"></span>
                  <span className="w-1 bg-secondary h-2 rounded-full"></span>
                </div>
              </div>
            </div>

            {/* Ensemble Architecture Column (Right) */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary-fixed font-label-sm text-label-sm mb-space-sm">
                <span className="material-symbols-outlined text-[16px]">analytics</span>
                <span>AI-assisted screening pipeline</span>
              </div>
              <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-white mb-space-sm">
                Multiple signals. One clearer picture.
              </h2>
              <p className="font-body-md text-body-md text-white/70 mb-space-md leading-relaxed">
                CogniSense integrates advanced machine learning models to analyze speech patterns, semantic structures, and cognitive latency across 83 clinical features.
              </p>

              {/* Model Pipeline Diagram */}
              <div className="w-full bg-white/5 rounded-2xl p-space-md mb-space-md border border-white/10">
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="block font-label-sm text-[12px] text-white font-semibold">Random Forest</span>
                    <span className="text-[10px] text-white/50">Non-linear splits</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="block font-label-sm text-[12px] text-white font-semibold">Support Vector</span>
                    <span className="text-[10px] text-white/50">Hyperplane bound</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="block font-label-sm text-[12px] text-white font-semibold">Logistic Reg</span>
                    <span className="text-[10px] text-white/50">Probability baseline</span>
                  </div>
                </div>

                <div className="flex justify-center my-1 text-secondary-fixed">
                  <span className="material-symbols-outlined text-[20px]">keyboard_double_arrow_down</span>
                </div>

                <div className="bg-primary-container/30 p-2.5 rounded-xl text-center mb-3 border border-primary-container/40">
                  <span className="font-label-sm text-label-sm font-semibold text-primary-fixed">
                    Ensemble Weighted Consensus Engine
                  </span>
                </div>

                <div className="flex justify-center my-1 text-secondary-fixed">
                  <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
                </div>

                <div className="bg-secondary/20 p-2.5 rounded-xl text-center border border-secondary/30">
                  <span className="font-label-sm text-label-sm font-semibold text-secondary-fixed">
                    Cognitive Signal Indicator (Multi-factor Awareness)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/60 text-body-sm text-[13px]">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px]">info</span>
                <span>Screening aid only — does not provide a confirmed medical diagnosis.</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: KEY STATISTICS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm sm:gap-space-md mb-space-xl">
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col border border-white/60">
            <span className="font-display-hero text-headline-lg sm:text-display-hero text-primary-container leading-none font-bold mb-2">
              83
            </span>
            <span className="font-headline-sm text-[17px] font-semibold text-on-surface mb-1">
              Speech & behavioral
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Continuous acoustic and temporal markers extracted.
            </span>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col border border-white/60">
            <span className="font-display-hero text-headline-lg sm:text-display-hero text-secondary leading-none font-bold mb-2">
              3
            </span>
            <span className="font-headline-sm text-[17px] font-semibold text-on-surface mb-1">
              ML models in ensemble
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Validated algorithms cross-correlating signal accuracy.
            </span>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col border border-white/60">
            <span className="font-display-hero text-headline-lg sm:text-display-hero text-primary leading-none font-bold mb-2">
              10
            </span>
            <span className="font-headline-sm text-[17px] font-semibold text-on-surface mb-1">
              Cognitive micro-tasks
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Targeting memory, executive focus, and word retrieval.
            </span>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col border border-white/60">
            <span className="font-display-hero text-headline-lg sm:text-display-hero text-on-surface leading-none font-bold mb-2">
              10-15
            </span>
            <span className="font-headline-sm text-[17px] font-semibold text-on-surface mb-1">
              Minutes per check-in
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Self-paced, calm, and done comfortably from home.
            </span>
          </div>
        </section>

        {/* SECTION 4: EDUCATIONAL — CONSTELLATION VISUAL */}
        <section id="early-signs" className="my-space-xl p-space-lg sm:p-space-xl rounded-3xl bg-surface-container/40 backdrop-blur-xl relative overflow-hidden border border-white/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-gutter items-center relative z-10">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-md shadow-sm mb-space-md border border-white/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
                </span>
                <span className="font-label-sm text-label-sm font-semibold tracking-wider text-secondary uppercase">
                  UNDERSTANDING COGNITIVE HEALTH
                </span>
              </div>

              <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface mb-space-sm font-semibold tracking-tight leading-tight">
                What is early-stage{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-surface-tint to-secondary">
                  cognitive shift?
                </span>
              </h2>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-space-sm leading-relaxed">
                Dementia is an umbrella term for progressive changes that influence <strong className="text-on-surface font-semibold">memory</strong>, <strong className="text-on-surface font-semibold">thinking</strong>, and <strong className="text-on-surface font-semibold">communication</strong>. Early shifts are gradual and easily masked within busy schedules.
              </p>

              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-space-lg leading-relaxed">
                By observing variations in <strong className="text-on-surface font-semibold">speech cadence</strong>, subtle <strong className="text-on-surface font-semibold">word retrieval latency</strong>, and focused <strong className="text-on-surface font-semibold">attention</strong> before pronounced symptoms surface, families gain precious time to establish baselines.
              </p>

              <div className="inline-flex items-center gap-3 p-3 px-4 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl border border-white/50 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-secondary-fixed/40 flex items-center justify-center shrink-0 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-label-sm text-[13px] font-semibold text-on-surface">Cognitive Baseline Instrument</span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant leading-tight mt-0.5">CogniSense is an investigational screening aid.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Holographic 3D Female Profile + Constellation Orbits */}
            <div className="lg:col-span-7 relative flex items-center justify-center min-h-[550px] lg:min-h-[600px]">
              <div className="relative w-full max-w-[550px] h-[550px] flex items-center justify-center">
                {/* Ambient glows */}
                <div className="absolute w-72 h-72 rounded-full bg-primary-container/25 blur-3xl -top-4 right-10 animate-pulse"></div>
                <div className="absolute w-64 h-64 rounded-full bg-secondary-fixed/30 blur-3xl bottom-4 left-6"></div>

                {/* SVG Constellation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" fill="none" viewBox="0 0 550 550">
                  <ellipse cx="275" cy="275" rx="240" ry="220" stroke="#6C5CE7" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4 6" />
                  <ellipse cx="275" cy="275" rx="190" ry="180" stroke="#22C3B6" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="3 5" />
                  <circle cx="275" cy="260" r="130" stroke="#6C5CE7" strokeOpacity="0.15" strokeWidth="1.2" />

                  {/* Connectors */}
                  <path d="M275 160 Q275 90 275 42" stroke="#6C5CE7" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                  <path d="M205 190 Q120 150 70 120" stroke="#22C3B6" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                  <path d="M175 260 Q100 260 45 250" stroke="#6C5CE7" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                  <path d="M190 350 Q110 390 60 410" stroke="#22C3B6" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                  <path d="M350 180 Q430 140 480 110" stroke="#6C5CE7" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                  <path d="M380 260 Q450 250 500 240" stroke="#22C3B6" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                </svg>

                {/* 3D Profile Silhouette from Stitch assets */}
                <div className="relative z-10 w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvjaJQBfEE2Nl9IitI9SvivHuvFebga6tCJhdmm9zSMc5DwcV2zo146peCK_U5TuCY-qYX5ZcqJHlT6htoBzuRApipHUyFhMF-dVwCmWH9FYH8EOPCHMiJX90VS3peQ0EjCgQ2oFbxsrO2Y1sFQISe-XN-SxfAWEIgsUCUanp6d1Sa7za0DA7cLexCeI7ejV1LcfSWrG7MUBYBvt-qxYXQlS2QlzMZrd1yVAsM31WTvFdThCLEKUaF"
                    alt="CogniSense 3D Translucent Neural Profile"
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_20px_40px_rgba(83,65,205,0.18)]"
                    style={{ maskImage: 'radial-gradient(circle at center, black 55%, transparent 95%)', WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 95%)' }}
                  />
                </div>

                {/* 6 Dimension Orbit Pills */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/50">
                  <span className="font-label-sm text-[12px] font-semibold text-on-surface">Memory</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                </div>

                <div className="absolute top-16 left-2 sm:left-6 z-20 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/50">
                  <span className="font-label-sm text-[12px] font-semibold text-on-surface">Speech</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                </div>

                <div className="absolute top-1/2 -translate-y-6 -left-2 sm:left-2 z-20 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/50">
                  <span className="font-label-sm text-[12px] font-semibold text-on-surface">Language</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                </div>

                <div className="absolute bottom-20 left-4 sm:left-8 z-20 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/50">
                  <span className="font-label-sm text-[12px] font-semibold text-on-surface">Recall</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                </div>

                <div className="absolute top-14 right-2 sm:right-6 z-20 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/50">
                  <span className="font-label-sm text-[12px] font-semibold text-on-surface">Reasoning</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                </div>

                <div className="absolute top-1/2 -translate-y-10 right-0 sm:right-4 z-20 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/50">
                  <span className="font-label-sm text-[12px] font-semibold text-on-surface">Attention</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                </div>

                {/* Cognitive Snapshot Floating Card */}
                <div className="absolute -bottom-6 right-0 sm:right-2 bg-surface-container-lowest/95 backdrop-blur-2xl p-3.5 rounded-2xl shadow-[0_16px_32px_rgba(26,25,45,0.12)] border border-white/60 z-30 max-w-[210px]">
                  <div className="flex items-center justify-between gap-2 pb-1.5 mb-2 border-b border-surface-container">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[15px]">insights</span>
                      <span className="font-label-sm text-[11px] font-semibold text-on-surface tracking-wide">Cognitive snapshot</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Memory</span>
                      <span className="text-primary font-medium">●●●●○</span>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Language</span>
                      <span className="text-secondary font-medium">●●●●○</span>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Attention</span>
                      <span className="text-primary font-medium">●●●○○</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-surface-container/60 flex items-center gap-1.5 text-[10px] font-medium text-secondary">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    <span className="font-semibold">Multi-task baseline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: COMMON EARLY SIGNS */}
        <section className="my-space-xl">
          <div className="text-center max-w-2xl mx-auto mb-space-lg">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">SIGNS & SYMPTOMS</span>
            <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface mt-1 mb-space-xs font-semibold">
              Common early patterns to observe
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Knowing what to watch for brings clarity rather than fear. Recognizing these everyday patterns early opens the door to supportive care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {[
              {
                icon: 'history',
                title: 'Memory lapses',
                desc: 'Forgetting recently absorbed information, key calendar dates, or repeatedly asking the same question within short intervals.',
                color: 'bg-primary-fixed text-primary'
              },
              {
                icon: 'chat_bubble_outline',
                title: 'Trouble finding words',
                desc: 'Struggling to locate everyday vocabulary, pausing mid-sentence, or substituting unusual descriptors for familiar objects.',
                color: 'bg-secondary-fixed/40 text-secondary'
              },
              {
                icon: 'task_alt',
                title: 'Difficulty with familiar tasks',
                desc: 'Trouble executing practiced routines, such as preparing a favorite recipe, navigating a well-known route, or managing personal budgets.',
                color: 'bg-surface-container-high text-on-surface'
              },
              {
                icon: 'schedule',
                title: 'Confusion with time or place',
                desc: 'Losing track of seasons, the passage of days, or temporarily forgetting where one is and how they arrived there.',
                color: 'bg-secondary-fixed/40 text-secondary'
              },
              {
                icon: 'search',
                title: 'Misplacing items',
                desc: 'Putting everyday belongings into atypical places (e.g., wallet in refrigerator) and encountering difficulty retracing steps.',
                color: 'bg-primary-fixed text-primary'
              },
              {
                icon: 'sentiment_neutral',
                title: 'Withdrawal or mood shifts',
                desc: 'Subtle pulls away from active hobbies, family dinners, or noticeable adjustments in confidence and social enthusiasm.',
                color: 'bg-surface-container-high text-on-surface'
              }
            ].map((sign, idx) => (
              <div
                key={idx}
                className="p-space-md rounded-2xl bg-surface-container-lowest/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all flex flex-col items-start border border-white/60 hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-xl ${sign.color} flex items-center justify-center mb-3 shadow-sm`}>
                  <span className="material-symbols-outlined text-[22px]">{sign.icon}</span>
                </div>
                <h3 className="font-headline-sm text-[18px] font-semibold text-on-surface mb-1.5">{sign.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{sign.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: INTERACTIVE COGNITIVE SNAPSHOT WIDGET */}
        <section className="my-space-xl p-space-lg rounded-3xl bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low backdrop-blur-2xl shadow-sm border border-white/60">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-space-lg">
            <div className="w-full md:w-1/2 bg-surface-container-lowest p-space-md rounded-2xl shadow-md border border-white/70">
              <div className="flex items-center justify-between mb-space-sm pb-2 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
                  <span className="font-label-lg text-label-lg font-semibold text-on-surface">Cognitive Snapshot</span>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary px-2 py-0.5 rounded bg-secondary-fixed/20">
                  Sample Metric
                </span>
              </div>

              <div className="space-y-3.5">
                {dimensions.map((dim, idx) => (
                  <div key={idx} className="cursor-pointer" onClick={() => setActiveDimension(dim.name)}>
                    <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface">
                      <span className={activeDimension === dim.name ? 'font-bold text-primary' : ''}>{dim.name}</span>
                      <span className="text-secondary font-bold">{dim.level}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {dim.bars.map((filled, barIdx) => (
                        <span
                          key={barIdx}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            filled ? `bg-${dim.color}` : 'bg-surface-container-high'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-start">
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed/30 text-secondary flex items-center justify-center mb-3 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">graphic_eq</span>
              </div>
              <h3 className="font-headline-md text-headline-sm sm:text-headline-md text-on-surface font-semibold mb-2">
                Holistic pattern assessment
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-sm">
                Single moments do not define cognitive health. CogniSense maps patterns across multiple micro-tasks to construct a reliable baseline portrait over time, isolating normal fatigue from deeper shifts.
              </p>
              <span className="font-body-sm text-[13px] text-on-surface-variant italic">
                Patterns across multiple tasks help create a broader screening picture — never a standalone diagnostic conclusion.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 7: HOW A CHECK-IN WORKS (3-Step Journey) */}
        <section className="my-space-xl" id="how-it-works">
          <div className="text-center max-w-2xl mx-auto mb-space-lg">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">THE PROCESS</span>
            <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface mt-1 mb-space-xs font-semibold">
              How a check-in works
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Simple, compassionate, and conducted at your own pace from your phone, tablet, or computer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-space-md rounded-2xl shadow-sm flex flex-col items-start border border-white/60 hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center justify-center mb-space-sm shadow-md">
                01
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1">Speak</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                Answer a few spoken prompts while CogniSense analyzes natural speech cadence, pause frequencies, and phonetic variation.
              </p>
              <div className="w-full h-24 rounded-xl bg-surface-container-low flex items-center justify-center px-4">
                <AudioWaveform height={28} barCount={22} color="#6c5ce7" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-space-md rounded-2xl shadow-sm flex flex-col items-start border border-white/60 hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary font-headline-sm text-headline-sm flex items-center justify-center mb-space-sm shadow-md">
                02
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1">Solve</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                Complete brief, engaging cognitive mini-exercises designed to evaluate working memory, sequence recall, and mental flexibility.
              </p>
              <div className="w-full h-24 rounded-xl bg-surface-container-low flex items-center justify-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary-container/20 border-2 border-primary-container flex items-center justify-center text-[10px] font-bold text-primary">A</span>
                <span className="w-7 h-7 rounded-lg bg-secondary/20 border-2 border-secondary flex items-center justify-center text-[10px] font-bold text-secondary">B</span>
                <span className="w-7 h-7 rotate-45 bg-surface-tint/20 border-2 border-surface-tint flex items-center justify-center text-[10px] font-bold text-surface-tint">C</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-space-md rounded-2xl shadow-sm flex flex-col items-start border border-white/60 hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-on-surface text-surface-container-lowest font-headline-sm text-headline-sm flex items-center justify-center mb-space-sm shadow-md">
                03
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1">See your results</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                Review a dignified, comprehensive summary of your cognitive profile to share with your healthcare provider.
              </p>
              <div className="w-full h-24 rounded-xl bg-surface-container-low flex flex-col items-center justify-center p-2">
                <span className="material-symbols-outlined text-secondary text-[24px] mb-1">verified</span>
                <span className="font-label-sm text-[11px] font-semibold text-on-surface">Screening Summary Ready</span>
              </div>
            </div>
          </div>

          <div className="mt-space-md p-3.5 rounded-xl bg-surface-container-high/60 flex items-center justify-center gap-2 text-center text-on-surface-variant text-body-sm border border-white/40">
            <span className="material-symbols-outlined text-secondary text-[18px]">medical_services</span>
            <span>Always consult a qualified healthcare professional for formal diagnosis or clinical guidance.</span>
          </div>
        </section>

        {/* SECTION 8: LARGE CALL TO ACTION BANNER */}
        <section className="my-space-xl rounded-3xl bg-gradient-to-r from-primary-container via-surface-tint to-secondary p-space-lg sm:p-space-xl text-on-primary relative overflow-hidden shadow-xl">
          <svg className="absolute right-0 top-0 h-full opacity-15 pointer-events-none" fill="none" viewBox="0 0 400 400">
            <circle cx="300" cy="200" r="120" stroke="currentColor" strokeDasharray="4 4" strokeWidth="2"></circle>
            <circle cx="300" cy="200" r="60" stroke="currentColor" strokeWidth="2"></circle>
            <line stroke="currentColor" strokeWidth="2" x1="200" x2="380" y1="200" y2="200"></line>
            <line stroke="currentColor" strokeWidth="2" x1="300" x2="300" y1="100" y2="300"></line>
          </svg>

          <div className="relative z-10 max-w-2xl flex flex-col items-start">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">neurology</span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed font-semibold">
                Start your screening today
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-md sm:text-headline-lg text-white mb-space-sm font-semibold">
              Ready to check in on your mind?
            </h2>
            <p className="font-body-lg text-body-lg text-white/90 mb-space-lg leading-relaxed">
              Take a short, private screening and gain a clearer understanding of your cognitive baseline in just 12 minutes.
            </p>
            <button
              onClick={startNewScreening}
              className="px-space-lg py-4 rounded-full bg-white text-on-surface font-label-lg text-label-lg shadow-lg hover:shadow-xl hover:bg-surface-bright transition-all flex items-center gap-2 font-semibold"
            >
              <span>Start a free check-in</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
