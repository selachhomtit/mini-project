import { baseService } from "./baseService";
import { db, delay, fail, newId, now, ok, save } from "./localDb";

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: { id: string; name: string; email: string; avatar?: string };
}

function session(userId: string): AuthResponse {
  const u = db().users.find((x) => x.id === userId)!;
  return {
    token: `demo-token-${u.id}`,
    user: { id: u.id, name: u.fullName, email: u.email, avatar: u.profilePhoto },
  };
}

export const authService = baseService.injectEndpoints({
  // Hot reload re-runs this file in development; replace the old endpoints instead of warning.
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      async queryFn({ email, password }) {
        await delay(300);
        const user = db().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user || user.password !== password) return fail("Invalid email or password.", 401);
        return ok(session(user.id));
      },
    }),

    register: builder.mutation<
      AuthResponse,
      { fullName: string; username: string; email: string; password: string }
    >({
      async queryFn({ fullName, username, email, password }) {
        await delay(300);
        const d = db();
        if (d.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return fail("An account with this email already exists.", 409);
        }
        const id = newId("u");
        d.users.push({ id, fullName, username, email, password, isVerified: true, createdAt: now() });
        // Give new accounts a team to explore right away.
        d.members.push({ id: newId("m"), teamId: "t1", userId: id, role: "MEMBER", joinedAt: now() });
        save();
        return ok(session(id));
      },
    }),

    forgotPassword: builder.mutation<null, { email: string }>({
      async queryFn() {
        await delay(300);
        return ok(null);
      },
    }),

    resetPassword: builder.mutation<null, { token: string; newPassword: string }>({
      async queryFn() {
        await delay(300);
        return ok(null);
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authService;
