import * as React from "react";
import { useState } from "react";
import { FileInput, FormTextInput } from "./Inputs";
import { ResultDisplay } from "./ResultDisplay";
import { getData } from "./fetch";
import styles from "./App.module.css";
import { useTournament } from "./use-tournament";
import { useAuth } from "react-oidc-context";
import { CompetitionEvent } from "./types";
import { useFetcher, useOutletContext, useParams } from "react-router";
import { useLocation } from "react-router-dom";

export function EventDisplay() {
  const events = useOutletContext<CompetitionEvent[]>();

  const params = useParams<{ eventId: string }>();
  const event = events.find(
    (e: CompetitionEvent) => e.id === Number(params.eventId),
  );

  const fetcher = useFetcher();
  const location = useLocation();
  const [roundType, setRoundType] = React.useState("FINALIST");
  const { uploadResults } = useTournament();

  if (!event) {
    return null;
  }

  function handleUpload(formEvt: React.ChangeEvent<HTMLInputElement>) {
    return uploadResults(formEvt, event?.id, roundType);
  }

  return (
    <section key={event.id}>
      <h2>Results</h2>
      <div>
        <fetcher.Form
          action={location.pathname}
          method="POST"
          className={styles.standardForm}
        >
          <FormTextInput
            name={"newName"}
            label={"Event Name: "}
            defaultValue={event.name}
            key={event.id}
          />
          <button
            type={"submit"}
            name="intent"
            value={"rename"}
            className={styles.button}
            title={"Update Name"}
          >
            Update Name
          </button>
          <button
            type={"submit"}
            name="intent"
            value={"reset"}
            className={styles.button}
            onClick={(evt) => {
              if (!window.confirm("Are you sure you want to reset results")) {
                evt.preventDefault();
              }
            }}
            title={"Reset Results"}
          >
            Reset Results
          </button>
          <button
            name="intent"
            value={"delete"}
            type={"submit"}
            className={[styles.button, styles.danger].join(" ")}
            onClick={(evt) => {
              if (
                !window.confirm("Are you sure you want to delete this event?")
              ) {
                evt.preventDefault();
              }
            }}
            title={"Delete Event"}
          >
            Delete Event
          </button>
        </fetcher.Form>
      </div>
      <fetcher.Form
        className={styles.inlineSubmit}
        action={location.pathname}
        method="POST"
      >
        <EnumSelect
          url={"/enums/event_types"}
          label={"Event Type"}
          defaultValue={event.eventType}
          key={event.id}
          name={"eventType"}
        />
        <button type={"submit"} name={"intent"} value={"update"}>
          Update
        </button>{" "}
      </fetcher.Form>
      <fetcher.Form
        className={styles.inlineSubmit}
        action={location.pathname}
        method="POST"
      >
        <EnumSelect
          url={"/enums/certificate_types"}
          label={"Certificate Type"}
          defaultValue={event.certificateType}
          key={event.id}
          name={"certType"}
        />
        <button type={"submit"} name={"intent"} value={"update"}>
          Update
        </button>{" "}
      </fetcher.Form>
      <fetcher.Form
        className={styles.inlineSubmit}
        action={location.pathname}
        method={"POST"}
      >
        <label htmlFor={"numRounds"}>Number of Rounds:</label>
        <input
          type={"number"}
          name={"numRounds"}
          defaultValue={String(event.numRounds)}
        />
        <button type={"submit"} name={"intent"} value={"update"}>
          Update
        </button>
      </fetcher.Form>
      <div className={styles.inlineSubmit}>
        <EnumSelect
          url={"/enums/elim_types"}
          label={"Round Type"}
          onChange={(evt) => setRoundType(evt.target.value)}
          value={roundType}
          key={event.id}
          name={"roundType"}
        />
      </div>
      <FileInput name="eventResults" onChange={handleUpload} />
      <ResultDisplay
        results={event.results}
        placementCutoff={event.placementCutoff}
        certificateCutoff={event.certificateCutoff}
        medalCutoff={event.medalCutoff}
        halfQuals={event.halfQuals}
        eventId={event.id}
        key={event.id}
      />
    </section>
  );
}

type Option = {
  label: string;
  value: string;
};

type EnumSelectProps = {
  url: string;
  label: string;
};

function EnumSelect({
  url,
  label,
  onChange,
  value,
  defaultValue,
  name,
}: Readonly<EnumSelectProps & React.HTMLProps<HTMLSelectElement>>) {
  const [options, setOptions] = useState<Option[]>([]);
  const auth = useAuth();

  React.useEffect(() => {
    getData(url, auth.user?.access_token).then(setOptions);
  }, [url, auth.user?.access_token]);
  return (
    <>
      <label htmlFor={name}>{label}:</label>
      <select
        name={name}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </>
  );
}
