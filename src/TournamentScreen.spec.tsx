import { render, screen } from "@testing-library/react";
import { TournamentScreen } from "./TournamentScreen";
import { describe, expect, it, vi } from "vitest";
import { TournamentContext } from "./tournament-context";
import { MemoryRouter } from "react-router-dom";

vi.mock("@react-keycloak/web", () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    useKeycloak: () => ({
      keycloak: {
        token: "something",
      },
    }),
  };
});

describe("<TournamentScreen/>", () => {
  it("renders", async () => {
    render(<TournamentScreen copyTournament={vi.fn()} />);
    expect(await screen.findByText("Loading...")).toBeInTheDocument();
  });

  it("renders a tournament", async () => {
    render(
      <MemoryRouter>
        <TournamentContext.Provider
          value={{
            tournament: {
              id: 1,
              host: "Regis",
              name: "NYCFL First Regis",
              date: "Sept 2024",
              events: [],
            },
            setTournament: vi.fn(),
          }}
        >
          <TournamentScreen copyTournament={vi.fn()} />
        </TournamentContext.Provider>
      </MemoryRouter>,
    );
    const tournamentName: HTMLInputElement =
      await screen.findByLabelText("Tournament Name");
    expect(tournamentName.value).toBe("NYCFL First Regis");
  });
});
