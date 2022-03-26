import styles from "./App.module.css";
import { Certificate, Medal, Trophy } from "./icons";
import * as React from "react";
import { Result } from "./App";
import { ISetCutoff } from "./TournamentScreen";
import { useTournament } from "./use-tournament";
import { StripedTable } from "./StripedTable";

interface ResultDisplayProps {
  certificateCutoff: number;
  medalCutoff: number;
  placementCutoff: number;
  halfQuals: number;
  results: Result[];
  setCutoff: ISetCutoff;
  eventId: number;
}

export function ResultDisplay({
  results,
  placementCutoff,
  certificateCutoff,
  medalCutoff,
  setCutoff,
  eventId,
  halfQuals,
}: ResultDisplayProps) {
  function setPlacementCutoff(value: number) {
    setCutoff(value, "placement", eventId);
  }

  function setCertificateCutoff(value: number) {
    setCutoff(value, "cutoff", eventId);
  }

  function setMedalCutoff(value: number) {
    setCutoff(value, "medal", eventId);
  }

  function setHalfQuals(value: number) {
    setCutoff(value, "quals", eventId);
  }

  const btnStyle = [styles.button, styles.btnSmall].join(" ");

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
            <th colSpan={4}>&nbsp;</th>
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
                <button
                  type={"button"}
                  className={btnStyle}
                  onClick={() => setMedalCutoff(result.place + 1)}
                  title={"Set Medal Cutoff"}
                >
                  <Medal />
                </button>
              </td>
              <td>
                <button
                  type={"button"}
                  className={btnStyle}
                  onClick={() => setPlacementCutoff(result.place + 1)}
                  title={"Set Placement Cutoff"}
                >
                  <Trophy />
                </button>
              </td>
              <td>
                <button
                  type={"button"}
                  className={btnStyle}
                  onClick={() => setCertificateCutoff(result.place + 1)}
                  title={"Set Certificate Cutoff"}
                >
                  <Certificate />
                </button>
              </td>
              <td>
                <button
                  type={"button"}
                  className={btnStyle}
                  onClick={() => setHalfQuals(result.place + 1)}
                  title={"Set Half Quals"}
                  style={{ fontSize: "1.5em" }}
                >
                  ½
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </StripedTable>
      <p style={{ textAlign: "right", width: "90%", margin: "0 auto" }}>
        Reset{" "}
        <button
          type={"button"}
          className={btnStyle}
          onClick={() => setMedalCutoff(1)}
          title={"Set Medal Cutoff"}
        >
          <Medal />
        </button>
        <button
          type={"button"}
          className={btnStyle}
          onClick={() => setPlacementCutoff(1)}
          title={"Set Placement Cutoff"}
        >
          <Trophy />
        </button>
        <button
          type={"button"}
          className={btnStyle}
          onClick={() => setCertificateCutoff(1)}
          title={"Set Certificate Cutoff"}
        >
          <Certificate />
        </button>
        <button
          type={"button"}
          className={btnStyle}
          onClick={() => setHalfQuals(1)}
          title={"Set Half Quals"}
          style={{ fontSize: "1.5em", userSelect: "none" }}
        >
          ½
        </button>
      </p>
    </>
  );
}

function ResultName({ result, eventId }: { result: Result; eventId: number }) {
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
    <span onDoubleClick={handleDoubleClick} title={String(result.id)}>
      {result.name}
    </span>
  );
}

function ResultSchool({
  result,
  eventId,
}: {
  result: Result;
  eventId: number;
}) {
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
        <input
          type={"text"}
          name={"newSchool"}
          defaultValue={result.school.id}
        />
        <br />
        <button type={"submit"}>Save</button>
      </form>
    );
  }
  return (
    <span onDoubleClick={handleDoubleClick} title={String(result.school.id)}>
      {result.school.name}
    </span>
  );
}
