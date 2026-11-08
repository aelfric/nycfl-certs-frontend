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
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const tournamentApi: TournamentApi = new TournamentApi({
  access_token: "some-token",
} as User);

const server = setupServer();

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

  describe("Tournament CRUD", () => {
    it("can get all tournaments with authorization header", async () => {
      server.use(
        http.get("/certs/tournaments", () => {
          return HttpResponse.json([{ id: 1 }, { id: 2 }]);
        }),
      );

      expect(await tournamentApi.findAll()).toHaveLength(2);
    });

    it("returns no tournaments in case of error", async () => {
      server.use(
        http.get("/certs/tournaments", () => {
          return new HttpResponse("Not Allowed", { status: 401 });
        }),
      );
      expect(await tournamentApi.findAll()).toHaveLength(0);
    });

    it("can get one tournament with authorization header", async () => {
      server.use(
        http.get("/certs/tournaments/1", () => {
          return HttpResponse.json({
            id: 1,
          });
        }),
      );
      expect(await tournamentApi.findOne(1)).toEqual({ id: 1 });
    });

    it("can create a tournament", async () => {
      server.use(
        http.post("/certs/tournaments", async ({ request }) => {
          const newTournament = await request.clone().json(); // Post
          if (newTournament && typeof newTournament === "object") {
            return HttpResponse.json({ ...newTournament, id: 1 });
          }
        }),
      );
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

    it("can copy a tournament", async () => {
      server.use(
        http.post("/certs/tournaments", ({ request }) => {
          const url = new URL(request.url);
          const sourceId = url.searchParams.get("sourceId");
          if (sourceId) {
            return HttpResponse.json({
              id: 2,
              date: "2026-08-19",
              host: "Nowhere Academy",
              name: "Copy of Some Name",
            });
          }
        }),
      );
      expect(await tournamentApi.copyTournament(1)).toEqual({
        id: 2,
        date: "2026-08-19",
        host: "Nowhere Academy",
        name: "Copy of Some Name",
      });
    });

    it("can update a tournament", async () => {
      server.use(
        http.post("/certs/tournaments/1", () => {
          return HttpResponse.json({
            id: 1,
            date: "2026-08-19",
            host: "Nowhere Academy",
            name: "New Name",
          });
        }),
      );
      expect(
        await tournamentApi.updateOne(1, {
          name: "New Name",
        }),
      ).toEqual({
        id: 1,
        date: "2026-08-19",
        host: "Nowhere Academy",
        name: "New Name",
      });
    });

    it("can handle errors when getting a tournament", async () => {
      server.use(
        http.get("/certs/tournaments/:id", () => {
          return new HttpResponse(null, { status: 404 });
        }),
      );
      expect(await tournamentApi.findOne(-1)).toBeUndefined();

      expect(globalThis.alert).toHaveBeenCalledWith(
        "Sorry you can't do that: Error: Not Found",
      );
    });
  });

  describe("Event Configuration", () => {
    it("can create events", async () => {
      // TODO: Implement
    });

    it("can set event name", async () => {
      // TODO: Implement
    });

    it("can set certificate type", async () => {
      // TODO: Implement
    });

    it("can set number of rounds", async () => {
      // TODO: Implement
    });

    it("can set cutoff values", async () => {
      // TODO: Implement
    });

    it("can set event type", async () => {
      // TODO: Implement
    });
  });

  describe("Results & Competitors", () => {
    it("can upload event results", async () => {
      // TODO: Implement
    });

    it("can rename a competitor", async () => {
      // TODO: Implement
    });

    it("can reset results", async () => {
      // TODO: Implement
    });

    it("can delete an event", async () => {
      // TODO: Implement
    });
  });

  describe("Metadata & Settings", () => {
    it("can set the circuit", async () => {
      // TODO: Implement
    });
  });
});
