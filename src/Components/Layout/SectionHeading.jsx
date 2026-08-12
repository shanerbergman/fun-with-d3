import React from "react";

const SectionHeading = ({ id, title, meta, spaced }) => (
  <div
    id={id}
    className={`section-head${spaced ? " section-head--spaced" : ""}`}
  >
    <h2 className="section-head__title">{title}</h2>
    <span className="section-head__meta">{meta}</span>
  </div>
);

export default SectionHeading;
