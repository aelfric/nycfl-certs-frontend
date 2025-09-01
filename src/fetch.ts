import * as React from "react";
function DEFAULT_FETCH_OPTIONS(
  token: string,
  contentType: string = "application/json",
): RequestInit {
  return {
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": contentType,
      Authorization: "Bearer " + token,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  };
}

function isResponseOk(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export async function postData(
  url: string = "",
  token: string = "",
  data: object = {},
) {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS(token),
      method: "POST",
      body: JSON.stringify(data),
    }).then(isResponseOk);
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (e) {
    alert("Sorry you can't do that: " + e);
  }
}

export async function deleteData(url: string = "", token: string = "") {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS(token),
      method: "DELETE",
    }).then(isResponseOk);
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (e) {
    alert("Sorry you can't do that: " + e);
  }
}

export async function getData(
  url: string = "",
  token: string = "",
  contentType: string = "application/json",
) {
  try {
    // Default options are marked with *

    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS(token, contentType),
      method: "GET",
    }).then(isResponseOk);
    if (contentType === "application/json") {
      return response.json(); // parses JSON response into native JavaScript objects
    } else {
      return response.text();
    }
  } catch (e) {
    alert("Sorry you can't do that: " + e);
  }
}

export async function handleFileUploadFormData<T>(
  url: string,
  formData: FormData,
  token: string | undefined,
): Promise<T | undefined> {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + (token || ""),
      },
    });
    const response_1 = isResponseOk(response);
    return await response_1.json();
  } catch (error) {
    console.error(error);
    return;
  }
}

export function handleFileUpload(
  event: React.ChangeEvent<HTMLInputElement>,
  url: string,
  token: string | undefined,
  onFulfilled: ((value: unknown) => unknown) | null | undefined,
) {
  try {
    const files = event.target.files;
    const formData = new FormData();
    if (files && files.length > 0) {
      formData.append("file", files[0]);
      formData.append("fileName", files[0].name);
      formData.append("mimeType", files[0].type);
      return handleFileUploadFormData(url, formData, token).then(onFulfilled);
    } else {
      return Promise.resolve();
    }
  } catch (e) {
    alert("Sorry you can't do that: " + e);
    return Promise.reject("Not allowed");
  }
}
