import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

function AuthProbe() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="authenticated">{String(isAuthenticated)}</div>
      <div data-testid="email">{user?.email ?? ""}</div>
      <button onClick={() => login("john@example.com", "secret123")}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("refreshes /me on mount when token exists", async () => {
    localStorage.setItem("kvas_token", "existing-token");
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        isAdmin: false,
      }),
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("authenticated")).toHaveTextContent("true"));
    expect(screen.getByTestId("email")).toHaveTextContent("john@example.com");
  });

  it("supports login flow", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "new-token",
        user: {
          id: 1,
          email: "john@example.com",
          firstName: "John",
          lastName: "Doe",
          isAdmin: false,
        },
      }),
    });

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await user.click(screen.getByText("login"));

    await waitFor(() => expect(screen.getByTestId("authenticated")).toHaveTextContent("true"));
    expect(localStorage.getItem("kvas_token")).toBe("new-token");
  });

  it("supports logout flow", async () => {
    (fetch as unknown as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: "new-token",
          user: {
            id: 1,
            email: "john@example.com",
            firstName: "John",
            lastName: "Doe",
            isAdmin: false,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await user.click(screen.getByText("login"));
    await waitFor(() => expect(screen.getByTestId("authenticated")).toHaveTextContent("true"));

    await user.click(screen.getByText("logout"));

    await waitFor(() => expect(screen.getByTestId("authenticated")).toHaveTextContent("false"));
    expect(localStorage.getItem("kvas_token")).toBeNull();
  });
});
