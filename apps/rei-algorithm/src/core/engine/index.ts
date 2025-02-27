import { parse, ParseResult } from "@babel/parser";
import { AST } from "./type";
import { VisualConfig } from "../parse/type";
import { parseCode } from "../parse/parse";

// 整合代码执行流程
class VisualizationEngine {
  visualConfig: VisualConfig = {
    variables: new Map(),
    steps: [],
  };
  constructor(code: string) {
    this.visualConfig = parseCode(code); // 使用Babel解析代码结构
    this.steps = this.extractSteps(); // 提取执行步骤
    this.stateSnapshots = []; // 状态快照数组
    this.currentStep = 0;

    // 创建沙箱环境
    this.sandbox = new Proxy(
      {},
      {
        get: (target, prop) => {
          if (prop === "map") return this.proxyHandler; // 拦截关键对象
          return target[prop];
        },
      },
    );
  }

  // 使用Babel解析代码生成AST
  parseAST(code: string) {
    return parse(code, {
      sourceType: "module",
      plugins: ["jsx"],
    });
  }
}
