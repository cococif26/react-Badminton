import React from "react";

const FormSelectTime = (props) => {
  const { label, nameHour, nameMinute, selectHour, selectMinute, nameTime, selectTime, errorMessage, classNameErr, id, ...inputProps } = props;

  let dataJam = [];
  for (let i = 1; i <= 12; i++) {
    const jamnya = (i < 10) ? `0${i}`:i;
    dataJam.push({id:jamnya, value:jamnya});
  }
  let dataMenit = [];
  for (let i = 0; i <= 59; i++) {
    const menitnya = (i < 10) ? `0${i}`:i;
    dataMenit.push({id:menitnya, value:menitnya});
  }

  let dataTime = [
    {id:"AM", value:"AM"},
    {id:"PM", value:"PM"},
  ];

  return (
    <>
      { label ? <><label>{label}</label><br/></> : "" }
      <div className="d-flex">
        <select 
          {...inputProps}
          name={nameHour}
          defaultValue={selectHour?selectHour:""}
          className="form-select form-select-sm" 
          style={{width:60,fontSize:12}}>
          {
              dataJam.map((val, key) => (
                  <option value={val.id} key={key}>{val.value}</option>
              ))
          }
        </select>
        &nbsp;:&nbsp;
        <select 
          {...inputProps}
          name={nameMinute}
          defaultValue={selectMinute?selectMinute:""}
          className="form-select form-select-sm" 
          style={{width:61,fontSize:12}}>
          {
              dataMenit.map((val, key) => (
                  <option value={val.id} key={key}>{val.value}</option>
              ))
          }
        </select>
        &nbsp;:&nbsp;
        <select 
          {...inputProps}
          name={nameTime}
          defaultValue={selectTime?selectTime:""}
          className="form-select form-select-sm" 
          style={{width:65,fontSize:12}}>
          {
              dataTime.map((val, key) => (
                  <option value={val.id} key={key}>{val.value}</option>
              ))
          }
        </select>
      </div>
      {errorMessage && <span id="validError">{errorMessage}</span>}
    </>
  );
};

export default FormSelectTime;