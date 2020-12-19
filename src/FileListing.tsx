import React from "react";
import { getData } from "./fetch";
import styles from "./App.module.css";

type FileObject = {
  url: string;
  objectName: string;
};

export function FileListing() {
  const [files, setFiles] = React.useState<FileObject[]>([]);
  React.useEffect(() => {
    getData("/s3").then(setFiles);
  }, []);
  return (
    <ul className={styles.fileList}>
      {files.map((file) => (
        <li>
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
