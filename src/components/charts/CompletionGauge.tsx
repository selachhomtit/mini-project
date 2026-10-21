"use client";

interface Props {
  completedTasks: number;
  totalTasks: number;
}

export function CompletionGauge({ completedTasks, totalTasks }: Props) {
  const pct = totalTasks ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0;

  // Semicircle gauge: the arc runs over the top from the left end (0%) to the right end (100%).
  const CX = 110, CY = 100, R = 80, STROKE = 16;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPt = (deg: number) => ({
    x: CX + R * Math.cos(toRad(deg)),
    y: CY + R * Math.sin(toRad(deg)),
  });

  // 180° = left end, 270° = top, 360° = right end (SVG y grows downward).
  const start = arcPt(180);
  const end = arcPt(180 + (pct / 100) * 180);
  const full = arcPt(360);

  const color = pct >= 75 ? "#22c55e" : pct >= 40 ? "#059669" : "#ef4444";
  const label = pct >= 75 ? "On track" : pct >= 40 ? "In progress" : "Needs focus";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E8E8EF] dark:border-slate-700 p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Completion rate</p>

      <div className="flex flex-col items-center">
        <svg viewBox="0 0 220 128" className="w-full max-w-60" role="img" aria-label={`${pct}% of tasks completed`}>
          {/* track */}
          <path
            d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${full.x} ${full.y}`}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={STROKE}
            strokeLinecap="round"
            className="dark:stroke-slate-800"
          />

          {/* value arc */}
          {pct > 0 && (
            <path
              d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`}
              fill="none"
              stroke={color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          )}

          {/* centre text, inside the arc */}
          <text x={CX} y={CY - 18} textAnchor="middle" fontSize={30} fontWeight={700} className="fill-slate-950 dark:fill-white">
            {pct}%
          </text>
          <text x={CX} y={CY + 2} textAnchor="middle" fontSize={12} fill={color} fontWeight={600}>
            {label}
          </text>

          {/* tick labels under each end of the arc */}
          <text x={start.x} y={CY + 24} textAnchor="middle" fontSize={11} className="fill-slate-400">0%</text>
          <text x={full.x} y={CY + 24} textAnchor="middle" fontSize={11} className="fill-slate-400">100%</text>
        </svg>

        {/* detail row */}
        <div className="mt-3 grid grid-cols-2 gap-3 w-full">
          <div className="text-center bg-slate-50 dark:bg-slate-800 rounded-lg py-2">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{completedTasks}</p>
            <p className="text-[11px] text-slate-400">Completed</p>
          </div>
          <div className="text-center bg-slate-50 dark:bg-slate-800 rounded-lg py-2">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{totalTasks - completedTasks}</p>
            <p className="text-[11px] text-slate-400">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}