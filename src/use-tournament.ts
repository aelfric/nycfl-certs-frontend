import React from "react";
import { TournamentContext } from "./tournament-context";
import { handleFileUpload } from "./fetch";
import { useAuth } from "react-oidc-context";

export function useTournament() {
  const { tournament, setTournament } = React.useContext(TournamentContext);

  const auth = useAuth();
  const user = auth.user;
  const token = user?.access_token;
  function handleEventResultsUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    eventId: number | undefined,
    roundType: string = "FINALIST",
  ) {
    if (eventId !== undefined) {
      handleFileUpload(
        event,
        `/certs/tournaments/${tournament?.id}/events/${eventId}/results?type=${roundType}`,
        token,
        setTournament,
      );
    }
  }

  return {
    tournament: tournament,
    uploadResults: handleEventResultsUpload,
  };
}
