import { forwardRef, FunctionComponent, useCallback, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import { SlateMock } from "../../slate/slateEditor/mock";
import { withHistory } from "slate-history";
import { Element, Leaf } from "@/src/components/slate/slateEditor/element";

interface SlateRendererProps {
  data?: Descendant[];
}

const SlateRenderer = forwardRef<HTMLDivElement, SlateRendererProps>(
  ({ data }, ref) => {
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
          ref={ref}
          readOnly
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    );
  },
);

export default SlateRenderer;
