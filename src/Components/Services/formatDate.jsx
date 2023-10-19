const FormatDate = (date = "") => {
  if (!date) return date;
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);

  // Split the formatted date into day, month, and year parts

  const [weekday, day, month, year, ] = formattedDate.split(" ");
  // // Convert the month abbreviation to uppercase
  // const capitalizeMonth = month.toUpperCase();

  // Return the formatted date with uppercase month abbreviation and desired format
  return `${weekday} ${day} ${month} ${year} `;


};

export default FormatDate;
