import { BlogPost } from "../post";
import { TagTypes } from "../tag";

export const MockPost: BlogPost = {
  id: "mock-id",
  title: "mock-title",
  contents: [
    {
      type: "markdown",
      content: "# mock-content",
    },
    {
      type: "code",
      content: "mock-code",
      metadata: {
        language: "mock-language",
      },
    },
  ],
  createdAt: new Date("2022-01-01"),
  updatedAt: new Date(),
  tags: [TagTypes.TECH],
};
