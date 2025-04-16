import { Node } from "@babel/types";
import { BabelFile } from "@/src/core/parse/type";
import { parse, ParseResult } from "@babel/parser";

// 定义一个步骤的接口
interface Step {
  node: Node;
  execute: (variables: Record<string, any>) => void;
}

// 解析代码为 AST
export function parseCode(code: string): ParseResult<BabelFile> {
  return parse(code, {
    sourceType: "module",
    plugins: ["typescript"], // 支持 TypeScript 语法
    tokens: true,
    errorRecovery: true,
  });
}

// 将 AST 转换为步骤
export function createSteps(ast: ParseResult<BabelFile>): Step[] {
  const steps: Step[] = [];

  // 遍历 AST，将每个节点转化为步骤
  // for (const node of ast.program.body) {
  //   // traverseNode(node);
  // }
  // function traverseNode(node: ParseResult<BabelFile>) {
  //   console.log(node.type);
  //   if (
  //     node.type === "VariableDeclaration" ||
  //     node.type === "AssignmentExpression"
  //   ) {
  //     steps.push({
  //       node,
  //       execute: (variables) => {
  //         const variableName = (node as any).declarations[0].id.name;
  //         let value = (node as any).declarations[0].init;
  //         if (value.type === "Literal") {
  //           variables[variableName] = value.value;
  //         }
  //         console.log(`${variableName} = ${variables[variableName]}`);
  //       },
  //     });
  //   } else if (node.type === "ExpressionStatement") {
  //     steps.push({
  //       node,
  //       execute: (variables) => {
  //         // 处理表达式
  //         const expr = (node as any).expression;
  //         if (expr.type === "BinaryExpression") {
  //           const left = expr.left.name;
  //           const right = expr.right.value;
  //           variables[left] = variables[left] ? variables[left] + right : right;
  //           console.log(`${left} = ${variables[left]}`);
  //         }
  //       },
  //     });
  //   } else if (node.type === "ReturnStatement") {
  //     steps.push({
  //       node,
  //       execute: (variables) => {
  //         const value = (node as any).argument.value;
  //         console.log("Returning:", value);
  //       },
  //     });
  //   }
  //   // 递归遍历子节点
  //   if (node.body) {
  //     node.body.forEach(traverseNode);
  //   }
  // }

  return steps;
}

// 模拟逐步执行
// export async function stepExecution(steps: Step[]) {
//   const variables: Record<string, any> = {};

//   for (let i = 0; i < steps.length; i++) {
//     const step = steps[i];
//     console.log(`Executing step ${i + 1}: ${generator(step.node).code}`);
//     step.execute(variables);
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // 每步停顿1秒
//   }
// }

// // 跳转到指定步骤
// export function jumpToStep(steps: Step[], stepNumber: number) {
//   const step = steps[stepNumber - 1];
//   const variables: Record<string, any> = {};
//   step.execute(variables);
//   console.log(`Jumped to step ${stepNumber}: ${generator(step.node).code}`);
// }
