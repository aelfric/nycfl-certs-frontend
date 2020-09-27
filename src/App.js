import React from 'react';
import './App.css';
import styles from './App.module.css';
import {Certificate, Medal, Trophy} from "./icons";

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', //POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function App() {
    const [tournaments, setTournaments] = React.useState([]);
    const [activeTournament, setActiveTournament] = React.useState(undefined);
    const [activeEvent, setActiveEvent] = React.useState(undefined);

    const activeTournamentIndex = activeTournament ? tournaments.findIndex(t => t.id === activeTournament) : undefined;
    const activeEventIndex = activeEvent ? tournaments[activeTournamentIndex].events.findIndex(e => e.id === activeEvent) : undefined;

    React.useEffect(() => {
        getData("/certs/tournaments")
            .then(setTournaments);
    }, [])

    function createTournament(evt) {
        evt.preventDefault();
        postData("/certs/tournaments",
            {
                name: evt.target.name.value,
                host: evt.target.host.value,
                date: evt.target.date.value
            })
            .then((newTournament) => setTournaments(tournaments => [...tournaments, newTournament]));
    }

    function createEvents(evt) {
        evt.preventDefault();
        postData("/certs/events", {events: evt.target.events.value, tournamentId: activeTournament})
            .then((newTournament) => setTournaments(tournaments => {
                const index = tournaments.findIndex(t => t.id === activeTournament);
                return Object.assign([], tournaments, {[index]: newTournament});
            }));
    }

    function setPlacementCutoff(value) {
        postData(`/certs/tournaments/${activeTournament}/events/${activeEvent}/placement`, {cutoff: value})
            .then((newTournament) => setTournaments(tournaments => {
                const index = tournaments.findIndex(t => t.id === activeTournament);
                return Object.assign([], tournaments, {[index]: newTournament});
            }));
    }

    function setCertificateCutoff(value) {
        postData(`/certs/tournaments/${activeTournament}/events/${activeEvent}/cutoff`, {cutoff: value})
            .then((newTournament) => setTournaments(tournaments => {
                const index = tournaments.findIndex(t => t.id === activeTournament);
                return Object.assign([], tournaments, {[index]: newTournament});
            }));
    }

    function setMedalCutoff(value) {
        postData(`/certs/tournaments/${activeTournament}/events/${activeEvent}/medal`, {cutoff: value})
            .then((newTournament) => setTournaments(tournaments => {
                const index = tournaments.findIndex(t => t.id === activeTournament);
                return Object.assign([], tournaments, {[index]: newTournament});
            }));
    }

    function handleCsvUpload(event, url) {
        const files = event.target.files
        const formData = new FormData()
        formData.append('file', files[0])
        formData.append('fileName', "resultsCSV")

        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const index = tournaments.findIndex(t => t.id === activeTournament);
                return setTournaments(tournaments => Object.assign([], tournaments, {[index]: data}));
            })
            .catch(error => {
                console.error(error)
            })
    }

    function handleEventResultsUpload(event) {
        handleCsvUpload(event, `/certs/results?tournamentId=${activeTournament}&eventId=${activeEvent}`);
    }

    function handleSweepsUpload(event) {
        handleCsvUpload(event, `/certs/tournaments/${activeTournament}/sweeps`);
    }

    return (
        <div className={styles.main}>
            <h1>NYCFL Certificates</h1>
            <h2>Instructions</h2>
            <ol>
                <li>Create a Tournament</li>
                <li>Upload Events</li>
                <li>Upload Results</li>
                <li>Set Thresholds</li>
                <li>Download Certificates</li>
            </ol>
            <h2>Tournaments</h2>
            <form onSubmit={createTournament}>
                <label>Tournament Name: <input type={"text"} name={"name"}/></label>
                <label>Host: <input type={"text"} name={"host"}/></label>
                <label>Date: <input type={"date"} name={"date"}/></label>
                <button className={styles.button} type={"submit"}>Create Tournament</button>
            </form>
            <ul>
                {tournaments.map(t =>
                    <li key={t.id}
                        onClick={() => setActiveTournament(t.id)}>{t.name} {activeTournament === t.id ? "*" : ""}</li>
                )}
            </ul>
            {activeTournament && <section>
                <h2>Events</h2>
                <form onSubmit={createEvents}>
                    <textarea name={"events"}/>
                    <button className={styles.button} type={"submit"}>Save Events</button>
                </form>
                <table className={styles.stripedTable}>
                    <thead>
                    <tr>
                        <th>Event</th>
                        <th>Results Loaded</th>
                        <th>Placement Set</th>
                        <th>Medals Set</th>
                        <th>Cutoff Set</th>
                    </tr>
                    </thead>
                    {tournaments[activeTournamentIndex].events.map(e => <tr onClick={() => setActiveEvent(e.id)}
                                                                            key={e.id} className={`${styles.selectableRow} ${activeEvent === e.id ? styles.selected : ""}`}>
                        <td>{e.name}</td>
                        <td>{e.results.length > 0 ? "Yes" : ""}</td>
                        <td>{e.placementCutoff > 0 ? "Yes" : ""}</td>
                        <td>{e.medalCutoff > 0 ? "Yes" : ""}</td>
                        <td>{e.certificateCutoff > 0 ? "Yes" : ""}</td>
                    </tr>)}
                </table>
            </section>}
            {activeTournament && activeEvent && <section>
                <h2>Results</h2>
                <input type="file" id="fileUpload" onChange={handleEventResultsUpload} disabled={false}/>
                <ResultDisplay
                    results={tournaments[activeTournamentIndex].events[activeEventIndex].results}
                    setPlacementCutoff={setPlacementCutoff}
                    placementCutoff={tournaments[activeTournamentIndex].events[activeEventIndex].placementCutoff}
                    setCertificateCutoff={setCertificateCutoff}
                    certificateCutoff={tournaments[activeTournamentIndex].events[activeEventIndex].certificateCutoff}
                    setMedalCutoff={setMedalCutoff}
                    medalCutoff={tournaments[activeTournamentIndex].events[activeEventIndex].medalCutoff}
                />
            </section>
            }
            {activeTournament && <section>
                <h2>Sweepstakes</h2>
                <input type="file" id="fileUpload" onChange={handleSweepsUpload} disabled={false}/>
            </section>}
            {activeTournament && <div style={{margin: "50px"}}><a className={styles.button} href={`http://localhost:8080/certs/tournaments/${activeTournament}/certificates`}>Generate Certificates</a></div>}
            <section>
                <h2>Medals</h2>
                <SchoolList tournamentId={activeTournament}/>
            </section>
            <footer>
                <p>Medal by Gregor Cresnar from the Noun Project</p>
                <p>Trophy by Ken Messenger from the Noun Project</p>
                <p>Certificate by Iconstock from the Noun Project</p>
            </footer>
        </div>
    );
}

function SchoolList({tournamentId}) {
    const [medals, setMedals] = React.useState([]);
    React.useEffect(() => {
        if (tournamentId) {
            getData(`/certs/tournaments/${tournamentId}/medals`)
                .then(setMedals);
        }
    }, [tournamentId])

    if(!tournamentId) return null;

    return <table className={styles.stripedTable}>
        <thead>
        <tr>
            <th>School</th>
            <th>Medal Count</th>
            <th>Sweeps</th>
        </tr>
        </thead>
        {medals.map(result => <tr key={result.school}>
        <td>{result.school}</td>
        <td style={{textAlign: "center"}}>{result.count}</td>
        <td style={{textAlign: "center"}}>{result.sweeps}</td>
    </tr>)}</table>
}

function ResultDisplay({results, setCertificateCutoff, setPlacementCutoff, setMedalCutoff, placementCutoff, certificateCutoff, medalCutoff}) {
    return <table className={styles.stripedTable}>
        <thead>
        <tr>
            <th>Place (#)</th>
            <th colSpan={2}>Certificate</th>
            <th>Name</th>
            <th>School</th>
            <th colSpan={3}>&nbsp;</th>
        </tr>
        </thead>
        {results.map(result => <tr key={results.id} className={
            result.place < placementCutoff ?
                styles.placing :
                result.place < certificateCutoff ?
                    styles.finalist :
                    styles.noCert }>
        <td>{result.place}</td>
            <td>{result.place < medalCutoff ?
                "M" :
                ""}</td>
            <td>{result.placeString}</td>
        <td>{result.name}</td>
        <td>{result.school.name}</td>
        <td>
            <button type={"button"} className={styles.button} onClick={() => setMedalCutoff(result.place + 1)}
                    title={"Set Medal Cutoff"}
            ><Medal style={{
                width: "1.5em",
                top: "0.5em",
                position: "relative"}}/></button>
        </td>
        <td>
            <button type={"button"} className={styles.button} onClick={() => setPlacementCutoff(result.place + 1)}
            title={"Set Placement Cutoff"}><Trophy style={{
                width: "1.5em",
                top: "0.5em",
                position: "relative"}}/></button>
        </td>
        <td>
            <button type={"button"} className={styles.button} onClick={() => setCertificateCutoff(result.place + 1)}
                    title={"Set Certificate Cutoff"}
            ><Certificate style={{
                width: "1.5em",
                top: "0.5em",
                position: "relative"
            }}
            /></button>
        </td>
    </tr>)}</table>
}

export default App;