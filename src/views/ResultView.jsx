import { useApp } from '../context/AppContext';
import AudioWaveform from '../components/AudioWaveform';

export default function ResultView() {
  const { navigate, user, selectedRecord } = useApp();

  // No fabricated fallback: if there's no real record yet, say so plainly
  // and send the person to start a check-in, rather than showing a fake
  // "CS-9842 / Low risk" demo result as if it were their data.
  if (!selectedRecord) {
    return (
      <div className="flex flex-col w-full items-center justify-center px-margin-mobile lg:px-margin py-space-xl bg-surface min-h-screen text-center">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary mb-4">
          <span className="material-symbols-outlined text-[32px]">quiz</span>
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface font-semibold mb-2">
          No result to show yet
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6">
          Complete a check-in first, and your result will appear here.
        </p>
        <button
          onClick={() => navigate('screening')}
          className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary transition-all"
        >
          Start a check-in
        </button>
      </div>
    );
  }

  const record = selectedRecord;

  const handlePrint = () => {
    window.print();
  };

  const isLow = record.riskTier === 'low';
  const isMod = record.riskTier === 'moderate';

  const riskBadgeColor = isLow
    ? 'bg-secondary-container/40 text-on-secondary-container'
    : isMod
    ? 'bg-amber-500/20 text-amber-900'
    : 'bg-error-container text-on-error-container';

  const riskDotColor = isLow ? 'bg-secondary' : isMod ? 'bg-amber-500' : 'bg-error';

  return (
    <div className="flex flex-col w-full items-center px-margin-mobile lg:px-margin pb-space-xl bg-surface min-h-screen">
      <div className="relative w-full max-w-3xl flex flex-col gap-space-lg">
        {/* Ambient Glows */}
        <div className="absolute -top-12 -left-20 w-80 h-80 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* 1. Header & Context Banner */}
        <div className="flex flex-col items-center text-center pt-space-lg">
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm mb-space-md border border-white/60">
            <span className={`w-2 h-2 rounded-full ${riskDotColor}`}></span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">
              Assessment complete
            </span>
            <span className="font-label-sm text-label-sm text-outline-variant">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Session #{record.id} evaluated via {record.modelUsed || 'CogniSense ML Ensemble'}
            </span>
            <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
          </div>

          <h1 className="font-display-hero-mobile lg:font-display-hero text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight font-semibold">
            Your check-in result
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-xl">
            Completed on {record.date}{record.time ? ` at ${record.time}` : ''}
          </p>
        </div>

        {/* 2. Primary Overall Assessment Card */}
        <div className="w-full bg-surface-container-lowest/85 backdrop-blur-xl rounded-2xl p-space-lg lg:p-space-xl shadow-xl shadow-primary/5 flex flex-col gap-space-lg relative overflow-hidden border border-white/70">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary-fixed-dim via-primary-container to-secondary"></div>

          <div className="flex items-center justify-between flex-wrap gap-space-sm">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Comprehensive Summary
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Overall Clinical Risk Index
              </h2>
            </div>
            <div className={`inline-flex items-center gap-2 px-space-md py-1.5 rounded-full ${riskBadgeColor}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${riskDotColor} animate-pulse`}></span>
              <span className="font-label-md text-label-md font-semibold">{record.riskLabel}</span>
            </div>
          </div>

          {/* Score & Gauge Section */}
          <div className="flex flex-col gap-space-sm bg-surface-container-low/60 rounded-xl p-space-md lg:p-space-lg border border-white/50">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-bold tracking-tight">
                  {record.clinicalIndex}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">/ 100</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Overall Risk Index (Lower is optimal)
              </span>
            </div>

            {/* Horizontal Multi-Zone Track */}
            <div className="relative w-full pt-4 pb-2">
              <div className="h-3 w-full rounded-full bg-surface-container-highest overflow-hidden flex shadow-inner">
                <div className="h-full w-[35%] bg-secondary/80"></div>
                <div className="h-full w-[30%] bg-amber-400/80"></div>
                <div className="h-full w-[35%] bg-error/70"></div>
              </div>

              {/* Pin Marker */}
              <div
                className="absolute top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-700"
                style={{ left: `${Math.min(Math.max(record.clinicalIndex, 5), 95)}%` }}
              >
                <div className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-[10px] leading-tight shadow-md font-bold mb-1">
                  {record.clinicalIndex}
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-surface-container-lowest ring-4 ring-primary-container shadow-sm"></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm pt-1">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>Low (0–35)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Moderate (36–65)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                <span>High (66–100)</span>
              </div>
            </div>
          </div>

          {/* Plain Language Narrative */}
          <div className="flex flex-col gap-space-xs text-on-surface">
            <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {record.notes}
            </p>
            {record.dementiaProb !== undefined && record.dementiaProb !== null && (
              <div className="mt-2 p-3 rounded-xl bg-surface-container-high/60 flex items-center justify-between text-xs text-on-surface-variant">
                <span>Ensemble P(dementia): <strong>{(Number(record.dementiaProb) * 100).toFixed(1)}%</strong></span>
                <span>Model: <strong>{record.modelUsed || 'ensemble'}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Modality Breakdown Card */}
        <div className="w-full bg-surface-container-lowest/85 backdrop-blur-xl rounded-2xl p-space-lg lg:p-space-xl shadow-xl shadow-primary/5 flex flex-col gap-space-lg border border-white/70">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Modality Analysis
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Telemetry Breakdown
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Modality-specific telemetric scoring calibrated across acoustic and cognitive domains.
            </p>
          </div>

          <div className="flex flex-col gap-space-md">
            {/* Submeter 1: Speech & Acoustic */}
            <div className="bg-surface-container-low/50 rounded-xl p-space-md flex flex-col gap-space-sm border border-white/50">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Speech & Acoustic Biomarkers
                    </h3>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">
                      70% Weighted Ensemble Signal
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-md text-headline-md font-semibold text-on-surface">
                    {record.speechScore}
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary">/ 100</span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(record.speechScore, 100)}%` }}
                ></div>
              </div>

              <AudioWaveform height={28} barCount={26} color="#006a63" />

              <div className="flex flex-wrap items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                <span className="bg-surface-container-lowest px-2.5 py-1 rounded-full shadow-sm text-on-surface">
                  85 acoustic &amp; linguistic features analyzed
                </span>
              </div>
            </div>

            {/* Submeter 2: Visuospatial & Cognitive */}
            <div className="bg-surface-container-low/50 rounded-xl p-space-md flex flex-col gap-space-sm border border-white/50">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed/60 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">gesture</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Cognitive & Visuospatial Function
                    </h3>
                    <span className="font-label-sm text-label-sm text-primary font-medium">
                      30% Weighted Cognitive Domain
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-md text-headline-md font-semibold text-on-surface">
                    {record.cognitiveScore ?? record.visuospatialScore}
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary">/ 100</span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-primary-container rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(record.cognitiveScore ?? record.visuospatialScore ?? 0, 100)}%` }}
                ></div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                <span className="bg-surface-container-lowest px-2.5 py-1 rounded-full shadow-sm text-on-surface">
                  Orientation, math, clock, shapes, story &amp; recall
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Disclaimer Banner */}
        <div className="w-full bg-surface-container-low/70 rounded-2xl p-space-md flex flex-col sm:flex-row items-start sm:items-center gap-space-md border border-white/60">
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm text-primary">
            <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-body-md text-body-md text-on-surface font-medium">
              This check-in is an early screening aid, not a definitive medical diagnosis.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Always consult with your clinical team about persistent changes.
              {user.carePartner
                ? <> Your caretaker on file is <span className="font-medium text-on-surface">{user.carePartner}</span> — consider sharing this result with them directly.</>
                : ' No caretaker is on file for this account yet — you can add one from your profile.'}
            </p>
          </div>
        </div>

        {/* 5. Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-space-md pt-space-sm pb-space-lg w-full">
          <button
            onClick={() => navigate('dashboard')}
            className="w-full sm:w-auto min-w-[200px] h-12 px-space-lg rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary-container/30 transition-all active:scale-[0.98]"
          >
            <span>Back to dashboard</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            onClick={() => navigate('history')}
            className="w-full sm:w-auto min-w-[160px] h-12 px-space-lg rounded-full bg-surface-container-lowest/80 text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm hover:bg-surface-container-highest transition-all active:scale-[0.98] border border-white/60"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">history</span>
            <span>View history</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto h-12 px-space-md text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 hover:underline transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export report (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
