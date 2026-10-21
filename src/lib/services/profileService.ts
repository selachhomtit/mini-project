import type { UserProfile } from "@/lib/features/types/task-type";
import type { RootState } from "@/lib/store";
import { baseService, currentUserId } from "./baseService";
import { db, delay, fail, now, ok, save, toProfile } from "./localDb";

export type UpdateProfilePayload = {
  fullName?: string;
  username?: string;
  email?: string;
  profilePhoto?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
};

/**
 * Returns the signed-in user's row, recreating it from the session when the
 * local database no longer has it (e.g. browser storage was cleared).
 */
function currentUserRow(getState: () => unknown) {
  const id = currentUserId(getState);
  const d = db();
  let row = d.users.find((u) => u.id === id);
  const sessionUser = (getState() as RootState).auth.user;
  if (!row && sessionUser) {
    row = {
      id,
      fullName: sessionUser.name,
      username: sessionUser.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_"),
      email: sessionUser.email,
      password: "",
      profilePhoto: sessionUser.avatar,
      isVerified: true,
      createdAt: now(),
    };
    d.users.push(row);
    save();
  }
  return row;
}

export const profileService = baseService.injectEndpoints({
  // Hot reload re-runs this file in development; replace the old endpoints instead of warning.
  overrideExisting: import.meta.env.DEV,
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      async queryFn(_arg, { getState }) {
        await delay();
        currentUserRow(getState);
        return ok(toProfile(currentUserId(getState)));
      },
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      async queryFn(data, { getState }) {
        await delay(300);
        const row = currentUserRow(getState);
        if (!row) return fail("Profile not found.", 404);
        Object.assign(row, Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)));
        save();
        return ok(toProfile(row.id));
      },
      invalidatesTags: ["Profile", "TeamMember", "Comment", "Task"],
    }),

    changePassword: builder.mutation<null, { currentPassword: string; newPassword: string }>({
      async queryFn({ currentPassword, newPassword }, { getState }) {
        await delay(300);
        const row = currentUserRow(getState);
        // A row restored from the session has no password yet, so any current password is accepted.
        if (!row || (row.password && row.password !== currentPassword)) return fail("Current password is incorrect.", 400);
        row.password = newPassword;
        save();
        return ok(null);
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileService;
