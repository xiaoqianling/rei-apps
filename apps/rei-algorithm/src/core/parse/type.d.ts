export type VisualConfig = {
  variables: Map<string, unknown>;
  steps: Step[];
};

export type BabelFile = _babel_types.File;

// babel AST结点类型
export enum BabelNodeType {
  // 变量声明
  VariableDeclaration = "VariableDeclaration",
  // 赋值表达式
  AssignmentExpression = "AssignmentExpression",
  // 表达式语句
  ExpressionStatement = "ExpressionStatement",
  // 返回语句
  ReturnStatement = "ReturnStatement",
}
