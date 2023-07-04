const getLocalItems = () => {
  let list = localStorage.getItem("gastos");
  if (list === null) {
    return [];
  }
  console.log(list);
  if (list) {
    return JSON.parse(localStorage.getItem("gastos") ?? "");
  }
};

export default getLocalItems;
