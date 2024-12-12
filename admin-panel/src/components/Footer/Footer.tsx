import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <p>&copy; 2024 Admin Panel. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
