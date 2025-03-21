import { MockPost } from "@/src/community/mock";
import { renderPostContent } from "@/src/community/render";
import { RouteObject } from "react-router";

export const communityRouter: RouteObject[] = [
  {
    path: "",
    element: renderPostContent(MockPost.contents),
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
