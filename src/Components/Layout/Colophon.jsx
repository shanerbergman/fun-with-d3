import React from "react";

const specs = [
  { label: "Stack", value: "React 18, D3 v7, Vite" },
  { label: "Type", value: "Instrument Serif & IBM Plex" },
  {
    label: "Data",
    value: "Jail Data Initiative · Yahoo Finance · World Bank",
  },
  { label: "License", value: "MIT — copy anything" },
];

const links = [
  { label: "GitHub", href: "https://github.com/shanebergman" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shanebergman" },
  { label: "Email me", href: "mailto:shanerbergman@gmail.com" },
];

const Colophon = () => (
  <section id="colophon" className="wrap colophon">
    <div className="colophon__copy">
      <h2 className="colophon__title">Why this page exists</h2>
      <p className="colophon__body">
        I build software for a living. This is where I try a visualization idea
        end to end — data in, component out — before it&rsquo;s good enough to
        ship anywhere else. Nothing here is a library; everything here is
        readable.
      </p>
      <div className="colophon__links">
        {links.map((link) => (
          <a
            key={link.label}
            className="btn btn--ghost"
            href={link.href}
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
    <div className="spec">
      {specs.map((spec) => (
        <div className="spec__row spec__row--wide" key={spec.label}>
          <span className="eyebrow">{spec.label}</span>
          <span className="spec__label">{spec.value}</span>
        </div>
      ))}
    </div>
  </section>
);

export default Colophon;
