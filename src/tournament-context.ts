import React from "react";

import { Tournament } from "./types";

export interface ITournamentContext {
  tournament?: Tournament;
  setTournament: (t: Tournament) => void;
}

export const TournamentContext = React.createContext<ITournamentContext>({
  setTournament: () => undefined,
});
