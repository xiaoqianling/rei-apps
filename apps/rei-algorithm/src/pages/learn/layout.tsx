import styles from "./index.module.scss";
import Sidebar from "@/src/components/common/sidebar";
import { Outlet } from "react-router-dom";
import { learnMenuData } from "./route";
import Anchor from "@/src/components/community/article/Anchor";
import { useSelector } from "@/src/lib/redux";
import { selectAnchorItems } from "@/src/lib/redux/anchor";

function LearnPageLayout() {
  const anchorItems = useSelector(selectAnchorItems);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Sidebar menuData={learnMenuData} prefix="/learn" />
      </div>
      <div className={styles.right}>
        <div className={styles.main}>
          <Outlet />
        </div>
        <div className={styles.anchor}>
          <Anchor items={anchorItems} />
        </div>
      </div>
    </div>
  );
}

export default LearnPageLayout;
