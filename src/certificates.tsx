import { RefObject, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { getData } from "./fetch";
import styles from "./App.module.css";
import { useAuth } from "react-oidc-context";

function useAjaxIframe(
  url: string,
  token?: string,
): RefObject<HTMLIFrameElement> {
  const iframe = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    getData(url, token, "text/html").then((response) => {
      if (iframe.current) {
        const document = iframe.current?.contentDocument;
        document?.open();
        document?.write(response);
        document?.close();
      }
    });
  }, [url, token]);

  return iframe;
}

export function Certificates() {
  const { id } = useParams<"id">();
  const auth = useAuth();
  const token = auth.user?.access_token;
  const iframe = useAjaxIframe(`/certs/tournaments/${id}/certificates`, token);

  function doPrint() {
    iframe.current?.contentWindow?.print();
  }

  return (
    <>
      <div style={{ textAlign: "right" }}>
        <button type="button" className={styles.button} onClick={doPrint}>
          Print
        </button>
      </div>
      <iframe
        title={"Certificates Preview"}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        ref={iframe}
      />
    </>
  );
}

export function Slides() {
  const { id } = useParams<"id">();
  const auth = useAuth();
  const iframe = useAjaxIframe(
    `/certs/tournaments/${id}/slides?dl=0`,
    auth.user?.access_token,
  );

  return (
    <iframe
      title={"Slides Preview"}
      style={{ position: "absolute", width: "100%", height: "100%" }}
      ref={iframe}
    />
  );
}

export function Postings() {
  const { id } = useParams<"id">();
  const auth = useAuth();
  const iframe = useAjaxIframe(
    `/certs/tournaments/${id}/postings?dl=0`,
    auth.user?.access_token,
  );

  return (
    <iframe
      title={"Slides Preview"}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
      ref={iframe}
    />
  );
}
