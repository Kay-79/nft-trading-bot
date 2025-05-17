import { combineReducers } from "@reduxjs/toolkit";
import bulkStorageReducer from "./bulkStorageReducer";
import cartStorageReducer from "./cartStorageReducer";

const rootReducer = combineReducers({
    bulkStorage: bulkStorageReducer,
    cartStorage: cartStorageReducer
});

export default rootReducer;
