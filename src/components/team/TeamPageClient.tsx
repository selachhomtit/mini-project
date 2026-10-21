import DashboardHeader from "@/components/DashboardHeader";
import { useSearchParams } from "react-router";
import { useState } from "react";

import type { Team } from "@/lib/features/types/task-type";
import {
  useDeleteTeamMutation,
  useGetTeamsQuery,
} from "@/lib/services/teamService";
import { useGetTaskQuery, useGetProjectQuery } from "@/lib/services/taskService";
import TeamGrid from "./TeamGrid";
import TeamDetailView from "./TeamDetailView";
import CreateTeamModal from "./modals/CreateTeamModal";
import EditTeamModal from "./modals/EditTeamModal";

export default function TeamPageClient() {
  const [searchParams] = useSearchParams();
  const taskId = searchParams?.get("taskId");

  const [showCreate, setShowCreate] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [activeTeam, setActiveTeam] = useState<{ team: Team; idx: number } | null>(null);

  const { data: teamsPage, isLoading, refetch } = useGetTeamsQuery({});
  const [deleteTeam] = useDeleteTeamMutation();
  const { data: task } = useGetTaskQuery(taskId || "", { skip: !taskId });
  const { data: project } = useGetProjectQuery(task?.projectId || "", { skip: !task?.projectId });

  const teams = teamsPage?.content ?? [];

  // A comment notification (?taskId=…) opens the team that owns the task, until the user goes back.
  const [linkDismissed, setLinkDismissed] = useState(false);
  const linkedIdx = project?.teamId ? teams.findIndex((t) => t.id === project.teamId) : -1;
  const shownTeam =
    activeTeam ?? (!linkDismissed && linkedIdx >= 0 ? { team: teams[linkedIdx], idx: linkedIdx } : null);

  if (shownTeam) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TeamDetailView
          team={shownTeam.team}
          idx={shownTeam.idx}
          onBack={() => { setActiveTeam(null); setLinkDismissed(true); }}
        />
      </div>
    );
  }

  return (
    <>
      <DashboardHeader onRefresh={refetch} onCreate={() => setShowCreate(true)} createLabel="Create" />

      <TeamGrid
        teams={teams}
        isLoading={isLoading}
        onSelect={(team, idx) => setActiveTeam({ team, idx })}
        onEdit={(team) => setEditTeam(team)}
        onDelete={(id) => deleteTeam(id)}
      />

      {showCreate && <CreateTeamModal onClose={() => setShowCreate(false)} />}
      {editTeam && (
        <EditTeamModal team={editTeam} onClose={() => setEditTeam(null)} />
      )}
    </>
  );
}