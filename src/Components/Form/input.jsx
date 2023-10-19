import React from "react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, icon, errorMessage, onChange, classNameErr, id, ...inputProps } = props;

  const [visible, setVisible] = useState(true);

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <>
      {label ? (
        <>
          <label>{label}</label>
          {icon ? <div className="formIcon">{icon}</div> : ""}
        </>
      ) : (
        icon
      )}
      <input
        {...inputProps}
        type={inputProps.type === "password" && visible ? "password" : inputProps.type && inputProps.type !== "password" ? inputProps.type : "text"}
        onChange={onChange ? onChange : ""}
        onBlur={handleFocus}
        onFocus={() => inputProps.name === "confirmPassword" && setFocused(true)}
        focused={focused.toString()}
        className="form-control"
      />
      {inputProps.type === "password" ? (
        <div className="inputPassword" onClick={() => setVisible(!visible)}>
          {visible ? <EyeIcon /> : <EyeSlashIcon />}
        </div>
      ) : (
        ""
      )}
      {errorMessage && <span id="validError">{errorMessage}</span>}
    </>
  );
};

export default FormInput;
