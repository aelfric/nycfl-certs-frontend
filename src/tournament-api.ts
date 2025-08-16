import { User } from "oidc-client-ts";
import { deleteData, getData, handleFileUpload, postData } from "./fetch";
import { Tournament, TournamentForEdit } from "./types";
import React from "react";

export class TournamentApi {
  private user: User | undefined | null;

  constructor(user: User | undefined | null) {
    this.user = user;
  }

  getToken() {
    return this.user?.access_token;
  }
  async findAll() {
    return await getData("/certs/tournaments", this.getToken());
  }

  async findOne(tournamentId: string | number): Promise<Tournament> {
    return await getData(`/certs/tournaments/${tournamentId}`, this.getToken());
  }

  async createTournament({
    name,
    host,
    date,
  }: {
    name: string;
    host: string;
    date: string;
  }) {
    return await postData("/certs/tournaments", this.getToken(), {
      name,
      host,
      date,
    });
  }

  async copyTournament(tournamentId: number | string) {
    return await postData(
      `/certs/tournaments?sourceId=${tournamentId}`,
      this.getToken(),
      {},
    );
  }

  async createEvents(tournamentId: string | number, events: string) {
    return await postData("/certs/events", this.getToken(), {
      events: events,
      tournamentId: tournamentId,
    });
  }

  async setEventName(
    activeEvent: number,
    newName: string,
    tournamentId: string,
  ) {
    return await postData(
      `/certs/tournaments/${tournamentId}/events/${activeEvent}/rename?name=${newName}`,
      this.getToken(),
      {},
    );
  }

  async setCertType(
    activeEvent: number,
    certType: string,
    tournamentId: string,
  ) {
    return await postData(
      `/certs/tournaments/${tournamentId}/events/${activeEvent}/cert_type?type=${certType}`,
      this.getToken(),
      {},
    );
  }

  async setNumRounds(
    activeEvent: number,
    numRounds: number,
    tournamentId: string,
  ) {
    return await postData(
      `/certs/tournaments/${tournamentId}/events/${activeEvent}/rounds?count=${numRounds}`,
      this.getToken(),
      {},
    );
  }

  async setCutoff(
    value: number,
    type: "placement" | "cutoff" | "medal" | "quals",
    activeEvent: number,
    tournamentId: string,
  ) {
    return await postData(
      `/certs/tournaments/${tournamentId}/events/${activeEvent}/${type}`,
      this.getToken(),
      { cutoff: value },
    );
  }

  async setEventType(
    activeEvent: number,
    eventType: string,
    tournamentId: string,
  ) {
    return await postData(
      `/certs/tournaments/${tournamentId}/events/${activeEvent}/type?type=${eventType}`,
      this.getToken(),
      {},
    );
  }

  async renameCompetitor(
    eventId: number,
    resultId: number,
    newName: string,
    tournamentId: string,
  ) {
    return await postData(
      `/certs/tournaments/${
        tournamentId
      }/events/${eventId}/results/${resultId}/rename?name=${encodeURI(
        newName,
      ).replace("&", "%26")}`,
      this.getToken(),
      {},
    );
  }

  async switchSchool(
    eventId: number,
    resultId: number,
    newSchool: number,
    tournamentId: string,
  ) {
    return await postData(
      `/certs/tournaments/${tournamentId}/events/${eventId}/results/${resultId}/school?schoolId=${newSchool}`,
      this.getToken(),
      {},
    );
  }

  async handleEventResultsUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    eventId: number | undefined,
    roundType: string = "FINALIST",
    tournamentId: string,
  ) {
    if (eventId !== undefined) {
      return await handleFileUpload(
        event,
        `/certs/tournaments/${tournamentId}/events/${eventId}/results?type=${roundType}`,
        this.getToken(),
        () => undefined,
      );
    }
  }

  async resetResults(eventId: number, tournamentId: string): Promise<void> {
    return await deleteData(
      `/certs/tournaments/${tournamentId}/events/${eventId}/results`,
      this.getToken(),
    );
  }

  async deleteEvent(eventId: number, tournamentId: string): Promise<void> {
    return await deleteData(
      `/certs/tournaments/${tournamentId}/events/${eventId}`,
      this.getToken(),
    );
  }

  async updateOne(
    tournamentId: string | number,
    tournament: TournamentForEdit,
  ) {
    return await postData(
      `/certs/tournaments/${tournamentId}`,
      this.getToken(),
      tournament,
    );
  }
}
