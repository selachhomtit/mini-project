import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/lib/store";

/**
 * Root of the data layer. RTK Query is used only for caching and re-fetching;
 * every endpoint has a `queryFn` that reads/writes the local static database
 * (src/lib/services/localDb.ts). No HTTP requests are made.
 */
export const baseService = createApi({
  reducerPath: "localData",
  baseQuery: fakeBaseQuery<{ status: number; data: { message: string } }>(),
  tagTypes: [
    "Task", "PersonalTask", "ProjectTask",
    "Project", "Team", "TeamMember",
    "Notification", "Profile", "Comment", "Dashboard",
  ],
  endpoints: () => ({}),
});

/** Id of the signed-in demo user. */
export const currentUserId = (getState: () => unknown) =>
  (getState() as RootState).auth.user?.id ?? "u1";
