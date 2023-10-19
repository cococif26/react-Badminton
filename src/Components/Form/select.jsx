import React from "react";
import Select from "react-select";

const FormSelect = (props) => {
  const { plugin, label, options, icon, errorMessage, className, classNameErr, id, selected, ...inputProps } = props;
  const targetHeight = 30;

  const styles = {
    control: (base="") => ({
      ...base,
      minHeight: 'initial',
    }),
    valueContainer: (base="") => ({
      ...base,
      height: `${targetHeight - 1 - 1}px`,
      padding: '0 8px',
    }),
    clearIndicator: (base="") => ({
      ...base,
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
    }),
    dropdownIndicator: (base="") => ({
      ...base,
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
    }),
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "white" : "#222",
      backgroundColor: state.isSelected ? "rgba(248, 80, 50, 1)" : "white",
    }),
  }

  return (
    <>
      {label ? 
        <>
          <label>{label}</label>
          {(icon) ? <div className="formIcon iconSelect">{icon}</div>:""}
        </>
      : icon
      }
      
      {
        plugin==="react-select" ?
          <Select 
            {...inputProps}
            className={`formSelect ${className?className:""}`}
            classNamePrefix="form-select-custom"  
            // onBlur={() => props.input.onBlur(props.input.value)}
            defaultValue={selected ? selected:""}
            options={options}
            styles={styles}
          />
        :
        <select 
          {...inputProps}
          className={className?className:""} defaultValue={selected ? selected:""}>
          {
              options && options.map((val, key) => (
                  <option value={val.value} key={key}>{val.label}</option>
              ))
          }
        </select>
      }
      
      {errorMessage && <span id="validError">{errorMessage}</span>}
    </>
  );
};

export default FormSelect;