import React from "react";
import styles from "./App.module.css";

type ExpandableProps = {
    heading: React.ReactNode;
    children: React.ReactNode;
};

export function Expandable({
  heading,
  children,
}: Readonly<ExpandableProps>) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  if (isExpanded) {
    return (
      <div className={styles.expandable}>
        {heading}{" "}
        <button type={"button"} onClick={() => setIsExpanded(false)}>
          Collapse
        </button>
        {children}
      </div>
    );
  } else {
    return (
      <div className={styles.expandable}>
        {heading}{" "}
        <button type={"button"} onClick={() => setIsExpanded(true)}>
          Expand
        </button>
      </div>
    );
  }
}
