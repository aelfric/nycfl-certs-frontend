import React from "react";
import { Tournament } from "./TournamentScreen";
import { getData } from "./fetch";
import { TournamentContext } from "./tournament-context";

export function TournamentProvider({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const [tournament, setTournament] = React.useState<Tournament | null>(null);

  React.useEffect(() => {
    getData(`/certs/tournaments/${id}`).then(setTournament);
  }, [id]);

  if (!tournament) {
    return <p>Loading...</p>;
  }
  return (
    <TournamentContext.Provider value={{ tournament, setTournament }}>
      {children}
    </TournamentContext.Provider>
  );
}
