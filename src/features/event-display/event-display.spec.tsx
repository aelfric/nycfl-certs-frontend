import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Enums, EventDisplay } from "./event-display";
import { createRoutesStub, Outlet } from "react-router";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("Event Display", () => {
  const events = [
    {
      certificateCutoff: 14,
      certificateType: "PLACEMENT",
      entriesPerPostingSlide: 30,
      eventType: "SPEECH",
      halfQuals: 2,
      id: 1,
      latestResult: "Quarter-Finalist",
      medalCutoff: 1,
      name: "Event 1",
      numRounds: 0,
      placementCutoff: 2,
      results: [],
    },
    {
      certificateCutoff: 0,
      certificateType: "PLACEMENT",
      entriesPerPostingSlide: 30,
      eventType: "SPEECH",
      halfQuals: 0,
      id: 2,
      medalCutoff: 0,
      name: "Event 2",
      numRounds: 0,
      placementCutoff: 0,
      results: [],
    },
  ];

  const Stub = createRoutesStub([
    {
      path: "/tournaments/:id",
      Component: () => {
        return <Outlet context={events} />;
      },
      children: [
        {
          path: "/tournaments/:id/events/:eventId",
          loader: async () =>
            Promise.resolve<Enums>({
              certTypes: [],
              elimTypes: [],
              eventTypes: [],
            }),
          Component: EventDisplay,
          HydrateFallback: () => <p>Loading...</p>,
        },
      ],
    },
  ]);

  it("Renders", async () => {
    render(
      <MemoryRouter initialEntries={["/tournaments/1/events/1"]}>
        <Stub initialEntries={["/tournaments/1/events/1"]} />
      </MemoryRouter>,
    );
    expect(await screen.findByText("Event Name:")).toBeInTheDocument();
  });
});
