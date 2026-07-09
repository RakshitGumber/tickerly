export const volatility = () => {
  const start = new Date();
  const end = new Date(start); // copy
  end.setUTCDate(end.getUTCDate() - 365);

  console.log(start, end);
};

// const main = () => {
//   volatility();
// };

// main();
