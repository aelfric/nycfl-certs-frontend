import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const restHandlers = [
  http.get("/certs/tournaments", () => {
    return HttpResponse.json([]);
  }),

  http.post("/certs/tournaments", async ({ request }) => {
    const newTournament = await request.clone().json(); // Post
    if (newTournament && typeof newTournament === "object") {
      return HttpResponse.json({ ...newTournament, id: 1 });
    }
    return new HttpResponse(null, { status: 400 });
  }),

  http.get<{ id: string }>("/certs/tournaments/:id", ({ params }) => {
    if (Number(params.id) < 0) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      id: 1,
    });
  }),
];

export const server = setupServer(...restHandlers);
