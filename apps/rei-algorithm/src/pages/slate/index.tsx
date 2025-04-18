import { FunctionComponent } from "react";
import { VisualPanel } from "@/src/components/visual";
import { useOpenState } from "@/src/hooks";
import RichTextEditor from "@/src/components/community/components/editor/RichTextEditor";

interface SlatePageProps {}

const SlatePage: FunctionComponent<SlatePageProps> = () => {
  const [visible, open, close] = useOpenState(true);

  return (
    <div style={{ padding: "0 5rem" }}>
      <h2>Create Blog</h2>
      <hr />
      <RichTextEditor />
      <hr />
      <VisualPanel />
      {/* <FreeMoveContainer visible={visible} onClose={close}>
        <ResizeContainer initWidth={800} initHeight={600}>
          <VisualPanel />
        </ResizeContainer>
      </FreeMoveContainer> */}
    </div>
  );
};

export default SlatePage;
