import { Result } from "../../App";

export interface CompetitionEvent {
  latestResult: string;
  eventType: string;
  certificateType: string;
  id: number;
  name: string;
  results: Result[];
  placementCutoff: number;
  medalCutoff: number;
  certificateCutoff: number;
  halfQuals: number;
  numRounds: number | null;
  entriesPerPostingSlide: number;
}

export interface Tournament {
  id: number;
  name: string;
  host: string;
  date: string;
  logoUrl?: string;
  slideBackgroundUrl?: string;
  slideAccentColor?: string;
  slideSecondaryAccentColor?: string;
  slidePrimaryColor?: string;
  slideOverlayColor?: string;
  certificateHeadline?: string;
  line1?: string;
  line2?: string;
  signature?: string;
  signatureTitle?: string;
  styleOverrides?: string;
  events: CompetitionEvent[];
}

type PickOptional<T> = {
  [Key in keyof T as Omit<T, Key> extends T ? Key : never]: T[Key];
};
type PickNotOptional<T> = {
  [Key in keyof T as Omit<T, Key> extends T ? never : Key]: T[Key];
};
type OptionalNullable<T> = {
  [K in keyof PickOptional<T>]?: Exclude<T[K], undefined> | null;
} & {
  [K in keyof PickNotOptional<T>]: T[K];
};
export type TournamentForEdit = Omit<
  OptionalNullable<Tournament>,
  "id" | "events"
>;

export type CutoffType = "placement" | "cutoff" | "medal" | "quals";
export type ISetCutoff = (
  value: number,
  type: CutoffType,
  activeEvent: number,
) => void;
