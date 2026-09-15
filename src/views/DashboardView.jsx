import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AudioWaveform from '../components/AudioWaveform';
import api from '../services/api';

export default function DashboardView() {
  const { user, navigate, historyRecords, setSelectedRecord, startNewScreening } = useApp();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [locationQuery, setLocationQuery] = useState('Hyderabad');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const data = await api.getNearbyDoctors(locationQuery);
        if (data && data.doctors) {
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.warn('Failed to load nearby doctors:', err.message);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [locationQuery]);

  const handleViewReport = (record) => {
    setSelectedRecord(record);
    navigate('result');
  };

  const displayName = (user?.fullName || user?.name || 'Patient').split(' ')[0];
  const lastRecord = historyRecords?.[0];

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <div className="relative w-full max-w-[880px] mx-auto px-gutter-mobile sm:px-space-md md:px-0 py-space-lg md:py-space-xl">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-16 -left-20 w-80 h-80 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none -z-10"></div>

        {/* 1. GREETING & HEADER */}
        <section className="flex flex-col gap-space-sm mb-space-lg">
          <div className="flex flex-wrap items-center justify-between gap-space-xs">
            <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm border border-white/50">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>
                {lastRecord ? `Last evaluated: ${lastRecord.date}` : 'Baseline evaluation ready'}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Longitudinal Neuro-Acoustic Protocol
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
              Hello, {displayName}.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Your scheduled cognitive check-in is prepared. Today’s check-in takes about 10–15 minutes and assesses speech fluency, active recall, and auditory attention.
            </p>
          </div>
        </section>

        {/* 2. HERO ACTION CARD ("Start a new check-in") */}
        <section className="relative group rounded-3xl bg-surface-container-lowest/85 backdrop-blur-xl shadow-xl p-space-lg md:p-space-xl mb-space-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-white/70">
          <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-primary-fixed-dim/25 via-transparent to-secondary-fixed/20"></div>

          <div className="relative z-10 flex flex-col gap-space-md">
            {/* Badge row */}
            <div className="flex items-center justify-between flex-wrap gap-space-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm border border-primary/10">
                <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
                <span>Active Protocol: Standard Neuro-Acoustic v2.4</span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
                Clinical AI Grade
              </span>
            </div>

            {/* Main Title & Prompt */}
            <div className="space-y-2">
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Start a new check-in
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl leading-relaxed">
                Find a quiet environment with consistent lighting. When prompted, speak naturally and comfortably into your device microphone.
              </p>
            </div>

            {/* Metric Telemetry Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/60 border border-white/50">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Estimated Time</p>
                  <p className="font-label-md text-label-md text-on-surface font-medium">~12 minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/60 border border-white/50">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Modalities</p>
                  <p className="font-label-md text-label-md text-on-surface font-medium">Voice & Recall</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/60 border border-white/50">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Backend Ingestion</p>
                  <p className="font-label-md text-label-md text-on-surface font-medium">ML Ensemble Active</p>
                </div>
              </div>
            </div>

            {/* Interactive Voice Amplitude Wave Preview */}
            <div className="w-full py-2 px-3 rounded-2xl bg-surface-container-low/50 flex items-center justify-between gap-3 overflow-hidden border border-white/40">
              <div className="w-48 sm:w-64">
                <AudioWaveform height={24} barCount={24} color="#006a63" />
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-medium shrink-0 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                Microphone calibrated • Ready
              </span>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={startNewScreening}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-[0_8px_24px_rgba(108,92,231,0.3)] hover:shadow-[0_12px_32px_rgba(108,92,231,0.45)] hover:bg-primary transition-all duration-200 group-hover:translate-x-0.5"
              >
                <span>Begin check-in</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Audio is processed non-invasively through 85 acoustic and linguistic biomarker vectors.
              </p>
            </div>
          </div>
        </section>

        {/* 3. RECENT CHECK-INS SECTION */}
        <section className="flex flex-col gap-space-sm mb-space-lg">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Recent check-ins
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Telemetry history evaluated by the CogniSense backend
              </p>
            </div>
            <button
              onClick={() => navigate('history')}
              className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors"
            >
              <span>View all history</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Frosted List Container */}
          <div className="rounded-3xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-md p-space-sm sm:p-space-md space-y-2 border border-white/60">
            {historyRecords.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[36px] text-primary mb-2">history</span>
                <p className="font-medium text-on-surface">No evaluations recorded yet</p>
                <p className="text-sm mt-1">Complete your first screening check-in above to establish your cognitive baseline.</p>
              </div>
            ) : (
              historyRecords.slice(0, 5).map((record) => {
                const isLow = record.riskTier === 'low';
                const isMod = record.riskTier === 'moderate';

                return (
                  <div
                    key={record.id}
                    onClick={() => handleViewReport(record)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-2xl bg-surface-container-low/40 hover:bg-surface-container-low transition-colors gap-3 cursor-pointer group border border-transparent hover:border-outline-variant/30"
                  >
                    <div className="flex items-start gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-0.5 sm:mt-0 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[20px]">
                          {isLow ? 'record_voice_over' : isMod ? 'hearing' : 'psychology'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-label-md text-label-md font-semibold text-on-surface">
                            {record.date}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            • Risk: {record.clinicalIndex}%
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          {record.protocol || 'CogniSense Neuro-Acoustic Protocol'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm ${
                          isLow
                            ? 'bg-secondary-container/40 text-on-secondary-container'
                            : isMod
                            ? 'bg-surface-container-highest text-on-surface'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isLow ? 'bg-secondary' : isMod ? 'bg-tertiary' : 'bg-error'
                          }`}
                        ></span>
                        {record.riskLabel}
                      </span>

                      <button
                        aria-label="View Report"
                        className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 4. NEARBY CLINICAL SPECIALISTS (Endpoint: /api/nearby-doctors) */}
        <section className="flex flex-col gap-space-sm mb-space-lg">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Find specialists near you
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Example specialists to search for — not a live directory. Always verify details independently.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="City name..."
                className="h-8 px-3 rounded-full text-xs bg-surface-container-low border border-outline-variant/40 text-on-surface outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loadingDoctors ? (
              <div className="col-span-2 p-6 text-center text-sm text-on-surface-variant">
                Loading nearby clinicians...
              </div>
            ) : (
              doctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-surface-container-lowest/90 border border-white/60 shadow-sm flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-label-lg font-semibold text-on-surface">{doc.name}</h4>
                      <p className="font-body-sm text-xs text-primary font-medium">{doc.speciality} · {doc.hospital}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-bold flex items-center gap-1">
                      ★ {doc.rating}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant">{doc.address}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 mt-1">
                    <span className="text-xs text-tertiary font-mono">{doc.phone}</span>
                    <a
                      href={doc.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5"
                    >
                      <span>Directions</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 5. CARETAKER INFO */}
        <section className="rounded-2xl bg-surface-container-low/80 p-space-md flex items-center gap-space-md text-on-surface-variant border border-white/60">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[18px]">family_restroom</span>
          </div>
          {user?.carePartner ? (
            <p className="font-body-sm text-body-sm">
              <span className="font-medium text-on-surface">Caretaker on file:</span> {user.carePartner}
            </p>
          ) : (
            <p className="font-body-sm text-body-sm">
              No caretaker added yet. You can add one when editing your profile.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
