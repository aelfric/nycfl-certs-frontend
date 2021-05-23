import React, { ChangeEvent } from "react";
import { getData, postData } from "./fetch";
import { useKeycloak } from "@react-keycloak/web";
import styles from "./App.module.css";

interface DraftStream {
  title: string;
  startTime: string;
  endTime: string;
}

interface CreatedStream {
  title: string;
  startTime: string;
  endTime: string;
  streamKey: string;
  status: string;
  streamStatus: string;
  monitorHtml: string;
  broadcastId: string;
  ingestionAddress: string;
  privacyStatus: string;
}

function BroadcastStatusBadge(props: { status: string }) {
  const broadcastStatusColors: Record<string, object> = {
    ready: {
      backgroundColor: "yellow",
      color: "rgba(0,0,0,0.8)",
    },
    testing: {
      backgroundColor: "orange",
      color: "rgba(0,0,0,0.8)",
    },
    live: {
      backgroundColor: "green",
      color: "rgba(0,0,0,0.8)",
    },
    complete: {
      backgroundColor: "grey",
      color: "rgba(255,255,255,0.7)",
    },
  };

  return (
    <span className={styles.badge} style={broadcastStatusColors[props.status]}>
      {props.status}
    </span>
  );
}
function StreamStatusBadge(props: { status: string }) {
  const streamStatusColors: Record<string, object> = {
    ready: {
      backgroundColor: "yellow",
      color: "rgba(0,0,0,0.8)",
    },
    active: {
      backgroundColor: "green",
      color: "rgba(0,0,0,0.8)",
    },
    inactive: {
      backgroundColor: "grey",
      color: "rgba(255,255,255,0.8)",
    },
  };

  return (
    <span className={styles.badge} style={streamStatusColors[props.status]}>
      {props.status}
    </span>
  );
}

export function StreamingDashboard() {
  const [rows, setRows] = React.useState<DraftStream[]>([]);
  const [streams, setStreams] = React.useState<CreatedStream[]>([]);
  const { keycloak } = useKeycloak();
  const [selected, setSelected] = React.useState<string>("");
  const currentStream = streams.find(s => s.broadcastId === selected);

  React.useEffect(() => {
    getData("/youtube").then(setStreams);
  }, []);

  function addRow() {
    setRows([
      ...rows,
      {
        title: "",
        startTime: "",
        endTime: "",
      },
    ]);
  }

  function startTesting() {
    if(currentStream) {
      postData(`/youtube/${currentStream.broadcastId}/test`, keycloak.token)
          .then(setStreams)
          .catch(() => alert("An error"));
    }
  }

  function goLive() {
    if(currentStream) {
      postData(`/youtube/${currentStream.broadcastId}/golive`, keycloak.token)
          .then(setStreams)
          .catch(() => alert("An error"));
    }
  }

  function completeStream() {
    if(currentStream) {
      postData(`/youtube/${currentStream.broadcastId}/complete`, keycloak.token)
          .then(setStreams)
          .catch(() => alert("An error"));
    }
  }

  function submit() {
    const submission = rows.map((row) => ({
      title: row.title,
      startTime: new Date(row.startTime).toISOString(),
      endTime: new Date(row.endTime).toISOString(),
    }));
    postData("/youtube", keycloak.token, submission)
      .then(setStreams)
      .catch(() => alert("An error"));
  }

  function updateRow(evt: ChangeEvent<HTMLInputElement>) {
    const updatedRows = rows.map((row, index) => {
      if (index === Number(evt.target.getAttribute("data-index"))) {
        return {
          ...row,
          [evt.target.name]: evt.target.value,
        };
      } else {
        return row;
      }
    });
    setRows(updatedRows);
  }

  return (
    <div className={styles.main}>
      <main>
        <h1>Streaming Dashboard</h1>
        <table className={styles.stripedTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Scheduled Start</th>
              <th>Scheduled End</th>
              <th>Status</th>
              <th>Stream Status</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => {
              return (
                <tr
                  key={stream.broadcastId}
                  className={
                    selected === stream.broadcastId
                      ? [styles.selectableRow, styles.selected].join(" ")
                      : ""
                  }
                  onClick={() => setSelected(stream.broadcastId)}
                >
                  <td>{stream.title}</td>
                  <td>{new Date(stream.startTime).toLocaleString()}</td>
                  <td>{new Date(stream.endTime).toLocaleString()}</td>
                  <td>
                    <BroadcastStatusBadge status={stream.status} />
                  </td>
                  <td>
                    <StreamStatusBadge status={stream.streamStatus} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
          {currentStream && (
            <div>
              <h2>{currentStream.title}</h2>
              <table className={styles.stripedTable}>
                <tbody>
                  <tr>
                    <th>Start</th>
                    <td>
                      {" "}
                      {new Date(currentStream.startTime).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <th>End</th>
                    <td> {new Date(currentStream.endTime).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Stream Key</th>
                    <td>
                      <span className={styles.spoiler}>
                        {currentStream.streamKey}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>URL</th>
                    <td>
                      <a
                        href={`https://www.youtube.com/watch?v=${currentStream.broadcastId}`}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        https://www.youtube.com/watch?v=
                        {currentStream.broadcastId}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>Ingestion Address</th>
                    <td>{currentStream.ingestionAddress}</td>
                  </tr>
                  <tr>
                    <th>Privacy</th>
                    <td>{currentStream.privacyStatus}</td>
                  </tr>
                  <tr>
                    <th>Broadcast Status</th>
                    <td>
                      <BroadcastStatusBadge status={currentStream.status} />
                    </td>
                  </tr>
                  <tr>
                    <th>Stream Status</th>
                    <td>
                      <StreamStatusBadge status={currentStream.streamStatus} />
                    </td>
                  </tr>
                  <tr>
                    <th>Monitor</th>
                    <td>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentStream.monitorHtml,
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>&nbsp;</th>
                    <td>
                      <div>
                        <button
                          type={"button"}
                          className={styles.button}
                          onClick={startTesting}
                        >
                          Start Testing
                        </button>
                        <button
                          type={"button"}
                          className={styles.button}
                          onClick={goLive}
                        >
                          Go Live
                        </button>
                        <button
                          type={"button"}
                          className={styles.button}
                          onClick={completeStream}
                        >
                          End Stream
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <form>
          <div>
            <button type={"button"} onClick={addRow}>
              Add Row
            </button>
          </div>
          <table>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      name="title"
                      type={"text"}
                      value={rows[index].title}
                      data-index={index}
                      onChange={updateRow}
                    />
                  </td>
                  <td>
                    <input
                      name="startTime"
                      type={"datetime-local"}
                      value={rows[index].startTime}
                      data-index={index}
                      onChange={updateRow}
                    />
                  </td>
                  <td>
                    <input
                      name="endTime"
                      type={"datetime-local"}
                      value={rows[index].endTime}
                      data-index={index}
                      onChange={updateRow}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button type={"button"} onClick={submit}>
              Save
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
