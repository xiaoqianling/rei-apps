import { createBrowserRouter } from "react-router";
import Error from "../../pages/static/error";
import MainPage from "../../pages/static/home";
import NotFound from "../../pages/static/not-found";
import Layout from "../../components/layout/homoLayout";
import AboutPage from "../../pages/static/about";
import DocsPage from "@/src/pages/docs";
import LearnPage from "@/src/pages/learn";
import SlatePage from "@/src/pages/slate";
import { docsRouter } from "@/src/pages/docs/route";
import CommunityLayout from "@/src/components/layout/communityLayout";
import { communityRouter } from "@/src/pages/community/route";
import { learnRouter } from "@/src/pages/learn/route";

// 感觉把路由平行开来更好，比如/login与/同级 而非在/下
// 或者考虑嵌套层次，在需要layout的页面级下嵌套
export const reiRouter = createBrowserRouter([
  {
    caseSensitive: true,
    path: "/",
    hasErrorBoundary: true,
    handle: { rei: "rei handle info" }, // 传递额外信息的属性，在loader action element中使用
    errorElement: <Error />, // 路由错误显示
    element: <Layout />, // 子元素自动嵌套在layout中
    /**
     * 顶部导航栏 {@link LayoutHeader}
     */
    children: [
      {
        path: "",
        element: <MainPage />,
        index: true,
      },
      {
        path: "docs",
        element: <DocsPage />,
        children: docsRouter,
      },
      {
        path: "learn",
        element: <LearnPage />,
        children: learnRouter,
      },
      {
        path: "slate",
        element: <SlatePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
  {
    path: "/community",
    element: <CommunityLayout />,
    children: communityRouter,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
