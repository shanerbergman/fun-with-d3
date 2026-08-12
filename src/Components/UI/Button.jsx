import React from "react";

/**
 * Pill button. `variant="ghost"` gives the outlined colophon-link treatment.
 */
const Button = ({ variant, icon, children, className = "", ...rest }) => (
  <button
    type="button"
    className={`btn${variant === "ghost" ? " btn--ghost" : ""}${
      className ? ` ${className}` : ""
    }`}
    {...rest}
  >
    {icon}
    {children}
  </button>
);

export const PlayIcon = () => (
  <svg className="btn__icon" viewBox="0 0 10 11" aria-hidden="true">
    <path d="M0 0l10 5.5L0 11z" />
  </svg>
);

export const PauseIcon = () => (
  <svg className="btn__icon" viewBox="0 0 10 11" aria-hidden="true">
    <path d="M0 0h3.2v11H0zM6.8 0H10v11H6.8z" />
  </svg>
);

export default Button;
