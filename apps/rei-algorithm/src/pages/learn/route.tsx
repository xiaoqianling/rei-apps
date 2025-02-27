import VisualCode from "@/src/components/visual-code";
import { AboutPage, AllInOnePage, DesignPage, StartPage } from "@/src/docs";
import { RouteObject } from "react-router-dom";
import { MenuItem } from "rei-design/menu/type";

// 附加到/docs/下的所有路由
export const learnRouter: RouteObject[] = [
  {
    path: "",
    element: <StartPage components={{ VisualCode }} />,
    index: true,
  },
  {
    path: "getting-start",
    element: <StartPage components={{ VisualCode }} />,
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

// 渲染到menu的结构 应该和路由一致
export const learnMenuData: MenuItem[] = [
  {
    path: "",
    label: "开始",
    endPoint: true,
  },
  {
    path: "attribute",
    label: "特性",
    subItems: [
      {
        path: "about",
        label: "关于",
      },
      {
        path: "donate",
        label: "捐助",
      },
    ],
  },
  {
    path: "use",
    label: "使用",
    subItems: [
      {
        path: "getting-start",
        label: "起步",
      },
    ],
  },
  {
    path: "dev",
    label: "开发进展",
    subItems: [
      {
        path: "all-in-one",
        label: "All In One",
      },
      {
        path: "design",
        label: "设计",
      },
    ],
  },
];
