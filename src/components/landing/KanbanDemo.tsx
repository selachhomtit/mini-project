import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectCard, moveCard } from "@/lib/features/kanban/kanbanSlice";

const AV_COLORS: Record<string, string> = {
  SC: "#059669",
  MR: "#216e4e",
  PN: "#0F766E",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

const toolbarBtn =
  "rounded px-2.5 py-1 text-[11px] font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white";

export default function KanbanDemo() {
  const dispatch = useAppDispatch();
  const { columns, selectedCard, selectedCardCol } = useAppSelector((s) => s.kanban);

  const handleCardClick = useCallback(
    (cardId: string, colId: string) => {
      if (selectedCard === cardId) {
        dispatch(selectCard(null));
      } else {
        dispatch(selectCard({ cardId, colId }));
      }
    },
    [dispatch, selectedCard]
  );

  const handleMove = useCallback(
    (toColId: string) => {
      if (!selectedCard || !selectedCardCol) return;
      dispatch(moveCard({ cardId: selectedCard, fromColId: selectedCardCol, toColId }));
    },
    [dispatch, selectedCard, selectedCardCol]
  );

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-[0_28px_80px_rgba(0,0,0,0.14)] dark:border-slate-700 dark:bg-ink dark:text-slate-100">
      {/* Window chrome */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-100 px-4 py-2.5 dark:border-slate-700 dark:bg-ink-soft">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>

        <div className="hidden min-w-0 items-center gap-2 truncate text-[13px] font-medium sm:flex">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="2" y="2" width="4.5" height="12" rx="1.2" fill="currentColor" />
            <rect x="8.5" y="2" width="5.5" height="8" rx="1.2" fill="currentColor" opacity=".7" />
          </svg>
          <span className="truncate">Website Redesign · Sprint 12</span>
        </div>

        <div className="flex items-center">
          {["SC", "MR", "PN"].map((av, i) => (
            <div
              key={av}
              className={`flex size-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white dark:border-ink-soft ${
                i > 0 ? "-ml-2" : ""
              }`}
              style={{ background: AV_COLORS[av] }}
            >
              {av}
            </div>
          ))}
          <button className="ml-2.5 rounded-md bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-900 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600">
            + Invite
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-ink">
        <div className="flex gap-0.5">
          <button className={`${toolbarBtn} bg-slate-100 font-semibold text-slate-900 dark:bg-white/10 dark:text-white`}>
            Board
          </button>
          <button className={toolbarBtn}>Timeline</button>
          <button className={toolbarBtn}>List</button>
        </div>
        <div className="hidden gap-0.5 sm:flex">
          <button className={toolbarBtn}>Filter</button>
          <button className={toolbarBtn}>+ Column</button>
        </div>
      </div>

      {/* Board */}
      <div className="flex min-h-[280px] gap-3 overflow-x-auto bg-slate-50 p-4 dark:bg-ink [scrollbar-width:thin]">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex w-[220px] shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-100 px-2 py-2.5 dark:border-slate-700 dark:bg-ink-soft"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full" style={{ background: col.dotColor }} />
                <span className="text-[11px] font-bold uppercase tracking-wider">{col.label}</span>
                <span className="rounded border border-slate-200 bg-white px-1.5 text-[10px] font-bold text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {col.cards.length}
                </span>
              </div>

              {selectedCard && selectedCardCol !== col.id && (
                <button
                  className="animate-pop rounded bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white transition-transform hover:scale-105 hover:bg-brand-600"
                  onClick={() => handleMove(col.id)}
                >
                  Move →
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  className={`cursor-pointer select-none rounded-lg border bg-white px-3 py-2.5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-800 ${
                    selectedCard === card.id
                      ? "border-brand-500 ring-2 ring-brand-500/30"
                      : "border-slate-200/70 dark:border-slate-700"
                  } ${card.checked ? "opacity-60" : ""}`}
                  onClick={() => handleCardClick(card.id, col.id)}
                >
                  {card.tag && (
                    <span
                      className="mb-1.5 inline-block rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                      style={{ background: card.tagBg, color: card.tagColor }}
                    >
                      {card.tag}
                    </span>
                  )}

                  <p
                    className={`mb-2 text-xs font-medium leading-snug ${
                      card.checked ? "text-slate-400 line-through" : ""
                    }`}
                  >
                    {card.title}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-[7px] shrink-0 rounded-full" style={{ background: PRIORITY_DOT[card.priority] }} />
                      {card.dueDate && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">📅 {card.dueDate}</span>
                      )}
                    </div>

                    {card.avatar && (
                      <div
                        className="flex size-[22px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
                        style={{ background: card.avatarColor }}
                      >
                        {card.avatar}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button className="mt-1 rounded-md px-1 py-2 text-left text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                + Add a card
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="absolute inset-x-0 bottom-0 flex animate-slide-up items-center justify-between gap-2.5 bg-slate-900 px-4 py-2 text-xs text-white dark:bg-slate-100 dark:text-slate-900">
          <span>
            ✨ Click <strong>Move →</strong> on another column to move this card
          </span>
          <button
            onClick={() => dispatch(selectCard(null))}
            className="px-1 opacity-70 hover:opacity-100"
            aria-label="Dismiss hint"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
