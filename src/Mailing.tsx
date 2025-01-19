import styles from "./App.module.css";
import React from "react";
import { getData, handleFileUpload, postData } from "./fetch";
import { useAuth } from "react-oidc-context";
import { StripedTable } from "./StripedTable";
import { FileInput } from "./Inputs";
import { School, SchoolEmail } from "./App";

type MedalCount = {
  schoolId: string;
  school: string;
  count: string;
};

function Summary() {
  const auth = useAuth();
  const [medalCount, setMedalCount] = React.useState<MedalCount[]>([]);
  React.useEffect(() => {
    getData("/certs/tournaments/13/medals", auth.user?.access_token).then(
      setMedalCount,
    );
  }, [auth.user?.access_token]);

  function handleUpload(formEvt: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(
      formEvt,
      `/certs/tournaments/13/contacts`,
      auth.user?.access_token,
      alert,
    );
  }

  return (
    <>
      <StripedTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>School</th>
            <th>Num. Phy. Awards</th>
          </tr>
        </thead>
        <tbody>
          {medalCount.map((row) => (
            <tr key={row.schoolId}>
              <td>{row.schoolId}</td>
              <td>{row.school}</td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </StripedTable>
      <FileInput name="uploadContacts" onChange={handleUpload} />
    </>
  );
}

interface AwardsResult {
  id: number;
  studentName: string;
  schoolName: string;
  schoolId: number;
  eventName: string;
  award: string;
}

function Detail() {
  const auth = useAuth();
  const [results, setResults] = React.useState<AwardsResult[]>([]);
  const [schools, setSchools] = React.useState<School[]>([]);
  React.useEffect(() => {
    getData("/certs/tournaments/13/awards_sheet", auth.user?.access_token).then(
      setResults,
    );
    getData("/certs/tournaments/13/schools", auth.user?.access_token).then(
      setSchools,
    );
  }, [auth.user?.access_token]);

  const contactMap: Record<number, SchoolEmail[]> = {};
  for (const school of schools) {
    contactMap[school.id] = school.emails;
  }

  function doDraft() {
    postData(`/certs/tournaments/13/awards_sheet`, auth.user?.access_token)
      .then(alert)
      .catch(alert);
  }

  if (schools.length === 0 || results.length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <StripedTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>School</th>
            <th>Event</th>
            <th>Placement</th>
            <th>Contact(s)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => {
            const contacts = contactMap[row.schoolId] || [];
            return (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.studentName}</td>
                <td>{row.schoolName}</td>
                <td>{row.eventName}</td>
                <td>{row.award}</td>
                <td>
                  {contacts.map((email) => {
                    if (email.isPrimary) {
                      return (
                        <p key={email.email}>
                          <b>{email.email}</b>
                        </p>
                      );
                    } else {
                      return <p key={email.email}>{email.email}</p>;
                    }
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </StripedTable>
      <button type="button" className={styles.button} onClick={doDraft}>
        Draft Emails
      </button>
    </>
  );
}

export function Mailing() {
  return (
    <div className={styles.main}>
      <main>
        <h1>Mailing Control</h1>
        <h2>Summary</h2>
        <Summary />
        <h2>Detail</h2>
        <Detail />
      </main>
    </div>
  );
}
