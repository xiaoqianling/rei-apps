import { RouteObject } from "react-router";
// MDX
import StartPage from "@/src/docs/getting-start.mdx";
import About from "@/src/docs/about.mdx";

export const docsRouter: RouteObject[] = [
  {
    path: "",
    element: <div>开始！</div>,
    index: true,
  },
  {
    path: "getting-start",
    element: <StartPage />,
  },
  ,
  {
    path: "about",
    element: <About />,
  },
];
