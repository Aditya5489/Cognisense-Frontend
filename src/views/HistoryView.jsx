import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function HistoryView() {
  const { user, navigate, historyRecords, setSelectedRecord } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'low' | 'moderate' | 'high'
  const [showEmptyState, setShowEmptyState] = useState(false);

  const filteredRecords = historyRecords.filter((record) => {
    if (filter === 'all') return true;
    if (filter === 'high' || filter === 'elevated') {
      return record.riskTier === 'high' || record.riskTier === 'elevated';
    }
    return record.riskTier === filter;
  });

  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    navigate('result');
  };

  const handleExport = () => {
    window.print();
  };

  const avgIndex = historyRecords.length > 0
    ? Math.round(historyRecords.reduce((acc, r) => acc + (Number(r.clinicalIndex) || Number(r.overallRisk) || 0), 0) / historyRecords.length)
    : 0;

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">
      <div className="relative w-full max-w-5xl mx-auto px-margin-mobile lg:px-margin py-space-lg">
        {/* Ambient Neural Glows */}
        <div className="absolute -top-16 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-48 -right-16 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-space-xs mb-space-lg">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm border border-white/50">
              <span className="material-symbols-outlined text-[14px]">neurology</span>
              Longitudinal Clinical Record
            </span>
            <span className="text-outline-variant font-label-sm text-label-sm">/</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {user.fullName || user.name || 'Your account'} {user.id ? `(ID: ${user.id})` : ''}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-space-xs">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
                Check-in history
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
                Review past neuro-acoustic screening results, acoustic stability metrics, and risk trajectory evaluations verified by the CogniSense ensemble model.
              </p>
            </div>

            <div className="flex items-center gap-space-xs flex-shrink-0">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-space-md py-2.5 rounded-full bg-surface-container-lowest hover:bg-surface-container shadow-sm text-on-surface font-label-md text-label-md transition-all duration-200 hover:shadow border border-white/60"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">download</span>
                <span>Export Report (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Longitudinal Metrics Shelf */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mb-space-lg">
          <div className="bg-surface-container-lowest/80 backdrop-blur-md p-space-md rounded-2xl shadow-sm flex items-center justify-between border border-white/60">
            <div>
              <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider block">
                Total Assessments
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  {historyRecords.length}
                </span>
                <span className="font-body-sm text-body-sm text-secondary flex items-center gap-0.5 font-medium">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> Complete
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">history_edu</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur-md p-space-md rounded-2xl shadow-sm flex items-center justify-between border border-white/60">
            <div>
              <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider block">
                Avg Clinical Index
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  {avgIndex}<span className="font-body-sm text-body-sm text-tertiary font-normal">/100</span>
                </span>
                <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium ${
                  avgIndex <= 35 ? 'bg-secondary-fixed/30 text-on-secondary-fixed' : 'bg-primary-fixed/30 text-on-primary-fixed'
                }`}>
                  {avgIndex <= 35 ? 'Optimal' : avgIndex <= 65 ? 'Moderate' : 'Elevated'}
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[22px]">ssid_chart</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur-md p-space-md rounded-2xl shadow-sm flex items-center justify-between border border-white/60">
            <div>
              <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider block">
                Last Completed
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  {historyRecords[0] ? historyRecords[0].date : 'No sessions'}
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">event_available</span>
            </div>
          </div>
        </div>

        {/* Filter Pills & View Switcher */}
        <div className="bg-surface-container-low/70 backdrop-blur-md p-2 rounded-full mb-space-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border border-white/50">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 px-1 scrollbar-none">
            {[
              { id: 'all', label: `All check-ins (${historyRecords.length})` },
              { id: 'low', label: `Low risk (${historyRecords.filter((r) => r.riskTier === 'low').length})` },
              { id: 'moderate', label: `Moderate risk (${historyRecords.filter((r) => r.riskTier === 'moderate').length})` },
              { id: 'high', label: `High / Elevated (${historyRecords.filter((r) => r.riskTier === 'high' || r.riskTier === 'elevated').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  setShowEmptyState(false);
                }}
                className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap ${
                  filter === tab.id && !showEmptyState
                    ? 'bg-primary text-on-primary shadow-sm font-semibold'
                    : 'bg-transparent hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 px-1 justify-end">
            <button
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-tertiary hover:text-on-surface hover:bg-surface-container-highest font-label-sm text-label-sm transition-colors"
              title="Toggle empty state view"
            >
              <span className="material-symbols-outlined text-[16px]">
                {showEmptyState ? 'visibility_off' : 'visibility'}
              </span>
              <span>{showEmptyState ? 'Show Full Records' : 'Simulate Empty'}</span>
            </button>
          </div>
        </div>

        {/* Records Container */}
        <div className="w-full">
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl shadow-[0_12px_36px_-8px_rgba(23,22,42,0.06)] overflow-hidden border border-white/60">
            {/* Table Header / Legend */}
            <div className="bg-surface-container-low/60 px-space-md lg:px-space-lg py-space-sm flex items-center justify-between text-tertiary font-label-sm text-label-sm border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span className="uppercase tracking-wider">Evaluation Timestamp & Protocol</span>
              </div>
              <div className="hidden sm:flex items-center gap-6 pr-6">
                <span className="uppercase tracking-wider">Clinical Index & Risk Tier</span>
              </div>
            </div>

            {/* List Rows or Empty State */}
            {showEmptyState || filteredRecords.length === 0 ? (
              <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary mb-3">
                  <span className="material-symbols-outlined text-[32px]">folder_open</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1">
                  No check-in records found
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mb-4">
                  {showEmptyState
                    ? 'Previewing empty history state. No assessment sessions match this view.'
                    : 'No check-in telemetry packets match your current filter category.'}
                </p>
                <button
                  onClick={() => navigate('screening')}
                  className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary transition-all"
                >
                  Start new check-in
                </button>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-outline-variant/20">
                {filteredRecords.map((record) => {
                  const isLow = record.riskTier === 'low';
                  const isMod = record.riskTier === 'moderate';

                  return (
                    <div
                      key={record.id}
                      onClick={() => handleSelectRecord(record)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between px-space-md lg:px-space-lg py-space-md hover:bg-surface-container-low/70 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start sm:items-center gap-space-md">
                        <div className="w-10 h-10 rounded-full bg-secondary-fixed/40 text-on-secondary-container flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                          <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-label-md text-label-md text-on-surface font-semibold">
                              {record.date}
                            </span>
                            <span className="text-outline-variant">•</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                              {record.time}
                            </span>
                            <span className="text-outline-variant">•</span>
                            <span className="font-label-sm text-label-sm text-tertiary font-mono">
                              #{record.id}
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            {record.protocol || 'CogniSense check-in'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pl-14 sm:pl-0 mt-3 sm:mt-0">
                        <div className="flex items-center gap-3">
                          <span className="font-headline-sm text-[17px] font-bold text-on-surface">
                            {record.clinicalIndex}
                            <span className="text-tertiary text-[12px] font-normal">/100</span>
                          </span>

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
                            <span>{record.riskLabel}</span>
                          </span>

                          <button
                            type="button"
                            className="p-1 rounded-full text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all"
                            title="Inspect Report"
                          >
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
