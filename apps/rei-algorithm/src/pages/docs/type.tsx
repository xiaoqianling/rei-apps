import { RouteObject } from "react-router";
// MDX
import StartPage from "@/src/docs/getting-start.mdx";
import About from "@/src/docs/about.mdx";
import { MenuItem } from "rei-design/menu/type";

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
  {
    path: "about",
    element: <About />,
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
        path: "test",
        label: "Web Development 3123123123123123123",
        subItems: [
          {
            path: "test2",
            label: "Web Development2",
          },
        ],
      },
      {
        path: "app",
        label: "App Development",
      },
      {
        path: "getting-start",
        label: "起步",
      },
    ],
  },
  {
    path: "extend",
    label: "拓展能力",
  },
];
