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
