import { NodeOptions } from "../common";
import { QueueVisual } from "./QueueVisual";
import { StackVisual } from "./StackVisual";

/** 一个可以用于可视化组件的配置类型。在构造函数使用，内部维护可以使用另外的类型
 * @usage {@link QueueVisual | 队列可视化组件}
 * @usage {@link StackVisual | 栈可视化组件}
 * */
export interface VisualComponentConstructorOptions {
  // 标签字体大小
  labelFontSize?: number;
  // 标签字体颜色
  labelFill?: string;
  // 节点之间的间距
  spacing?: number;
  // 动画持续时间
  animationDuration?: number;
  // 节点的配置项
  nodeOptions?: Omit<NodeOptions, "id" | "parentSelection">;
}

// 内部维护的配置类型
export type VisualComponentOptions = {
  nodeOptions: {
    width: number;
    height: number;
    shape: "circle" | "rect";
    radius: number;
  };
} & Required<VisualComponentConstructorOptions>;

// 一组默认的配置项，用于在构造函数替换值
export const defaultQueueOptions: VisualComponentOptions = {
  labelFontSize: 12,
  labelFill: "#333",
  spacing: 10,
  animationDuration: 300,
  nodeOptions: {
    shape: "rect",
    fill: "#fff",
    stroke: "#000",
    strokeWidth: 1,
    radius: 30,
    width: 50,
    height: 30,
  },
};

// 在构造函数中生成配置项，带有默认值
export function constructVisualComponentOptions(
  param: VisualComponentConstructorOptions,
): VisualComponentOptions;
// 在构造函数中生成配置项，带有用户提供的配置项
export function constructVisualComponentOptions(
  param: VisualComponentConstructorOptions,
  defaultOptions: VisualComponentOptions,
): VisualComponentOptions;

// 重载函数实现
export function constructVisualComponentOptions(
  param: VisualComponentConstructorOptions,
  defaultOptions?: VisualComponentOptions,
): VisualComponentOptions {
  if (defaultOptions) {
    return {
      ...defaultOptions,
      ...param,
      nodeOptions: {
        ...defaultOptions.nodeOptions,
        ...param.nodeOptions,
      },
    };
  }
  return {
    ...defaultQueueOptions,
    ...param,
    nodeOptions: {
      ...defaultQueueOptions.nodeOptions,
      ...param.nodeOptions,
    },
  };
}
