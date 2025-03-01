export interface VisualItemProps {
  // 外形
  type: VisualItemType;
  label: string;
  color: string;
  onClick?: () => void;
}

export enum VisualItemType {
  Rectangle,
  Circle,
}
