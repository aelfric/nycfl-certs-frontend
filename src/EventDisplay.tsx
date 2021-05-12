import * as React from "react";
import { useState } from "react";
import { FileInput } from "./Inputs";
import { ResultDisplay } from "./ResultDisplay";
import { CompetitionEvent, ISetCutoff } from "./TournamentScreen";
import { getData } from "./fetch";
import styles from "./App.module.css";
import { useTournament } from "./use-tournament";
import {useKeycloak} from "@react-keycloak/web";

type EventDisplayParams = {
  event: CompetitionEvent;
  setCutoff: ISetCutoff;
  setEventType: (eventId: number, type: string) => void;
  setCertType: (eventId: number, type: string) => void;
  setNumRounds: (eventId: number, num: number) => void;
  setEventName: (eventId: number, newName: string) => void;
  resetResults: (eventId: number) => void;
};

export function EventDisplay({
  event,
  setCutoff,
  setEventType,
  setCertType,
  setNumRounds,
  setEventName,
  resetResults,
}: EventDisplayParams) {
  const [roundType, setRoundType] = React.useState("FINALIST");
  const { uploadResults, deleteEvent } = useTournament();

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

  function onRenameEvent(evt: React.ChangeEvent<HTMLFormElement>) {
    evt.preventDefault();
    setEventName(event.id, evt.target.newName.value);
  }

  return (
    <section key={event.id}>
      <h2>Results</h2>
      <p>
        <form onSubmit={onRenameEvent}>
          <label>
            Event Name:
            <input
              name={"newName"}
              type="text"
              defaultValue={event.name}
              key={event.id}
            />
          </label>
          <button
            type={"submit"}
            className={styles.button}
            title={"Reset Results"}
          >
            Update Name
          </button>
        </form>
      </p>
      <p>
        <EnumSelect
          url={"/enums/event_types"}
          label={"Event Type"}
          onSelect={onTypeSelect}
          value={event.eventType}
          key={event.id}
        />
      </p>
      <p>
        <EnumSelect
          url={"/enums/certificate_types"}
          label={"Certificate Type"}
          onSelect={onCertTypeSelect}
          value={event.certificateType}
          key={event.id}
        />
      </p>
      <p>
        <label>
          Number of Rounds:
          <input
            type={"number"}
            value={String(event.numRounds)}
            onChange={onSetNumRounds}
          />
        </label>
      </p>
      <p>
        <EnumSelect
          url={"/enums/elim_types"}
          label={"Round Type"}
          onSelect={(evt) => setRoundType(evt.target.value)}
          value={roundType}
          key={event.id}
        />
      </p>
      <p>
        <button
          type={"button"}
          className={styles.button}
          onClick={() => resetResults(event.id)}
          title={"Reset Results"}
        >
          Reset Results
        </button>
        <button
          type={"button"}
          className={[styles.button, styles.danger].join(" ")}
          onClick={() => deleteEvent(event.id)}
          title={"Delete Event"}
        >
          Delete Event
        </button>
      </p>
      <FileInput name="eventResults" onChange={handleUpload} />
      <ResultDisplay
        results={event.results}
        placementCutoff={event.placementCutoff}
        certificateCutoff={event.certificateCutoff}
        medalCutoff={event.medalCutoff}
        halfQuals={event.halfQuals}
        setCutoff={setCutoff}
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

function EnumSelect({
  url,
  label,
  onSelect,
  value,
}: {
  url: string;
  label: string;
  onSelect: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string | undefined;
}) {
  const [options, setOptions] = useState<Option[]>([]);
  const {keycloak} = useKeycloak();

  React.useEffect(() => {
    getData(url,keycloak.token).then(setOptions);
  }, [url, keycloak.token]);
  return (
    <label>
      {label}:{" "}
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
