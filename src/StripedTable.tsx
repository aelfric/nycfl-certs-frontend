import styles from "./App.module.css";
import * as React from "react";

type StripedTableProps = { children: React.ReactNode };

export function StripedTable({ children }: Readonly<StripedTableProps>) {
  const ref = React.useRef<HTMLTableElement>(null);

  function handleCopy() {
    const el = ref.current;
    if (!el) return;

    let range: Range;
    if (document.createRange && window.getSelection) {
      range = document.createRange();
      const sel = window.getSelection();
      if (!sel) {
        alert("could not select");
        return;
      }
      sel.removeAllRanges();
      try {
        range.selectNodeContents(el as Node);
        sel.addRange(range);
      } catch (e) {
        range.selectNode(el as Node);
        sel.addRange(range);
        console.error(e);
      }
    }
  }

  return (
    <>
      <table className={styles.stripedTable} ref={ref}>
        {children}
      </table>
      <button type={"button"} className={styles.btnSmall} onClick={handleCopy}>
        Copy Table
      </button>
    </>
  );
}
