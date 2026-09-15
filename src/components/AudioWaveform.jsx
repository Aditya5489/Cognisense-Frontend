export default function AudioWaveform({ isActive = true, height = 32, barCount = 28, color = '#22c3b6' }) {

  // Pre-calculated heights for an organic biological voice cadence
  const baseHeights = [
    25, 40, 65, 80, 45, 30, 70, 95, 85, 60, 40, 75, 90, 100, 70, 50, 85, 95, 60, 40, 65, 80, 55, 35, 60, 75, 45, 30
  ];

  return (
    <div className="flex items-center justify-between gap-1 overflow-hidden px-2 w-full" style={{ height: `${height}px` }}>
      {Array.from({ length: barCount }).map((_, index) => {
        const heightPct = baseHeights[index % baseHeights.length];
        const delay = (index * 0.05).toFixed(2);
        return (
          <div
            key={index}
            className={`w-1 rounded-full transition-all duration-300 ${isActive ? 'animate-pulse' : 'opacity-40'}`}
            style={{
              height: isActive ? `${heightPct}%` : '20%',
              backgroundColor: index % 3 === 0 ? '#6c5ce7' : color,
              animationDelay: `${delay}s`,
              animationDuration: '1.2s'
            }}
          />
        );
      })}
    </div>
  );
}
