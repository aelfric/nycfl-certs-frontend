import {
  createBrowserRouter,
  LoaderFunctionArgs,
  RouteObject,
} from "react-router";
import { Interface, NoTournamentSelected } from "./Interface";
import { Certificates, Postings, Slides } from "./certificates";
import { User } from "oidc-client-ts";
import { getData, postData } from "./fetch";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { TournamentScreen } from "./TournamentScreen";
import { TournamentForEdit } from "./types";

export const router = (user: User | null | undefined) => {
  const routes: RouteObject[] = [
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
          loader: async ({ params }: LoaderFunctionArgs) => {
            return await getData(
              `/certs/tournaments/${params.id}`,
              user?.access_token,
            );
          },
          action: async ({ request, params }) => {
            function emptyToNull(str: FormDataEntryValue): string | null {
              if (typeof str === "string") {
                return str === "" ? null : str;
              }
              return null;
            }

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
            return await postData(
              `/certs/tournaments/${params.id}`,
              user?.access_token,
              data,
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
  ];

  return createBrowserRouter(routes);
};
