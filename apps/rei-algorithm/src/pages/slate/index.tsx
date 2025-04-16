import { FunctionComponent } from "react";
import { VisualPanel } from "@/src/components/visual";
import { useOpenState } from "@/src/hooks";
import QuillEditor from "./quill";

interface SlatePageProps {}

const SlatePage: FunctionComponent<SlatePageProps> = () => {
  const [visible, open, close] = useOpenState(true);

  return (
    <div>
      <h2>TEST Page</h2>
      <hr />
      <QuillEditor />
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
