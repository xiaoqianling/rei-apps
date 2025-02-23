import "./index.scss";
import VisualCode from "@/src/components/visual-code";
import { ReactEditor } from "slate-react";
import { BaseEditor } from "slate";

function LearnPage() {
  return (
    <div>
      学习页面:
      <VisualCode />
    </div>
  );
}

export default LearnPage;
