import React from "react";

const RelaySwitch = (props) => {
 
  return (
    <div className="switch-container">
    <div className="switch">
      <input type="checkbox" name="toggle" 
        onClick={(e) => {props.handleClick(props.relay.relayID)} } 
        checked={ props.relay.relayState } />
      <label for="toggle">
        <i></i>
      </label>
      <span></span>
    </div>
  </div>
  )
}

export default RelaySwitch;
