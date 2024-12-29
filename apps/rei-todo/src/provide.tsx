import React, { FunctionComponent, ReactNode } from "react";
import { Provider } from "react-redux";
import { reiRouter } from "./lib/router";
import { RouterProvider } from "react-router-dom";

interface ReiProviderProps {
  children: ReactNode;
}

const ReiProvider: FunctionComponent<ReiProviderProps> = ({ children }) => {
  return (
    <>
      <RouterProvider router={reiRouter}>
        <Provider store={undefined}>{children}</Provider>
      </RouterProvider>
    </>
  );
};

export default ReiProvider;
