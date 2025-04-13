import * as d3 from 'd3';
import { Position, BaseElementOptions } from './types';

export interface NodeOptions extends BaseElementOptions {
  shape?: 'circle' | 'rect'; // 形状 (未来可扩展)
  radius?: number; // 圆形半径
  width?: number; // 矩形宽度
  height?: number; // 矩形高度
  fill?: string; // 填充色
  stroke?: string; // 边框色
  strokeWidth?: number; // 边框宽度
  text?: string; // 节点内显示的文本
  textColor?: string; // 文本颜色
  fontSize?: number; // 文本大小
}

const defaultNodeOptions: Required<Omit<NodeOptions, keyof BaseElementOptions | 'width' | 'height'>> = {
  shape: 'circle',
  radius: 20,
  fill: '#eee',
  stroke: '#333',
  strokeWidth: 1,
  text: '',
  textColor: '#000',
  fontSize: 12,
};

export class Node {
  public readonly id: string | number;
  private readonly options: Required<NodeOptions>;
  private readonly group: d3.Selection<SVGGElement, unknown, null, undefined>;
  private readonly shapeElement: d3.Selection<any, unknown, null, undefined>;
  private readonly textElement: d3.Selection<SVGTextElement, unknown, null, undefined>;

  private position: Position;

  constructor(options: NodeOptions) {
    this.id = options.id;
    const mergedOptions = { ...defaultNodeOptions, ...options, width: options.width ?? (options.radius ? options.radius * 2 : 40) , height: options.height ?? (options.radius ? options.radius * 2 : 40) }; // 合并默认值
    this.options = mergedOptions as Required<NodeOptions>; // 类型断言

    this.position = options.initialPosition ?? { x: 0, y: 0 };

    this.group = this.options.parentSelection
      .append('g')
      .attr('id', `node-${this.id}`)
      .attr('class', 'rei-ds-visual-node')
      .attr('transform', `translate(${this.position.x}, ${this.position.y})`);

    // 创建形状并断言为 any
    if (this.options.shape === 'circle') {
      this.shapeElement = this.group.append('circle') as any;
      this.shapeElement.attr('r', this.options.radius);
    } else { // rect
      this.shapeElement = this.group.append('rect') as any;
      this.shapeElement.attr('width', this.options.width)
        .attr('height', this.options.height)
        .attr('x', -this.options.width / 2)
        .attr('y', -this.options.height / 2);
    }

    // 通用样式可以应用
    this.shapeElement
        .style('fill', this.options.fill)
        .style('stroke', this.options.stroke)
        .style('stroke-width', this.options.strokeWidth);

    // 创建文本
    this.textElement = this.group.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', this.options.textColor)
        .style('font-size', `${this.options.fontSize}px`)
        .text(this.options.text);

    // 添加 tooltip
    if (this.options.tooltip) {
        this.group.append('title').text(this.options.tooltip);
    }
  }

  /** 更新节点位置 */
  public moveTo(x: number, y: number, duration: number = 0): void {
    this.position = { x, y };
    const transition = this.group.transition().duration(duration);
    transition.attr('transform', `translate(${x}, ${y})`);
  }

  /** 更新节点文本 */
  public setText(text: string): void {
      this.options.text = text;
      this.textElement.text(text);
  }

  /** 更新节点样式 */
  public updateStyle(style: Partial<Pick<NodeOptions, 'fill' | 'stroke' | 'strokeWidth' | 'textColor' | 'fontSize'>>): void {
      if (style.fill) {
          this.options.fill = style.fill;
          this.shapeElement.style('fill', style.fill);
      }
      if (style.stroke) {
          this.options.stroke = style.stroke;
          this.shapeElement.style('stroke', style.stroke);
      }
      if (style.strokeWidth) {
          this.options.strokeWidth = style.strokeWidth;
          this.shapeElement.style('stroke-width', style.strokeWidth);
      }
      if (style.textColor) {
          this.options.textColor = style.textColor;
          this.textElement.style('fill', style.textColor);
      }
       if (style.fontSize) {
          this.options.fontSize = style.fontSize;
          this.textElement.style('font-size', `${style.fontSize}px`);
      }
  }

  /** 获取节点当前位置 */
  public getPosition(): Position {
      return this.position;
  }

  /** 获取节点尺寸 (用于布局计算) */
  public getDimensions(): { width: number; height: number } {
      if (this.options.shape === 'circle') {
          return { width: this.options.radius * 2, height: this.options.radius * 2 };
      } else {
          return { width: this.options.width, height: this.options.height };
      }
  }

   /** 获取节点根 SVG 元素 */
  public getGroup(): d3.Selection<SVGGElement, unknown, null, undefined> {
      return this.group;
  }

  /** 销毁节点 */
  public destroy(): void {
    this.group.remove();
  }
} 