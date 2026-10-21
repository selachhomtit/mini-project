import type { UserProfile } from "@/lib/features/types/task-type";
import { baseService, currentUserId } from "./baseService";
import { db, delay, fail, ok, save, toProfile } from "./localDb";

export type UpdateProfilePayload = {
  fullName?: string;
  username?: string;
  email?: string;
  profilePhoto?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
};

export const profileService = baseService.injectEndpoints({
  // Hot reload re-runs this file in development; replace the old endpoints instead of warning.
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      async queryFn(_arg, { getState }) {
        await delay();
        return ok(toProfile(currentUserId(getState)));
      },
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      async queryFn(data, { getState }) {
        await delay(300);
        const id = currentUserId(getState);
        const row = db().users.find((u) => u.id === id);
        if (!row) return fail("Profile not found.", 404);
        Object.assign(row, Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)));
        save();
        return ok(toProfile(id));
      },
      invalidatesTags: ["Profile", "TeamMember", "Comment", "Task"],
    }),

    changePassword: builder.mutation<null, { currentPassword: string; newPassword: string }>({
      async queryFn({ currentPassword, newPassword }, { getState }) {
        await delay(300);
        const row = db().users.find((u) => u.id === currentUserId(getState));
        if (!row || row.password !== currentPassword) return fail("Current password is incorrect.", 400);
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
