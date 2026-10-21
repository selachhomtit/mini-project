import type { MemberRole, PageResponse, Team, TeamMember } from "@/lib/features/types/task-type";
import { baseService, currentUserId } from "./baseService";
import { db, delay, fail, newId, now, ok, paginate, save, teamIdsOf, toMember, toTeam } from "./localDb";

export const teamService = baseService.injectEndpoints({
  // Hot reload re-runs this file in development; replace the old endpoints instead of warning.
  overrideExisting: import.meta.env.DEV,
  endpoints: (builder) => ({
    // ── Teams ──────────────────────────────────────────────────────────────
    getTeams: builder.query<PageResponse<Team>, { page?: number; size?: number }>({
      async queryFn({ page = 0, size = 50 }, { getState }) {
        await delay();
        const mine = new Set(teamIdsOf(currentUserId(getState)));
        return ok(paginate(db().teams.filter((t) => mine.has(t.id)).map(toTeam), page, size));
      },
      providesTags: ["Team"],
    }),

    getTeamById: builder.query<Team, string>({
      async queryFn(id) {
        await delay();
        const row = db().teams.find((t) => t.id === id);
        return row ? ok(toTeam(row)) : fail("Team not found.", 404);
      },
      providesTags: ["Team"],
    }),

    createTeam: builder.mutation<Team, { name: string; description?: string }>({
      async queryFn({ name, description }, { getState }) {
        await delay();
        const userId = currentUserId(getState);
        const row = { id: newId("t"), name, description: description ?? "", ownerId: userId, createdAt: now() };
        db().teams.unshift(row);
        db().members.push({ id: newId("m"), teamId: row.id, userId, role: "OWNER", joinedAt: now() });
        save();
        return ok(toTeam(row));
      },
      invalidatesTags: ["Team", "Dashboard"],
    }),

    updateTeam: builder.mutation<Team, { id: string; data: { name?: string; description?: string } }>({
      async queryFn({ id, data }) {
        await delay();
        const row = db().teams.find((t) => t.id === id);
        if (!row) return fail("Team not found.", 404);
        if (data.name !== undefined) row.name = data.name;
        if (data.description !== undefined) row.description = data.description;
        save();
        return ok(toTeam(row));
      },
      invalidatesTags: ["Team"],
    }),

    deleteTeam: builder.mutation<null, string>({
      async queryFn(id) {
        await delay();
        const d = db();
        const projectIds = new Set(d.projects.filter((p) => p.teamId === id).map((p) => p.id));
        d.teams = d.teams.filter((t) => t.id !== id);
        d.members = d.members.filter((m) => m.teamId !== id);
        d.projects = d.projects.filter((p) => p.teamId !== id);
        d.tasks = d.tasks.filter((t) => !t.projectId || !projectIds.has(t.projectId));
        save();
        return ok(null);
      },
      invalidatesTags: ["Team", "TeamMember", "Project", "ProjectTask", "Dashboard"],
    }),

    // ── Members ────────────────────────────────────────────────────────────
    getTeamMembers: builder.query<PageResponse<TeamMember>, { teamId: string; page?: number; size?: number }>({
      async queryFn({ teamId, page = 0, size = 50 }) {
        await delay();
        return ok(paginate(db().members.filter((m) => m.teamId === teamId).map(toMember), page, size));
      },
      providesTags: ["TeamMember"],
    }),

    inviteMember: builder.mutation<null, { teamId: string; email: string; role: string }>({
      async queryFn({ teamId, email, role }) {
        await delay(300);
        const d = db();
        let user = d.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          // Create a placeholder account so the invited person shows up in the team.
          const name = email.split("@")[0];
          user = { id: newId("u"), fullName: name.charAt(0).toUpperCase() + name.slice(1), username: name, email, password: "", createdAt: now() };
          d.users.push(user);
        }
        if (d.members.some((m) => m.teamId === teamId && m.userId === user.id)) {
          return fail("This person is already a member of the team.", 409);
        }
        d.members.push({ id: newId("m"), teamId, userId: user.id, role: role as MemberRole, joinedAt: now() });
        save();
        return ok(null);
      },
      invalidatesTags: ["TeamMember", "Team"],
    }),

    updateMemberRole: builder.mutation<null, { teamId: string; memberId: string; role: string }>({
      async queryFn({ teamId, memberId, role }) {
        await delay();
        const row = db().members.find((m) => m.teamId === teamId && (m.id === memberId || m.userId === memberId));
        if (!row) return fail("Member not found.", 404);
        row.role = role as MemberRole;
        save();
        return ok(null);
      },
      invalidatesTags: ["TeamMember"],
    }),

    removeMember: builder.mutation<null, { teamId: string; userId: string }>({
      async queryFn({ teamId, userId }) {
        await delay();
        const d = db();
        d.members = d.members.filter((m) => !(m.teamId === teamId && (m.userId === userId || m.id === userId)));
        save();
        return ok(null);
      },
      invalidatesTags: ["TeamMember", "Team"],
    }),

    acceptInvitation: builder.mutation<null, string>({
      async queryFn(invitationId, { getState }) {
        await delay(300);
        const d = db();
        const invite = d.invitations.find((i) => i.id === invitationId);
        if (!invite) return fail("This invitation has expired.", 404);
        const teamId = newId("t");
        d.teams.push({ id: teamId, name: invite.teamName, description: invite.description, ownerId: invite.invitedById, createdAt: now() });
        d.members.push(
          { id: newId("m"), teamId, userId: invite.invitedById, role: "OWNER", joinedAt: now() },
          { id: newId("m"), teamId, userId: currentUserId(getState), role: "MEMBER", joinedAt: now() }
        );
        d.invitations = d.invitations.filter((i) => i.id !== invitationId);
        save();
        return ok(null);
      },
      invalidatesTags: ["Team", "TeamMember", "Notification", "Dashboard"],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamMembersQuery,
  useInviteMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useAcceptInvitationMutation,
} = teamService;
