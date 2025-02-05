import DocsSidebar from "@/src/components/sidebar";
import styles from "./index.module.scss";
// import { TestMDX } from "@/src/docs/test.mdx";
import TestMDX from "@/src/docs/getting-start.mdx";

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
        <TestMDX
          components={{
            MyComponent: <div>MyComponent</div>,
          }}
        />
        {children}
      </div>
    </div>
  );
}

export default DocsPage;
