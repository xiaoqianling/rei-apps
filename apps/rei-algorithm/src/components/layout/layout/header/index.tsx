import styles from "./index.module.scss";
import HeaderLink from "./header-link";
import Github from "@icon-park/react/lib/icons/Github";
import ReiLOGO from "@/src/components/custom/logo";
import { ReactElement, ReactNode } from "react";

interface Props {
  children: ReactElement<typeof HeaderLink> | ReactElement<typeof HeaderLink>[];
}

function LayoutHeader({ children }: Props) {
  return (
    <div className={styles.header}>
      <ReiLOGO />
      <div className={styles.links}>
        {children}
        <HeaderLink
          to="https://github.com/xiaoqianling/rei-apps/tree/master/apps/rei-algorithm"
          target="blank"
        >
          <Github theme="outline" size="28" fill="#333" />
        </HeaderLink>
      </div>

      {/* TODO: 移动端打开侧边栏选择导航 */}
      <span className={styles.icon}>=</span>
    </div>
  );
}

export default LayoutHeader;
