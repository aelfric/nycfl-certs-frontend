import React from "react";
import "./App.css";
import styles from "./App.module.css";
import { Certificate, Medal, Trophy } from "./icons";
import * as PropTypes from "prop-types";

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = "") {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "GET", //POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function FormTextInput({ name, label, type = "text", value, placeholder, defaultValue }) {
  return (
    <label>
      <span>{label}</span>
      <input type={type} name={name} value={value} defaultValue={defaultValue} placeholder={placeholder} />
    </label>
  );
}

function SubmitButton({ children }) {
  return (
    <div className={styles.submitButtonRow}>
      <button className={styles.button} type={"submit"}>
        {children}
      </button>
    </div>
  );
}

function FileInput({ name, onChange }) {
  return (
    <div className={styles.fileUploadRow}>
      <input
        type="file"
        id={name}
        name={name}
        onChange={onChange}
        disabled={false}
        className={styles.fileInput}
      />
      <label htmlFor={name}>Choose a file</label>
    </div>
  );
}

FileInput.propTypes = { onChange: PropTypes.func };

function App() {
  const [tournaments, setTournaments] = React.useState([]);
  const [activeTournament, setActiveTournament] = React.useState(undefined);
  const [activeEvent, setActiveEvent] = React.useState(undefined);

  const activeTournamentIndex = activeTournament
    ? tournaments.findIndex((t) => t.id === activeTournament)
    : undefined;
  const activeEventIndex = activeEvent
    ? tournaments[activeTournamentIndex].events.findIndex(
        (e) => e.id === activeEvent
      )
    : undefined;

  React.useEffect(() => {
    getData("/certs/tournaments").then(setTournaments);
  }, []);

  function createTournament(evt) {
    evt.preventDefault();
    postData("/certs/tournaments", {
      name: evt.target.name.value,
      host: evt.target.host.value,
      date: evt.target.date.value,
    }).then((newTournament) =>
      setTournaments((tournaments) => [...tournaments, newTournament])
    );
  }
  function updateTournament(evt) {
    evt.preventDefault();
    postData(`/certs/tournaments/${activeTournament}`, {
      name: evt.target.name.value,
      host: evt.target.host.value,
      date: evt.target.date.value,
      logoUrl: evt.target.logoUrl.value,
      certificateHeadline: evt.target.certificateHeadline.value,
      signature: evt.target.signature.value,
    }).then((newTournament) =>
      setTournaments((tournaments) => Object.assign([], tournaments, {[activeTournamentIndex]: newTournament}))
    );
  }

  function createEvents(evt) {
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

  function setPlacementCutoff(value) {
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

  function setCertificateCutoff(value) {
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

  function setMedalCutoff(value) {
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

  function handleFileUpload(event, url, onFulfilled) {
    const files = event.target.files;
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("fileName", files[0].name);
    formData.append("mimeType", files[0].type);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(onFulfilled)
      .catch((error) => {
        console.error(error);
      });
  }

  function handleEventResultsUpload(event) {
    handleFileUpload(
      event,
      `/certs/tournaments/${activeTournament}/events/${activeEvent}/results`,
      (data) => {
        const index = tournaments.findIndex((t) => t.id === activeTournament);
        return setTournaments((tournaments) =>
          Object.assign([], tournaments, { [index]: data })
        );
      }
    );
  }

  function handleSweepsUpload(event) {
    handleFileUpload(
      event,
      `/certs/tournaments/${activeTournament}/sweeps`,
      (data) => {
        const index = tournaments.findIndex((t) => t.id === activeTournament);
        return setTournaments((tournaments) =>
          Object.assign([], tournaments, { [index]: data })
        );
      }
    );
  }
  function handleSchoolsUpload(event) {
    handleFileUpload(
      event,
      `/certs/tournaments/${activeTournament}/schools`,
      () => {
        alert("Schools Loaded");
      }
    );
  }
  function handleMediaUpload(event) {
    handleFileUpload(
      event,
      `/s3/upload`,
      () => {
        alert("Media Saved");
      }
    );
  }

  return (
      <div  className={styles.main}>
        <aside>
          <ul className={[styles.tournaments, styles.box].join(" ")}>
            {tournaments.map((t) => (
                <li key={t.id} className={activeTournament === t.id ? styles.selected : null} onClick={() => setActiveTournament(t.id)}>
                  {t.name} {}
                </li>
            ))}
          </ul>
          <section className={styles.box}>
            <h2>Media</h2>
            <FileInput name="mediaUpload" onChange={handleMediaUpload} key={activeTournament} />
          </section>
          <section className={styles.box}>
          <form onSubmit={createTournament} className={styles.standardForm}>
            <FormTextInput name={"name"} label={"Tournament Name"} />
            <FormTextInput label={"Host"} name={"host"} />
            <FormTextInput label="Date" type={"date"} name={"date"} />
            <SubmitButton>Create Tournament</SubmitButton>
          </form>
          </section>
        </aside>
    <main >
      {activeTournament && (
          <>
          <section>
            <h1>{tournaments[activeTournamentIndex].name} </h1>
            <form onSubmit={updateTournament} className={styles.standardForm}>
              <FormTextInput name={"name"} label={"Tournament Name"} defaultValue={tournaments[activeTournamentIndex].name} />
              <FormTextInput label={"Host"} name={"host"}  defaultValue={tournaments[activeTournamentIndex].host} />
              <FormTextInput label="Date" type={"date"} name={"date"} defaultValue={tournaments[activeTournamentIndex].date} />
              <FormTextInput label="Headline"  name={"certificateHeadline"} defaultValue={tournaments[activeTournamentIndex].certificateHeadline} placeholder={"New York Catholic Forensics League"}/>
              <FormTextInput label="Logo" name={"logoUrl"} defaultValue={tournaments[activeTournamentIndex].logoUrl} placeholder={"/nycfl-logo.svg"} />
              {tournaments[activeTournamentIndex].logoUrl && <p style={{textAlign: "center"}}><img src={tournaments[activeTournamentIndex].logoUrl}/></p>}
              <FormTextInput label="Signature" name={"signature"} defaultValue={tournaments[activeTournamentIndex].signature} placeholder={"Tom Beck"} />
              <SubmitButton>Update Tournament</SubmitButton>
            </form>
          </section>
        <section>
          <h2>Schools</h2>
          <FileInput name="schoolsUpload" onChange={handleSchoolsUpload} key={activeTournament} />
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
            {tournaments[activeTournamentIndex].events.map((e) => (
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
          <FileInput name="eventResults" onChange={handleEventResultsUpload} key={activeEventIndex} />
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

function SchoolList({ tournamentId }) {
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
      {medals.map((result) => (
        <tr key={result.school}>
          <td>{result.school}</td>
          <td style={{ textAlign: "center" }}>{result.count}</td>
        </tr>
      ))}
    </table>
  );
}

function Sweepstakes({ tournamentId }) {
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

function IndividualSweeps({ tournamentId }) {
  const [data, setData] = React.useState([]);
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

function CumulativeSweeps() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    getData(`/certs/tournaments/sweeps`).then((resp) => {
      setData(resp);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

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
                {Object.values(data.resultsMap[key]).map((result) => (
                  <tr>
                    <td>{result.tournament}</td>
                    <td>{result.points}</td>
                  </tr>
                ))}
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
}) {
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
          key={results.id}
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
