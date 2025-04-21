import { MouseEvent } from "react";
import styles from "./index.module.scss";
import { css, cx } from "@emotion/css";
import React, { ReactNode, Ref } from "react";
import { useSlate } from "slate-react";
import {
  BlockElementFormat,
  InlineElementFormat,
  CustomElementFormat,
} from "./types";
import {
  isBlockMarkActive,
  isAlignType,
  isInlineMarkActive,
  toggleInlineMark,
  toggleBlockMark,
  isCustomMarkActive,
  toggleCustomMark,
} from "./util";
import ReiTooltip from "rei-design/tooltip";

interface Props {
  className?: string;
  active: boolean;
  reversed?: boolean;
  children?: ReactNode;
  onMouseDown?: (event: MouseEvent<HTMLSpanElement>) => void;
}

export const Button = React.forwardRef(
  (
    { className, active, reversed, children, onMouseDown }: Props,
    ref: Ref<HTMLSpanElement>,
  ) => (
    <span
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? "white"
              : "#aaa"
            : active
              ? "black"
              : "#ccc"};
        `,
      )}
      children={children}
      onMouseDown={onMouseDown}
    />
  ),
);

export const Toolbar = ({ children }: { children: ReactNode }) => {
  return <div className={styles.toolbar}>{children}</div>;
};

interface BlockButtonProps {
  format: BlockElementFormat;
  icon: ReactNode;
  tip?: string;
}

// 块级元素(标题、段落)
export const BlockButton = ({ format, icon, tip }: BlockButtonProps) => {
  const editor = useSlate();

  return (
    <ReiTooltip content={tip} className={styles.tooltip}>
      <Button
        active={isBlockMarkActive(
          editor,
          format,
          isAlignType(format) ? "align" : "type",
        )}
        onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
          event.preventDefault();
          toggleBlockMark(editor, format);
        }}
      >
        {icon}
      </Button>
    </ReiTooltip>
  );
};

interface InlineMarkButtonProps {
  format: InlineElementFormat;
  icon: ReactNode;
  tip?: string;
}

// 行内元素
export const InlineMarkButton = ({
  format,
  icon,
  tip,
}: InlineMarkButtonProps) => {
  const editor = useSlate();
  return (
    <ReiTooltip content={tip} className={styles.tooltip}>
      <Button
        active={isInlineMarkActive(editor, format)}
        onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
          event.preventDefault();
          toggleInlineMark(editor, format);
        }}
      >
        {icon}
      </Button>
    </ReiTooltip>
  );
};

interface CustomButtonProps {
  format: CustomElementFormat;
  icon: ReactNode;
  tip?: string;
}

export const CustomButton = ({ icon, format, tip }: CustomButtonProps) => {
  const editor = useSlate();
  return (
    <ReiTooltip content={tip} className={styles.tooltip}>
      <Button
        active={isCustomMarkActive(editor, format)}
        onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
          event.preventDefault();
          toggleCustomMark(editor, format);
        }}
      >
        {icon}
      </Button>
    </ReiTooltip>
  );
};
