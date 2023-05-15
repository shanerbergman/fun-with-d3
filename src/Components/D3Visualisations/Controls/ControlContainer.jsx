import React from "react";

const ControlContainer = ({ children }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{ borderTop: "solid 1px #d9d9d9", marginBottom: "10px" }}
      ></div>
      {children}
    </div>
  );
};

export default ControlContainer;
