import React from "react";
import { TournamentContext } from "./tournament-context";
import { handleFileUpload, postData } from "./fetch";
import { useAuth } from "react-oidc-context";

export function useTournament() {
  const { tournament, setTournament } = React.useContext(TournamentContext);

  const auth = useAuth();
  const user = auth.user;
  const token = user?.access_token;

  function setCertType(activeEvent: number, certType: string) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/cert_type?type=${certType}`,
      token,
      {},
    ).then(setTournament);
  }

  function setNumRounds(activeEvent: number, numRounds: number) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/rounds?count=${numRounds}`,
      token,
      {},
    ).then(setTournament);
  }

  function setEventType(activeEvent: number, eventType: string) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/type?type=${eventType}`,
      token,
      {},
    ).then(setTournament);
  }

  function renameCompetitor(
    eventId: number,
    resultId: number,
    newName: string,
  ) {
    postData(
      `/certs/tournaments/${
        tournament?.id
      }/events/${eventId}/results/${resultId}/rename?name=${encodeURI(
        newName,
      ).replace("&", "%26")}`,
      token,
      {},
    ).then(setTournament);
  }

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
    renameCompetitor: renameCompetitor,
    uploadResults: handleEventResultsUpload,
    setEventType,
    setCertType,
    setNumRounds,
  };
}
