import styles from "./App.module.css";
import { Certificate, Medal, Trophy } from "./icons";
import * as React from "react";
import { ReactNode } from "react";
import { Result } from "./App";
import { useTournament } from "./use-tournament";
import { StripedTable } from "./StripedTable";
import { CutoffType } from "./types";
import { useFetcher, useParams } from "react-router";
import cx from "classnames";

interface ResultDisplayProps {
  certificateCutoff: number;
  medalCutoff: number;
  placementCutoff: number;
  halfQuals: number;
  results: Result[];
  eventId: number;
}

const cutoffButtons: Required<
  Record<CutoffType, { icon: ReactNode; title: string }>
> = {
  cutoff: {
    icon: <Certificate />,
    title: "Set Certificate Cutoff",
  },
  medal: {
    icon: <Medal />,
    title: "Set Medal Cutoff",
  },
  placement: {
    icon: <Trophy />,
    title: "Set Placement Cutoff",
  },
  quals: {
    icon: "½",
    title: "Set Half Quals",
  },
};

function CutoffButtons() {
  return Object.entries(cutoffButtons).map(([type, props]) => (
    <button
      key={type}
      type={"submit"}
      className={cx(styles.button, styles.btnSmall)}
      name={"cutoffType"}
      value={type}
      title={props.title}
    >
      {props.icon}
    </button>
  ));
}

export function ResultDisplay({
  results,
  placementCutoff,
  certificateCutoff,
  medalCutoff,
  eventId,
  halfQuals,
}: Readonly<ResultDisplayProps>) {
  const { id: tournamentId } = useParams();
  const fetcher = useFetcher();
  return (
    <>
      <StripedTable>
        <thead>
          <tr>
            <th>Place (#)</th>
            <th>Certificate</th>
            <th>Name</th>
            <th>School</th>
            <th>Half?</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.id}
              className={
                result.place < placementCutoff
                  ? styles.placing
                  : result.place < certificateCutoff
                    ? styles.finalist
                    : styles.noCert
              }
            >
              <td>{result.place}</td>
              <td>
                {result.placeString} {result.place < medalCutoff ? " (M)" : ""}
              </td>
              <td>
                <ResultName result={result} eventId={eventId} />
              </td>
              <td>
                <ResultSchool result={result} eventId={eventId} />
              </td>
              <td>{result.place < halfQuals ? "Half" : ""}</td>
              <td>
                <fetcher.Form
                  action={`/tournaments/${tournamentId}/events/${eventId}/cutoff`}
                  method={"POST"}
                  style={{ display: "flex" }}
                >
                  <input
                    type={"hidden"}
                    name={"value"}
                    value={result.place + 1}
                  />
                  <CutoffButtons />
                </fetcher.Form>
              </td>
            </tr>
          ))}
        </tbody>
      </StripedTable>
      <div style={{ textAlign: "right", width: "90%", margin: "0 auto" }}>
        <fetcher.Form
          action={`/tournaments/${tournamentId}/events/${eventId}/cutoff`}
          method={"POST"}
        >
          Reset <input type={"hidden"} name={"value"} value={1} />
          <CutoffButtons />
        </fetcher.Form>
      </div>
    </>
  );
}

type ResultNameProps = { result: Result; eventId: number };

function ResultName({ result, eventId }: Readonly<ResultNameProps>) {
  const [editing, setEditing] = React.useState(false);
  const { renameCompetitor } = useTournament();

  function handleDoubleClick() {
    setEditing((e) => !e);
  }

  function handleSave(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    renameCompetitor(eventId, result.id, evt.target.newName.value);
    setEditing(false);
  }

  if (editing) {
    return (
      <form onSubmit={handleSave}>
        <input type={"text"} name={"newName"} defaultValue={result.name} />
        <br />
        <button type={"submit"}>Save</button>
      </form>
    );
  }
  return (
    <button
      className={styles.buttonInline}
      onDoubleClick={handleDoubleClick}
      title={String(result.id)}
    >
      {result.name}
    </button>
  );
}

type ResultSchoolProps = {
  result: Result;
  eventId: number;
};

function ResultSchool({ result, eventId }: Readonly<ResultSchoolProps>) {
  const [editing, setEditing] = React.useState(false);
  const { switchSchool } = useTournament();

  function handleDoubleClick() {
    setEditing((e) => !e);
  }

  function handleSave(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    switchSchool(eventId, result.id, Number(evt.target.newSchool.value));
    setEditing(false);
  }

  if (editing) {
    return (
      <form onSubmit={handleSave}>
        <input type={"hidden"} value={result.school.id} />
        <input
          type={"text"}
          name={"newSchool"}
          defaultValue={result.school.name}
        />
        <br />
        <button type={"submit"}>Save</button>
      </form>
    );
  }
  return (
    <button
      className={styles.buttonInline}
      onDoubleClick={handleDoubleClick}
      title={String(result.school.id)}
    >
      {result.school.name}
    </button>
  );
}
