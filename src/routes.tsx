import {
  createBrowserRouter,
  LoaderFunctionArgs,
  RouteObject,
} from "react-router";
import { Interface, NoTournamentSelected } from "./Interface";
import { Certificates, Postings, Slides } from "./certificates";
import { User } from "oidc-client-ts";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { EventDisplayV2, TournamentScreen } from "./TournamentScreen";
import { CutoffType, TournamentForEdit } from "./types";
import { emptyToNull } from "./utils";
import { TournamentApi } from "./tournament-api";

export const router = (user: User | null | undefined) => {
  const api = new TournamentApi(user);
  const routes: RouteObject[] = [
    {
      path: "/",
      Component: Interface,
      loader: api.findAll.bind(api),
      action: async (args: ActionFunctionArgs) => {
        const { request } = args;
        const formData = await request.formData();
        const intent = formData.get("intent");
        if (intent === "copy") {
          await api.copyTournament(formData.get("tournamentId") as string);
        } else {
          const { tournamentName, host, date } = Object.fromEntries(
            formData.entries(),
          );
          await api.createTournament({
            name: tournamentName as string,
            host: host as string,
            date: date as string,
          });
        }
        return redirect("/");
      },
      children: [
        {
          path: "",
          Component: NoTournamentSelected,
        },
        {
          path: "tournaments/:id",
          Component: TournamentScreen,
          loader: async ({ params }: LoaderFunctionArgs) => {
            return api.findOne(params.id as string);
          },
          action: async ({ request, params }) => {
            const formData = Object.fromEntries(await request.formData());
            const data: TournamentForEdit = {
              name: formData.tournamentName as string,
              host: formData.host as string,
              date: formData.date as string,
              logoUrl: emptyToNull(formData.logoUrl),
              slideBackgroundUrl: emptyToNull(formData.backgroundUrl),
              slidePrimaryColor: emptyToNull(formData.slidePrimaryColor),
              slideAccentColor: emptyToNull(formData.slideAccentColor),
              slideSecondaryAccentColor: emptyToNull(
                formData.slideSecondaryAccentColor,
              ),
              slideOverlayColor: emptyToNull(formData.slideOverlayColor),
              certificateHeadline: emptyToNull(formData.certificateHeadline),
              line1: emptyToNull(formData.line1),
              line2: emptyToNull(formData.line2),
              signature: emptyToNull(formData.signature),
              signatureTitle: emptyToNull(formData.signatureTitle),
              styleOverrides: emptyToNull(formData.styleOverrides),
            };
            return api.updateOne(params.id as string, data);
          },
          children: [
            {
              path: "events",
              action: async ({ request, params }) => {
                const formData = await request.formData();
                await api.createEvents(
                  params.id as string,
                  formData.get("events") as string,
                );
                return redirect(`/tournaments/${params.id}`);
              },
            },
            {
              path: "events/:eventId",
              Component: EventDisplayV2,
              action: async ({ request, params }) => {
                const formData = await request.formData();
                const intent = formData.get("intent") as string;
                switch (intent) {
                  case "rename":
                    return await api.setEventName(
                      Number(params.eventId),
                      formData.get("newName") as string,
                      params.id as string,
                    );
                  case "reset":
                    return await api.resetResults(
                      Number(params.eventId),
                      params.id as string,
                    );
                  case "delete":
                    await api.deleteEvent(
                      Number(params.eventId),
                      params.id as string,
                    );
                    return redirect(`/tournaments/${params.id}`);
                  default:
                    console.log(intent);
                    return null;
                }
              },
              children: [
                {
                  path: "cutoff",
                  action: async ({ request, params }) => {
                    const formData = await request.formData();
                    const value = Number(formData.get("value"));
                    const cutoffType = formData.get("cutoffType") as CutoffType;
                    await api.setCutoff(
                      value,
                      cutoffType,
                      Number(params.eventId),
                      params.id as string,
                    );
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "postings/:id",
      Component: Postings,
    },
    {
      path: "certificates/:id",
      Component: Certificates,
    },
    {
      path: "preview_slides/:id",
      Component: Slides,
    },
  ];

  return createBrowserRouter(routes);
};
