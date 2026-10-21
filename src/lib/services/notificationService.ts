import type { Notification, PageResponse } from "@/lib/features/types/task-type";
import { baseService } from "./baseService";
import { db, delay, ok, paginate, save } from "./localDb";

export const notificationService = baseService.injectEndpoints({
  // Hot reload re-runs this file in development; replace the old endpoints instead of warning.
  overrideExisting: import.meta.env.DEV,
  endpoints: (builder) => ({
    getNotifications: builder.query<PageResponse<Notification>, { page?: number; size?: number }>({
      async queryFn({ page = 0, size = 20 }) {
        await delay();
        // Return copies: RTK Query freezes results, and the stored rows must stay editable.
        const sorted = db().notifications
          .map((n) => ({ ...n }))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return ok(paginate(sorted, page, size));
      },
      providesTags: ["Notification"],
    }),

    getUnreadCount: builder.query<{ count: number }, void>({
      async queryFn() {
        return ok({ count: db().notifications.filter((n) => !n.isRead).length });
      },
      providesTags: ["Notification"],
    }),

    markAllRead: builder.mutation<null, void>({
      async queryFn() {
        await delay();
        db().notifications.forEach((n) => (n.isRead = true));
        save();
        return ok(null);
      },
      invalidatesTags: ["Notification"],
    }),

    markRead: builder.mutation<null, string>({
      async queryFn(id) {
        const row = db().notifications.find((n) => n.id === id);
        if (row) row.isRead = true;
        save();
        return ok(null);
      },
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
} = notificationService;
