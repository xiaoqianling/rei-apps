import { BlogPost } from "../post";
import { TagTypes } from "../tag";

export const MockPost: BlogPost = {
  id: "mock-id",
  title: "没有Manus邀请码？试试免邀请码的MGX或者开源的OpenManus吧",
  username: "mock-username",
  userLink: "mock-userLink",
  contents: [
    {
      type: "markdown",
      content: `
  # 一级标题
  # 一级标题
  这是一个段落。
  > 这是一个引用。
  - 这是一个无序列表。
  - 这是第二个项目。
  - 这是第三个项目。
    - 这是一个嵌套的项目。
    
  这是一个段落。
  ## 二级标题
  ### 三级标题
  #### 四级标题
  这是一个段落。
  > 这是一个引用。
  - 这是一个无序列表。
  - 这是第二个项目。
  - 这是第三个项目。
    - 这是一个嵌套的项目。
  \`\`\` javascript
  public class HelloWorld {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
    } 
  }
  \`\`\`
      `,
    },
    {
      type: "tip",
      content: "这是一个提示。",
      level: "tip",
    },
    {
      type: "tip",
      content: "这是一个警告。",
      level: "warning",
    },
    {
      type: "tip",
      content: "这是一个禁止。",
      level: "error",
    },
    {
      type: "code",
      metadata: [
        ["javascript", "console.log('Hello, World!');"],
        ["python", "print('Hello, World!')"],
        ["java", "System.out.println('Hello, World!');"],
        ["csharp", "Console.WriteLine('Hello, World!');"],
      ],
    },
  ],
  createdAt: new Date("2022-01-01"),
  updatedAt: new Date(),
  tags: [TagTypes.TECH, TagTypes.BUG],
};

export const post1: BlogPost = {
  id: "mock-id-2",
  title: "深入理解React Hooks：从基础到高级用法",
  username: "react-expert",
  userLink: "/user/react-expert",
  contents: [
    {
      type: "markdown",
      content: `
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
      type: "tip",
      content: "使用Hooks时，请确保遵守Hooks的规则，特别是在条件语句和循环中。",
      level: "tip",
    },
    {
      type: "tip",
      content: "过度使用useEffect可能导致性能问题，请谨慎使用。",
      level: "warning",
    },
    {
      type: "tip",
      content: "在类组件中不能直接使用Hooks，请考虑重构为函数组件。",
      level: "error",
    },
    {
      type: "code",
      metadata: [
        ["javascript", "const [state, setState] = useState(initialState);"],
        [
          "typescript",
          "const [state, setState] = useState<Type>(initialState);",
        ],
        [
          "react",
          "function MyComponent() {\n  const [count, setCount] = useState(0);\n  return <div>{count}</div>;\n}",
        ],
        ["react-native", "const [isLoading, setIsLoading] = useState(false);"],
      ],
    },
  ],
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date(),
  tags: [TagTypes.TECH],
};
