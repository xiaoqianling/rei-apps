import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useDispatch } from "@/src/lib/redux";
import { clearAnchorItems, setAnchorItems } from "@/src/lib/redux/anchor";
import { parseBlogAnchors } from "../../slate/markdown/util";

interface SlateRendererProps {
  data?: Descendant[];
}

const SlateRenderer = forwardRef<HTMLDivElement, SlateRendererProps>(
  ({ data }, ref) => {
    const editorRef = useMemo(() => withHistory(withReact(createEditor())), []);
    const [slateData, setSlateData] = useState<Descendant[]>(data ?? SlateMock);
    const dispatch = useDispatch();
    const internalRef = useRef<HTMLDivElement | null>(null); // 内部 ref，用于保存 div 元素

    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node; // 保存内部 ref
        if (ref) {
          // 如果外部传递了 ref，就将 node 传递给外部 ref
          if (typeof ref === "function") {
            ref(node);
          } else {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
          }
        }
      },
      [ref],
    );

    useEffect(() => {
      const items = parseBlogAnchors(internalRef.current);
      console.log("items", items);
      dispatch(setAnchorItems({ anchorItems: items }));

      return () => {
        dispatch(clearAnchorItems());
      };
    }, [data]);

    const renderElement = useCallback(
      (props: RenderElementProps) => <Element {...props} />,
      [],
    );

    const renderLeaf = useCallback(
      (props: RenderLeafProps) => <Leaf {...props} />,
      [],
    );

    return (
      <Slate editor={editorRef} initialValue={slateData}>
        <Editable
          ref={combinedRef}
          readOnly
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    );
  },
);

export default SlateRenderer;
