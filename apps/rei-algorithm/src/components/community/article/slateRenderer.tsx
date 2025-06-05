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
import { getDocsByID } from "@/src/api/docs";

interface SlateRendererProps {
  data?: Descendant[];
  // [仅文档] 从目标接口获取数组
  id?: string;
}

// 用于渲染文档页和文章。文档页通过URL获取数据，因为文档页直接对应了路由。文章则外部请求数据交给组件渲染。
const SlateRenderer = forwardRef<HTMLDivElement, SlateRendererProps>(
  ({ data, id }, ref) => {
    const editorRef = useMemo(() => withHistory(withReact(createEditor())), []);
    const [slateData, setSlateData] = useState<Descendant[] | null>(
      data ?? (id ? null : SlateMock),
    );
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
      dispatch(setAnchorItems({ anchorItems: items }));

      return () => {
        dispatch(clearAnchorItems());
      };
    }, [data]);

    useEffect(() => {
      if (id) {
        getDocsByID(id).then((res) => {
          setSlateData(res);
        });
      }
    }, [id]);

    const renderElement = useCallback(
      (props: RenderElementProps) => <Element {...props} />,
      [],
    );

    const renderLeaf = useCallback(
      (props: RenderLeafProps) => <Leaf {...props} />,
      [],
    );

    if (!slateData) {
      return <div>Loading...</div>; // 或者其他加载状态的 UI
    }
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
