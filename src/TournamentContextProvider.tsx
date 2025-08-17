import React, { useMemo } from "react";
import { getData } from "./fetch";
import { ITournamentContext, TournamentContext } from "./tournament-context";
import { useAuth } from "react-oidc-context";
import { Tournament } from "./types";

type TournamentProviderProps = {
  id: number;
  children: React.ReactNode;
};

export function TournamentProvider({
  id,
  children,
}: Readonly<TournamentProviderProps>) {
  const [tournament, setTournament] = React.useState<Tournament | null>(null);
  const auth = useAuth();

  React.useEffect(() => {
    getData(`/certs/tournaments/${id}`, auth.user?.access_token).then(
      setTournament,
    );
  }, [id, auth.user?.access_token]);

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
