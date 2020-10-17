import * as React from "react";
const DEFAULT_FETCH_OPTIONS : RequestInit = {
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json",
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
} ;

export async function postData(url: string = "", data: object = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    ...DEFAULT_FETCH_OPTIONS,
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export async function deleteData(url: string = "", data: object = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    ...DEFAULT_FETCH_OPTIONS,
    method: "DELETE",
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export async function getData(url: string = "") {
  // Default options are marked with *
  const response = await fetch(url, {
    ...DEFAULT_FETCH_OPTIONS,
    method: "GET",
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export function handleFileUpload(
  event: React.ChangeEvent<HTMLInputElement>,
  url: string,
  onFulfilled: ((value: any) => any) | null | undefined
) {
  const files = event.target.files;
  const formData = new FormData();
  if (files) {
    formData.append("file", files[0]);
    formData.append("fileName", files[0].name);
    formData.append("mimeType", files[0].type);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(onFulfilled)
      .catch((error) => {
        console.error(error);
      });
  }
}
