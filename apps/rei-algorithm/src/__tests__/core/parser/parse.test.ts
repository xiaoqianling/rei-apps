import { initialCode } from "@/src/components/visual/panel/mock";
import { createSteps, stepExecution } from "@/src/core/parse";
import { BabelFile } from "@/src/core/parse/type";
import { parse, ParseResult } from "@babel/parser";
import { describe, expect, it } from "vitest";

// const ast = parseCode(code);
// const steps = createSteps(ast);

// // 执行代码，逐步执行
// stepExecution(steps);

// 跳转到第二步
// setTimeout(() => {
//   jumpToStep(steps, 2);
// }, 3000);

describe("代码解析器测试", () => {
  it("看看代码的AST", () => {
    const ast = parse(initialCode, {});
    expect(ast).toBeDefined();
    expect(ast).matchSnapshot();
  });

  it("模拟一下步进器", () => {
    const ast: ParseResult<BabelFile> = parse(initialCode);
    const steps = createSteps(ast);
    // expect(steps).matchSnapshot();
    console.log(steps);

    // 执行代码，逐步执行
    stepExecution(steps);
  });
});
