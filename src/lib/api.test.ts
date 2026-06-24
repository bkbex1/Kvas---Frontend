import { ApiError, apiSend } from "./api";

describe("api.ts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("apiSend parses backend error message and throws ApiError", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid credentials" }),
    });

    await expect(apiSend("/api/auth/login", "POST", { email: "a", password: "b" })).rejects.toMatchObject({
      message: "Invalid credentials",
      status: 401,
    });
  });

  it("ApiError carries status", () => {
    const error = new ApiError("Oops", 429, { reason: "rate_limit" });
    expect(error.status).toBe(429);
    expect(error.message).toBe("Oops");
  });
});
