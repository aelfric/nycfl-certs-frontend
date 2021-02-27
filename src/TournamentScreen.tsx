import * as React from "react";
import { getData } from "./fetch";
import styles from "./App.module.css";
import { FormTextInput, SubmitButton } from "./Inputs";
import { EventDisplay } from "./EventDisplay";
import { MedalCount, Result, TournamentIdProps } from "./App";
import {Debate, Qualifier, Speaker, Trophy} from "./icons";
import { useTournament } from "./use-tournament";
const cx = require("classnames");

export interface Tournament {
  id: number;
  name: string;
  host: string;
  date: string;
  logoUrl?: string;
  slideBackgroundUrl?: string;
  certificateHeadline?: string;
  line1?: string;
  line2?: string;
  signature?: string;
  signatureTitle?: string;
  styleOverrides?: string;
  events: CompetitionEvent[];
}

export interface CompetitionEvent {
  eventType: string;
  certificateType: string;
  id: number;
  name: string;
  results: Result[];
  placementCutoff: number;
  medalCutoff: number;
  certificateCutoff: number;
  halfQuals: number;
  numRounds: number | null;
}

export type ISetCutoff = (
  value: number,
  type: "placement" | "cutoff" | "medal" | "quals",
  activeEvent: number
) => void;

function CertificateTypeIcon({ certificateType }: { certificateType: string }) {
  const defaultStyle: React.CSSProperties = {
    width: "1em",
    top: "0.125em",
    position: "relative",
  };

  switch (certificateType) {
    case "PLACEMENT":
      return <Trophy style={defaultStyle} />;
    case "DEBATE_RECORD":
      return <Debate style={defaultStyle} />;
    case "DEBATE_SPEAKER":
      return <Speaker style={defaultStyle} />;
    case "QUALIFIER":
      return <Qualifier style={defaultStyle} />;
    default:
      return null;
  }
}

export function TournamentScreen() {
  const [activeEventId, setActiveEventId] = React.useState<number | undefined>(
    undefined
  );
  const {
    tournament,
    setCutoff,
    updateTournament,
    resetResults,
    setEventType,
    createEvents,
    setEventName,
    setNumRounds,
    setCertType,
  } = useTournament();
  if (!tournament) return <p>Loading...</p>;

  const {
    signature,
    signatureTitle,
    events,
    certificateHeadline,
    line1,
    line2,
    name,
    logoUrl,
    slideBackgroundUrl,
    host,
    date,
    styleOverrides,
  } = tournament;
  const activeEventIndex = activeEventId
    ? events.findIndex((e: CompetitionEvent) => e.id === activeEventId)
    : -1;

  function checkOrBlank(value: number, cutOff: number) {
    if (value > cutOff) {
      return <>✓ ({value-cutOff})</>;
    } else {
      return "";
    }
  }

  return (
    <>
      <section>
        <h1>{name} </h1>
        <form onSubmit={updateTournament} className={styles.standardForm}>
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
            label="Line 1"
            name={"line1"}
            defaultValue={line1}
            placeholder={host}
          />
          <FormTextInput
            label="Line 2"
            name={"line2"}
            defaultValue={line2}
            placeholder={name}
          />
          <FormTextInput
            label="Logo"
            name={"logoUrl"}
            defaultValue={logoUrl}
            placeholder={"/nycfl-logo.svg"}
          />
          <FormTextInput
            label="Slide Background"
            name={"backgroundUrl"}
            defaultValue={slideBackgroundUrl}
            placeholder={""}
          />
          {logoUrl && (
            <p style={{ textAlign: "center" }}>
              <img
                src={logoUrl}
                alt={"Tournament Logo"}
                style={{ height: "100px", margin: "0 auto" }}
              />
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
          <label>
            Style Overrides (include valid CSS):
            <textarea
              name={"styleOverrides"}
              style={{ fontFamily: "Courier" }}
              defaultValue={styleOverrides}
            />
          </label>
          <SubmitButton>Update Tournament</SubmitButton>
        </form>
      </section>
      <section>
        <h2>Events</h2>
        <form onSubmit={createEvents} className={styles.standardForm}>
          <label >Enter a list of events separated by newlines.<textarea name={"events"} />
          </label>
          <SubmitButton>Save Events</SubmitButton>
        </form>
        <table className={styles.stripedTable}>
          <thead>
            <tr>
              <th colSpan={2}>Event</th>
              <th>Results Loaded</th>
              <th>Placement Set</th>
              <th>Medals Set</th>
              <th>Cutoff Set</th>
              <th>Half Q. Set</th>
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
                <td>
                  <CertificateTypeIcon certificateType={e.certificateType} />
                </td>
                <td>{e.name}</td>
                <td>{checkOrBlank(e.results.length, 0)}</td>
                <td>{checkOrBlank(e.placementCutoff, 1)}</td>
                <td>{checkOrBlank(e.medalCutoff, 1)}</td>
                <td>{checkOrBlank(e.certificateCutoff, 1)}</td>
                <td>{checkOrBlank(e.halfQuals, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {events[activeEventIndex] !== undefined && (
        <EventDisplay
          tournament={tournament}
          event={events[activeEventIndex]}
          setCutoff={setCutoff}
          setEventType={setEventType}
          setCertType={setCertType}
          setNumRounds={setNumRounds}
          setEventName={setEventName}
          resetResults={resetResults}
        />
      )}

      <div style={{ margin: "50px" }}>
        <a
          className={styles.button}
          target={"_blank"}
          href={`http://localhost:8080/certs/tournaments/${tournament.id}/certificates`}
        >
          Generate Certificates
        </a>
        <a
          className={styles.button}
          target={"_blank"}
          href={`http://localhost:8080/certs/tournaments/${tournament.id}/slides?dl=0`}
        >
          Generate Slides
        </a>
      </div>
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
