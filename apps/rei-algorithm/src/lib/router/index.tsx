import { createBrowserRouter } from "react-router";
import Error from "../../pages/error";
import MainPage from "../../pages";
import NotFound from "../../pages/not-found";
import Layout from "../../components/layout";
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
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <div>login page2</div>,
  },
  {
    path: "/docs",
    element: <div>docs page</div>,
  },
  {
    path: "/about",
    element: <div>about page</div>,
  },
  {
    path: "/layout",
    element: <Layout />,
    children: [],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
