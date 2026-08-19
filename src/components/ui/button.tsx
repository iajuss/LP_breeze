import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "text";
  children: ReactNode;
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href">;

const styles = {
  primary: "inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90",
  secondary: "inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--secondary)] px-5 py-3 font-semibold text-[var(--foreground)] transition hover:brightness-95",
  text: "inline-flex min-h-11 items-center justify-center rounded-xl px-3 py-3 font-semibold text-[var(--primary)] underline-offset-4 hover:underline",
};

export function Button({ variant = "primary", children, href, className = "", ...props }: ButtonProps) {
  const classNames = `${styles[variant]} ${className}`;
  return href ? <a href={href} className={classNames} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a> : <button className={classNames} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
