import * as React from "react";
import { useState } from "react";
import { FileInput, FormTextInput } from "./Inputs";
import { ResultDisplay } from "./ResultDisplay";
import { getData } from "./fetch";
import styles from "./App.module.css";
import { useTournament } from "./use-tournament";
import { useAuth } from "react-oidc-context";
import { CompetitionEvent } from "./types";
import { useFetcher } from "react-router";
import { useLocation } from "react-router-dom";

type EventDisplayParams = {
  event: CompetitionEvent;
  setEventType: (eventId: number, type: string) => void;
  setCertType: (eventId: number, type: string) => void;
  setNumRounds: (eventId: number, num: number) => void;
};

export function EventDisplay({
  event,
  setEventType,
  setCertType,
  setNumRounds,
}: Readonly<EventDisplayParams>) {
  const fetcher = useFetcher();
  const location = useLocation();
  const [roundType, setRoundType] = React.useState("FINALIST");
  const { uploadResults } = useTournament();

  function handleUpload(formEvt: React.ChangeEvent<HTMLInputElement>) {
    return uploadResults(formEvt, event.id, roundType);
  }

  function onTypeSelect(evt: React.ChangeEvent<HTMLSelectElement>) {
    setEventType(event.id, evt.target.value);
  }

  function onCertTypeSelect(evt: React.ChangeEvent<HTMLSelectElement>) {
    setCertType(event.id, evt.target.value);
  }

  function onSetNumRounds(evt: React.ChangeEvent<HTMLInputElement>) {
    setNumRounds(event.id, Number(evt.target.value));
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
      <div className={styles.standardForm}>
        <EnumSelect
          url={"/enums/event_types"}
          label={"Event Type"}
          onSelect={onTypeSelect}
          value={event.eventType}
          key={event.id}
        />
      </div>
      <div className={styles.standardForm}>
        <EnumSelect
          url={"/enums/certificate_types"}
          label={"Certificate Type"}
          onSelect={onCertTypeSelect}
          value={event.certificateType}
          key={event.id}
        />
      </div>
      <div className={styles.standardForm}>
        <label>
          <span>Number of Rounds:</span>
          <input
            type={"number"}
            value={String(event.numRounds)}
            onChange={onSetNumRounds}
          />
        </label>
      </div>
      <div className={styles.standardForm}>
        <EnumSelect
          url={"/enums/elim_types"}
          label={"Round Type"}
          onSelect={(evt) => setRoundType(evt.target.value)}
          value={roundType}
          key={event.id}
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
  onSelect: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string | undefined;
};

function EnumSelect({
  url,
  label,
  onSelect,
  value,
}: Readonly<EnumSelectProps>) {
  const [options, setOptions] = useState<Option[]>([]);
  const auth = useAuth();

  React.useEffect(() => {
    getData(url, auth.user?.access_token).then(setOptions);
  }, [url, auth.user?.access_token]);
  return (
    <label>
      <span>{label}:</span>
      <select onChange={onSelect} value={value}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
