import { ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
