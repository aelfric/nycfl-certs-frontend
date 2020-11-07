import React from "react";
import styles from "./App.module.css";

export function Expandable({heading, children}:{heading: React.ReactNode, children: React.ReactNode}){
    const [isExpanded, setExpanded] = React.useState(false);
    if(isExpanded){
        return <div className={styles.expandable}>
            {heading} <button type={"button"} onClick={()=>setExpanded(false)}>Collapse</button>
            {children}
        </div>
    } else {
        return <div className={styles.expandable}>
            {heading} <button type={"button"} onClick={()=>setExpanded(true)}>Expand</button>
        </div>
    }
}