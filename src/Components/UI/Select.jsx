import React, { useId } from "react";

/**
 * Native select styled as a pill. Options: [{ value, label }]
 */
const Select = ({ label, value, options, onChange }) => {
  const id = useId();

  return (
    <div className="select">
      {label && (
        <label className="select__label" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
