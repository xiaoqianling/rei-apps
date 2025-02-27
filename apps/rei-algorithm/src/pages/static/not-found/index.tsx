import { Link } from "react-router";
import styles from "./index.module.scss";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ReiButton from "@/src/components/custom/button";

function ReiNotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.lottieContainer}>
        <DotLottieReact src="/lotties/not-found.lottie" loop autoplay />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>404 - 页面未找到</h1>
        <p className={styles.description}>
          您访问的页面可能已被移动、删除或暂时不可用
        </p>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => window.history.back()}
          >
            回到上一页
          </button>
          <Link to="/" className={styles.homeLink}>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReiNotFound;
