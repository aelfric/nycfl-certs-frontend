import { Form, Outlet, useLoaderData, useParams } from "react-router";
import * as React from "react";
import { Suspense } from "react";
import { useAuth } from "react-oidc-context";
import { handleFileUpload } from "./fetch";
import styles from "./App.module.css";
import cx from "classnames";
import { FileInput, FormTextInput, SubmitButton } from "./Inputs";
import { FileListing } from "./FileListing";
import { NavLink } from "react-router-dom";
import { Tournament } from "./types";

export function Interface() {
  const { id } = useParams<"id">();
  const activeTournamentId = Number(id);
  const tournaments = useLoaderData<Tournament[]>();

  const auth = useAuth();
  const token = auth.user?.access_token;

  function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(event, `/s3/upload`, token, () => {
      alert("Media Saved");
    });
  }

  return (
    <div className={styles.main}>
      <aside>
        <button onClick={() => void auth.removeUser()}>Log out</button>{" "}
        {auth.user?.profile.name}
        <ul className={cx(styles.tournaments, styles.box)}>
          {tournaments.map((t) => (
            <li key={t.id}>
              <NavLink
                to={`/tournaments/${t.id}`}
                className={({ isActive }) => (isActive ? styles.selected : "")}
              >
                {t.name}
              </NavLink>
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
          <h3>Uploaded Files</h3>
          <details>
            <FileListing />
          </details>
        </section>
        <section className={styles.box}>
          <Form action={"/"} method="post" className={styles.standardForm}>
            <FormTextInput name={"tournamentName"} label={"Tournament Name"} />
            <FormTextInput label={"Host"} name={"host"} />
            <FormTextInput label="Date" type={"date"} name={"date"} />
            <SubmitButton>Create Tournament</SubmitButton>
          </Form>
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
        <Suspense fallback={<p>Loading...</p>}>
          <Outlet />
        </Suspense>
        {/*<ScrollRestoration />*/}
      </main>
    </div>
  );
}

export function NoTournamentSelected() {
  return <h1>Please select a tournament</h1>;
}
