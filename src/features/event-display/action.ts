import { TournamentApi } from "../../tournament-api";
import { ActionFunctionArgs, redirect } from "react-router-dom";

export async function action<Context>(
  this: TournamentApi,
  { request, params }: ActionFunctionArgs<Context>,
) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  switch (intent) {
    case "rename":
      return await this.setEventName(
        Number(params.eventId),
        formData.get("newName") as string,
        params.id as string,
      );
    case "update":
      if (formData.get("numRounds")) {
        return await this.setNumRounds(
          Number(params.eventId),
          Number(formData.get("numRounds")),
          params.id as string,
        );
      } else if (formData.get("certType")) {
        return await this.setCertType(
          Number(params.eventId),
          formData.get("certType") as string,
          params.id as string,
        );
      } else if (formData.get("eventType")) {
        return await this.setEventType(
          Number(params.eventId),
          formData.get("eventType") as string,
          params.id as string,
        );
      } else if(formData.get("perSlide")){
        return await this.setCutoff(
          Number(formData.get("perSlide")),
          "slide_size",
          Number(params.eventId),
          params.id as string,
        );
      } else {
        throw new Error("Not implemented");
      }
    case "reset":
      return await this.resetResults(
        Number(params.eventId),
        params.id as string,
      );
    case "delete":
      await this.deleteEvent(Number(params.eventId), params.id as string);
      return redirect(`/tournaments/${params.id}`);
    default:
      console.log(intent);
      return null;
  }
}