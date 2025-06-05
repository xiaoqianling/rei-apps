import { FunctionComponent } from "react";
import VisualEditor from "@/src/components/engine/visual/editor";

interface SlatePageProps {}

const SlatePage: FunctionComponent<SlatePageProps> = () => {
  return (
    <>
      {/* <VisualPanel /> */}
      <VisualEditor />
      {/* <FreeMoveContainer visible={visible} onClose={close}>
        <ResizeContainer initWidth={800} initHeight={600}>
          <VisualPanel />
        </ResizeContainer>
      </FreeMoveContainer> */}
    </>
  );
};

export default SlatePage;
