import React, {ChangeEvent} from 'react';

interface DraftStream {
    title?: string;
    startTime?: string;
    endTime?: string;
}

export function StreamingDashboard() {
    const [rows, setRows] = React.useState<DraftStream[]>([]);


    function addRow() {
        setRows([...rows, {
            title:"",
            startTime:"",
            endTime:""
        }]);
    }

    function submit() {
        console.log(rows);
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

    return <form>
        <div>
            <button type={"button"} onClick={addRow}>Add Row</button>
        </div>
        <table>
            <tbody>
            {rows.map((row, index) =>
                <tr key={index}>
                    <td><input name="title" type={"text"} value={rows[index].title} data-index={index} onChange={updateRow}/></td>
                    <td><input name="startTime" type={"datetime-local"} value={rows[index].startTime} data-index={index} onChange={updateRow}/></td>
                    <td><input name="endTime" type={"datetime-local"} value={rows[index].endTime} data-index={index} onChange={updateRow}/></td>
                </tr>)}
            </tbody>
        </table>
        <div>
            <button type={"button"} onClick={submit}>Save</button>
        </div>
    </form>;
}