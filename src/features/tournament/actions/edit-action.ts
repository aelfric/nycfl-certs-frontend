import { ActionFunctionArgs } from "react-router-dom";
import { TournamentApi } from "../../../tournament-api";
import { TournamentForEdit } from "../types";
import { emptyToNull } from "../../../utils";

export async function editAction(
  this: TournamentApi,
  { request, params }: ActionFunctionArgs,
) {
  const formData = Object.fromEntries(await request.formData());
  const data: TournamentForEdit = {
    name: formData.tournamentName as string,
    host: formData.host as string,
    date: formData.date as string,
    logoUrl: emptyToNull(formData.logoUrl),
    slideBackgroundUrl: emptyToNull(formData.backgroundUrl),
    slidePrimaryColor: emptyToNull(formData.slidePrimaryColor),
    slideAccentColor: emptyToNull(formData.slideAccentColor),
    slideSecondaryAccentColor: emptyToNull(formData.slideSecondaryAccentColor),
    slideOverlayColor: emptyToNull(formData.slideOverlayColor),
    certificateHeadline: emptyToNull(formData.certificateHeadline),
    line1: emptyToNull(formData.line1),
    line2: emptyToNull(formData.line2),
    signature: emptyToNull(formData.signature),
    signatureTitle: emptyToNull(formData.signatureTitle),
    styleOverrides: emptyToNull(formData.styleOverrides),
  };
  return this.updateOne(params.id as string, data);
}
