import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";

// Lazy load the page components with correct paths
const CommunityHome = lazy(() => import("."));
const CreatePostPage = lazy(() => import("./pages/create")); // Correct path
const UserProfilePage = lazy(() => import("./pages/profile")); // Correct path
const BlogArticlePage = lazy(() => import("./article")); // Try importing the specific file path

export const communityRouter: RouteObject[] = [
  {
    path: "", // Base path for community: /community
    element: <CommunityHome />,
    index: true, // Keep index route for base path
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
    path: "article/:articleId",
    element: <BlogArticlePage />,
  },
  // --- Remove or comment out unused routes ---
  // {
  //   path: "mock",
  //   element: <Blog blog={post1} />,
  // },
  // {
  //   path: "i",
  //   element: <> </>,
  // },
  // {
  //   path: "list",
  //   element: <></>,
  // },
];
