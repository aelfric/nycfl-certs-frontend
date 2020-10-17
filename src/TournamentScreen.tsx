import * as React from "react";
import {deleteData, getData} from "./fetch";
import styles from "./App.module.css";
import { FileInput, FormTextInput, SubmitButton } from "./Inputs";
import { EventDisplay } from "./EventDisplay";
import { Sweepstakes } from "./Sweepstakes";
import { MedalCount, Result, TournamentIdProps } from "./App";
const cx = require("classnames");

export interface Tournament {
  id: number;
  name: string;
  host: string;
  date: string;
  logoUrl?: string;
  certificateHeadline?: string;
  signature?: string;
  signatureTitle?: string;
  events: CompetitionEvent[];
}

export interface CompetitionEvent {
  eventType: string;
  id: number;
  name: string;
  results: Result[];
  placementCutoff: number;
  medalCutoff: number;
  certificateCutoff: number;
}

export type ISetCutoff = (
  value: number,
  type: "placement" | "cutoff" | "medal",
  activeEvent: number
) => void;

type InputEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (evt: React.ChangeEvent<HTMLFormElement>) => void;

type TournamentScreenParams = {
  onSubmit: SubmitHandler;
  uploadSchools: InputEventHandler;
  setEventType: (eventId: number, type: string) => void;
  createEvents: SubmitHandler;
  uploadResults: (
    inputEvent: React.ChangeEvent<HTMLInputElement>,
    eventId: number,
    roundType: string
  ) => void;
  uploadSweeps: InputEventHandler;
  setCutoff: ISetCutoff;
  tournament: Tournament;
  resetResults: (eventId: number) => void
};

export function TournamentScreen({
  onSubmit,
  setCutoff,
  setEventType,
  uploadResults,
  uploadSchools,
  uploadSweeps,
  createEvents,
  tournament,
  resetResults
}: TournamentScreenParams) {
  const [activeEventId, setActiveEventId] = React.useState<number | undefined>(
    undefined
  );
  const {
    signature,
    signatureTitle,
    events,
    certificateHeadline,
    name,
    logoUrl,
    host,
    date,
  } = tournament;
  const activeEventIndex = activeEventId
    ? events.findIndex((e: CompetitionEvent) => e.id === activeEventId)
    : -1;

  return (
    <>
      <section>
        <h1>{name} </h1>
        <form onSubmit={onSubmit} className={styles.standardForm}>
          <FormTextInput
            name={"tournamentName"}
            label={"Tournament Name"}
            defaultValue={name}
          />
          <FormTextInput label={"Host"} name={"host"} defaultValue={host} />
          <FormTextInput
            label="Date"
            type={"date"}
            name={"date"}
            defaultValue={date}
          />
          <FormTextInput
            label="Headline"
            name={"certificateHeadline"}
            defaultValue={certificateHeadline}
            placeholder={"New York Catholic Forensics League"}
          />
          <FormTextInput
            label="Logo"
            name={"logoUrl"}
            defaultValue={logoUrl}
            placeholder={"/nycfl-logo.svg"}
          />
          {logoUrl && (
            <p style={{ textAlign: "center" }}>
              <img src={logoUrl} alt={"Tournament Logo"} />
            </p>
          )}
          <FormTextInput
            label="Signature"
            name={"signature"}
            defaultValue={signature}
            placeholder={"Tom Beck"}
          />
          <FormTextInput
            label="Signature Title"
            name={"signatureTitle"}
            defaultValue={signatureTitle}
            placeholder={"NYCFL President"}
          />
          <SubmitButton>Update Tournament</SubmitButton>
        </form>
      </section>
      <section>
        <h2>Schools</h2>
        <FileInput name="schoolsUpload" onChange={uploadSchools} />
      </section>
      <section>
        <h2>Events</h2>
        <form onSubmit={createEvents} className={styles.standardForm}>
          <textarea name={"events"} />
          <SubmitButton>Save Events</SubmitButton>
        </form>
        <table className={styles.stripedTable}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Results Loaded</th>
              <th>Placement Set</th>
              <th>Medals Set</th>
              <th>Cutoff Set</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e: CompetitionEvent) => (
              <tr
                onClick={() => setActiveEventId(e.id)}
                key={e.id}
                className={cx(styles.selectableRow, {
                  [styles.selected]: activeEventId === e.id,
                })}
              >
                <td>{e.name}</td>
                <td>{e.results.length > 0 ? "Yes" : ""}</td>
                <td>{e.placementCutoff > 0 ? "Yes" : ""}</td>
                <td>{e.medalCutoff > 0 ? "Yes" : ""}</td>
                <td>{e.certificateCutoff > 0 ? "Yes" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {events[activeEventIndex] !== undefined && (
        <EventDisplay
          uploadResults={uploadResults}
          tournament={tournament}
          event={events[activeEventIndex]}
          setCutoff={setCutoff}
          setEventType={setEventType}
          resetResults={resetResults}
        />
      )}

      <div style={{ margin: "50px" }}>
        <a
          className={styles.button}
          href={`http://localhost:8080/certs/tournaments/${tournament.id}/certificates`}
        >
          Generate Certificates
        </a>
      </div>
      <section>
        <h2>Medals</h2>
        <SchoolList tournamentId={tournament.id} />
      </section>
      <section>
        <h2>Sweepstakes</h2>
        <FileInput name={"sweepsResults"} onChange={uploadSweeps} />
        <Sweepstakes tournamentId={tournament.id} />
      </section>
    </>
  );
}

function SchoolList({ tournamentId }: TournamentIdProps) {
  const [medals, setMedals] = React.useState([]);
  React.useEffect(() => {
    if (tournamentId) {
      getData(`/certs/tournaments/${tournamentId}/medals`).then(setMedals);
    }
  }, [tournamentId]);

  if (!tournamentId) return null;

  return (
    <table className={styles.stripedTable}>
      <thead>
        <tr>
          <th>School</th>
          <th>Medal Count</th>
        </tr>
      </thead>
      <tbody>
        {medals.map((result: MedalCount) => (
          <tr key={result.school}>
            <td>{result.school}</td>
            <td style={{ textAlign: "center" }}>{result.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
