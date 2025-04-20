import React, { useEffect, useRef } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { EditorView, Decoration, DecorationSet } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { basicSetup } from "codemirror"; // Or a different setup
import { javascript } from "@codemirror/lang-javascript"; // Assuming JS code
import styles from "./CodeDesc.module.scss"; // Import the styles

type Props = {
  code: string;
  desc: string[];
  info: {
    line: number[]; // [startLine, endLine] - 1-indexed
    desc: number; // 1-indexed
  };
};

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
                      attributes: { class: 'cm-highlightedLine' } // Use class from SCSS
                    }).range(line.from, line.from) // Apply to the start of the line
                  );
                }
              }
           } catch (e) {
               console.error("Error getting line for highlighting:", e);
               // Handle cases where line number might be out of bounds temporarily
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

function CodeDesc({ code, desc, info }: Props) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    const view = editorRef.current?.view;
    if (view) {
      // Dispatch the effect to update highlights when info.line changes
      // Make sure line numbers are valid before dispatching
       const [start, end] = info.line;
        if (start !== -1 && end !== -1) { // Use -1 check from original code
            view.dispatch({
                effects: highlightEffect.of([start, end]),
            });
        } else {
             // Clear highlights if line numbers are invalid (-1)
             view.dispatch({
                effects: highlightEffect.of([0, 0]), // Dispatch with invalid range to clear
             });
        }

       // Optionally scroll the highlighted area into view
        try {
          if (start > 0 && start <= view.state.doc.lines) {
              const line = view.state.doc.line(start);
              view.dispatch({
                  effects: EditorView.scrollIntoView(line.from, { y: "center" })
              });
          }
        } catch(e) {
            console.error("Error scrolling into view:", e);
        }
    }
  }, [info.line]); // Depend on info.line

  return (
    // Apply the styles from CodeDesc.module.scss
    <div className={styles.codeDescContainer}>
      <div className={styles.descriptionArea}>
        <p>
          {/* Adjust index access: desc is 0-indexed, info.desc is 1-indexed */}
          {info.desc > 0 && info.desc <= desc.length
            ? desc[info.desc - 1]
            : "点击控制区播放按钮，开始执行"}
        </p>
      </div>
      <div className={styles.codeMirrorWrapper}>
        <CodeMirror
          ref={editorRef}
          value={code}
          // theme="dark" // Example: Use a predefined dark theme or customize fully
           height="100%" // Make CodeMirror fill the wrapper
           style={{ height: '100%' }} // Ensure wrapper and CM have height
          readOnly={true} // Make editor non-editable
          basicSetup={{ // Customize basic setup if needed
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
             highlightActiveLineGutter: true,
             // remove other defaults if not needed
             autocompletion: false,
             lintKeymap: false,
          }}
          extensions={[
            // basicSetup(), // Use basicSetup prop instead or customize extensions manually
            javascript(), // Add JS language support
            lineHighlightExtension(), // Add our custom highlight extension
            EditorView.lineWrapping // Enable line wrapping
          ]}
        />
      </div>
    </div>
  );
}

export default CodeDesc;
