import React from "react";

const notmatch = {
  width: "100%",
  height: "100vh",
  background: "#f0f0f0",
  overflow: "hidden",
};

const NoMatch = () => {
  return (
    <div style={notmatch}>
      <h2 style={{ textAlign: "center", fontSize: "4rem", fontWeight: 400, paddingTop: "200px" }}>There are NO Route Match ! Sorry</h2>
    </div>
  );
};

export default NoMatch;
