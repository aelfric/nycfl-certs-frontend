import React from "react";
import { getData } from "./fetch";
import styles from "./App.module.css";
import { useAuth } from "react-oidc-context";

type FileObject = {
  url: string;
  objectName: string;
};

export function FileListing() {
  const [files, setFiles] = React.useState<FileObject[]>([]);
  const auth = useAuth();
  React.useEffect(() => {
    getData("/s3", auth.user?.access_token).then(setFiles);
  }, [auth.user?.access_token]);
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
