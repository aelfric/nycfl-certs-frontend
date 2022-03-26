import React from "react";
import { getData } from "./fetch";
import styles from "./App.module.css";
import { useKeycloak } from "@react-keycloak/web";

type FileObject = {
  url: string;
  objectName: string;
};

export function FileListing() {
  const [files, setFiles] = React.useState<FileObject[]>([]);
  const { keycloak } = useKeycloak();
  React.useEffect(() => {
    getData("/s3", keycloak.token).then(setFiles);
  }, [keycloak.token]);
  return (
    <ul className={styles.fileList}>
      {files.map((file) => (
        <li key={file.objectName}>
          {
            <a href={file.url} title={file.objectName}>
              {file.objectName}
            </a>
          }
        </li>
      ))}
    </ul>
  );
}
