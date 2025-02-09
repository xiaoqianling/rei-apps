# 可视化设计

## 核心设计

- 可视化核心：提供自由构建模式和算法演示模式，支持用户通过拖拽节点和连接来构建可视化图形，并通过算法执行器来执行算法演示。

```mermaid
graph TD
    A[可视化核心] --> B[自由构建模式]
    A --> C[算法演示模式]
    B --> D[节点交互系统]
    B --> E[动态渲染引擎]
    C --> F[算法执行器]
    C --> G[动画控制器]
```

- 自由构建模式：

  ```TS
    // 链表节点数据模型
  interface LinkedListNode {
  id: string; // UUID
  value: number;
  nextId: string | null;
  position: { x: number; y: number };
  }
  // 全局状态管理（Redux）
  interface LinkedListState {
    nodes: Record<string, LinkedListNode>;
    headId: string | null;
    selectedNodeId: string | null;
  }
  ```

```mermaid
flowchart TD
  前端状态 --> 操作指令(新增/删除/连接)
  操作指令 --> 后端接口
  后端接口 --> 算法引擎
  算法引擎 --> 步骤序列
  步骤序列 --> 动画系统
  动画系统 --> 前端状态
```

```mermaid
sequenceDiagram
    用户->>前端: 选择算法（如反转链表）
    前端->>后端: POST /algo/linkedlist/reverse
    后端->>算法引擎: 执行算法并生成步骤
    算法引擎-->>后端: 返回步骤数据
    后端-->>前端: 结构化响应
    前端->>动画系统: 加载步骤数据
    用户->>控制台: 点击播放
    控制台->>动画系统: 启动分步渲染
```

操作指令生命周期

```mermaid
sequenceDiagram
    participant Frontend
    participant Backend
    participant Algorithm

    Frontend->>Backend: POST /algo/reverse (当前链表状态)
    Backend->>Algorithm: 执行算法逻辑
    Algorithm->>Backend: 生成步骤序列
    Backend->>Frontend: 返回步骤数组
    Frontend->>Animation: 按步骤播放
    Animation->>Redux: dispatch每一步的action
    Redux->>UI: 触发界面更新
```

动态输入处理流程：

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend

    User->>Frontend: 输入[5,2,8,3]
    Frontend->>Backend: POST /build {"values":[5,2,8,3]}
    Backend->>Backend: 生成链表结构
    Backend-->>Frontend: 返回初始可视化状态
    Frontend->>Frontend: 渲染初始链表
    User->>Frontend: 点击"反转"
    Frontend->>Backend: POST /reverse
    Backend->>Backend: 执行算法生成步骤
    Backend-->>Frontend: 返回步骤数组
    Frontend->>Frontend: 播放动画
```

ER:

```mermaid
erDiagram
    USER ||--o{ ALGORITHM : owns
    USER ||--o{ POST : writes
    ALGORITHM ||--o{ ALGO_VERSION : has
    POST ||--o{ EMBEDDED_ALGO : contains

    USER {
        string id PK
        string username
        string email
    }
    ALGORITHM {
        string id PK
        string name
        json config
    }
    POST {
        string id PK
        text content
        timestamp created
    }
    EMBEDDED_ALGO {
        string postId FK
        string algorithmId FK
        json snapshot
    }
```
