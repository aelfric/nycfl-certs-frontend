import React, { RefObject, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getData } from "./fetch";
import { useKeycloak } from "@react-keycloak/web";
import styles from "./App.module.css";

function useAjaxIframe(
  url: string,
  token?: string
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
  const { keycloak } = useKeycloak();

  const iframe = useAjaxIframe(
    `/certs/tournaments/${id}/certificates`,
    keycloak.token
  );
  function doPrint() {
    if (iframe.current && iframe.current.contentWindow) {
      iframe.current.contentWindow.print();
    }
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
  const { keycloak } = useKeycloak();
  const iframe = useAjaxIframe(
    `/certs/tournaments/${id}/slides?dl=0`,
    keycloak.token
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
  const { keycloak } = useKeycloak();
  const iframe = useAjaxIframe(
    `/certs/tournaments/${id}/postings?dl=0`,
    keycloak.token
  );

  return (
    <>
      <iframe
        title={"Slides Preview"}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        ref={iframe}
      />
    </>
  );
}
