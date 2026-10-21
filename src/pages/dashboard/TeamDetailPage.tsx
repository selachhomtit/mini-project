import { useGetTeamByIdQuery } from "@/lib/services/teamService";
import { useNavigate, useParams } from "react-router";
import TeamDetailView from "@/components/team/TeamDetailView";

export default function TeamDetailPage() {
  const navigate = useNavigate();
  const { teamId = "" } = useParams();
  const { data: team, isLoading, isError } = useGetTeamByIdQuery(teamId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Loading team…
        </div>
      </div>
    );
  }

  if (isError || !team) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">Team not found</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Unable to locate that team. Try returning to the team list.</p>
        <button
          onClick={() => navigate("/dashboard/team")}
          className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors"
        >
          Back to teams
        </button>
      </div>
    );
  }

  return <TeamDetailView team={team} idx={0} onBack={() => navigate("/dashboard/team")} />;
}
