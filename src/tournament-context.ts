import React from "react";
import { Tournament } from "./TournamentScreen";

export interface ITournamentContext {
  tournament?: Tournament;
  setTournament: (t: Tournament) => void;
}

export const TournamentContext = React.createContext<ITournamentContext>({
  setTournament: () => undefined,
});
