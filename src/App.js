import React from 'react';
import './App.css';

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

    React.useEffect(()=>{
        getData("/certs/tournaments")
            .then(setTournaments);
    },[])

    function createTournament(evt){
        evt.preventDefault();
        postData("/certs/tournaments", {name: evt.target.name.value})
            .then((newTournament) => setTournaments(tournaments => [...tournaments, newTournament]));
    }
    function createEvents(evt){
        evt.preventDefault();
        postData("/certs/events", {events: evt.target.events.value, tournamentId: activeTournament})
            .then((newTournament) => setTournaments(tournaments => {
                const index = tournaments.findIndex(t=>t.id===activeTournament);
                return Object.assign([], tournaments, {[index]: newTournament});
            }));
    }

    function handleCSVUpload(event) {
        const files = event.target.files
        const formData = new FormData()
        formData.append('file', files[0])
        formData.append('fileName', "resultsCSV")

        fetch(`/certs/results?tournamentID=${activeTournament}&eventId=${activeEvent}`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const index = tournaments.findIndex(t=>t.id===activeTournament);
                return setTournaments(tournaments => Object.assign([], tournaments, {[index]: data}));
            })
            .catch(error => {
                console.error(error)
            })
    }

    return (
    <div className="App">
      <ul>
        <li>Create a Tournament</li>
        <li>Upload Events</li>
        <li>Upload Results</li>
        <li>Download Certificates</li>
      </ul>
        <ul>
            {tournaments.map(t=>
                <li key={t.id} onClick={()=>setActiveTournament(t.id)}>{t.name} {activeTournament===t.id ? "*" : ""}
                    {t.events.length > 0 && <ul>
                        {t.events.map(e=><li onClick={()=>setActiveEvent(e.id)} key={e.id}>{e.name} ({e.results ? e.results.length : 0}) {activeEvent===e.id ? "**" : ""}</li>)}
                    </ul>}
                </li>
            )}
        </ul>
        <form onSubmit={createTournament}>
            <input type={"text"} name={"name"} />
            <button type={"submit"}>Submit</button>
        </form>
        <form onSubmit={createEvents}>
            <textarea name={"events"} />
            <button type={"submit"} disabled={activeTournament===undefined}>Submit</button>
        </form>
        <input type="file" id="fileUpload" onChange={handleCSVUpload}/>
    </div>
  );
}

export default App;
