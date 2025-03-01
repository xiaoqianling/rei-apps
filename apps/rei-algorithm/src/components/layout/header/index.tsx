import styles from "./index.module.scss";
import HeaderLink from "./header-link";
import ReiLOGO from "../../custom/logo";
import Github from "@icon-park/react/lib/icons/Github";

function LayoutHeader() {
  return (
    <div className={styles.header}>
      <ReiLOGO />
      <div className={styles.links}>
        <HeaderLink to="/">首页</HeaderLink>
        <HeaderLink to="/learn">开始使用</HeaderLink>
        <HeaderLink to="/docs">文档</HeaderLink>
        <HeaderLink to="/slate">杂项</HeaderLink>
        <HeaderLink to="/community">社区</HeaderLink>
        <HeaderLink to="/about">关于</HeaderLink>
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
