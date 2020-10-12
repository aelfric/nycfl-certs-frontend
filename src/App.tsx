import * as React from "react";
import "./App.css";
import styles from "./App.module.css";
import { getData, handleFileUpload, postData } from "./fetch";
import { FileInput, FormTextInput, SubmitButton } from "./Inputs";
import { Tournament, TournamentScreen } from "./TournamentScreen";

const cx = require("classnames");

function App() {
  const [tournaments, setTournaments] = React.useState<Tournament[]>([]);
  const [activeTournamentId, setActiveTournament] = React.useState<
    number | undefined
  >(undefined);
  const activeTournamentIndex = activeTournamentId
    ? tournaments.findIndex((t) => t.id === activeTournamentId)
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
    postData(`/certs/tournaments/${activeTournamentId}`, {
      name: evt.target.tournamentName.value,
      host: evt.target.host.value,
      date: evt.target.date.value,
      logoUrl: evt.target.logoUrl.value,
      certificateHeadline: evt.target.certificateHeadline.value,
      signature: evt.target.signature.value,
      signatureTitle: evt.target.signatureTitle.value,
    }).then(replaceActiveTournament);
  }

  function createEvents(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    postData("/certs/events", {
      events: evt.target.events.value,
      tournamentId: activeTournamentId,
    }).then(replaceActiveTournament);
  }

  function setCutoff(
    value: number,
    type: "placement" | "cutoff" | "medal",
    activeEvent: number
  ) {
    postData(
      `/certs/tournaments/${activeTournamentId}/events/${activeEvent}/${type}`,
      { cutoff: value }
    ).then(replaceActiveTournament);
  }

  function handleEventResultsUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    eventId: number | undefined,
    roundType: string = "QUARTER_FINALIST"
  ) {
    if (eventId !== undefined) {
      handleFileUpload(
        event,
        `/certs/tournaments/${activeTournamentId}/events/${eventId}/results\?type=${roundType}`,
        replaceActiveTournament
      );
    }
  }

  function replaceActiveTournament(data: Tournament) {
    return setTournaments((tournaments) =>
      Object.assign([], tournaments, { [activeTournamentIndex]: data })
    );
  }

  function handleSweepsUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(
      event,
      `/certs/tournaments/${activeTournamentId}/sweeps`,
      replaceActiveTournament
    );
  }
  function handleSchoolsUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(
      event,
      `/certs/tournaments/${activeTournamentId}/schools`,
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

  function setEventType(activeEvent: number, eventType: string) {
    postData(
      `/certs/tournaments/${activeTournamentId}/events/${activeEvent}/type\?type=${eventType}`,
      {}
    ).then(replaceActiveTournament);
  }

  return (
    <div className={styles.main}>
      <aside>
        <ul className={cx(styles.tournaments, styles.box)}>
          {tournaments.map((t) => (
            <li
              key={t.id}
              className={cx({
                [styles.selected]: activeTournamentId === t.id,
              })}
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
            key={activeTournamentId}
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
        <footer>
          <p>Medal by Gregor Cresnar from the Noun Project</p>
          <p>Trophy by Ken Messenger from the Noun Project</p>
          <p>Certificate by Iconstock from the Noun Project</p>
        </footer>
      </aside>
      <main>
        {activeTournamentId && (
          <TournamentScreen
            key={activeTournamentId}
            tournament={tournaments[activeTournamentIndex]}
            onSubmit={updateTournament}
            uploadSchools={handleSchoolsUpload}
            createEvents={createEvents}
            uploadResults={handleEventResultsUpload}
            setCutoff={setCutoff}
            uploadSweeps={handleSweepsUpload}
            setEventType={setEventType}
          />
        )}
      </main>
    </div>
  );
}

export interface TournamentIdProps {
  tournamentId: number;
}

export interface MedalCount {
  school: string;
  count: number;
}

export interface School {
  id: number;
  name: string;
}

export interface Result {
  school: School;
  points: number;
  id: number;
  place: number;
  placeString: string;
  name: string;
}

export default App;
