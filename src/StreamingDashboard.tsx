import React from 'react';

interface DraftStream {
    title?: string;
    startTime?: string;
    endTime?: string;
}

export function StreamingDashboard() {
    const [rows, setRows] = React.useState<DraftStream[]>([]);


    function addRow(){
        setRows([...rows, {}]);
    }
    return <form>
        <div><button type={"button"} onClick={addRow}>Add Row</button></div>
        <table>
        {rows.map( row =>
        <tr key={row.title}>
            <td><input type={"text"} /></td>
            <td><input type={"datetime-local"} /></td>
            <td><input type={"datetime-local"} /></td>
        </tr> ) }
    </table></form>;
}