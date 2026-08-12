import React, { useId } from "react";

/**
 * Labelled range input with a live mono readout, per the card control bar.
 */
const Slider = ({ label, value, min = 1, max = 50, step = 1, onChange }) => {
  const id = useId();

  return (
    <div className="slider">
      {label && (
        <label className="slider__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="slider__value">{value}</span>
    </div>
  );
};

export default Slider;
