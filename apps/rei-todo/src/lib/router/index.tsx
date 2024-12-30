import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { testLoader } from "./loader";
import Layout from "../../components/layout";
import ReiNotFound from "../../pages/not-found/not-fount";
import ReiError from "../../pages/error/error";

// 测试懒加载路由
const TestLazy = lazy(() => import("../../components/layout"));

export const reiRouter = createBrowserRouter([
  {
    caseSensitive: true,
    id: "root", // 不常用
    path: "/",
    loader: testLoader, // 异步加载数据函数
    action: async ({ request }) => {}, // 提交表单函数
    hasErrorBoundary: true,
    // ErrorBoundary: Layout,
    // shouldRevalidate: () => true, // 是否需要重新验证？TODO: 待补充
    handle: {rei: 'rei handle info'}, // 传递额外信息的属性，在loader action element中使用
    // hydrateFallbackElement: <></>, // SSR 数据加载之前的loading状态
    // HydrateFallback: Layout, // SSR 加载显示？
    errorElement: <ReiError />, // 路由错误显示
    // Component: Layout,  // 路由组件替代 早期方式
    // lazy: ()=>import('../../components/layout'),
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <div>home</div>,
      },
      {
        path: "page1",
        hasErrorBoundary: true,
        ErrorBoundary: ReiError,
        element: <div>page1</div>,
        loader: testLoader,
      },
      {
        path: "page2",
        element: <div>page1</div>,
      },
      {
        path: "loading",
        element: (
          <Suspense fallback={<TestLazy />}>
            <div>page1</div>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ReiNotFound />,
  },
]);
