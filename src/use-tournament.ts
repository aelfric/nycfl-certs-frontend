import React from "react";
import { TournamentContext } from "./tournament-context";
import { deleteData, handleFileUpload, postData } from "./fetch";

export function useTournament() {
  const { tournament, setTournament } = React.useContext(TournamentContext);

  function updateTournament(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    function emptyToNull(str: string) {
      if (str === "") {
        return null;
      } else {
        return str;
      }
    }
    postData(`/certs/tournaments/${tournament?.id}`, {
      name: evt.target.tournamentName.value,
      host: evt.target.host.value,
      date: evt.target.date.value,
      logoUrl: emptyToNull(evt.target.logoUrl.value),
      slideBackgroundUrl: emptyToNull(evt.target.backgroundUrl.value),
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
    postData("/certs/events", {
      events: evt.target.events.value,
      tournamentId: tournament?.id,
    }).then(setTournament);
  }

  function setEventName(activeEvent: number, newName: string) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/rename?name=${newName}`,
      {}
    ).then(setTournament);
  }
  function setCertType(activeEvent: number, certType: string) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/cert_type?type=${certType}`,
      {}
    ).then(setTournament);
  }
  function setNumRounds(activeEvent: number, numRounds: number) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/rounds?count=${numRounds}`,
      {}
    ).then(setTournament);
  }

  function setCutoff(
    value: number,
    type: "placement" | "cutoff" | "medal" | "quals",
    activeEvent: number
  ) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/${type}`,
      { cutoff: value }
    ).then(setTournament);
  }

  function setEventType(activeEvent: number, eventType: string) {
    postData(
      `/certs/tournaments/${tournament?.id}/events/${activeEvent}/type?type=${eventType}`,
      {}
    ).then(setTournament);
  }

  function renameCompetitor(
    eventId: number,
    resultId: number,
    newName: string
  ) {
    postData(
      `/certs/tournaments/${
        tournament?.id
      }/events/${eventId}/results/${resultId}/rename?name=${encodeURI(
        newName
      ).replace("&", "%26")}`,
      {}
    ).then(setTournament);
  }

  function handleEventResultsUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    eventId: number | undefined,
    roundType: string = "FINALIST"
  ) {
    if (eventId !== undefined) {
      handleFileUpload(
        event,
        `/certs/tournaments/${tournament?.id}/events/${eventId}/results?type=${roundType}`,
        setTournament
      );
    }
  }

  function resetResults(eventId: number): void {
    deleteData(
      `/certs/tournaments/${tournament?.id}/events/${eventId}/results`
    ).then(setTournament);
  }

  function deleteEvent(eventId: number): void {
    deleteData(
      `/certs/tournaments/${tournament?.id}/events/${eventId}`
    ).then(setTournament);
  }

  function handleSweepsUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(
      event,
      `/certs/tournaments/${tournament?.id}/sweeps`,
      setTournament
    );
  }
  function handleSchoolsUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(
      event,
      `/certs/tournaments/${tournament?.id}/schools`,
      () => {
        alert("Schools Loaded");
      }
    );
  }

  return {
    tournament: tournament,
    renameCompetitor: renameCompetitor,
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
    handleSchoolsUpload,
    handleSweepsUpload,
  };
}
