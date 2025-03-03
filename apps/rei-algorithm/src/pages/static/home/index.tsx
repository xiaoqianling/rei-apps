import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import styles from "./index.module.scss";
import GradientText from "@/src/components/GradientText/GradientText";

function MainPage() {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.bg}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.svg_background}
          ></svg>
        </div>
        <div className={styles.overlay}>
          <div className={styles.desc}>
            <h1>
              welcome to{" "}
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={5}
                showBorder={false}
                className={styles.gradient}
              >
                Rei Algorithm
              </GradientText>
            </h1>
            <p>
              你好，这是一个我的个人项目，致力于提供简单易懂的数据结构与算法学习方案
            </p>
          </div>
          <div className={styles.lottie}>
            <DotLottieReact src="/lotties/code.lottie" loop autoplay />
          </div>
        </div>
      </div>
      <div>{/* TODO: */}</div>
    </div>
  );
}

export default MainPage;
