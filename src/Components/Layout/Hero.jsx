import React from "react";

const specs = [
  { label: "Physics & motion toys", value: "02" },
  { label: "Time-series charts", value: "03" },
  { label: "Geographic maps", value: "02" },
  { label: "Built with", value: "D3 v7 · React" },
  {
    label: "Source",
    value: "github.com/shanebergman",
    accent: true,
  },
];

const Hero = () => (
  <section className="wrap hero fadeup">
    <div className="hero__copy">
      <span className="eyebrow eyebrow--accent">
        Shane Bergman · Data visualization
      </span>
      <h1 className="hero__title">
        Small experiments in
        <br />
        <em>making data move.</em>
      </h1>
      <p className="hero__lede">
        A working sketchbook of React components built on D3 — physics toys,
        animated gauges, maps, and charts wired to real public datasets.
        Everything on this page is live. Press play, drag a range, poke at it.
      </p>
    </div>
    <div className="spec">
      {specs.map((spec) => (
        <div className="spec__row" key={spec.label}>
          <span className="spec__label">{spec.label}</span>
          <span
            className={`spec__value${spec.accent ? " spec__value--accent" : ""}`}
          >
            {spec.value}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default Hero;
