import { useEffect, useRef } from "react";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ReactCodeMirrorRef,
  StateEffect,
  StateField,
  ViewUpdate,
} from "@uiw/react-codemirror";
import styles from "./CodeDesc.module.scss"; // Import the styles
import ReactCodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { githubDark } from "@uiw/codemirror-theme-github";

// --- CodeMirror Highlight Extension ---

// Effect to trigger highlight update
const highlightEffect = StateEffect.define<[number, number]>();

// StateField to manage the decorations
const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    // Start with existing decorations
    decorations = decorations.map(tr.changes);
    // Check for our highlight effect
    for (let effect of tr.effects) {
      if (effect.is(highlightEffect)) {
        const [startLine, endLine] = effect.value;
        const linesToHighlight = [];
        // Only highlight if valid range (CodeMirror lines are 1-indexed in API, but 0 internally sometimes)
        if (startLine >= 1 && endLine >= startLine) {
          // Iterate through lines in the document within the range
          try {
            for (let i = startLine; i <= endLine; i++) {
              // Ensure line exists in the document
              if (i <= tr.state.doc.lines) {
                const line = tr.state.doc.line(i);
                // Add decoration for the entire line
                linesToHighlight.push(
                  Decoration.line({
                    attributes: { class: "cm-highlightedLine" }, // Use class from SCSS
                  }).range(line.from, line.from), // Apply to the start of the line
                );
              }
            }
          } catch (e) {
            console.error("Error getting line for highlighting:", e);
          }
        }
        // Replace all previous decorations with the new set
        decorations = Decoration.set(linesToHighlight);
      }
    }
    return decorations;
  },
  // Provide the decorations to the editor view
  provide: (field) => EditorView.decorations.from(field),
});

// The actual extension to pass to CodeMirror
const lineHighlightExtension = () => [highlightField];

// --- Component ---
type Props = {
  code: string;
  desc?: string[];
  info: {
    line: number[]; // [startLine, endLine] - 1-indexed
    desc: number; // 1-indexed
  };
  // default true
  readonly?: boolean;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
};

function CodeDesc({ code, desc, info, readonly = true, onChange }: Props) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    const view = editorRef.current?.view;
    if (view) {
      const [start, end] = info.line;
      if (start !== -1 && end !== -1) {
        view.dispatch({
          effects: highlightEffect.of([start, end]),
        });
      } else {
        view.dispatch({
          effects: highlightEffect.of([0, 0]),
        });
      }

      try {
        if (start > 0 && start <= view.state.doc.lines) {
          const line = view.state.doc.line(start);
          view.dispatch({
            effects: EditorView.scrollIntoView(line.from, { y: "center" }),
          });
        }
      } catch (e) {
        console.error("Error scrolling into view:", e);
      }
    }
  }, [info.line]);

  return (
    <div className={styles.codeDescContainer}>
      <div className={styles.descriptionArea}>
        <p>
          {desc
            ? info.desc > 0 && info.desc <= desc.length
              ? desc[info.desc - 1]
              : "点击控制区播放按钮，开始执行"
            : "标题"}
        </p>
      </div>
      <div className={styles.codeMirrorWrapper}>
        <ReactCodeMirror
          ref={editorRef}
          value={code}
          height="100%"
          style={{ height: "100%" }}
          readOnly={readonly}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            autocompletion: false,
            lintKeymap: false,
          }}
          extensions={[
            langs.tsx(),
            lineHighlightExtension(), // Add our custom highlight extension
          ]}
          theme={githubDark}
        />
      </div>
    </div>
  );
}

export default CodeDesc;
