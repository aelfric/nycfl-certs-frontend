import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { TournamentApi } from "./tournament-api";
import { User } from "oidc-client-ts";
import { server } from "./tournament-api.mock";

const tournamentApi = new TournamentApi({
  access_token: "some-token",
} as User);

describe("Tournament API", () => {
  // Start server before all tests
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

  it("can get all tournaments with authorization header", async () => {
    expect(await tournamentApi.findAll()).toHaveLength(0);
  });

  it("can get one tournament with authorization header", async () => {
    expect(await tournamentApi.findOne(1)).toEqual({ id: 1 });
  });

  it("can create a tournament", async () => {
    expect(
      await tournamentApi.createTournament({
        date: "2026-08-19",
        host: "Nowhere Academy",
        name: "NYCFL Local",
      }),
    ).toEqual({
      id: 1,
      date: "2026-08-19",
      host: "Nowhere Academy",
      name: "NYCFL Local",
    });
  });

  it("can handle errors when getting a tournament", async () => {
    expect(await tournamentApi.findOne(-1)).toBeUndefined();

    expect(globalThis.alert).toHaveBeenCalledWith(
      "Sorry you can't do that: Error: Not Found",
    );
  });
});
