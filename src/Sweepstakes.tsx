import * as React from "react";
import { deleteData, getData } from "./fetch";
import styles from "./App.module.css";
import { TournamentIdProps } from "./App";
import { Certificate, Delete } from "./icons";
import { useKeycloak } from "@react-keycloak/web";

export function Sweepstakes({ tournamentId }: TournamentIdProps) {
  const [showYTD, setShowYTD] = React.useState(false);

  if (!tournamentId) return null;

  return (
    <>
      <label>
        Show YTD
        <input
          type={"checkbox"}
          checked={showYTD}
          onChange={() => setShowYTD((c) => !c)}
        />
      </label>
      {showYTD ? (
        <CumulativeSweeps />
      ) : (
        <IndividualSweeps tournamentId={tournamentId} />
      )}
    </>
  );
}

export interface SweepsResult {
  school: string;
  points: number;
  id: number;
  place: number;
  placeString: string;
  name: string;
}

function IndividualSweeps({ tournamentId }: TournamentIdProps) {
  const { keycloak } = useKeycloak();

  const [data, setData] = React.useState<SweepsResult[]>([]);
  const [key, setKey] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (tournamentId) {
      setLoading(true);
      getData(
        `/certs/tournaments/${tournamentId}/sweeps?key=${key}`,
        keycloak.token
      ).then((resp) => {
        setData(resp);
        setLoading(false);
      });
    }
  }, [tournamentId]);

  const deleteSchool = (id: number) =>
    deleteData(
      `/certs/tournaments/${tournamentId}/schools/${id}`,
      keycloak.token
    ).then(() => setKey((k) => k + 1));

  if (loading) return <p>Loading...</p>;

  return (
    <table className={styles.stripedTable}>
      <thead>
        <tr>
          <th></th>
          <th>School</th>
          <th>Points (current tournament)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((result) => (
          <tr key={result.school}>
            <td>
              <button
                type={"button"}
                className={styles.button}
                onClick={() => deleteSchool(result.schoolId)}
              >
                <Delete
                  style={{
                    width: "1.5em",
                    top: "0.5em",
                    position: "relative",
                  }}
                />
              </button>
            </td>
            <td>{result.school}</td>
            <td style={{ textAlign: "center" }}>{result.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export interface CumulativeSweepsData {
  totals: object;
  resultsMap: Record<string, SweepsResult>;
}

export interface SweepsResult {
  schoolId: number;
  tournament: string;
  points: number;
}

function CumulativeSweeps() {
  const [data, setData] = React.useState<CumulativeSweepsData | undefined>(
    undefined
  );
  const { keycloak } = useKeycloak();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    getData(`/certs/tournaments/sweeps`, keycloak.token).then((resp) => {
      setData(resp);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <p>Loading...</p>;

  return (
    <table className={styles.stripedTable}>
      <thead>
        <tr>
          <th>School</th>
          <th>Points (current tournament)</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data.totals).map(([key, value]) => (
          <tr key={key}>
            <td>
              {key}
              <table>
                <tbody>
                  {Object.values(data.resultsMap[key]).map(
                    (result: SweepsResult) => (
                      <tr key={result.tournament}>
                        <td>{result.tournament}</td>
                        <td>{result.points}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </td>
            <td style={{ textAlign: "center" }}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
