import { useReducer } from "react";
import itemsContext from "./itemsContext";

// Reducer function for managing items state
const itemsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return [...state, action.item];
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.id);
    case "UPDATE_ITEM":
      return state.map((item) =>
        item.id === action.item.id ? action.item : item
      );
    default:
      return state;
  }
};

const ItemsProvider = (props) => {
  const [itemsState, dispatchItemsAction] = useReducer(itemsReducer, []);

  const addItemHandler = (item) => {
    dispatchItemsAction({ type: "ADD_ITEM", item });
  };

  const removeItemHandler = (id) => {
    dispatchItemsAction({ type: "REMOVE_ITEM", id });
  };

  const updateItemHandler = (item) => {
    dispatchItemsAction({ type: "UPDATE_ITEM", item });
  };

  const itemsContextValue = {
    itemsData: itemsState,
    addNewItem: addItemHandler,
    removeItem: removeItemHandler,
    updateItem: updateItemHandler,
  };

  return (
    <itemsContext.Provider value={itemsContextValue}>
      {props.children}
    </itemsContext.Provider>
  );
};

export default ItemsProvider;
