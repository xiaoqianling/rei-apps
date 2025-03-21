import { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";

// 注释标签补全选项
const tagOptions = [
  "color",
  "visual",
  "link",
  "param",
  "returns",
  "type",
  "comment",
].map((tag) => ({ label: "@" + tag, type: "keyword" }));

// 获取代码补全建议
function getCodeCompletions(
  context: CompletionContext,
): CompletionResult | null {
  const word = context.matchBefore(/\w*\.?\w*/);
  if (!word) return null;

  const text = word.text;
  const isDotAccess = text.includes(".");

  // 获取变量名
  const varName = isDotAccess ? text.split(".")[0] : text;

  // 根据变量类型提供不同的补全建议
  const completions = getCompletionsForVariable(varName);

  return {
    from: word.from,
    options: completions,
    validFor: /^\w*\.?\w*$/,
  };
}

// 获取变量对应的补全建议
function getCompletionsForVariable(
  varName: string,
): { label: string; type: string }[] {
  console.log(varName);
  // 这里可以根据实际上下文推断变量类型
  // 示例实现：
  if (varName === "a") {
    return [
      { label: "length", type: "property" },
      { label: "push", type: "method" },
      { label: "pop", type: "method" },
      { label: "map", type: "method" },
      { label: "filter", type: "method" },
      { label: "reduce", type: "method" },
    ];
  } else if (varName === "set") {
    return [
      { label: "add", type: "method" },
      { label: "delete", type: "method" },
      { label: "has", type: "method" },
      { label: "clear", type: "method" },
      { label: "size", type: "property" },
    ];
  }
  return [];
}

// 合并后的自动完成函数
export function CustomAutoCompletion(context: CompletionContext) {
  // 先检查是否是注释补全
  let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (
    nodeBefore.name == "BlockComment" &&
    context.state.sliceDoc(nodeBefore.from, nodeBefore.from + 3) == "/**"
  ) {
    let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos);
    let tagBefore = /@\w*$/.exec(textBefore);
    if (tagBefore || context.explicit) {
      return {
        from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
        options: tagOptions,
        validFor: /^(@\w*)?$/,
      };
    }
  }

  // 如果不是注释补全，则进行代码补全
  return getCodeCompletions(context);
}
