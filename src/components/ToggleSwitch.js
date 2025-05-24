import React from "react";
import Switch from "@mui/material/Switch";
import "./ToggleSwitch.css";

function ToggleSwitch(props) {
    function handleChange(event) {
      let checked = event.target.checked;
      props.onChange(checked);
    }
    return (
        <Switch
        checked={props.checked}
        onChange={handleChange}
        className="toggle-switch"
        />
    );
}

export default ToggleSwitch;