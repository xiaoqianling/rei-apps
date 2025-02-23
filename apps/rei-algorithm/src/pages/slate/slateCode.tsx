import React, { FunctionComponent, ReactNode } from "react";
import { SlateAttribute } from "./type";

interface SlateCodeProps {
  children: ReactNode;
  attributes: SlateAttribute;
}

const SlateCode: FunctionComponent<SlateCodeProps> = ({
  children,
  attributes,
}) => {
  return (
    <div {...attributes}>
      <h4>SLATE CODE</h4>
      {children}
    </div>
  );
};

export default SlateCode;
