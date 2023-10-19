const FormatTime = (date = "") => {
    if (!date) return date;
    const options = { hour: 'numeric', minute: 'numeric' };
    const formattedTime = new Date (date).toLocaleTimeString("en-US", options);
  
    // Split the formatted date into day, month, and year parts
  
    const [ hour, minute, ] = formattedTime.split(" ");
    // Convert the month abbreviation to uppercase

  
    // Return the formatted date with uppercase month abbreviation and desired format
    return ` ${hour} ${minute} `;
  
  
  };
  
  export default FormatTime;
  