import { post1 } from "@/src/components/community/type/mock";
import { RouteObject } from "react-router";
import CommunityPage from ".";
import BlogArticle from "../../components/community/article";
import { Blog } from "@/src/components/community";
import CreatePostPage from "./pages/create";
import UserProfilePage from "./pages/profile";

export const communityRouter: RouteObject[] = [
  {
    path: "",
    element: <CommunityPage />,
    index: true,
  },
  {
    path: "create", // Path: /community/create
    element: <CreatePostPage />,
  },
  {
    path: "profile/:userId",
    element: <UserProfilePage />,
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
    path: "article/:articleId",
    element: <BlogArticle />,
  },
];
