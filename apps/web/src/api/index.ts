const url = "/api";

export const fetchStatus = async () => {
  const data = await fetch(url);
  const content = await data.json();
  console.log(content);
};

export const fetchReturns = async (ticker: string) => {
  const data = await fetch(`${url}/prices/${ticker}`);
  const content = await data.json();
  return content.data;
};
