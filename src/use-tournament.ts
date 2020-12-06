import React from "react";
import {TournamentContext} from "./tournament-context";
import {handleFileUpload, postData} from "./fetch";

export function useTournament() {
    const {tournament, setTournament} = React.useContext(TournamentContext);

    function renameCompetitor(
        eventId: number,
        resultId: number,
        newName: string) {

        postData(
            `/certs/tournaments/${tournament?.id}/events/${eventId}/results/${resultId}/rename?name=${encodeURI(newName)}`,
            {}
        ).then(setTournament);
    }

    function handleEventResultsUpload(
        event: React.ChangeEvent<HTMLInputElement>,
        eventId: number | undefined,
        roundType: string = "FINALIST"
    ) {
        if (eventId !== undefined) {
            handleFileUpload(
                event,
                `/certs/tournaments/${tournament?.id}/events/${eventId}/results\?type=${roundType}`,
                setTournament
            );
        }
    }


    return {
        tournament: tournament,
        renameCompetitor: renameCompetitor,
        uploadResults: handleEventResultsUpload
    }
}