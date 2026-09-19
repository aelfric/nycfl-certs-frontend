import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { setupServer } from "msw/node";
import {
  deleteData,
  getData,
  handleFileUpload,
  postData,
  putData,
} from "./fetch";
import { http, HttpResponse } from "msw";
import { ChangeEvent } from "react";

const server = setupServer();

describe("fetch", () => {
  // Start server before all tests
  beforeAll(() => {
    vi.spyOn(globalThis, "alert");
    vi.mocked(globalThis.alert);
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
    vi.resetAllMocks();
  });

  it("can GET JSON data", async () => {
    server.use(
      http.get("/test", () => {
        return HttpResponse.json({ message: "hello" });
      }),
    );
    expect(await getData("/test")).toEqual({ message: "hello" });
  });

  it("can GET Text data", async () => {
    server.use(
      http.get("/test", () => {
        return HttpResponse.text("hello world");
      }),
    );
    expect(await getData("/test", "some-token", "text/html")).toEqual(
      "hello world",
    );
  });

  it("can POST data", async () => {
    server.use(
      http.post("/test", () => {
        return HttpResponse.json({ message: "ok" });
      }),
    );
    expect(await postData("/test", "some-token", {})).toEqual({
      message: "ok",
    });
  });

  it("can PUT data", async () => {
    server.use(
      http.put("/test", () => {
        return HttpResponse.json({ message: "ok" });
      }),
    );
    expect(await putData("/test", "some-token")).toEqual({
      message: "ok",
    });
  });

  it("can DELETE data", async () => {
    server.use(
      http.delete("/test", () => {
        return HttpResponse.json({ message: "ok" });
      }),
    );
    expect(await deleteData("/test", "some-token")).toEqual({
      message: "ok",
    });
  });

  it("can upload files", async () => {
    server.use(
      http.post("/test", async ({ request }) => {
        const data = await request.formData();
        const file = data.get("file");

        if (!file) {
          return new HttpResponse("Missing document", { status: 400 });
        }

        const textContent =
          typeof file === "string"
            ? String.fromCharCode(...file.split(",").map(Number))
            : await file.text();

        return HttpResponse.json({
          contents: textContent,
        });
      }),
    );
    const file = Object.assign(new TextEncoder().encode("lorem ipsum"), {
      name: "test.txt",
      type: "text/plain",
    }) as unknown as File;

    const onFulfilled = vi.fn();
    await handleFileUpload(
      {
        target: {
          files: [file] as unknown as FileList,
        },
      } as ChangeEvent<HTMLInputElement>,
      "/test",
      "some-token",
      onFulfilled,
    );

    expect(onFulfilled).toHaveBeenCalledWith({ contents: "lorem ipsum" });
  });
});
