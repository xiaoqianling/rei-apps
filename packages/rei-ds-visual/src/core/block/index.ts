import * as d3 from "d3";
import { Canvas } from "../canvas"; // 需要访问 Canvas 的变换信息

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
  // 默认值10
  paddingX?: number;
  paddingY?: number;
}

// TODO: 内容区translate由参数确定，因为内容的一些信息(比如label)在block上层无法感知。很容易垂直不居中
export class Block {
  public readonly id: string;
  private readonly canvas: Canvas;
  private readonly group: d3.Selection<SVGGElement, unknown, null, undefined>;
  private readonly borderRect: d3.Selection<
    SVGRectElement,
    unknown,
    null,
    undefined
  >;
  private readonly titleText: d3.Selection<
    SVGTextElement,
    unknown,
    null,
    undefined
  >;
  private readonly contentGroup: d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  >;

  private x: number;
  private y: number;
  private currentWidth: number; // Store current dynamic width
  private currentHeight: number; // Store current dynamic height
  private titleBgRect: d3.Selection<SVGRectElement, unknown, null, undefined>;
  private dividerLine: d3.Selection<SVGLineElement, unknown, null, undefined>;

  // Store drag start state
  private dragStartCoords: { x: number; y: number } | null = null;
  private blockStartCoords: { x: number; y: number } | null = null;

  private static readonly titleHeight = 30;
  private readonly paddingX: number = 10;
  private readonly paddingY: number = 10;

  constructor(options: BlockOptions) {
    this.id = options.id;
    this.canvas = options.canvas;
    this.x = options.x;
    this.y = options.y;
    this.currentWidth = options.width; // Initialize with provided size
    this.currentHeight = options.height;
    this.paddingX = options.paddingX ?? 10;
    this.paddingY = options.paddingY ?? 10;
    // 创建块的根 <g> 元素
    this.group = this.canvas
      .getRootGroup()
      .append("g")
      .attr("id", `block-${this.id}`)
      .attr("class", "rei-ds-visual-block")
      .attr("transform", `translate(${this.x}, ${this.y})`);

    // 绘制边框 - Use current dimensions
    this.borderRect = this.group
      .append("rect")
      .attr("class", "rei-ds-visual-block-border")
      .attr("width", this.currentWidth)
      .attr("height", this.currentHeight);

    // 绘制标题背景 - Use current dimensions
    this.titleBgRect = this.group // Store reference
      .append("rect")
      .attr("width", this.currentWidth - 1)
      .attr("height", Block.titleHeight - 1)
      .attr("class", "rei-ds-visual-block-title-bg")
      .attr("x", 0.5)
      .attr("y", 0.5)
      .attr("rx", 4)
      .attr("ry", 4)
      .style("fill", "#f0f0f0");

    // 添加标题下方的分割线 - Use current dimensions
    this.dividerLine = this.group // Store reference
      .append("line")
      .attr("class", "rei-ds-visual-block-divider")
      .attr("x1", 2)
      .attr("y1", Block.titleHeight)
      .attr("x2", this.currentWidth - 2)
      .attr("y2", Block.titleHeight)
      .style("stroke-width", "1px");

    // 添加标题文字 - Center based on current width
    this.titleText = this.group
      .append("text")
      .attr("class", "rei-ds-visual-block-title")
      .attr("x", this.currentWidth / 2) // 水平居中
      .attr("y", Block.titleHeight / 2) // 垂直居中
      .attr("text-anchor", "middle") // 文字水平居中
      .attr("dominant-baseline", "middle") // 文字垂直居中
      .text(options.title);

    // 创建内容区域的 <g> 元素
    this.contentGroup = this.group
      .append("g")
      .attr("class", "rei-ds-visual-block-content")
      .attr(
        "transform",
        `translate(${this.paddingX}, ${Block.titleHeight + this.paddingY})`,
      );

    // 添加拖拽行为
    const dragBehavior = d3
      .drag<SVGGElement, unknown>() // Specify Element type
      .container(this.canvas.getRootGroup().node() as any) // Important: Define container for coordinate calculations
      .on("start", this.dragStarted.bind(this))
      .on("drag", this.dragged.bind(this))
      .on("end", this.dragEnded.bind(this));

    this.group.call(dragBehavior);
  }

  private dragStarted(event: d3.D3DragEvent<SVGGElement, unknown, any>): void {
    this.group.raise().classed("dragging", true);
    d3.select(this.canvas.getSVG().node()!).style("cursor", "grabbing");
    // Use event.x, event.y which are relative to the container defined above (rootGroup)
    this.dragStartCoords = { x: event.x, y: event.y };
    this.blockStartCoords = { x: this.x, y: this.y };
    // Prevent text selection during drag, applied to body
    d3.select("body")
      .style("-webkit-user-select", "none")
      .style("-moz-user-select", "none")
      .style("-ms-user-select", "none")
      .style("user-select", "none");
  }

  private dragged(event: d3.D3DragEvent<SVGGElement, unknown, any>): void {
    if (!this.dragStartCoords || !this.blockStartCoords) return;

    // event.x, event.y are coordinates relative to the container (rootGroup)
    const currentX = event.x;
    const currentY = event.y;

    // Calculate displacement in canvas coordinates
    const dxCanvas = currentX - this.dragStartCoords.x;
    const dyCanvas = currentY - this.dragStartCoords.y;

    // Calculate the new block position based on start position + displacement
    let newX = this.blockStartCoords.x + dxCanvas;
    let newY = this.blockStartCoords.y + dyCanvas;

    // 获取画布的逻辑边界 (以画布坐标系表示)
    const bounds = this.canvas.getLogicalBounds();

    // 修正边界计算
    const minX = bounds.x;
    const minY = bounds.y;
    const maxX = bounds.x + bounds.width - this.currentWidth; // 最大 x 坐标 (块的左上角)
    const maxY = bounds.y + bounds.height - this.currentHeight; // 最大 y 坐标 (块的左上角)

    // 限制块的移动范围，确保其完全在逻辑边界内
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    this.x = newX;
    this.y = newY;
    this.group.attr("transform", `translate(${this.x}, ${this.y})`);
  }

  private dragEnded(event: d3.D3DragEvent<SVGGElement, unknown, any>): void {
    this.group.classed("dragging", false);
    d3.select(this.canvas.getSVG().node()!).style("cursor", "default"); // 或者恢复为 grab
    this.dragStartCoords = null; // Clear stored coords
    this.blockStartCoords = null;
    // Re-enable text selection
    d3.select("body")
      .style("-webkit-user-select", null)
      .style("-moz-user-select", null)
      .style("-ms-user-select", null)
      .style("user-select", null);
    // 未来可能需要通知 Canvas 更新此块的位置信息
    // this.canvas.updateBlockPosition(this.id, this.x, this.y);
  }

  /**
   * 获取用于绘制具体数据结构内容的 <g> 元素
   */
  public getContentGroup(): d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > {
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

  /**
   * 获取关联的 Canvas 实例
   */
  public getCanvas(): Canvas {
    return this.canvas;
  }

  /**
   * 根据内容大小更新块的尺寸
   * @param contentWidth 内容区域的实际宽度
   * @param contentHeight 内容区域的实际高度
   * @param duration 动画时长 (ms)
   */
  public updateSize(
    contentWidth: number,
    contentHeight: number,
    duration: number = 300,
  ): void {
    const newWidth = contentWidth + 2 * this.paddingX;
    const height = contentHeight + this.paddingY * 2 + Block.titleHeight;
    const newHeight = height;

    if (newWidth !== this.currentWidth || newHeight !== this.currentHeight) {
      this.currentWidth = newWidth;
      this.currentHeight = newHeight;

      // If duration is 0, skip transitions entirely
      if (duration <= 0) {
        console.log("√ 不搞动画");
        // 无动画情况保持不变
        this.borderRect
          .attr("width", this.currentWidth)
          .attr("height", this.currentHeight);
        this.titleBgRect.attr("width", this.currentWidth - 1);
        this.dividerLine.attr("x2", this.currentWidth - 2);
        this.titleText.attr("x", this.currentWidth / 2);
      } else {
        const transition = d3.transition().duration(duration);

        // Interrupt existing transition before starting a new one
        // BUG:
        this.borderRect
          .interrupt()
          .transition(transition)
          .attr("width", this.currentWidth)
          .attr("height", this.currentHeight);

        this.titleBgRect
          .interrupt()
          .transition(transition)
          .attr("width", this.currentWidth - 1);
        // height remains titleHeight - 1

        this.dividerLine
          .interrupt()
          .transition(transition)
          .attr("x2", this.currentWidth - 2);

        this.titleText
          .interrupt()
          .transition(transition)
          .attr("x", this.currentWidth / 2);
      }
    }
  }
}
