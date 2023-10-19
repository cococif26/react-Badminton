import React from "react";
import { useState } from "react";

const FormTextarea = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, value, icon, errorMessage, onChange, classNameErr, id, ...inputProps } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <>
      {label ? 
        <>
          <label>{label}</label>
          {(icon) ? <div className="formIcon">{icon}</div>:""}
        </>
      : icon
      }
      <textarea
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        focused={focused.toString()}
        className="form-control"
        value={value}
      ></textarea>
      {errorMessage && <span id="validError">{errorMessage}</span>}
    </>
  );
};

export default FormTextarea;