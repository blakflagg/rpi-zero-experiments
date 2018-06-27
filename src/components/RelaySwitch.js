import React from "react";

const RelaySwitch = (props) => (
  <div className="switch-container">
    <div className="switch">
      <input type="checkbox" name="toggle" onClick={ props.handleClick } checked={ props.relayState } relayID={props.relayID} />
      <label for="toggle">
        <i></i>
      </label>
      <span></span>
    </div>
  </div>
)

export default RelaySwitch;
