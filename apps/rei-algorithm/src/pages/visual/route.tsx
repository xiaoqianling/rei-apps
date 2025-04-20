import SimulateSort from "@/src/components/senki/visual/sort";
import { RouteObject } from "react-router-dom";

// 附加到/docs/下的所有路由
export const docsRouter: RouteObject[] = [
  {
    path: "",
    element: <SimulateSort />,
    index: true,
  },
];
