import { render, screen } from "@testing-library/react";
import { TournamentScreen } from "./TournamentScreen";
import { describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";

describe("<TournamentScreen/>", () => {
  const mockLoadOneTournament = vi.fn();
  const Stub = createRoutesStub([
    {
      path: "/tournaments/:id",
      loader: mockLoadOneTournament,
      Component: TournamentScreen,
      HydrateFallback: () => <p>Loading...</p>,
    },
  ]);
  it("renders", async () => {
    render(<Stub initialEntries={["/tournaments/1"]} />);
    expect(await screen.findByText("Loading...")).toBeInTheDocument();
  });

  it("renders a tournament", async () => {
    mockLoadOneTournament.mockResolvedValue({
      id: 1,
      host: "Regis",
      name: "NYCFL First Regis",
      date: "Sept 2024",
      events: [],
    });
    render(<Stub initialEntries={["/tournaments/1"]}></Stub>);
    const tournamentName: HTMLInputElement =
      await screen.findByLabelText("Tournament Name");
    expect(tournamentName.value).toBe("NYCFL First Regis");
  });
});
