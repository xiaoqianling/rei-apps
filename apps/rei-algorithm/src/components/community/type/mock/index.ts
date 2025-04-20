import { ContentTypes } from "../content";
import { BlogDetail } from "..";
import { TagTypes } from "../../components/blog/tag/type";
import { TipLevelsTypes } from "../../components/tip";

export const post1: BlogDetail = {
  pid: "mock-id-2",
  title: "深入理解React Hooks：从基础到高级用法",
  username: "react-expert",
  userLink: "/user/react-expert",
  contents: [
    {
      type: ContentTypes.MARKDOWN,
      content: `

# React Hooks 全面指南 第一个标题测试宽度宽度宽度宽度


graph TD
    A[可视化核心] --> B[自由构建模式]
    A --> C[算法演示模式]
    B --> D[节点交互系统]
    B --> E[动态渲染引擎]
    C --> F[算法执行器]
    C --> G[动画控制器]

# React Hooks 全面指南

## 什么是React Hooks？
React Hooks是React 16.8引入的新特性，它允许你在函数组件中使用state和其他React特性。

## 基础Hooks

### useState
\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### useEffect
\`\`\`jsx
function Example() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []); // 空数组表示只在组件挂载时执行

  return <div>{data ? data.message : 'Loading...'}</div>;
}
\`\`\`

## 高级用法

### 自定义Hook
\`\`\`javascript
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
\`\`\`

## 性能优化

### useMemo
\`\`\`jsx
function ExpensiveComponent({ a, b }) {
  const result = useMemo(() => {
    // 复杂计算
    return a * b;
  }, [a, b]);

  return <div>{result}</div>;
}
\`\`\`

### useCallback
\`\`\`jsx
function ParentComponent() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <ChildComponent onClick={increment} />;
}
\`\`\`
      `,
    },
    {
      type: ContentTypes.TIP,
      content: "使用Hooks时，请确保遵守Hooks的规则，特别是在条件语句和循环中。",
      level: TipLevelsTypes.TIP,
    },
    {
      type: ContentTypes.TIP,
      content: "过度使用useEffect可能导致性能问题，请谨慎使用。",
      level: TipLevelsTypes.WARNING,
    },
    {
      type: ContentTypes.TIP,
      content: "在类组件中不能直接使用Hooks，请考虑重构为函数组件。",
      level: TipLevelsTypes.ERROR,
    },
    {
      type: ContentTypes.CODE,
      metadata: [
        {
          language: "javascript",
          code: "console.log('Hello, World!');",
        },
        {
          language: "python",
          code: "print('Hello, World!')",
        },
        {
          language: "java",
          code: "System.out.println('Hello, World!');",
        },
      ],
    },
    {
      type: ContentTypes.FOLD,
      content: "测试文本",
      title: "折叠标题",
    },
    {
      type: ContentTypes.MARKDOWN,
      content: "### Mermaid支持！\n #### graph TD",
    },
    {
      type: ContentTypes.MERMAID,
      content: `
graph TD
  A[可视化核心] --> B[自由构建模式]
  A --> C[算法演示模式]
  B --> D[节点交互系统]
  B --> E[动态渲染引擎]
  C --> F[算法执行器]
  C --> G[动画控制器]
  `,
    },
    {
      type: ContentTypes.MARKDOWN,
      content: "#### flowchart LR",
    },
    {
      type: ContentTypes.MERMAID,
      content: `
flowchart LR
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
      `,
    },
    {
      type: ContentTypes.VISUAL,
      content: "",
    },
  ],
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date(),
  tags: [TagTypes.TECH],
};

export const AlgorithmStationIntro: BlogDetail = {
  pid: "algorithm-station-intro",
  title: "欢迎来到算法站：你的算法学习与实践平台",
  username: "admin",
  userLink: "/user/admin",
  contents: [
    {
      type: ContentTypes.MARKDOWN,
      content: `
# 欢迎来到算法站

## 关于我们
算法站是一个专注于算法学习与实践的在线平台。我们致力于为开发者、学生和算法爱好者提供一个交流、学习和提升的社区。

## 主要功能

### 1. 算法学习
- 提供从基础到高级的算法教程
- 涵盖数据结构、算法设计、复杂度分析等内容
- 丰富的代码示例和实践练习

### 2. 在线编程
- 支持多种编程语言（JavaScript, Python, Java, C++等）
- 实时代码运行和调试
- 自动测试用例验证

### 3. 社区交流
- 分享算法学习心得
- 讨论算法问题与解决方案
- 参与算法挑战和竞赛

### 4. 资源中心
- 精选算法书籍推荐
- 实用工具和插件
- 面试题库和技巧分享
      `,
    },
    {
      type: ContentTypes.TIP,
      content: "建议初学者从基础算法开始学习，逐步提升难度。",
      level: TipLevelsTypes.TIP,
    },
    {
      type: ContentTypes.TIP,
      content: "在提交代码前，请确保已经充分测试，避免不必要的错误。",
      level: TipLevelsTypes.WARNING,
    },
    {
      type: ContentTypes.TIP,
      content: "请勿在社区发布与算法无关的内容或广告，违者将被封禁。",
      level: TipLevelsTypes.ERROR,
    },
    {
      type: ContentTypes.CODE,
      metadata: [
        {
          language: "python",
          code: "def hello_world():\n    print('Hello, Algorithm Station!')",
        },
        {
          language: "javascript",
          code: "console.log('Welcome to Algorithm Station!')",
        },
        {
          language: "java",
          code: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println('Hello, Algorithm Station!');\n    }\n}",
        },
        {
          language: "csharp",
          code: "using System;\n\npublic class HelloWorld {\n    public static void Main() {\n        Console.WriteLine('Hello, Algorithm Station!');\n    }\n}",
        },
      ],
    },
    {
      type: ContentTypes.MARKDOWN,
      content: `
## 如何开始？

1. 注册账号并完善个人信息
2. 选择适合你的学习路径
3. 参与社区讨论和算法挑战
4. 持续学习和提升你的算法能力

> 还有一些markdown支持

## 联系我们
如有任何问题或建议，请通过以下方式联系我们：
- 邮箱：support@algorithmstation.com
- 官方论坛：[https://forum.algorithmstation.com](https://forum.algorithmstation.com)
- 社交媒体：@AlgorithmStation
      `,
    },
  ],
  createdAt: new Date("2023-10-01"),
  updatedAt: new Date(),
  tags: [TagTypes.TECH],
};
