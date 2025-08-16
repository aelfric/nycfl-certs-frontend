import React from "react";
import { TournamentContext } from "./tournament-context";
import { deleteData, handleFileUpload, postData } from "./fetch";
import { useAuth } from "react-oidc-context";

export function useTournament() {
  const { tournament, setTournament } = React.useContext(TournamentContext);

  const auth = useAuth();
  const user = auth.user;
  const token = user?.access_token;

  function setEventName(activeEvent: number, newName: string) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/rename?name=${newName}`,
      token,
      {},
    ).then(setTournament);
  }

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

  function setCutoff(
    value: number,
    type: "placement" | "cutoff" | "medal" | "quals",
    activeEvent: number,
  ) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/${type}`,
      token,
      { cutoff: value },
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

  function switchSchool(eventId: number, resultId: number, newSchool: number) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${eventId}/results/${resultId}/school?schoolId=${newSchool}`,
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

  function resetResults(eventId: number): void {
    deleteData(
      `/certs/tournaments/${tournament?.id}/events/${eventId}/results`,
      token,
    ).then(setTournament);
  }

  function deleteEvent(eventId: number): void {
    deleteData(
      `/certs/tournaments/${tournament?.id}/events/${eventId}`,
      token,
    ).then(setTournament);
  }
  return {
    tournament: tournament,
    renameCompetitor: renameCompetitor,
    switchSchool,
    uploadResults: handleEventResultsUpload,
    setCutoff,
    resetResults,
    deleteEvent,
    setEventType,
    setEventName,
    setCertType,
    setNumRounds,
  };
}
