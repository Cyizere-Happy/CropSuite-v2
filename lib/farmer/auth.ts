export type AuthRequest =
  | { action: "sign-in" | "sign-up"; email: string; password: string }
  | { action: "reset"; email: string }
  | { action: "google" };

type AuthResult = { status: "unavailable"; message: string };

interface AuthenticationService {
  request(input: AuthRequest): Promise<AuthResult>;
}

export const authentication: AuthenticationService = {
  async request(input) {
    if (input.action === "reset") {
      return { status: "unavailable", message: "Authentication coming soon. Password reset emails are unavailable in this preview." };
    }
    return {
      status: "unavailable",
      message: "Authentication coming soon. Continue in Demo Mode to build a planting plan.",
    };
  },
};

