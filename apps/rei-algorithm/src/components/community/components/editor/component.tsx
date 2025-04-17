import { MouseEvent } from "react";
import styles from "./index.module.scss";
import { css, cx } from "@emotion/css";
import React, { PropsWithChildren, ReactNode, Ref } from "react";
import { useSlate } from "slate-react";
import {
  BlockElementFormat,
  InlineElementFormat,
  CustomElementFormat,
} from "./custom-types";
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

interface BaseProps {
  className: string;
  [key: string]: unknown;
}

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<HTMLSpanElement>,
  ) => (
    <span
      {...props}
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
    />
  ),
);

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLSpanElement>,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        "material-icons",
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `,
      )}
    />
  ),
);

export const Instruction = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>,
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          white-space: pre-wrap;
          margin: 0 -20px 10px;
          padding: 10px 20px;
          font-size: 14px;
          background: #f8f8e8;
        `,
      )}
    />
  ),
);

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>,
  ) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }

          & > * + * {
            margin-left: 15px;
          }
        `,
      )}
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
