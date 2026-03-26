import { scoreColor } from "../../utils/colors";

/**
 * Circular SVG score ring.
 *
 * Props:
 *   score  – number 0-100
 *   size   – svg width/height in px (default 36)
 *   stroke – ring stroke width (default 3)
 */
export default function ScoreCircle({ score, size = 36, stroke = 3 }) {
  const radius = (size / 2) - stroke;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;
  const color = scoreColor(score);
  const fontSize = size <= 40 ? Math.round(size * 0.25) : Math.round(size * 0.22);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Score: ${score}`}>
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none" stroke="#e5e7eb" strokeWidth={stroke}
      />
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx} y={cy + fontSize * 0.4}
        textAnchor="middle"
        fontSize={fontSize}
        fill={color}
        fontWeight="600"
      >
        {score}
      </text>
    </svg>
  );
}
