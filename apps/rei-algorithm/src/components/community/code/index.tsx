import { FunctionComponent } from "react";
import { CodeContent } from "../type/content";

interface PostCodeProps {
  code: CodeContent;
}

const PostCode: FunctionComponent<PostCodeProps> = ({ code }) => {
  return (
    <div>
      {code.content}-{code.metadata.language}
    </div>
  );
};

export default PostCode;
