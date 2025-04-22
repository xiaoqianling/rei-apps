import { createBrowserRouter } from "react-router";
import Error from "../../pages/static/error";
import MainPage from "../../pages/static/home";
import NotFound from "../../pages/static/not-found";
import HomeLayout from "../../components/layout/homeLayout";
import AboutPage from "../../pages/static/about";
import VisualPage from "@/src/pages/visual";
import LearnPageLayout from "@/src/pages/learn/layout";
import SlatePage from "@/src/pages/playground";
import { docsRouter as visualRouter } from "@/src/pages/visual/route";
import { communityRouter } from "@/src/pages/community/route";
import { learnRouter } from "@/src/pages/learn/route";
import DemoPage from "@/src/pages/demo";

// 感觉把路由平行开来更好，比如/login与/同级 而非在/下
// 或者考虑嵌套层次，在需要layout的页面级下嵌套
export const reiRouter = createBrowserRouter([
  {
    caseSensitive: true,
    path: "/",
    hasErrorBoundary: true,
    handle: { rei: "rei handle info" }, // 传递额外信息的属性，在loader action element中使用
    errorElement: <Error />, // 路由错误显示
    element: <HomeLayout />, // 子元素自动嵌套在layout中
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
        path: "visual",
        element: <VisualPage />,
        children: visualRouter,
      },
      {
        path: "learn",
        element: <LearnPageLayout />,
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
      {
        path: "demo",
        element: <DemoPage />,
      },
      {
        path: "community",
        children: communityRouter,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
