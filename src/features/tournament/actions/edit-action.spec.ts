import {
  describe,
  it,
  vi,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import { editAction } from "./edit-action";
import { TournamentApi } from "../../../tournament-api";
import { User } from "oidc-client-ts";
import { server } from "../../../tournament-api.mock";

describe("edit-action", () => {
  beforeAll(() => {
    vi.spyOn(globalThis, "alert");
    vi.mocked(globalThis.alert);
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
    vi.resetAllMocks();
  });

  it("handles POST", async () => {
    // 1. Construct a standard Web API Request object mimicking a form submission
    const formData = new FormData();
    formData.append("tournamentName", "Isolated Test Tournament");

    const request = new Request("https://example.com", {
      method: "POST",
      body: formData,
    });

    // 2. Call the action directly, mocking required router context/params if applicable
    const action = editAction.bind(
      new TournamentApi({ access_token: "test" } as User),
    );
    const response = await action({
      request,
      params: { id: "1" },
      url: new URL("http://localhost"),
      pattern: "",
      context: null,
    });

    // 3. Assert on the response output
    expect(response).toEqual({
      certificateHeadline: null,
      line1: null,
      line2: null,
      logoUrl: null,
      name: "Isolated Test Tournament",
      signature: null,
      signatureTitle: null,
      slideAccentColor: null,
      slideBackgroundUrl: null,
      slideOverlayColor: null,
      slidePrimaryColor: null,
      slideSecondaryAccentColor: null,
      styleOverrides: null,
    });
  });

  it("handles PUT", async () => {
    // 1. Construct a standard Web API Request object mimicking a form submission
    const formData = new FormData();
    formData.append("circuit", "nycfl");

    const request = new Request("https://example.com", {
      method: "PATCH",
      body: formData,
    });

    // 2. Call the action directly, mocking required router context/params if applicable
    const action = editAction.bind(
      new TournamentApi({ access_token: "test" } as User),
    );
    const response = await action({
      request,
      params: { id: "1" },
      url: new URL("http://localhost"),
      pattern: "",
      context: null,
    });

    // 3. Assert on the response output
    expect(response).toEqual({ circuit: "updated" });
  });
});
