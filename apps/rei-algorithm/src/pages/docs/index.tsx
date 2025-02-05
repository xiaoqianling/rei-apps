import DocsSidebar from "@/src/components/sidebar";
import styles from "./index.module.scss";
// import { TestMDX } from "@/src/docs/test.mdx";
import TestMDX from "@/src/docs/getting-start.mdx";
import { Outlet } from "react-router";

interface Props {
  children?: React.ReactNode;
}

function DocsPage({ children }: Props) {
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

export default DocsPage;
