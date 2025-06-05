import { RouteObject } from "react-router-dom";
import VisualHome from "./home";
import VisualSimulator from "@/src/components/engine/visual/simulator";

// 附加到/docs/下的所有路由
export const docsRouter: RouteObject[] = [
  {
    path: "",
    element: <VisualHome />,
    index: true,
  },
  {
    path: "detail/:id",
    element: <VisualSimulator />,
  },
];
