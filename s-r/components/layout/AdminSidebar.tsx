"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";
import axios from "axios";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard/admin", label: "Dashboard" },
    { href: "/dashboard/admin/students", label: "Students" },
    { href: "/dashboard/admin/register", label: "Register Student" },
    { href: "/dashboard/admin/profile", label: "Profile" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>SRS Admin</div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${
              pathname === item.href ? styles.active : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.logout} onClick={handleLogout}>
        Logout
      </div>
    </aside>
  );
}
