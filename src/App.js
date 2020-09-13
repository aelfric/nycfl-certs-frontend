import React from 'react';
import './App.css';
import styles from './App.module.css';

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
        postData("/certs/tournaments", {name: evt.target.name.value})
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

    function handleCSVUpload(event) {
        const files = event.target.files
        const formData = new FormData()
        formData.append('file', files[0])
        formData.append('fileName', "resultsCSV")

        fetch(`/certs/results?tournamentId=${activeTournament}&eventId=${activeEvent}`, {
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
                        <th>Cutoff Set</th>
                    </tr>
                    </thead>
                    {tournaments[activeTournamentIndex].events.map(e => <tr onClick={() => setActiveEvent(e.id)}
                                                                            key={e.id} className={`${styles.selectableRow} ${activeEvent === e.id ? styles.selected : ""}`}>
                        <td>{e.name}</td>
                        <td>{e.results.length > 0 ? "Yes" : ""}</td>
                        <td>{e.placementCutoff > 0 ? "Yes" : ""}</td>
                        <td>{e.certificateCutoff > 0 ? "Yes" : ""}</td>
                    </tr>)}
                </table>
            </section>}
            {activeTournament && activeEvent && <section>
                <h2>Results</h2>
                <input type="file" id="fileUpload" onChange={handleCSVUpload} disabled={false}/>
                <ResultDisplay
                    results={tournaments[activeTournamentIndex].events[activeEventIndex].results}
                    setPlacementCutoff={setPlacementCutoff}
                    placementCutoff={tournaments[activeTournamentIndex].events[activeEventIndex].placementCutoff}
                    setCertificateCutoff={setCertificateCutoff}
                    certificateCutoff={tournaments[activeTournamentIndex].events[activeEventIndex].certificateCutoff}
                />
            </section>
            }
            {activeTournament && <div style={{margin: "50px"}}><a className={styles.button} href={`http://localhost:8080/certs/tournaments/${activeTournament}/certificates`}>Generate Certificates</a></div>}
        </div>
    );
}

function SchoolList({tournamentId}) {
    const [schools, setSchools] = React.useState([]);
    React.useEffect(() => {
        if (tournamentId) {
            getData(`/certs/tournaments/${tournamentId}/schools`)
                .then(setSchools);
        }
    }, [tournamentId])

    return <table>{schools.map(school => <tr key={school.id}>
        <td>{school.name}</td>
    </tr>)}</table>
}

function ResultDisplay({results, setCertificateCutoff, setPlacementCutoff, placementCutoff, certificateCutoff}) {
    return <table className={styles.stripedTable}>
        <thead>
        <tr>
            <th>Place (#)</th>
            <th>Certificate</th>
            <th>Name</th>
            <th>School</th>
            <th colSpan={2}>&nbsp;</th>
        </tr>
        </thead>
        {results.map(result => <tr key={results.id} className={
            result.place < placementCutoff ?
                styles.placing :
                result.place < certificateCutoff ?
                    styles.finalist :
                    styles.noCert }>
        <td>{result.place}</td>
        <td>{result.placeString}</td>
        <td>{result.name}</td>
        <td>{result.school.name}</td>
        <td>
            <button type={"button"} className={styles.button} onClick={() => setPlacementCutoff(result.place + 1)}>Set Placement Cutoff</button>
        </td>
        <td>
            <button type={"button"} className={styles.button} onClick={() => setCertificateCutoff(result.place + 1)}>Set Certificate Cutoff
            </button>
        </td>
    </tr>)}</table>
}

export default App;
