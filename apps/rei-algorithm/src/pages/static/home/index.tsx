import React from 'react';
import styles from './index.module.scss';
import HeroSection from './components/HeroSection';
import FeatureCard from './components/FeatureCard';
import HighlightSection from './components/HighlightSection';
// import { Link } from 'react-router-dom'; // 如果需要链接到其他页面

// 模拟的特性数据
const features = [
  { icon: '💡', title: '交互式学习', description: '结合代码与可视化，深入理解数据结构与算法原理。' },
  { icon: '🖼️', title: '算法可视化库', description: '探索丰富的官方与用户分享的可视化实例。' },
  { icon: '✏️', title: '可视化编辑器', description: '使用我们的API，轻松创建并分享你自己的算法可视化。' },
  { icon: '💬', title: '开发者社区', description: '讨论、提问、分享见解，与他人共同进步。' },
  { icon: '💖', title: '免费开源', description: '我们相信知识共享的力量，完全免费且代码开源。' },
];

const StaticHomePage: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <HeroSection />

      {/* 特性区域 */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionHeading}>核心功能</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              iconPlaceholder={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* 可视化学习亮点 */}
      <HighlightSection
        title="告别枯燥，拥抱直观"
        description="传统的文字和静态代码往往难以完全展现算法的动态执行过程。我们通过实时交互的可视化，让你清晰地看到每一步操作，真正理解算法的精髓。"
        imagePlaceholderText="[此处应有可视化学习组件的截图/动图]"
        imageOnLeft={false} // 图片在右
      />

      {/* 编辑器亮点 */}
      <HighlightSection
        title="创建你的专属可视化"
        description="提供强大的可视化API和在线编辑器，无论你是想验证想法，还是分享独特的算法实现，都可以轻松创建出交互式的可视化效果，并一键分享到算法广场。"
        imagePlaceholderText="[此处应有编辑器界面的截图/动图]"
        imageOnLeft={true} // 图片在左
      />

      {/* 社区预告 */}
      <section className={styles.communitySection}>
         <h2 className={styles.sectionHeading}>加入我们的社区</h2>
         <p className={styles.communityText}>
           在这里，你可以提问、解答、分享你的学习心得和可视化作品。
           与其他学习者和开发者交流，共同构建一个活跃的算法爱好者社区。
         </p>
         {/* <Link to="/community" className={styles.communityButton}>前往社区</Link> */}
         <button className={styles.communityButton}>(社区链接占位)</button>
         {/* 可以在此添加一些社区相关的视觉元素占位符 */}
      </section>

      {/* 开源宣告 */}
       <section className={styles.openSourceSection}>
         <h2 className={styles.sectionHeading}>拥抱开源</h2>
         <p className={styles.openSourceText}>
           本项目完全免费且开源，我们欢迎任何形式的贡献。
           访问我们的 GitHub 仓库，一同参与改进！
         </p>
         <a href="#" /* Replace with actual GitHub link */ className={styles.githubLink}>
           {/* Placeholder for GitHub Icon */}
           <span className={styles.githubIcon}> G </span>
           访问 GitHub
         </a>
      </section>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Rei-Apps Algo Platform. 保留所有权利。</p>
        {/* Add other footer links if needed */}
      </footer>
    </div>
  );
};

export default StaticHomePage;
