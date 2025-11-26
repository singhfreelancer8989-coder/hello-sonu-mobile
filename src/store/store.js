import { configureStore } from "@reduxjs/toolkit";

import propertyReducer from "./slices/propertySlices";

export const store = configureStore({
  reducer: {
    property: propertyReducer,
  },
});
