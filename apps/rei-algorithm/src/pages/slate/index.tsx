import { FunctionComponent, useEffect } from "react";
import SaveEditor from "./saveEditor";
import { VisualPanel } from "@/src/components/visual";
import FreeMoveContainer from "@/src/components/container/freeMove";
import ResizeContainer from "@/src/components/container/resize";
import { useOpenState } from "@/src/hooks";

interface SlatePageProps {}

const SlatePage: FunctionComponent<SlatePageProps> = () => {
  const { visible, open, close } = useOpenState(true);

  return (
    <div>
      <h2>Slate Page</h2>
      <hr />
      {/* <SlateMarkdown /> */}
      <hr />
      <h2>可保存的编辑器</h2>
      <hr />
      <SaveEditor />
      <hr />
      <VisualPanel />
      <FreeMoveContainer visible={visible} onClose={close}>
        <ResizeContainer initWidth={800} initHeight={600}>
          <VisualPanel />
        </ResizeContainer>
      </FreeMoveContainer>
    </div>
  );
};

export default SlatePage;
