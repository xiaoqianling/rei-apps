import { parse } from "@babel/parser";
import { AST } from "../engine/type";
import { VisualConfig } from "./type";

const testCode = `var detectCycle = function(head) {
    let fast, slow;
    fast = slow = head;
    // @visualize color slow #99CCFF
    // @visualize color fast #99CC66
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        // 点击下面这一行代码，即可看到快慢指针追逐相遇
        if (fast == slow) break;
    }

    if (fast == null || fast.next == null) {
        // fast 遇到空指针说明没有环
        return null;
    }

    // 重新指向头结点
    slow = head;
    // 点击下面这一行代码，即可看到快慢指针同步前进，相交点就是环起点
    while (slow != fast) {
        fast = fast.next;
        slow = slow.next;
    }
    return slow;
};

let head = LinkedList.createCyclicHead([1,3,5,7,2,4], 2)
let result = detectCycle(head)`;

// 核心解析器类
export class CodeParser {
  private trackedObjects = new Map<string, any>();

  // 解析带有标记的代码
  parse(code: string): StepData[] {
    const steps: StepData[] = [];
    const lines = code.split("\n");

    lines.forEach((line, index) => {
      // 匹配自定义标记，例如 //@map map
      const marker = line.match(/\/\/@(\w+)\s+(\w+)/);
      if (marker) {
        const [_, type, objName] = marker;
        this.trackedObjects.set(objName, { type, history: [] });
        return;
      }

      // 检测跟踪对象的操作
      for (const [objName, data] of this.trackedObjects) {
        const methodCall = new RegExp(
          `${objName}\\.(put|get|remove|getTable)\\(`,
        );
        if (methodCall.test(line)) {
          steps.push(this.parseOperation(line, objName, index));
        }
      }
    });

    return steps;
  }

  private parseOperation(
    line: string,
    objName: string,
    lineNum: number,
  ): StepData {
    // 使用正则提取方法参数
    const match = line.match(new RegExp(`${objName}\\.(\\w+)\\(([^)]*)`));
    const [_, method, args] = match || [];

    return {
      line: lineNum,
      object: objName,
      method: method as "put" | "get" | "remove",
      args: args.split(",").map((s) => s.trim()),
      snapshot: null, // 需要与数据结构实现配合
    };
  }
}

// 步骤数据结构
export type StepData = {
  line: number;
  object: string;
  method: string;
  args: string[];
  snapshot: any; // 当前数据结构的快照
};
