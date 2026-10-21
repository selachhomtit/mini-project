import { AUDIENCES } from "@/data/features";

export default function Logos() {
  return (
    <section
      aria-label="Who uses TaskFlow"
      className="mt-12 border-y border-slate-100 bg-white px-4 py-8 dark:border-slate-800 dark:bg-ink sm:mt-16 sm:px-6 sm:py-10"
    >
      <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:mb-6">
        Built for teams across Cambodia
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
        {AUDIENCES.map((name) => (
          <li key={name} className="text-sm font-bold tracking-tight text-slate-400 dark:text-slate-500">
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
