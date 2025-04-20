import { post1 } from "@/src/components/community/type/mock";
import { RouteObject } from "react-router";
import CommunityPage from ".";
import BlogPage from "./article";
import { Blog } from "@/src/components/community";
import CreatePage from "./create";
import SlateRenderer from "@/src/components/community/components/blog/slateRenderer";

export const communityRouter: RouteObject[] = [
  {
    path: "",
    element: <CommunityPage />,
    index: true,
  },
  {
    path: "create-post",
    element: <CreatePage />,
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
    path: "post/:id",
    element: <BlogPage />,
  },
];
