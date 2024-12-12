// PanelTools.tsx
import React from "react";
import styles from "./PanelTools.module.css";

type PanelToolsPropsType = {
  buttons: React.ReactNode[]; // Array of buttons or components
};

const PanelTools: React.FC<PanelToolsPropsType> = ({ buttons }: PanelToolsPropsType) => {
  return <div className={styles.wrapper}>{buttons}</div>;
};

export default PanelTools;
