import { MenuItem } from "rei-design/menu/type";

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
        subItems: [
          {
            path: "about",
            label: "关于",
          },
          {
            path: "team",
            label: "团队",
          },
          {
            path: "contributors",
            label: "贡献者",
          },
        ],
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
