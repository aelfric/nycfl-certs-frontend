import { components } from "./schema";

export type Tournament = components["schemas"]["Tournament"];
export type CompetitionEvent = components["schemas"]["Event"];
export type Result = components["schemas"]["Result"];
export type TournamentForEdit = components["schemas"]["TournamentInput"];

export type CutoffType = "placement" | "cutoff" | "medal" | "quals";
export type ISetCutoff = (
  value: number,
  type: CutoffType,
  activeEvent: number,
) => void;
