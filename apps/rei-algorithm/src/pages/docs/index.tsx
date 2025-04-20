import DocsSidebar from "@/src/components/common/sidebar";
import styles from "./index.module.scss";
import { Outlet } from "react-router";
import { docsMenuData } from "./type";

interface Props {
  children?: React.ReactNode;
}

function VisualPage({ children }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <DocsSidebar menuData={docsMenuData} prefix="/docs" />
      </div>
      <div className={styles.right}>
        <Outlet />
      </div>
    </div>
  );
}

export default VisualPage;
