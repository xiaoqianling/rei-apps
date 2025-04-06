import { post1 } from "@/src/components/community/type/mock";
import { RouteObject } from "react-router";
import CommunityPage from ".";
import BlogPage from "./article";
import { Blog } from "@/src/components/community";

export const communityRouter: RouteObject[] = [
  {
    path: "",
    element: <CommunityPage />,
    index: true,
  },
  {
    path: "create-post",
    element: <></>,
  },
  {
    path: "mock",
    element: <Blog blog={post1} />,
  },
  {
    path: "i",
    element: <> </>,
  },
  {
    path: "list",
    element: <></>,
  },
  {
    // post/:id 如何获取参数？
    path: "post/:id",
    element: <BlogPage />,
  },
];
