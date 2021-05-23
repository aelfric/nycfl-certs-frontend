import React, {ChangeEvent} from 'react';
import {getData, postData} from "./fetch";
import {useKeycloak} from "@react-keycloak/web";
import styles from "./App.module.css";

interface DraftStream {
    title: string;
    startTime: string;
    endTime: string;
}

interface CreatedStream {
    title: string;
    startTime: string;
    endTime: string
    streamKey: string;
    status: string;
    streamStatus: string;
    monitorHtml: string;
    broadcastId: string;
}

export function StreamingDashboard() {
    const [rows, setRows] = React.useState<DraftStream[]>([]);
    const [streams, setStreams] = React.useState<CreatedStream[]>([]);
    const {keycloak} = useKeycloak();
    const [selected, setSelected] = React.useState<number>(-1);

    React.useEffect(() => {
        getData("/youtube").then(setStreams);
    }, []);

    function addRow() {
        setRows([...rows, {
            title: "",
            startTime: "",
            endTime: ""
        }]);
    }

    function startTesting(){
        postData(`/youtube/${currentStream.broadcastId}/test` , keycloak.token)
            .then(setStreams)
            .catch(() => alert("An error"));
    }

    function goLive(){
        postData(`/youtube/${currentStream.broadcastId}/golive` , keycloak.token)
            .then(setStreams)
            .catch(() => alert("An error"));
    }

    function completeStream(){
        postData(`/youtube/${currentStream.broadcastId}/complete` , keycloak.token)
            .then(setStreams)
            .catch(() => alert("An error"));

    }

    function submit() {
        const submission = rows.map(row => ({
            title: row.title,
            startTime: new Date(row.startTime).toISOString(),
            endTime: new Date(row.endTime).toISOString()
        }));
        postData('/youtube', keycloak.token, submission)
            .then(setStreams)
            .catch(() => alert("An error"));
    }

    function updateRow(evt: ChangeEvent<HTMLInputElement>) {
        const updatedRows = rows.map((row, index) => {
            if (index === Number(evt.target.getAttribute("data-index"))) {
                return {
                    ...row,
                    [evt.target.name]: evt.target.value
                };
            } else {
                return row;
            }
        });
        setRows(updatedRows);
    }

    const currentStream = streams[selected];
    return <div className={styles.main}>
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
            {streams.map( (stream,index) => {
                return <tr key={stream.title} className={selected === index ? [styles.selectableRow, styles.selected].join(" ") : ""} onClick={()=>setSelected(index)}>
                    <td>{stream.title}</td>
                    <td>{new Date(stream.startTime).toLocaleString()}</td>
                    <td>{new Date(stream.endTime).toLocaleString()}</td>
                    <td>{stream.status}</td>
                    <td>{stream.streamStatus}</td>
                </tr>;
            })}
            </tbody>
        </table>
            <div>
                {selected >= 0 &&
                <div>
                    <p>{currentStream.title}</p>
                    <p>{new Date(currentStream.startTime).toLocaleString()}</p>
                    <p>{new Date(currentStream.endTime).toLocaleString()}</p>
                    <p>{currentStream.streamKey}</p>
                    <p>{currentStream.status}</p>
                    <p>{currentStream.streamStatus}</p>
                    <p>
                        <button type={"button"} onClick={startTesting}>Start Testing</button>
                        <button type={"button"} onClick={goLive}>Go Live</button>
                        <button type={"button"} onClick={completeStream}>End Stream</button>
                    </p>
                    <div dangerouslySetInnerHTML={{__html: currentStream.monitorHtml}} />
                </div>
                }
            </div>
        <form>
        <div>
            <button type={"button"} onClick={addRow}>Add Row</button>
        </div>
        <table>
            <tbody>
            {rows.map((row, index) =>
                <tr key={index}>
                    <td><input name="title" type={"text"} value={rows[index].title} data-index={index}
                               onChange={updateRow}/></td>
                    <td><input name="startTime" type={"datetime-local"} value={rows[index].startTime} data-index={index}
                               onChange={updateRow}/></td>
                    <td><input name="endTime" type={"datetime-local"} value={rows[index].endTime} data-index={index}
                               onChange={updateRow}/></td>
                </tr>)}
            </tbody>
        </table>
        <div>
            <button type={"button"} onClick={submit}>Save</button>
        </div>
    </form>
        </main>
    </div>;
}