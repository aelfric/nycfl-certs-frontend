import { FormTextInput } from "../../Inputs";
import { ResultDisplay } from "../../ResultDisplay";
import styles from "../../App.module.css";
import { CompetitionEvent } from "../tournament/types";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "react-router";
import { useLocation } from "react-router-dom";

export type Enums = {
  eventTypes?: Option[];
  certTypes?: Option[];
  elimTypes?: Option[];
};

export function EventDisplay() {
  const events = useOutletContext<CompetitionEvent[]>();
  const enums: Enums = useLoaderData();
  const params = useParams<{ eventId: string }>();
  const event = events.find(
    (e: CompetitionEvent) => e.id === Number(params.eventId),
  );

  const fetcher = useFetcher();
  const location = useLocation();

  if (!event) {
    return null;
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
        <label htmlFor={"eventType"}>Event Type:</label>
        <select name={"eventType"} defaultValue={event.eventType}>
          {enums.eventTypes?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type={"submit"} name={"intent"} value={"update"}>
          Update
        </button>
      </fetcher.Form>
      <fetcher.Form
        className={styles.inlineSubmit}
        action={location.pathname}
        method="POST"
      >
        <label htmlFor={"certType"}>Certificate Type:</label>
        <select name={"certType"} defaultValue={event.certificateType}>
          {enums.certTypes?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type={"submit"} name={"intent"} value={"update"}>
          Update
        </button>
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
      <fetcher.Form
        action={location.pathname + "/results"}
        method={"POST"}
        encType={"multipart/form-data"}
      >
        <div className={styles.standardForm}>
          <label htmlFor={"eventResults"}>
            <span>Event Results:</span>
            <input
              type="file"
              id={"eventResults"}
              name={"file"}
              disabled={false}
              className={styles.fileInput}
            />
          </label>
        </div>
        <div className={styles.inlineSubmit}>
          <label htmlFor={"roundType"}>Round Type:</label>
          <select name={"roundType"} defaultValue={"FINALIST"}>
            {enums.elimTypes?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button type={"submit"}>Save</button>
        </div>
      </fetcher.Form>
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

export type Option = {
  label: string;
  value: string;
};
