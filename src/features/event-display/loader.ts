import { User } from "oidc-client-ts";
import { getData } from "../../fetch";
import { Enums, Option } from "./event-display";

export async function loader(this: User | null | undefined): Promise<Enums> {
  if (!this) {
    return Promise.resolve({});
  }
  const eventTypes: Option[] = await getData(
    "/enums/event_types",
    this.access_token,
  );
  const certTypes: Option[] = await getData(
    "/enums/certificate_types",
    this.access_token,
  );
  const elimTypes: Option[] = await getData(
    "/enums/elim_types",
    this.access_token,
  );

  return {
    eventTypes,
    certTypes,
    elimTypes,
  };
}
