import { Post } from "@/src/components/community";
import { post1 } from "@/src/components/community/type/mock";
import { RouteObject } from "react-router";

export const communityRouter: RouteObject[] = [
  {
    path: "",
    element: <Post post={post1} />,
    index: true,
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
    path: "detail",
    element: <></>,
  },
];
