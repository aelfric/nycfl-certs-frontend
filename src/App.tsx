import * as React from "react";
import "./App.css";
import styles from "./App.module.css";
import { getData, handleFileUpload, postData } from "./fetch";
import { FileInput, FormTextInput, SubmitButton } from "./Inputs";
import { Tournament, TournamentScreen } from "./TournamentScreen";
import { Expandable } from "./Expandable";
import { FileListing } from "./FileListing";
import { TournamentProvider } from "./TournamentContextProvider";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router";
import { Certificates, Postings, Slides } from "./certificates";
import { StreamingDashboard } from "./StreamingDashboard";
import { Mailing } from "./Mailing";

import cx from "classnames";
import { useAuth } from "react-oidc-context";

function Interface() {
  const { id } = useParams<"id">();
  const activeTournamentId = Number(id);

  const [tournaments, setTournaments] = React.useState<Tournament[]>([]);
  const auth = useAuth();
  const token = auth.user?.access_token;
  React.useEffect(() => {
    getData("/certs/tournaments", token).then(setTournaments);
  }, [token]);

  function createTournament(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    postData("/certs/tournaments", token, {
      name: evt.target.tournamentName.value,
      host: evt.target.host.value,
      date: evt.target.date.value,
    }).then((newTournament) =>
      setTournaments((tournaments) => [...tournaments, newTournament]),
    );
  }

  function copyTournament(evt: React.MouseEvent<HTMLButtonElement>) {
    evt.preventDefault();
    if (activeTournamentId) {
      postData(
        `/certs/tournaments?sourceId=${activeTournamentId}`,
        token,
        {},
      ).then((newTournament) =>
        setTournaments((tournaments) => [...tournaments, newTournament]),
      );
    }
  }

  function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(event, `/s3/upload`, token, () => {
      alert("Media Saved");
    });
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
            >
              <Link to={"/tournaments/" + String(t.id)}>{t.name}</Link>
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
          <Expandable heading={<h3>Uploaded Files</h3>}>
            <FileListing />
          </Expandable>
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
          <p>Delete by Gregor Cresnar from the Noun Project</p>
          <p>Trophy by Ken Messenger from the Noun Project</p>
          <p>Certificate by Iconstock from the Noun Project</p>
          <p>Speaking by Ayub Irawan from the Noun Project</p>
          <p>Debate by Mello from the Noun Project</p>
        </footer>
      </aside>
      <main>
        {isNaN(activeTournamentId) ? (
          <h1>Please select a tournament</h1>
        ) : (
          <TournamentProvider key={activeTournamentId} id={activeTournamentId}>
            <TournamentScreen copyTournament={copyTournament} />
          </TournamentProvider>
        )}
      </main>
    </div>
  );
}

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signinRedirect":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }
  if (!auth.isAuthenticated) {
    return (
      <button
        onClick={() =>
          void auth.signinRedirect({ redirect_uri: window.location.toString() })
        }
      >
        Log in
      </button>
    );
  } else {
    window.history.replaceState({}, document.title, window.location.pathname);
    return (
      <>
        <button onClick={() => void auth.removeUser()}>Log out</button>{" "}
        {auth.user?.profile.name}
        <Router>
          <Routes>
            <Route path="/tournaments/:id" element={<Interface />} />
            <Route
              path="/preview_certificates/:id"
              element={<Certificates />}
            />
            <Route path="/preview_slides/:id" element={<Slides />} />
            <Route path="/postings/:id" element={<Postings />} />
            <Route path="/mailing/:id" element={<Mailing />} />
            <Route path={"/stream"} element={<StreamingDashboard />} />
            <Route path="/" element={<Interface />} />
          </Routes>
        </Router>
      </>
    );
  }
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
  emails: SchoolEmail[];
}

export interface SchoolEmail {
  email: string;
  isPrimary: boolean;
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
