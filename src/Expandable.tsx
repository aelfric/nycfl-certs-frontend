import React from "react";

type ExpandableProps = {
  heading: React.ReactNode;
  children: React.ReactNode;
};

export function Expandable({ heading, children }: Readonly<ExpandableProps>) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  if (isExpanded) {
    return (
      <div>
        {heading}{" "}
        <button type={"button"} onClick={() => setIsExpanded(false)}>
          Collapse
        </button>
        {children}
      </div>
    );
  } else {
    return (
      <div>
        {heading}{" "}
        <button type={"button"} onClick={() => setIsExpanded(true)}>
          Expand
        </button>
      </div>
    );
  }
}
