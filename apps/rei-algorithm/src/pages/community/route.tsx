import { Post } from "@/src/components/community";
import { MockPost } from "@/src/components/community/type/mock";
import { RouteObject } from "react-router";

export const communityRouter: RouteObject[] = [
  {
    path: "",
    element: <Post post={MockPost} />,
    index: true,
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
