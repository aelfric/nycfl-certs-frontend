import { ActionFunctionArgs, redirect } from "react-router-dom";
import { TournamentApi } from "../../../tournament-api";

export async function createAction(
  this: TournamentApi,
  args: ActionFunctionArgs,
) {
  const { request } = args;
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "copy") {
    await this.copyTournament(formData.get("tournamentId") as string);
  } else {
    const { tournamentName, host, date } = Object.fromEntries(
      formData.entries(),
    );
    await this.createTournament({
      name: tournamentName as string,
      host: host as string,
      date: date as string,
    });
  }
  return redirect("/");
}
