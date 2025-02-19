import { Link } from "react-router";
import styles from "./index.module.scss";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function ReiNotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.lottieContainer}>
        <DotLottieReact src="/lotties/not-found.lottie" loop autoplay />
      </div>
      <h1>找不到该页面!</h1>
      <p>请检查url或联系管理员</p>
      <div>
        <Link to="/">返回上一页</Link> {"  "}
        <Link to="/">返回首页</Link>
      </div>
    </div>
  );
}

export default ReiNotFound;
