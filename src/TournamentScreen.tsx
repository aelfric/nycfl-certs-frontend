import * as React from "react";
import styles from "./App.module.css";
import { FieldGroup, FormTextInput, SubmitButton } from "./Inputs";
import { EventDisplay } from "./EventDisplay";
import { Result } from "./App";
import { Debate, Qualifier, Speaker, Trophy } from "./icons";
import { useTournament } from "./use-tournament";
import { Form, Link, useLoaderData } from "react-router";
import cx from "classnames";

export interface Tournament {
  id: number;
  name: string;
  host: string;
  date: string;
  logoUrl?: string;
  slideBackgroundUrl?: string;
  slideAccentColor?: string;
  slideSecondaryAccentColor?: string;
  slidePrimaryColor?: string;
  slideOverlayColor?: string;
  certificateHeadline?: string;
  line1?: string;
  line2?: string;
  signature?: string;
  signatureTitle?: string;
  styleOverrides?: string;
  events: CompetitionEvent[];
}

export interface CompetitionEvent {
  latestResult: string;
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
  activeEvent: number,
) => void;

type CertificateTypeIconProps = { certificateType: string };

function CertificateTypeIcon({
  certificateType,
}: Readonly<CertificateTypeIconProps>) {
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

interface TournamentScreenProps {
  copyTournament: (evt: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TournamentScreen() {
  const copyTournament = () => undefined;
  const [activeEventId, setActiveEventId] = React.useState<number | undefined>(
    undefined,
  );
  const tournament = useLoaderData<Tournament>();
  const {
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
    slidePrimaryColor,
    slideAccentColor,
    slideSecondaryAccentColor,
    slideOverlayColor,
  } = tournament;
  const activeEventIndex = activeEventId
    ? events.findIndex((e: CompetitionEvent) => e.id === activeEventId)
    : -1;

  function checkOrBlank(value: number, cutOff: number) {
    if (value > cutOff) {
      return <>✓ ({value - cutOff})</>;
    } else {
      return "";
    }
  }

  return (
    <>
      <section>
        <h1 style={{ display: "flex" }}>
          <span style={{ flexGrow: "1" }}>{name}</span>
          <Form method={"post"} action={"/"}>
            <input
              type={"hidden"}
              name={"tournamentId"}
              value={tournament.id}
            />
            <button
              className={styles.button}
              type="submit"
              name="intent"
              value="copy"
            >
              Copy
            </button>
          </Form>
        </h1>
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
          <FieldGroup legend={"Slide Properties"}>
            <FormTextInput
              label="Slide Background"
              name={"backgroundUrl"}
              defaultValue={slideBackgroundUrl}
              placeholder={""}
            />
            <FormTextInput
              label="Slide Overlay"
              name={"slideOverlayColor"}
              defaultValue={slideOverlayColor}
              placeholder={"#dddddd"}
            />
            <FormTextInput
              label="Slide Primary Color"
              name={"slidePrimaryColor"}
              defaultValue={slidePrimaryColor}
              placeholder={"#222222"}
            />
            <FormTextInput
              label="Slide Accent Color"
              name={"slideAccentColor"}
              defaultValue={slideAccentColor}
              placeholder={"#00356b"}
            />
            <FormTextInput
              label="Slide Secondary Accent Color"
              name={"slideSecondaryAccentColor"}
              defaultValue={slideSecondaryAccentColor}
              placeholder={"#4a4a4a"}
            />
          </FieldGroup>
          <label>
            Style Overrides (include valid CSS):{" "}
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
          <label>
            Enter a list of events separated by newlines.{" "}
            <textarea name={"events"} />
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
                <td>{e.latestResult || ""}</td>
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
          event={events[activeEventIndex]}
          setCutoff={setCutoff}
          setEventType={setEventType}
          setCertType={setCertType}
          setNumRounds={setNumRounds}
          setEventName={setEventName}
          resetResults={resetResults}
        />
      )}

      <div style={{ margin: "50px", display: "flex" }}>
        <Link
          className={styles.button}
          rel="noreferrer"
          target={"_blank"}
          style={{ flexGrow: 1 }}
          to={`/postings/${tournament.id}`}
        >
          Postings
        </Link>
        <Link
          className={styles.button}
          rel="noreferrer"
          target={"_blank"}
          style={{ flexGrow: 1 }}
          to={`/preview_certificates/${tournament.id}`}
        >
          Certificates
        </Link>
        <Link
          className={styles.button}
          rel="noreferrer"
          target={"_blank"}
          style={{ flexGrow: 1 }}
          to={`/preview_slides/${tournament.id}`}
        >
          Slides
        </Link>
      </div>
    </>
  );
}
