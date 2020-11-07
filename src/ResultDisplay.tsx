import styles from "./App.module.css";
import { Certificate, Medal, Trophy } from "./icons";
import * as React from "react";
import { Result } from "./App";
import { ISetCutoff } from "./TournamentScreen";
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

  function setHalfQuals(value: number){
    setCutoff(value, "quals", eventId);
  }

  return (
    <table className={styles.stripedTable}>
      <thead>
        <tr>
          <th>Place (#)</th>
          <th colSpan={2}>Certificate</th>
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
            <td>{result.place < medalCutoff ? "M" : ""}</td>
            <td>{result.placeString}</td>
            <td>{result.name}</td>
            <td>{result.school.name}</td>
            <td>{result.place < halfQuals ? "Half" : ""}</td>
            <td>
              <button
                type={"button"}
                className={styles.button}
                onClick={() => setMedalCutoff(result.place + 1)}
                title={"Set Medal Cutoff"}
              >
                <Medal
                  style={{
                    width: "1.5em",
                    top: "0.5em",
                    position: "relative",
                  }}
                />
              </button>
            </td>
            <td>
              <button
                type={"button"}
                className={styles.button}
                onClick={() => setPlacementCutoff(result.place + 1)}
                title={"Set Placement Cutoff"}
              >
                <Trophy
                  style={{
                    width: "1.5em",
                    top: "0.5em",
                    position: "relative",
                  }}
                />
              </button>
            </td>
            <td>
              <button
                type={"button"}
                className={styles.button}
                onClick={() => setCertificateCutoff(result.place + 1)}
                title={"Set Certificate Cutoff"}
              >
                <Certificate
                  style={{
                    width: "1.5em",
                    top: "0.5em",
                    position: "relative",
                  }}
                />
              </button>
            </td>
            <td>
              <button
                  type={"button"}
                  className={styles.button}
                  onClick={() => setHalfQuals(result.place + 1)}
                  title={"Set Half Quals"}
                  style={{fontSize: "1.5em"}}
              >
                ½
              </button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={6}>Reset</td>
          <td>
            <button
              type={"button"}
              className={styles.button}
              onClick={() => setMedalCutoff(1)}
              title={"Set Medal Cutoff"}
            >
              <Medal
                style={{
                  width: "1.5em",
                  top: "0.5em",
                  position: "relative",
                }}
              />
            </button>
          </td>
          <td>
            <button
              type={"button"}
              className={styles.button}
              onClick={() => setPlacementCutoff(1)}
              title={"Set Placement Cutoff"}
            >
              <Trophy
                style={{
                  width: "1.5em",
                  top: "0.5em",
                  position: "relative",
                }}
              />
            </button>
          </td>
          <td>
            <button
              type={"button"}
              className={styles.button}
              onClick={() => setCertificateCutoff(1)}
              title={"Set Certificate Cutoff"}
            >
              <Certificate
                style={{
                  width: "1.5em",
                  top: "0.5em",
                  position: "relative",
                }}
              />
            </button>
          </td>
          <td>
            <button
              type={"button"}
              className={styles.button}
              onClick={() => setHalfQuals(1)}
              title={"Set Half Quals"}
              style={{fontSize: "1.5em"}}
            >
              ½
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
