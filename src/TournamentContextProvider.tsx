import React, { useMemo } from "react";
import { Tournament } from "./TournamentScreen";
import { getData } from "./fetch";
import { ITournamentContext, TournamentContext } from "./tournament-context";
import { useKeycloak } from "@react-keycloak/web";

type TournamentProviderProps = {
  id: number;
  children: React.ReactNode;
};

export function TournamentProvider({
  id,
  children,
}: Readonly<TournamentProviderProps>) {
  const [tournament, setTournament] = React.useState<Tournament | null>(null);
  const { keycloak } = useKeycloak();

  React.useEffect(() => {
    getData(`/certs/tournaments/${id}`, keycloak.token).then(setTournament);
  }, [id, keycloak.token]);

  const context: ITournamentContext = useMemo(
    () => ({
      tournament: tournament || undefined,
      setTournament,
    }),
    [tournament],
  );
  if (!tournament) {
    return <p>Loading...</p>;
  }

  return (
    <TournamentContext.Provider value={context}>
      {children}
    </TournamentContext.Provider>
  );
}
