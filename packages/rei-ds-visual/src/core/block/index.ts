import * as d3 from 'd3';
import { Canvas } from '../canvas'; // 需要访问 Canvas 的变换信息

// 引入样式，假设你的构建工具能处理 CSS 导入
// import './styles.css'; // 如果构建设置支持，否则需要手动加载

export interface BlockOptions {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  canvas: Canvas; // 需要 Canvas 实例来获取当前变换和添加元素
}

export class Block {
  public readonly id: string;
  private readonly canvas: Canvas;
  private readonly group: d3.Selection<SVGGElement, unknown, null, undefined>;
  private readonly borderRect: d3.Selection<SVGRectElement, unknown, null, undefined>;
  private readonly titleText: d3.Selection<SVGTextElement, unknown, null, undefined>;
  private readonly contentGroup: d3.Selection<SVGGElement, unknown, null, undefined>;

  private x: number;
  private y: number;
  private width: number;
  private height: number;

  private static readonly titleHeight = 30;
  private static readonly padding = 10;

  constructor(options: BlockOptions) {
    this.id = options.id;
    this.canvas = options.canvas;
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;

    // 创建块的根 <g> 元素
    this.group = this.canvas.getRootGroup()
      .append('g')
      .attr('id', `block-${this.id}`)
      .attr('class', 'rei-ds-visual-block')
      .attr('transform', `translate(${this.x}, ${this.y})`);

    // 绘制边框
    this.borderRect = this.group.append('rect')
      .attr('class', 'rei-ds-visual-block-border')
      .attr('width', this.width)
      .attr('height', this.height);

    // 绘制标题背景（可选，如果需要不同于内容的背景）
    // this.group.append('rect')
    //   .attr('width', this.width)
    //   .attr('height', Block.titleHeight)
    //   .style('fill', '#f0f0f0');

    // 添加标题文字
    this.titleText = this.group.append('text')
      .attr('class', 'rei-ds-visual-block-title')
      .attr('x', Block.padding)
      .attr('y', Block.titleHeight / 2) // 垂直居中
      .attr('dy', '0.35em') // 微调垂直对齐
      .text(options.title);

    // 创建内容区域的 <g> 元素
    this.contentGroup = this.group.append('g')
      .attr('class', 'rei-ds-visual-block-content')
      .attr('transform', `translate(${Block.padding}, ${Block.titleHeight + Block.padding})`);

    // 添加拖拽行为
    const dragBehavior = d3.drag()
        .on('start', this.dragStarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragEnded.bind(this));

    this.group.call(dragBehavior as any);
  }

  private dragStarted(): void {
    this.group.raise().classed('dragging', true);
    d3.select(this.canvas.getSVG().node()!).style('cursor', 'grabbing');
  }

  private dragged(event: d3.D3DragEvent<SVGGElement, unknown, any>): void {
      const currentScale = this.canvas.getCurrentTransform().k;
      let newX = this.x + event.dx / currentScale;
      let newY = this.y + event.dy / currentScale;

      // 获取画布的边界 (以画布坐标系表示)
      const bounds = this.canvas.getLogicalBounds();
      // console.log('bounds', bounds);
      // console.log('newX', newX, 'newY', newY, " ", bounds.width - this.width);

      const right = bounds.width - this.width - bounds.x
      const bottom = bounds.height - this.height - bounds.y
      // 判断在画布内逻辑
      if (newX < bounds.x)  {
        newX = bounds.x;
      } else if (newX > right) {
        newX = right
      }
      if (newY < bounds.y)  {
        newY = bounds.y;
      } else if (newY > bottom) {
        newY = bottom
      }


      // 限制块的移动范围，确保其完全在画布内
      // 块的左上角不能超过画布可视区域的左上角
      // newX = Math.max(bounds.x, newX);
      // newY = Math.max(bounds.y, newY);

      // // 块的右下角不能超过画布可视区域的右下角
      // newX = Math.min(bounds.x + bounds.width - this.width, newX);
      // newY = Math.min(bounds.y + bounds.height - this.height, newY);

      this.x = newX;
      this.y = newY;
      this.group.attr('transform', `translate(${this.x}, ${this.y})`);
  }

  private dragEnded(): void {
    this.group.classed('dragging', false);
     d3.select(this.canvas.getSVG().node()!).style('cursor', 'default'); // 或者恢复为 grab
     // 未来可能需要通知 Canvas 更新此块的位置信息
     // this.canvas.updateBlockPosition(this.id, this.x, this.y);
  }

  /**
   * 获取用于绘制具体数据结构内容的 <g> 元素
   */
  public getContentGroup(): d3.Selection<SVGGElement, unknown, null, undefined> {
    return this.contentGroup;
  }

  /**
   * 获取块当前的 X 坐标
   */
  public getX(): number {
      return this.x;
  }

  /**
   * 获取块当前的 Y 坐标
   */
  public getY(): number {
      return this.y;
  }

  /**
   * 销毁块，移除 SVG 元素
   */
  public destroy(): void {
    this.group.remove();
    // 移除所有事件监听器 (d3 drag 会自动处理)
  }
} 