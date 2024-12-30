import {configureStore, UnknownAction} from "@reduxjs/toolkit";

export const reduxStore = configureStore({
    reducer: function (state: any, action: UnknownAction) {
        // throw new Error("Function not implemented.");
    }
})
