import { configureStore } from "@reduxjs/toolkit";
import { baseService } from "./services/baseService";
import authReducer from "./features/auth/authSlice";
import kanbanReducer from "./features/kanban/kanbanSlice";
import i18nReducer from "./features/i18n/i18nSlice";

// Register every endpoint on the shared service.
import "./services/authService";
import "./services/profileService";
import "./services/taskService";
import "./services/teamService";
import "./services/notificationService";
import "./services/dashboardService";

export const store = configureStore({
  reducer: {
    [baseService.reducerPath]: baseService.reducer,
    auth: authReducer,
    kanban: kanbanReducer,
    i18n: i18nReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
