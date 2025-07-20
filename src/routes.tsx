import { createBrowserRouter } from "react-router";
import { Interface, NoTournamentSelected } from "./Interface";
import { Certificates, Postings, Slides } from "./certificates";
import { User } from "oidc-client-ts";
import { getData, postData } from "./fetch";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { TournamentScreen } from "./TournamentScreen";

// noinspection JSUnusedGlobalSymbols
export const router = (user: User | null | undefined) =>
  createBrowserRouter([
    {
      path: "/",
      Component: Interface,
      loader: async () => {
        return await getData("/certs/tournaments", user?.access_token);
      },
      action: async (args: ActionFunctionArgs) => {
        const { request } = args;
        const formData = await request.formData();
        const intent = formData.get("intent");
        if (intent === "copy") {
          const tournamentId = formData.get("tournamentId");
          if (typeof tournamentId === "string") {
            await postData(
              `/certs/tournaments?sourceId=${tournamentId}`,
              user?.access_token,
              {},
            );
          }
        } else {
          const { tournamentName, host, date } = Object.fromEntries(
            formData.entries(),
          );

          await postData("/certs/tournaments", user?.access_token, {
            name: tournamentName,
            host,
            date,
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
          loader: async (args) => {
            return await getData(
              `/certs/tournaments/${args.params.id}`,
              user?.access_token,
            );
          },
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
  ]);
