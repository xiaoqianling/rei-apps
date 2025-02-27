import styles from "./index.module.scss";
import DocsSidebar from "@/src/components/sidebar";
import { Outlet } from "react-router-dom";
import { learnMenuData } from "./route";

function LearnPage() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <DocsSidebar menuData={learnMenuData} prefix="/learn" />
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
