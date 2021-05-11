import * as React from "react";
import "./App.css";
import styles from "./App.module.css";
import { getData, handleFileUpload, postData } from "./fetch";
import { FileInput, FormTextInput, SubmitButton } from "./Inputs";
import { Tournament, TournamentScreen } from "./TournamentScreen";
import { Expandable } from "./Expandable";
import { FileListing } from "./FileListing";
import { TournamentProvider } from "./TournamentContextProvider";
import { useKeycloak } from "@react-keycloak/web";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

const cx = require("classnames");

interface ParamTypes {
    id: string
}
function Interface() {
    let { id } = useParams<ParamTypes>();
    const activeTournamentId = Number(id);

  const [tournaments, setTournaments] = React.useState<Tournament[]>([]);
  const {keycloak} = useKeycloak();

  React.useEffect(() => {
    getData("/certs/tournaments", keycloak.token).then(setTournaments);
  }, [keycloak.token]);

  function createTournament(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    postData("/certs/tournaments", keycloak.token,{
      name: evt.target.tournamentName.value,
      host: evt.target.host.value,
      date: evt.target.date.value,
    }).then((newTournament) =>
        setTournaments((tournaments) => [...tournaments, newTournament])
    );
  }
  function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(event, `/s3/upload`, keycloak.token, () => {
      alert("Media Saved");
    });
  }

  return <div className={styles.main}>
    <aside>
      <ul className={cx(styles.tournaments, styles.box)}>
        {tournaments.map((t) => (
            <li
                key={t.id}
                className={cx({
                  [styles.selected]: activeTournamentId === t.id,
                })}
            >
                <Link to={String(t.id)}>{t.name}</Link>
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
      {isNaN(activeTournamentId) ?
          <h1>Please select a tournament</h1> :
          (
              <TournamentProvider key={activeTournamentId} id={activeTournamentId}>
                <TournamentScreen/>
              </TournamentProvider>
          )}
    </main>
  </div>;
}

function App() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }
  if( !keycloak.authenticated ){
    keycloak.login();
  }
    return <Router>
        <Switch>
            <Route path="/:id">
                <Interface/>
            </Route>
            <Route>
                <Interface/>
            </Route>
        </Switch>
    </Router>;
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
