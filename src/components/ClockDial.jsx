import { useRef, useState, useCallback } from 'react';

const SIZE = 260;
const CENTER = SIZE / 2;

function angleFromCenter(clientX, clientY, rect) {
  const x = clientX - rect.left - CENTER;
  const y = clientY - rect.top - CENTER;
  // clockwise from 12 o'clock (top), matching the backend's h_target/m_target convention
  let deg = (Math.atan2(x, -y) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

function handPoint(angleDeg, length) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + length * Math.sin(rad),
    y: CENTER - length * Math.cos(rad)
  };
}

export default function ClockDial({ hourAngle, minuteAngle, onChange }) {
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null); // "hour" | "minute" | null

  const handleMove = useCallback(
    (clientX, clientY) => {
      if (!dragging || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const angle = angleFromCenter(clientX, clientY, rect);
      if (dragging === 'hour') onChange({ hourAngle: angle, minuteAngle });
      else onChange({ hourAngle, minuteAngle: angle });
    },
    [dragging, hourAngle, minuteAngle, onChange]
  );

  const onPointerMove = (e) => handleMove(e.clientX, e.clientY);
  const onPointerUp = () => setDragging(null);

  const hourTip = handPoint(hourAngle, 65);
  const minuteTip = handPoint(minuteAngle, 100);

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const outer = { x: CENTER + 116 * Math.sin(a), y: CENTER - 116 * Math.cos(a) };
    const inner = { x: CENTER + 104 * Math.sin(a), y: CENTER - 104 * Math.cos(a) };
    return { outer, inner, key: i };
  });

  return (
    <svg
      ref={svgRef}
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ touchAction: 'none', cursor: dragging ? 'grabbing' : 'default' }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <circle cx={CENTER} cy={CENTER} r={120} fill="#ffffff" stroke="#e4e1f5" strokeWidth="2" />
      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.inner.x}
          y1={t.inner.y}
          x2={t.outer.x}
          y2={t.outer.y}
          stroke="#605d7d"
          strokeWidth="2"
        />
      ))}
      {/* minute hand */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={minuteTip.x}
        y2={minuteTip.y}
        stroke="#6C5CE7"
        strokeWidth="4"
        strokeLinecap="round"
        style={{ cursor: 'grab' }}
        onPointerDown={(e) => {
          e.target.setPointerCapture(e.pointerId);
          setDragging('minute');
        }}
      />
      {/* hour hand */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={hourTip.x}
        y2={hourTip.y}
        stroke="#17162A"
        strokeWidth="6"
        strokeLinecap="round"
        style={{ cursor: 'grab' }}
        onPointerDown={(e) => {
          e.target.setPointerCapture(e.pointerId);
          setDragging('hour');
        }}
      />
      <circle cx={CENTER} cy={CENTER} r="5" fill="#17162A" />
    </svg>
  );
}
