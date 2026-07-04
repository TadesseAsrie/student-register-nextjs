"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null,
  );

  useEffect(() => {
    axios.get("/api/auth/me").then((res) => {
      setUser(res.data);
    });
  }, []);

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.breadcrumb}>Dashboard</span>
      </div>
      <div className={styles.right}>
        <span className={styles.userName}>{user?.username}</span>
        <span className={styles.userRole}>({user?.role})</span>
      </div>
    </header>
  );
}
