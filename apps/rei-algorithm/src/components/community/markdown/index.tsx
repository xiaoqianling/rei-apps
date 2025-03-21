import { FunctionComponent } from "react";
import Markdown from "react-markdown";
import { MarkdownContent } from "../type/content";

interface PostMarkdownProps {
  markdown: MarkdownContent;
}

const PostMarkdown: FunctionComponent<PostMarkdownProps> = ({ markdown }) => {
  return <Markdown>{markdown.content}</Markdown>;
};

export default PostMarkdown;
