import { useMemo } from "react";
import type { TaskStatus } from "@/lib/features/types/task-type";

interface Props {
  statusCounts: Record<TaskStatus, number>;
  overdueTasks: number;
  totalTasks: number;
}

// Same colours as the board columns, so the chart reads like the kanban.
const STATUS_SEGMENTS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "TODO",        label: "To Do",       color: "#94A3B8" },
  { status: "IN_PROGRESS", label: "In Progress", color: "#3B82F6" },
  { status: "IN_REVIEW",   label: "In Review",   color: "#ff991f" },
  { status: "DONE",        label: "Done",        color: "#10B981" },
];

interface Segment {
  label: string;
  value: number;
  color: string;
  pct: number;
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function TaskStatusDonut({ statusCounts, overdueTasks, totalTasks }: Props) {
  const segments: Segment[] = useMemo(() => {
    const total = totalTasks || 1;
    return STATUS_SEGMENTS.map(({ status, label, color }) => ({
      label,
      color,
      value: statusCounts[status],
      pct: (statusCounts[status] / total) * 100,
    }));
  }, [statusCounts, totalTasks]);

  const completionPct = totalTasks ? Math.round((statusCounts.DONE / totalTasks) * 100) : 0;

  const CX = 80, CY = 80, R = 60, STROKE = 18;

  // Each visible segment's arc, laid end to end starting at 12 o'clock.
  const arcs = useMemo(() => {
    const visible = segments.filter((seg) => seg.value > 0);
    const sweeps = visible.map((seg) => (seg.pct / 100) * 360);
    return visible.map((seg, i) => {
      const start = -90 + sweeps.slice(0, i).reduce((sum, s) => sum + s, 0);
      return { ...seg, path: arcPath(CX, CY, R, start, start + sweeps[i] - 0.5) };
    });
  }, [segments]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E8E8EF] dark:border-slate-700 p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Task status</p>

      <div className="flex items-center gap-6">
        {/* SVG donut */}
        <div className="relative shrink-0">
          <svg width={160} height={160} viewBox="0 0 160 160">
            {/* background ring */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F1F5F9" strokeWidth={STROKE} className="dark:stroke-slate-800" />

            {arcs.map((arc) => (
              <path
                key={arc.label}
                d={arc.path}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
            ))}

            {/* centre label */}
            <text x={CX} y={CY - 8} textAnchor="middle" className="fill-slate-950 dark:fill-white" fontSize={22} fontWeight={600}>
              {completionPct}%
            </text>
            <text x={CX} y={CY + 10} textAnchor="middle" fill="#94A3B8" fontSize={11}>
              done
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{seg.label}</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                {seg.value}
              </span>
            </div>
          ))}

          <div className="mt-1 pt-2 border-t border-[#E8E8EF] dark:border-slate-700 flex justify-between">
            <span className="text-xs text-slate-400">Total</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{totalTasks}</span>
          </div>
          {overdueTasks > 0 && (
            <div className="flex justify-between">
              <span className="text-xs text-red-500">Overdue (not done)</span>
              <span className="text-xs font-bold text-red-500 tabular-nums">{overdueTasks}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}