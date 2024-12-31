import {configureStore, UnknownAction} from "@reduxjs/toolkit";
import { reducer } from "./reducer";

export const reduxStore = configureStore({
    reducer
})
