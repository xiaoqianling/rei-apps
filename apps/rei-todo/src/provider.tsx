import React, { FunctionComponent, ReactNode } from "react";
import { Provider } from "react-redux";
import { reiRouter } from "./lib/router";
import { RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import { reduxStore } from "./lib/redux";

interface ReiProviderProps {
}

const ReiProvider: FunctionComponent<ReiProviderProps> = () => {
  return (
    <> 
      <Provider store={reduxStore}>
          {/* 布局在router内组织 */}
          <RouterProvider router={reiRouter}/>
      </Provider>
    </>
  );
};

export default ReiProvider;
