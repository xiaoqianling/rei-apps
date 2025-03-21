import { AboutPage, AllInOnePage, DesignPage, StartPage } from "@/src/docs";
import { RouteObject } from "react-router-dom";

// 附加到/docs/下的所有路由
export const docsRouter: RouteObject[] = [
  {
    path: "",
    element: <StartPage />,
    index: true,
  },
  {
    path: "getting-start",
    element: <StartPage />,
  },
  {
    path: "about",
    element: <AboutPage />,
  },
  {
    path: "design",
    element: <DesignPage />,
  },
  {
    path: "all-in-one",
    element: <AllInOnePage />,
  },
];
