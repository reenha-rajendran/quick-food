import { createContext } from "react";

const itemsContext = createContext({
  itemsData: [],
  switchPage: null,
  addNewItem: (item) => {},
  removeItem: (id) => {},
  updateItem: (id) => {},
  tooglePgae: () => {},
});

export default itemsContext;
