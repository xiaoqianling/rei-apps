import VisualCode from "@/src/components/visual-code";
import { ReactEditor } from "slate-react";
import { BaseEditor } from "slate";
import styles from "./index.module.scss";
import DocsSidebar from "@/src/components/sidebar";
import { Outlet } from "react-router-dom";

function LearnPage() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <DocsSidebar />
      </div>
      <div className={styles.right}>
        {/* <TestMDX
          components={{
            MyComponent: <div>MyComponent</div>,
          }}
        /> */}
        <Outlet />
      </div>
    </div>
  );
}

export default LearnPage;
