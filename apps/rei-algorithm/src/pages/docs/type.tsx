import { RouteObject } from "react-router";
// MDX
import { MenuItem } from "rei-design/menu/type";
import VisualCode from "@/src/components/visual-code";
import { AboutPage, AllInOnePage, DesignPage, StartPage } from "@/src/docs";

// 附加到/docs/下的所有路由
export const docsRouter: RouteObject[] = [
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

// 此处定义路由文档路由层次
// TODO: 路由改成可以嵌套/docs/attribute/about 现状：/docs/about
export const docsMenuData: MenuItem[] = [
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
