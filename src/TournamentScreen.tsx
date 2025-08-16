import * as React from "react";
import styles from "./App.module.css";
import { FieldGroup, FormTextInput, SubmitButton } from "./Inputs";
import { EventDisplay } from "./EventDisplay";
import { Debate, Qualifier, Speaker, Trophy } from "./icons";
import {
  Form,
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "react-router";
import cx from "classnames";
import { CompetitionEvent, Tournament } from "./types";

export type ISetCutoff = (
  value: number,
  type: "placement" | "cutoff" | "medal" | "quals",
  activeEvent: number,
) => void;

type CertificateTypeIconProps = { certificateType: string };

function CertificateTypeIcon({
  certificateType,
}: Readonly<CertificateTypeIconProps>) {
  switch (certificateType) {
    case "PLACEMENT":
      return <Trophy />;
    case "DEBATE_RECORD":
      return <Debate />;
    case "DEBATE_SPEAKER":
      return <Speaker />;
    case "QUALIFIER":
      return <Qualifier />;
    default:
      return null;
  }
}
export function TournamentScreen() {
  const fetcher = useFetcher();
  const [activeEventId, setActiveEventId] = React.useState<number | undefined>(
    undefined,
  );
  const tournament = useLoaderData<Tournament>();
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
          <Form method={"post"} action={"/"} key={tournament.id}>
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
        <fetcher.Form
          method={"POST"}
          action={`/tournaments/${tournament.id}`}
          className={styles.standardForm}
          key={tournament.id}
        >
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
        </fetcher.Form>
      </section>
      <section>
        <h2>Events</h2>
        <Form
          action={"./events"}
          method="POST"
          className={styles.standardForm}
          key={tournament.id}
        >
          <label>
            Enter a list of events separated by newlines.{" "}
            <textarea name={"events"} />
          </label>
          <SubmitButton>Save Events</SubmitButton>
        </Form>
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
                <td>
                  <Link to={`./events/${e.id}`}>{e.name}</Link>
                </td>
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
      <Outlet context={tournament.events} />
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
export const EventDisplayV2 = () => {
  const events = useOutletContext<CompetitionEvent[]>();

  const params = useParams<{ eventId: string }>();
  const activeEventIndex =
    events.findIndex(
      (e: CompetitionEvent) => e.id === Number(params.eventId),
    ) ?? -1;
  return activeEventIndex >= 0 ? (
    <EventDisplay
      event={events[activeEventIndex]}
      setCutoff={(): void => {
        throw new Error("Function not implemented.");
      }}
      setEventType={(): void => {
        throw new Error("Function not implemented.");
      }}
      setCertType={(): void => {
        throw new Error("Function not implemented.");
      }}
      setNumRounds={(): void => {
        throw new Error("Function not implemented.");
      }}
    />
  ) : null;
};
