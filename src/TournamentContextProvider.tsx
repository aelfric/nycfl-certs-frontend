import React from "react";
import { Tournament } from "./TournamentScreen";
import { getData } from "./fetch";
import { TournamentContext } from "./tournament-context";
import {useKeycloak} from "@react-keycloak/web";

export function TournamentProvider({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const [tournament, setTournament] = React.useState<Tournament | null>(null);
  const {keycloak} = useKeycloak();

  React.useEffect(() => {
    getData(`/certs/tournaments/${id}`,keycloak.token).then(setTournament);
  }, [id, keycloak.token]);

  if (!tournament) {
    return <p>Loading...</p>;
  }
  return (
    <TournamentContext.Provider value={{ tournament, setTournament }}>
      {children}
    </TournamentContext.Provider>
  );
}
