import * as React from "react";
import "./App.css";
import styles from "./App.module.css";
import { Certificate, Medal, Trophy } from "./icons";
import { getData, handleFileUpload, postData } from "./fetch";
import { FileInput, FormTextInput, SubmitButton } from "./Inputs";

interface Tournament {
  id: number;
  name: string;
  host: string;
  date: string;
  logoUrl?: string;
  certificateHeadline?: string;
  signature?: string;
  events: Event[];
}

interface Event {
  id: number;
  name: string;
  results: Result[];
  placementCutoff: number;
  medalCutoff: number;
  certificateCutoff: number;
}

function App() {
  const [tournaments, setTournaments] = React.useState<Tournament[]>([]);
  const [activeTournament, setActiveTournament] = React.useState<
    number | undefined
  >(undefined);
  const [activeEvent, setActiveEvent] = React.useState<number | undefined>(
    undefined
  );

  const activeTournamentIndex = activeTournament
    ? tournaments.findIndex((t) => t.id === activeTournament)
    : -1;
  const activeEventIndex =
    activeTournamentIndex && activeEvent
      ? tournaments[activeTournamentIndex].events.findIndex(
          (e: Event) => e.id === activeEvent
        )
      : -1;

  React.useEffect(() => {
    getData("/certs/tournaments").then(setTournaments);
  }, []);

  function createTournament(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    postData("/certs/tournaments", {
      name: evt.target.tournamentName.value,
      host: evt.target.host.value,
      date: evt.target.date.value,
    }).then((newTournament) =>
      setTournaments((tournaments) => [...tournaments, newTournament])
    );
  }
  function updateTournament(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    postData(`/certs/tournaments/${activeTournament}`, {
      name: evt.target.tournamentName.value,
      host: evt.target.host.value,
      date: evt.target.date.value,
      logoUrl: evt.target.logoUrl.value,
      certificateHeadline: evt.target.certificateHeadline.value,
      signature: evt.target.signature.value,
    }).then((newTournament) =>
      setTournaments((tournaments) =>
        Object.assign([], tournaments, {
          [activeTournamentIndex]: newTournament,
        })
      )
    );
  }

  function createEvents(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    postData("/certs/events", {
      events: evt.target.events.value,
      tournamentId: activeTournament,
    }).then((newTournament) =>
      setTournaments((tournaments) => {
        const index = tournaments.findIndex((t) => t.id === activeTournament);
        return Object.assign([], tournaments, { [index]: newTournament });
      })
    );
  }

  function setPlacementCutoff(value: number) {
    postData(
      `/certs/tournaments/${activeTournament}/events/${activeEvent}/placement`,
      { cutoff: value }
    ).then((newTournament) =>
      setTournaments((tournaments) => {
        const index = tournaments.findIndex((t) => t.id === activeTournament);
        return Object.assign([], tournaments, { [index]: newTournament });
      })
    );
  }

  function setCertificateCutoff(value: number) {
    postData(
      `/certs/tournaments/${activeTournament}/events/${activeEvent}/cutoff`,
      { cutoff: value }
    ).then((newTournament) =>
      setTournaments((tournaments) => {
        const index = tournaments.findIndex((t) => t.id === activeTournament);
        return Object.assign([], tournaments, { [index]: newTournament });
      })
    );
  }

  function setMedalCutoff(value: number) {
    postData(
      `/certs/tournaments/${activeTournament}/events/${activeEvent}/medal`,
      { cutoff: value }
    ).then((newTournament) =>
      setTournaments((tournaments) => {
        const index = tournaments.findIndex((t) => t.id === activeTournament);
        return Object.assign([], tournaments, { [index]: newTournament });
      })
    );
  }

  function handleEventResultsUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    handleFileUpload(
      event,
      `/certs/tournaments/${activeTournament}/events/${activeEvent}/results`,
      (data: Tournament) => {
        const index = tournaments.findIndex((t) => t.id === activeTournament);
        return setTournaments((tournaments) =>
          Object.assign([], tournaments, { [index]: data })
        );
      }
    );
  }

  function handleSweepsUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(
      event,
      `/certs/tournaments/${activeTournament}/sweeps`,
      (data: Tournament) => {
        const index = tournaments.findIndex((t) => t.id === activeTournament);
        return setTournaments((tournaments) =>
          Object.assign([], tournaments, { [index]: data })
        );
      }
    );
  }
  function handleSchoolsUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(
      event,
      `/certs/tournaments/${activeTournament}/schools`,
      () => {
        alert("Schools Loaded");
      }
    );
  }
  function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(event, `/s3/upload`, () => {
      alert("Media Saved");
    });
  }

  return (
    <div className={styles.main}>
      <aside>
        <ul className={[styles.tournaments, styles.box].join(" ")}>
          {tournaments.map((t) => (
            <li
              key={t.id}
              className={
                activeTournament === t.id ? styles.selected : undefined
              }
              onClick={() => setActiveTournament(t.id)}
            >
              {t.name} {}
            </li>
          ))}
        </ul>
        <section className={styles.box}>
          <h2>Media</h2>
          <FileInput
            name="mediaUpload"
            onChange={handleMediaUpload}
            key={activeTournament}
          />
        </section>
        <section className={styles.box}>
          <form onSubmit={createTournament} className={styles.standardForm}>
            <FormTextInput name={"tournamentName"} label={"Tournament Name"} />
            <FormTextInput label={"Host"} name={"host"} />
            <FormTextInput label="Date" type={"date"} name={"date"} />
            <SubmitButton>Create Tournament</SubmitButton>
          </form>
        </section>
      </aside>
      <main>
        {activeTournament && (
          <>
            <section>
              <h1>{tournaments[activeTournamentIndex].name} </h1>
              <form
                onSubmit={updateTournament}
                className={styles.standardForm}
                key={activeTournament}
              >
                <FormTextInput
                  name={"tournamentName"}
                  label={"Tournament Name"}
                  defaultValue={tournaments[activeTournamentIndex].name}
                />
                <FormTextInput
                  label={"Host"}
                  name={"host"}
                  defaultValue={tournaments[activeTournamentIndex].host}
                />
                <FormTextInput
                  label="Date"
                  type={"date"}
                  name={"date"}
                  defaultValue={tournaments[activeTournamentIndex].date}
                />
                <FormTextInput
                  label="Headline"
                  name={"certificateHeadline"}
                  defaultValue={
                    tournaments[activeTournamentIndex].certificateHeadline
                  }
                  placeholder={"New York Catholic Forensics League"}
                />
                <FormTextInput
                  label="Logo"
                  name={"logoUrl"}
                  defaultValue={tournaments[activeTournamentIndex].logoUrl}
                  placeholder={"/nycfl-logo.svg"}
                />
                {tournaments[activeTournamentIndex].logoUrl && (
                  <p style={{ textAlign: "center" }}>
                    <img
                      src={tournaments[activeTournamentIndex].logoUrl}
                      alt={"Tournament Logo"}
                    />
                  </p>
                )}
                <FormTextInput
                  label="Signature"
                  name={"signature"}
                  defaultValue={tournaments[activeTournamentIndex].signature}
                  placeholder={"Tom Beck"}
                />
                <SubmitButton>Update Tournament</SubmitButton>
              </form>
            </section>
            <section>
              <h2>Schools</h2>
              <FileInput
                name="schoolsUpload"
                onChange={handleSchoolsUpload}
                key={activeTournament}
              />
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
                {tournaments[activeTournamentIndex].events.map((e: Event) => (
                  <tr
                    onClick={() => setActiveEvent(e.id)}
                    key={e.id}
                    className={`${styles.selectableRow} ${
                      activeEvent === e.id ? styles.selected : ""
                    }`}
                  >
                    <td>{e.name}</td>
                    <td>{e.results.length > 0 ? "Yes" : ""}</td>
                    <td>{e.placementCutoff > 0 ? "Yes" : ""}</td>
                    <td>{e.medalCutoff > 0 ? "Yes" : ""}</td>
                    <td>{e.certificateCutoff > 0 ? "Yes" : ""}</td>
                  </tr>
                ))}
              </table>
            </section>
          </>
        )}
        {activeTournament && activeEvent && (
          <section>
            <h2>Results</h2>
            <FileInput
              name="eventResults"
              onChange={handleEventResultsUpload}
              key={activeEventIndex}
            />
            <ResultDisplay
              results={
                tournaments[activeTournamentIndex].events[activeEventIndex]
                  .results
              }
              setPlacementCutoff={setPlacementCutoff}
              placementCutoff={
                tournaments[activeTournamentIndex].events[activeEventIndex]
                  .placementCutoff
              }
              setCertificateCutoff={setCertificateCutoff}
              certificateCutoff={
                tournaments[activeTournamentIndex].events[activeEventIndex]
                  .certificateCutoff
              }
              setMedalCutoff={setMedalCutoff}
              medalCutoff={
                tournaments[activeTournamentIndex].events[activeEventIndex]
                  .medalCutoff
              }
            />
          </section>
        )}
        {activeTournament && (
          <>
            <div style={{ margin: "50px" }}>
              <a
                className={styles.button}
                href={`http://localhost:8080/certs/tournaments/${activeTournament}/certificates`}
              >
                Generate Certificates
              </a>
            </div>
            <section>
              <h2>Medals</h2>
              <SchoolList tournamentId={activeTournament} />
            </section>
            <section>
              <h2>Sweepstakes</h2>
              <FileInput name={"sweepsResults"} onChange={handleSweepsUpload} />
              <Sweepstakes tournamentId={activeTournament} />
            </section>
          </>
        )}
        <footer>
          <p>Medal by Gregor Cresnar from the Noun Project</p>
          <p>Trophy by Ken Messenger from the Noun Project</p>
          <p>Certificate by Iconstock from the Noun Project</p>
        </footer>
      </main>
    </div>
  );
}

interface TournamentIdProps {
  tournamentId: number;
}

interface MedalCount {
  school: string;
  count: number;
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
      {medals.map((result: MedalCount) => (
        <tr key={result.school}>
          <td>{result.school}</td>
          <td style={{ textAlign: "center" }}>{result.count}</td>
        </tr>
      ))}
    </table>
  );
}

function Sweepstakes({ tournamentId }: TournamentIdProps) {
  const [showCume, setShowCume] = React.useState(false);

  if (!tournamentId) return null;

  return (
    <>
      <label>
        Show YTD
        <input
          type={"checkbox"}
          checked={showCume}
          onChange={() => setShowCume((c) => !c)}
        />
      </label>
      {showCume ? (
        <CumulativeSweeps />
      ) : (
        <IndividualSweeps tournamentId={tournamentId} />
      )}
    </>
  );
}

interface School {
  id: number;
  name: string;
}

interface Result {
  school: School;
  points: number;
  id: number;
  place: number;
  placeString: string;
  name: string;
}

interface SweepsResult {
  school: string;
  points: number;
  id: number;
  place: number;
  placeString: string;
  name: string;
}
function IndividualSweeps({ tournamentId }: TournamentIdProps) {
  const [data, setData] = React.useState<SweepsResult[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (tournamentId) {
      setLoading(true);
      getData(`/certs/tournaments/${tournamentId}/sweeps`).then((resp) => {
        setData(resp);
        setLoading(false);
      });
    }
  }, [tournamentId]);

  if (loading) return <p>Loading...</p>;

  return (
    <table className={styles.stripedTable}>
      <thead>
        <tr>
          <th>School</th>
          <th>Points (current tournament)</th>
        </tr>
      </thead>
      {data.map((result) => (
        <tr key={result.school}>
          <td>{result.school}</td>
          <td style={{ textAlign: "center" }}>{result.points}</td>
        </tr>
      ))}
    </table>
  );
}

interface CumulativeSweepsData {
  totals: object;
  resultsMap: Record<string, SweepsResult>;
}

interface SweepsResult {
  tournament: string;
  points: number;
}

function CumulativeSweeps() {
  const [data, setData] = React.useState<CumulativeSweepsData | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    getData(`/certs/tournaments/sweeps`).then((resp) => {
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
    </table>
  );
}

function ResultDisplay({
  results,
  setCertificateCutoff,
  setPlacementCutoff,
  setMedalCutoff,
  placementCutoff,
  certificateCutoff,
  medalCutoff,
}: ResultDisplayProps) {
  return (
    <table className={styles.stripedTable}>
      <thead>
        <tr>
          <th>Place (#)</th>
          <th colSpan={2}>Certificate</th>
          <th>Name</th>
          <th>School</th>
          <th colSpan={3}>&nbsp;</th>
        </tr>
      </thead>
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
        </tr>
      ))}
    </table>
  );
}

export default App;

interface SetCutoffFunction {
  (cutoff: number): void;
}

interface ResultDisplayProps {
  certificateCutoff: number;
  medalCutoff: number;
  placementCutoff: number;
  results: Result[];
  setCertificateCutoff: SetCutoffFunction;
  setMedalCutoff: SetCutoffFunction;
  setPlacementCutoff: SetCutoffFunction;
}
