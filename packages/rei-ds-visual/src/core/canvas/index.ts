import * as d3 from 'd3';
import { Block, BlockOptions } from '../block';

export interface CanvasOptions {
  container: HTMLElement;
}

// 画布
export class Canvas {
  private readonly container: HTMLElement;
  private readonly svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private readonly rootGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  private readonly zoomBehavior: d3.ZoomBehavior<Element, unknown>;

  private currentTransform: d3.ZoomTransform = d3.zoomIdentity;
  private readonly blocks: Map<string, Block> = new Map();

  private readonly initialWidth: number;
  private readonly initialHeight: number;
  private readonly borderPadding: number = 10;

  constructor(options: CanvasOptions) {
    this.container = options.container;

    // 确保容器有定位属性，以便 SVG 能正确填充
    if (getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative';
    }
    this.container.style.overflow = 'hidden'; // 防止 SVG 内容溢出

    // 获取容器的初始尺寸
    const { width, height } = this.container.getBoundingClientRect();
    this.initialWidth = width;
    this.initialHeight = height;

    // 创建 SVG 元素
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('display', 'block'); // 避免 SVG 底部产生额外空白

    // 创建根 <g> 元素，所有内容将绘制在此元素内
    this.rootGroup = this.svg.append('g');

    // --- 临时添加一个简单的边框来标识画布区域（未来可移除或替换）---
    this.rootGroup.append('rect')
        .attr('x', this.borderPadding)
        .attr('y', this.borderPadding)
        // .attr('width', `calc(100% - ${this.borderPadding * 2}px)`) // 暂时用 CSS 计算，更精确需要获取尺寸
        // .attr('height', `calc(100% - ${this.borderPadding * 2}px)`) // 暂时用 CSS 计算
        .attr('width', this.initialWidth - this.borderPadding * 2) // 使用初始尺寸
        .attr('height', this.initialHeight - this.borderPadding * 2) // 使用初始尺寸
        .style('fill', 'none')
        .style('stroke', '#ccc')
        .style('stroke-width', 1 / this.currentTransform.k)
        .attr("vector-effect", "non-scaling-stroke");
    // --- 临时边框结束 ---

    // 初始化 D3 Zoom
    this.zoomBehavior = d3.zoom()
      .scaleExtent([1, 4]) // 限制缩放范围
      .translateExtent([[-Infinity, -Infinity], [Infinity, Infinity]]) // 允许无限平移
      .on('zoom', this.zoomed.bind(this));

    // 将 zoom 行为应用到 SVG 元素上
    // 注意：我们监听 SVG 上的事件，但将变换应用到 rootGroup 上
    this.svg.call(this.zoomBehavior as any);

    // 初始设置，确保画布填满容器
    this.resetZoom();
  }

  private zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>): void {
    this.currentTransform = event.transform;

    // 限制平移，确保画布边缘不进入容器
    const { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect();
    
    const { k, x, y } = this.currentTransform;

    // 计算在当前缩放级别下，画布内容区域的实际显示尺寸
    // 这里假设画布"内容"的逻辑尺寸与容器初始尺寸一致
    // 未来可以根据实际内容调整
    const logicalWidth = this.initialWidth;
    const logicalHeight = this.initialHeight;

    // x 轴方向的限制
    const constrainedX = Math.min(
        this.borderPadding, // 左边界不能移出容器左边
        Math.max(x, containerWidth - logicalWidth * k) // 右边界不能移出容器右边
    );

    // y 轴方向的限制
    const constrainedY = Math.min(
        this.borderPadding, // 上边界不能移出容器上边
        Math.max(y, containerHeight - logicalHeight * k) // 下边界不能移出容器下边
    );

    // 如果变换被限制了，更新 currentTransform
    if (constrainedX !== x || constrainedY !== y) {
        this.currentTransform = d3.zoomIdentity.translate(constrainedX, constrainedY).scale(k);
        // 更新 d3 zoom 状态，防止抖动
        // 使用 d3.zoomIdentity.translate(constrainedX, constrainedY).scale(k) 来更新 zoom 状态
        // 这会触发另一次 zoom 事件，但因为 transform 相同，不会递归调用
        this.svg.call(this.zoomBehavior.transform as any, this.currentTransform);
        return; // 等待下一次 zoom 事件应用正确的 transform
    }


    // 应用最终的 transform 到根 <g> 元素
    this.rootGroup.attr('transform', this.currentTransform.toString());
  }

  /**
   * 重置缩放和平移到初始状态（画布填满容器）
   */
  public resetZoom(): void {
    // 计算初始的缩放和平移，使画布内容(假设为容器大小)正好填满容器
    // 这里的逻辑假设画布内容的逻辑原点(0,0)在容器的左上角
    const initialTransform = d3.zoomIdentity.translate(this.borderPadding, this.borderPadding).scale(1);
    // this.currentTransform = initialTransform; NOTE

    // 应用初始变换并更新 zoom 状态
    this.svg.call(this.zoomBehavior.transform as any, this.currentTransform);
    // this.rootGroup.attr('transform', this.currentTransform.toString());
  }

  public getLogicalBounds(): {x: number, y: number, width: number, height: number} {
    return {
      x: this.borderPadding,
      y: this.borderPadding,
      width: this.initialWidth,
      height: this.initialHeight,
    };
  }
  /**
   * 获取当前的 Zoom Transform
   */
  public getCurrentTransform(): d3.ZoomTransform {
    return this.currentTransform;
  }

  /**
   * 添加一个可视化块到画布
   * @param options 配置项，除了 canvas 之外
   * @returns 返回创建的 Block 实例
   */
  public addBlock(options: Omit<BlockOptions, 'canvas'>): Block {
    if (this.blocks.has(options.id)) {
      console.warn(`Block with id '${options.id}' already exists.`);
      return this.blocks.get(options.id)!;
    }

    const block = new Block({ ...options, canvas: this });
    this.blocks.set(options.id, block);
    return block;
  }

  /**
   * 从画布移除一个可视化块
   * @param id 要移除的块的 ID
   */
  public removeBlock(id: string): void {
    const block = this.blocks.get(id);
    if (block) {
      block.destroy();
      this.blocks.delete(id);
    } else {
      console.warn(`Block with id '${id}' not found.`);
    }
  }

  /**
   * 获取所有块的 Map
   */
  public getBlocks(): Map<string, Block> {
    return this.blocks;
  }

  /**
   * 根据 ID 获取块
   * @param id 块的 ID
   */
  public getBlockById(id: string): Block | undefined {
    return this.blocks.get(id);
  }

  public getContainerRect(): {width: number, height: number} {
    return this.container.getBoundingClientRect();
  }

  public getVisibleBounds(): {x: number, y: number, width: number, height: number} {
    const {width: containerWidth, height: containerHeight} = this.getContainerRect();
    const {k, x, y} = this.currentTransform;
    return {
      x: -x / k, y: -y / k, width: containerWidth / k, height: containerHeight / k,
    };
  }
  /**
   * 获取根 SVG 元素
   */
  public getSVG(): d3.Selection<SVGSVGElement, unknown, null, undefined> {
    return this.svg;
  }

  /**
   * 获取用于绘制内容的根 <g> 元素
   */
  public getRootGroup(): d3.Selection<SVGGElement, unknown, null, undefined> {
    return this.rootGroup;
  }

  /**
   * 销毁画布，移除 SVG 和事件监听器，并销毁所有块
   */
  public destroy(): void {
    // 销毁所有块
    this.blocks.forEach(block => block.destroy());
    this.blocks.clear();

    // 移除 zoom 事件监听
    this.svg.on('.zoom', null);
    // 移除 SVG 元素
    this.svg.remove();
  }

  
} 