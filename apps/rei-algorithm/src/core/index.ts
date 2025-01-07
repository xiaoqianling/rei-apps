import parser from "@babel/parser";

const code = `
const list = [1, 2, 3];
list.push(4);
`;

const ast = parser.parse(code, {
  sourceType: "module", // 指定源代码类型，可以是 'script' 或 'module'
});

console.log(ast);
