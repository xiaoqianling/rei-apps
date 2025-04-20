import SimulateSort from "@/src/components/senki/visual/sort";
import { RouteObject } from "react-router-dom";
import VisualHome from "./home";

// 附加到/docs/下的所有路由
export const docsRouter: RouteObject[] = [
  {
    path: "",
    element: <VisualHome />,
    index: true,
  },
  {
    path: "detail/:id",
    element: <SimulateSort />,
  },
  {
    path: "tree/:id",
    element: <SimulateSort algoType="tree" />,
  },
  {
    path: "linear/:id",
    element: <SimulateSort algoType="linear" />,
  },
];
