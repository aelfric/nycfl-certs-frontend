import {
  createBrowserRouter,
  LoaderFunctionArgs,
  RouteObject,
} from "react-router";
import { Interface, NoTournamentSelected } from "./Interface";
import { Certificates, Postings, Slides } from "./certificates";
import { User } from "oidc-client-ts";
import { redirect } from "react-router-dom";
import { CutoffType } from "./features/tournament/types";
import { TournamentApi } from "./tournament-api";
import * as EventDisplay from "./features/event-display";
import * as Tournament from "./features/tournament";

export const router = (user: User | null | undefined) => {
  const api = new TournamentApi(user);
  const routes: RouteObject[] = [
    {
      path: "/",
      Component: Interface,
      loader: api.findAll.bind(api),
      action: Tournament.createAction.bind(api),
      children: [
        {
          path: "",
          Component: NoTournamentSelected,
        },
        {
          path: "tournaments/:id",
          Component: Tournament.Component,
          loader: async ({ params }: LoaderFunctionArgs) => {
            return api.findOne(params.id as string);
          },
          action: Tournament.editAction.bind(api),
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
              loader: EventDisplay.loader.bind(user),
              path: "events/:eventId",
              Component: EventDisplay.Component,
              action: EventDisplay.action.bind(api),
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
                {
                  path: "results",
                  action: async ({ request, params }) => {
                    const formData = await request.formData();
                    await api.handleEventResultsUpload(
                      Number(params.eventId),
                      formData.get("roundType") as string,
                      params.id as string,
                      formData,
                    );
                    return redirect(
                      `/tournaments/${params.id}/events/${params.eventId}`,
                    );
                  },
                  children: [
                    {
                      path: ":resultId",
                      action: async ({ request, params }) => {
                        const formData = await request.formData();
                        await api.renameCompetitor(
                          Number(params.eventId),
                          Number(params.resultId),
                          formData.get("newName") as string,
                          params.id as string,
                        );
                        return redirect(
                          `/tournaments/${params.id}/events/${params.eventId}`,
                        );
                      },
                    },
                  ],
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
