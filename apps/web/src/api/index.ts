const url = "/api/";

export const fetchStatus = async () => {
  const data = await fetch(url);
  const content = await data.json();
  console.log(content);
};

// const fetchReturns = async () => {
//     await
// };
