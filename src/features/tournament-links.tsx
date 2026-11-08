import { useLoaderData } from "react-router";

export function Component() {
  const data = useLoaderData<
    {
      displayName: string;
      objectName: string;
      url: string;
    }[]
  >();
  return (
    <ul>
      {data.map((file) => (
        <li key={file.objectName}>
          <a href={file.url}>{file.displayName}</a>
        </li>
      ))}
    </ul>
  );
}
