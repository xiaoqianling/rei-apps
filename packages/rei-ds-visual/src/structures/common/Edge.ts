import * as d3 from 'd3';
import { Position, BaseElementOptions } from './types';
import { Node } from './Node'; // Edge 需要知道连接的 Node

export interface EdgeOptions extends Omit<BaseElementOptions, 'initialPosition'> {
  sourceNode: Node;
  targetNode: Node;
  stroke?: string;
  strokeWidth?: number;
  directed?: boolean; // 是否有方向 (箭头)
  markerEndId?: string; // 箭头 marker 的 ID (如果 directed 为 true)
}

// 明确定义 Edge 必须的属性
const requiredEdgeKeys = ['sourceNode', 'targetNode'] as const;
// 明确定义 Edge 可选且有默认值的属性
const optionalEdgeKeysWithDefaults = ['stroke', 'strokeWidth', 'directed'] as const;

// 计算出 EdgeOptions 中必需的属性类型 (除了继承的)
type RequiredEdgeOptionsPart = Required<Pick<EdgeOptions, typeof requiredEdgeKeys[number]>>;
// 计算出 EdgeOptions 中可选但有默认值的属性类型
type OptionalEdgeOptionsWithDefaultsPart = Required<Pick<EdgeOptions, typeof optionalEdgeKeysWithDefaults[number]>>;
// EdgeOptions 中其他可选属性
type OptionalEdgeOptionsRestPart = Omit<EdgeOptions, keyof BaseElementOptions | typeof requiredEdgeKeys[number] | typeof optionalEdgeKeysWithDefaults[number]>;

// 最终内部使用的 Options 类型：基础必需 + Edge必需 + Edge有默认值(也视作必需) + Edge其他可选
type InternalEdgeOptions = BaseElementOptions & RequiredEdgeOptionsPart & OptionalEdgeOptionsWithDefaultsPart & OptionalEdgeOptionsRestPart;

const defaultEdgeOptions: Pick<InternalEdgeOptions, typeof optionalEdgeKeysWithDefaults[number]> = {
  stroke: '#666',
  strokeWidth: 2,
  directed: false,
};

export class Edge {
  public readonly id: string | number;
  // 使用最终修正后的内部类型
  private readonly options: InternalEdgeOptions;
  private readonly lineElement: d3.Selection<SVGPathElement, unknown, null, undefined>; // Use path for flexibility

  constructor(options: EdgeOptions) {
    this.id = options.id;
    // 合并时 TS 能更好地推断类型
    this.options = { ...defaultEdgeOptions, ...options };

    // 创建 <path> 元素
    this.lineElement = this.options.parentSelection
      .append('path')
      .attr('id', `edge-${this.id}`)
      .attr('class', 'rei-ds-visual-edge')
      .style('stroke', this.options.stroke)
      .style('stroke-width', this.options.strokeWidth)
      .style('fill', 'none');

    if (this.options.directed && this.options.markerEndId) {
        this.lineElement.attr('marker-end', `url(#${this.options.markerEndId})`);
    }

    // 初始化位置
    this.updatePosition();

    // 添加 tooltip
    if (this.options.tooltip) {
        this.lineElement.append('title').text(this.options.tooltip);
    }
  }

  /** 更新边的位置 (连接点可能会变) */
  public updatePosition(duration: number = 0): void {
    const sourcePos = this.options.sourceNode.getPosition();
    const targetPos = this.options.targetNode.getPosition();

    // 简单的直线连接
    // 未来可以优化：计算节点边界上的连接点
    const pathData = `M ${sourcePos.x},${sourcePos.y} L ${targetPos.x},${targetPos.y}`;

    const transition = this.lineElement.transition().duration(duration);
    transition.attr('d', pathData);
  }

  /** 更新边样式 */
  public updateStyle(style: Partial<Pick<EdgeOptions, 'stroke' | 'strokeWidth'>>): void {
      if (style.stroke) {
          this.options.stroke = style.stroke;
          this.lineElement.style('stroke', style.stroke);
      }
      if (style.strokeWidth) {
          this.options.strokeWidth = style.strokeWidth;
          this.lineElement.style('stroke-width', style.strokeWidth);
      }
  }

  /** 获取源节点 */
  public getSourceNode(): Node {
      return this.options.sourceNode;
  }

  /** 获取目标节点 */
  public getTargetNode(): Node {
      return this.options.targetNode;
  }

  /** 获取边的根 SVG 元素 */
  public getElement(): d3.Selection<SVGPathElement, unknown, null, undefined> {
      return this.lineElement;
  }

  /** 销毁边 */
  public destroy(): void {
    this.lineElement.remove();
  }
}

/**
 * 在 SVG <defs> 中定义一个通用的箭头 marker
 * @param defsSelection d3 selection of the <defs> element
 * @param id The id for the marker
 * @param color Arrow color
 * @param size Arrow size
 */
export function defineArrowMarker(defsSelection: d3.Selection<SVGDefsElement, unknown, null, undefined>, id: string, color: string = '#666', size: number = 6): void {
    defsSelection.append('marker')
        .attr('id', id)
        .attr('viewBox', `0 -${size/2} ${size} ${size}`) // Adjusted viewBox
        .attr('refX', size) // Position the arrow tip at the end of the line
        .attr('refY', 0)
        .attr('markerWidth', size)
        .attr('markerHeight', size)
        .attr('orient', 'auto')
      .append('path')
        .attr('d', `M0,-${size/2}L${size},0L0,${size/2}`) // Arrow shape
        .style('fill', color)
        .style('stroke', 'none');
} 