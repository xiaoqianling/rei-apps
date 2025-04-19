import { FunctionComponent, useCallback, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import { SlateMock } from "../editor/mock";
import { withHistory } from "slate-history";
import {
  Element,
  Leaf,
} from "@/src/components/community/components/editor/element";

interface SlateRendererProps {
  data?: Descendant[];
}

const SlateRenderer: FunctionComponent<SlateRendererProps> = () => {
  const editorRef = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  return (
    <Slate editor={editorRef} initialValue={SlateMock}>
      <Editable
        readOnly
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
};

export default SlateRenderer;
