import { combineReducers } from "@reduxjs/toolkit";
import bulkStorageReducer from "./bulkStorageReducer";

const rootReducer = combineReducers({
    bulkStorage: bulkStorageReducer,
    cartStorage: bulkStorageReducer,
});

export default rootReducer;
