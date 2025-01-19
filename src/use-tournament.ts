import React from "react";
import { TournamentContext } from "./tournament-context";
import { deleteData, handleFileUpload, postData } from "./fetch";
import { useAuth } from "react-oidc-context";

export function useTournament() {
  const { tournament, setTournament } = React.useContext(TournamentContext);

  const auth = useAuth();
  const token = auth.user?.access_token;

  function updateTournament(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();

    function emptyToNull(str: string) {
      if (str === "") {
        return null;
      } else {
        return str;
      }
    }

    postData(`/certs/tournaments/${tournament?.id}`, token, {
      name: evt.target.tournamentName.value,
      host: evt.target.host.value,
      date: evt.target.date.value,
      logoUrl: emptyToNull(evt.target.logoUrl.value),
      slideBackgroundUrl: emptyToNull(evt.target.backgroundUrl.value),
      slidePrimaryColor: emptyToNull(evt.target.slidePrimaryColor.value),
      slideAccentColor: emptyToNull(evt.target.slideAccentColor.value),
      slideSecondaryAccentColor: emptyToNull(
        evt.target.slideSecondaryAccentColor.value,
      ),
      slideOverlayColor: emptyToNull(evt.target.slideOverlayColor.value),
      certificateHeadline: emptyToNull(evt.target.certificateHeadline.value),
      line1: emptyToNull(evt.target.line1.value),
      line2: emptyToNull(evt.target.line2.value),
      signature: emptyToNull(evt.target.signature.value),
      signatureTitle: emptyToNull(evt.target.signatureTitle.value),
      styleOverrides: emptyToNull(evt.target.styleOverrides.value),
    }).then(setTournament);
  }

  function createEvents(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    postData("/certs/events", token, {
      events: evt.target.events.value,
      tournamentId: tournament?.id,
    }).then(setTournament);
  }

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
    updateTournament,
    setCutoff,
    resetResults,
    deleteEvent,
    setEventType,
    createEvents,
    setEventName,
    setCertType,
    setNumRounds,
  };
}
