import * as React from "react";
import { FileInput } from "./Inputs";
import { ResultDisplay } from "./ResultDisplay";
import { CompetitionEvent, Tournament } from "./TournamentScreen";

type EventDisplayParams = {
  uploadResults: (
    event: React.ChangeEvent<HTMLInputElement>,
    eventId: number
  ) => void;
  tournament: Tournament;
  event: CompetitionEvent;
  setCutoff: (
    value: number,
    type: "placement" | "cutoff" | "medal",
    activeEvent: number
  ) => void;
};

export function EventDisplay({
  event,
  uploadResults,
  setCutoff,
}: EventDisplayParams) {
  function handleUpload(formEvt: React.ChangeEvent<HTMLInputElement>) {
    return uploadResults(formEvt, event.id);
  }
  return (
    <section>
      <h2>Results</h2>
      <FileInput name="eventResults" onChange={handleUpload} />
      <ResultDisplay
        results={event.results}
        placementCutoff={event.placementCutoff}
        certificateCutoff={event.certificateCutoff}
        medalCutoff={event.medalCutoff}
        setCutoff={setCutoff}
        eventId={event.id}
      />
    </section>
  );
}
