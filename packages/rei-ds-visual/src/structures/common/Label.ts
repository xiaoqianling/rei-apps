import * as d3 from "d3";
import { Position, BaseElementOptions } from "./types";

export interface LabelOptions extends BaseElementOptions {
  text: string;
  fontSize?: number;
  fill?: string;
  offsetX?: number; // 相对于 initialPosition 的 X 偏移
  offsetY?: number; // 相对于 initialPosition 的 Y 偏移
  textAnchor?: "start" | "middle" | "end";
  dominantBaseline?: "auto" | "middle" | "hanging" | "mathematical";
}

// 明确定义 Label 必需的属性 (除了继承的)
const requiredLabelKeys = ["text"] as const;
// 明确定义 Label 可选且有默认值的属性
const optionalLabelKeysWithDefaults = [
  "fontSize",
  "fill",
  "offsetX",
  "offsetY",
  "textAnchor",
  "dominantBaseline",
] as const;

// 计算出 LabelOptions 中必需的属性类型
type RequiredLabelOptionsPart = Required<
  Pick<LabelOptions, (typeof requiredLabelKeys)[number]>
>;
// 计算出 LabelOptions 中可选但有默认值的属性类型
type OptionalLabelOptionsWithDefaultsPart = Required<
  Pick<LabelOptions, (typeof optionalLabelKeysWithDefaults)[number]>
>;
// LabelOptions 中其他可选属性 (这里没有了，但保持结构一致性)
type OptionalLabelOptionsRestPart = Omit<
  LabelOptions,
  | keyof BaseElementOptions
  | (typeof requiredLabelKeys)[number]
  | (typeof optionalLabelKeysWithDefaults)[number]
>;

// 最终内部使用的 Options 类型
type InternalLabelOptions = BaseElementOptions &
  RequiredLabelOptionsPart &
  OptionalLabelOptionsWithDefaultsPart &
  OptionalLabelOptionsRestPart;

const defaultLabelOptions: Pick<
  InternalLabelOptions,
  (typeof optionalLabelKeysWithDefaults)[number]
> = {
  fontSize: 10,
  fill: "#555",
  offsetX: 0,
  offsetY: 0,
  textAnchor: "middle",
  dominantBaseline: "auto",
};

export class Label {
  public readonly id: string | number;
  private readonly options: InternalLabelOptions;
  private readonly textElement: d3.Selection<
    SVGTextElement,
    unknown,
    null,
    undefined
  >;

  private position: Position;

  constructor(options: LabelOptions) {
    this.id = options.id;
    this.options = { ...defaultLabelOptions, ...options };
    this.position = options.initialPosition ?? { x: 0, y: 0 };

    this.textElement = this.options.parentSelection
      .append("text")
      .attr("id", `label-${this.id}`)
      .attr("class", "rei-ds-visual-label")
      .attr("x", this.position.x + this.options.offsetX)
      .attr("y", this.position.y + this.options.offsetY)
      .attr("text-anchor", this.options.textAnchor)
      .attr("dominant-baseline", this.options.dominantBaseline)
      .style("font-size", `${this.options.fontSize}px`)
      .text(this.options.text);

    if (this.options.tooltip) {
      this.textElement.append("title").text(this.options.tooltip);
    }
  }

  /** 更新标签位置 */
  public moveTo(x: number, y: number, duration: number = 0): void {
    this.position = { x, y };
    const targetX = this.position.x + this.options.offsetX;
    const targetY = this.position.y + this.options.offsetY;
    const transition = this.textElement.transition().duration(duration);
    transition.attr("x", targetX).attr("y", targetY);
  }

  /** 更新标签文本 */
  public setText(text: string): void {
    this.options.text = text;
    this.textElement.text(text);
  }

  /** 更新标签样式 */
  public updateStyle(
    style: Partial<Pick<LabelOptions, "fill" | "fontSize">>,
  ): void {
    if (style.fill) {
      this.options.fill = style.fill;
      this.textElement.style("fill", style.fill);
    }
    if (style.fontSize) {
      this.options.fontSize = style.fontSize;
      this.textElement.style("font-size", `${style.fontSize}px`);
    }
  }

  /** 获取标签根 SVG 元素 */
  public getElement(): d3.Selection<SVGTextElement, unknown, null, undefined> {
    return this.textElement;
  }

  /** 销毁标签 */
  public destroy(): void {
    this.textElement.remove();
  }
}
