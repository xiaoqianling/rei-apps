import styles from "./index.module.scss";

function MainPage() {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.bg} />
        <div className={styles.overlay}>
          <h1>welcome to Rei Algorithm</h1>
          <p>
            你好，这是一个我的个人项目，致力于提供简单易懂的数据结构与算法学习方案
          </p>
        </div>
      </div>
      <div>
        <span>这是另一段文本</span>
      </div>
    </div>
  );
}

export default MainPage;
