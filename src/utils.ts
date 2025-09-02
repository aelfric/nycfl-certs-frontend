export function emptyToNull(str: FormDataEntryValue): string | null {
  if (typeof str === "string") {
    return str === "" ? null : str;
  }
  return null;
}
