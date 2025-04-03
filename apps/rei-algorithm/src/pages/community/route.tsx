import { Post } from "@/src/components/community";
import { post1 } from "@/src/components/community/type/mock";
import { RouteObject } from "react-router";
import CommunityPage from ".";
import PostPage from "./post";

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
    element: <Post post={post1} />,
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
    element: <PostPage />,
  },
];
