"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";
import axios from "axios";

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Student Portal</div>
      <nav className={styles.nav}>
        <Link
          href="/dashboard/student/profile"
          className={`${styles.navItem} ${
            pathname === "/dashboard/student/profile" ? styles.active : ""
          }`}
        >
          My Profile
        </Link>
      </nav>
      <div className={styles.logout} onClick={handleLogout}>
        Logout
      </div>
    </aside>
  );
}
