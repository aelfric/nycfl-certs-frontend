import * as React from "react";
import { FileInput } from "./Inputs";
import { ResultDisplay } from "./ResultDisplay";
import { CompetitionEvent, Tournament } from "./TournamentScreen";
import { deleteData, getData } from "./fetch";
import { useState } from "react";
import styles from "./App.module.css";

type EventDisplayParams = {
  uploadResults: (
    event: React.ChangeEvent<HTMLInputElement>,
    eventId: number,
    roundType: string
  ) => void;
  tournament: Tournament;
  event: CompetitionEvent;
  setCutoff: (
    value: number,
    type: "placement" | "cutoff" | "medal",
    activeEvent: number
  ) => void;
  setEventType: (eventId: number, type: string) => void;
  resetResults: (eventId: number) => void;
};

export function EventDisplay({
  event,
  uploadResults,
  setCutoff,
  setEventType,
  resetResults,
}: EventDisplayParams) {
  const [roundType, setRoundType] = React.useState("FINALIST");

  function handleUpload(formEvt: React.ChangeEvent<HTMLInputElement>) {
    return uploadResults(formEvt, event.id, roundType);
  }

  function onTypeSelect(evt: React.ChangeEvent<HTMLSelectElement>) {
    setEventType(event.id, evt.target.value);
  }

  return (
    <section>
      <h2>Results</h2>
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
      </p>
      <FileInput name="eventResults" onChange={handleUpload} />
      <ResultDisplay
        results={event.results}
        placementCutoff={event.placementCutoff}
        certificateCutoff={event.certificateCutoff}
        medalCutoff={event.medalCutoff}
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
  React.useEffect(() => {
    getData(url).then(setOptions);
  }, [url]);
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
