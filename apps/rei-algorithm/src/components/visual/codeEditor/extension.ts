import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";

// 创建高亮效果
export const highlightEffect = StateEffect.define<{
  from: number;
  to: number;
}>();

// 创建高亮装饰器
const highlightMark = Decoration.mark({
  attributes: { class: "cm-highlight" },
});

// 状态字段管理高亮位置
export const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(highlights, tr) {
    // 只处理手动触发的高亮效果
    for (const effect of tr.effects) {
      if (effect.is(highlightEffect)) {
        if (effect.value.from < effect.value.to) {
          return Decoration.none.update({
            add: [highlightMark.range(effect.value.from, effect.value.to)],
          });
        }
        return Decoration.none;
      }
    }
    return highlights; // 其他情况保持原样
  },
  provide: (f) => EditorView.decorations.from(f),
});
