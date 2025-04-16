import { ParseResult } from "@babel/parser";
import { BabelFile } from "./type";

// 处理AST 生成Steps
interface Step {
  node: Node;
  execute: (variables: Record<string, any>) => void;
}

export function transformAST(ast: ParseResult<BabelFile>): Step[] {
  const steps: Step[] = [];

  // 添加AST结构检查

  function traverseNode(node: ParseResult<BabelFile>) {
    console.log(node);
    if (
      node.type === "VariableDeclaration" ||
      node.type === "AssignmentExpression"
    ) {
      steps.push({
        node,
        execute: (variables) => {
          const variableName = (node as any).declarations[0].id.name;
          let value = (node as any).declarations[0].init;
          if (value.type === "Literal") {
            variables[variableName] = value.value;
          }
        },
      });
    } else if (node.type === "ExpressionStatement") {
      steps.push({
        node,
        execute: (variables) => {
          // 处理表达式
          const expr = (node as any).expression;
          if (expr.type === "BinaryExpression") {
            const left = expr.left.name;
            const right = expr.right.value;
            variables[left] = variables[left] ? variables[left] + right : right;
          }
        },
      });
    } else if (node.type === "ReturnStatement") {
      steps.push({
        node,
        execute: (variables) => {
          const value = (node as any).argument.value;
        },
      });
    }
    // 递归遍历子节点
    if (node.body) {
      node.body.body.forEach(traverseNode);
    }
  }

  // 遍历 AST，将每个节点转化为步骤
  for (const node of ast.program.body) {
    traverseNode(node);
  }
  return steps;
}
