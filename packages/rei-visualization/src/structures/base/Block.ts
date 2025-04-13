import * as PIXI from "pixi.js";
import { Scene } from "../../core/Scene"; // Adjust path as needed

export interface BlockOptions {
  title: string;
  x?: number; // Initial position X
  y?: number; // Initial position Y
  width?: number; // Width
  height?: number; // Height
  backgroundColor?: number; // Background color
  borderColor?: number; // Border color
  borderColorHover?: number; // Border color when hovered
  borderWidth?: number; // Border width
  borderRadius?: number; // Border radius
  padding?: number; // Padding
  titleStyle?: Partial<PIXI.TextStyle>; // Title style (PIXI.TextStyle)
  dataStructureType?: string; // Data structure type (future use)
}

// Define the required options shape after defaults are applied
// Explicitly state x and y are numbers, keep dataStructureType optional
type InternalBlockOptions = Required<
  Omit<BlockOptions, "dataStructureType" | "x" | "y">
> & { x: number; y: number } & Pick<BlockOptions, "dataStructureType">;

const DEFAULT_BLOCK_OPTIONS: Required<
  Omit<BlockOptions, "title" | "dataStructureType" | "x" | "y">
> &
  Pick<BlockOptions, "x" | "y"> = {
  x: 50,
  y: 50,
  width: 200,
  height: 150,
  backgroundColor: 0x2a2a2a, // Dark gray background
  borderColor: 0x888888, // Gray border
  borderColorHover: 0xffffff, // White border when hovered
  borderWidth: 1,
  borderRadius: 8,
  padding: 10,
  titleStyle: {
    fill: 0xffffff, // 白色文字
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Arial",
    align: "center",
  },
};

/**
 * 代表场景上的一个可拖动块(基本单元)，用于显示变量/数据结构。
 */
export class Block extends PIXI.Container {
  private options: InternalBlockOptions;
  private sceneRef: Scene; // 对父场景的引用，用于边界检查
  private backgroundGraphics: PIXI.Graphics; // 背景和边框图形
  private titleText: PIXI.Text; // 标题文本
  private contentContainer: PIXI.Container; // 用于容纳数据结构可视化的容器

  private isDragging = false; // 是否正在被拖动
  private dragOffset = new PIXI.Point(); // 拖动时指针相对于块左上角的偏移
  private isHovering = false; // 指针是否悬浮在块上

  constructor(scene: Scene, options: BlockOptions) {
    super();
    this.sceneRef = scene;

    // 合并传入选项和默认选项
    const mergedOptions: InternalBlockOptions = {
      ...DEFAULT_BLOCK_OPTIONS,
      ...options, // 用户选项覆盖默认值
      title: options.title, // 确保 title 总是存在
      x: (options.x ?? DEFAULT_BLOCK_OPTIONS.x) as number,
      y: (options.y ?? DEFAULT_BLOCK_OPTIONS.y) as number,
      dataStructureType: options.dataStructureType, // 可选的 dataStructureType
    } as InternalBlockOptions; // 使用类型断言
    this.options = mergedOptions;

    this.x = this.options.x;
    this.y = this.options.y;

    // --- 创建子元素 ---
    this.backgroundGraphics = new PIXI.Graphics();
    this.titleText = new PIXI.Text({
      text: this.options.title,
      style: this.options.titleStyle,
    });
    this.contentContainer = new PIXI.Container();

    // 添加子元素
    this.addChild(this.backgroundGraphics);
    this.addChild(this.contentContainer);
    this.addChild(this.titleText);

    // --- 设置布局和初始绘制 ---
    this._updateSizeAndLayout(); // 新的统一方法

    // --- 启用交互 ---
    this.eventMode = "static"; // 使块可交互
    this.cursor = "grab"; // 设置默认光标为抓手

    this.on("pointerdown", this.onDragStart, this);
    this.on("pointerup", this.onDragEnd, this);
    this.on("pointerupoutside", this.onDragEnd, this);
    this.on("pointermove", this.onDragMove, this);
    this.on("pointerover", this.onPointerOver, this);
    this.on("pointerout", this.onPointerOut, this);
  }

  /**
   * [核心重构] 计算块所需尺寸、重绘背景/边框、并布局子元素。
   * 会修改 this.options.width 和 this.options.height。
   */
  private _updateSizeAndLayout() {
    // --- 1. 计算所需尺寸 ---
    const padding = this.options.padding;
    const separatorThickness = 1; // 分隔线厚度
    const titleBounds = this.titleText.getLocalBounds(); // 获取标题的本地边界
    // 注意: getLocalBounds 可能在文本样式更改后需要一些时间更新，但通常足够快

    // 计算标题区域高度 (从顶部到分隔线下方一点)
    const titleAreaHeight =
      padding +
      titleBounds.height +
      padding / 2 +
      separatorThickness +
      padding / 2;

    // 获取内容尺寸 (如果内容为空，则尺寸为0)
    const contentBounds = this.contentContainer.getLocalBounds();
    const contentWidth = contentBounds.width > 0 ? contentBounds.width : 0;
    const contentHeight = contentBounds.height > 0 ? contentBounds.height : 0;

    // 计算总宽度 (至少是标题宽度，加上两边内边距)
    // 考虑内容宽度也可能影响总宽度
    const requiredInnerWidth = Math.max(titleBounds.width, contentWidth);
    const newWidth = requiredInnerWidth + padding * 2;

    // 计算总高度 (标题区 + 内容区 + 底部内边距)
    const newHeight = titleAreaHeight + contentHeight + padding;

    // 更新 options 中的尺寸 (或者使用内部变量)
    // 应该允许用户指定最小尺寸吗？暂时不考虑，直接更新。
    this.options.width = Math.max(newWidth, DEFAULT_BLOCK_OPTIONS.width); // 至少保持默认宽度
    this.options.height = Math.max(newHeight, DEFAULT_BLOCK_OPTIONS.height); // 至少保持默认高度

    // --- 2. 重绘背景和边框 (使用新尺寸) ---
    this.redraw();

    // --- 3. 布局子元素 (使用新尺寸) ---
    // 定位标题文本 (水平居中, 靠近顶部并带内边距)
    this.titleText.anchor.set(0.5, 0);
    this.titleText.x = this.options.width / 2;
    this.titleText.y = padding;

    // 设置内容容器的位置
    const separatorY = this.titleText.y + titleBounds.height + padding / 2; // 分隔线 Y 坐标
    this.contentContainer.x = padding;
    this.contentContainer.y = separatorY + separatorThickness + padding / 2;

    // --- 4. [移到 setContent 后执行] 内容居中逻辑 ---
    // Centering needs to happen *after* content is added and block resized.
  }

  /** [重构] 仅根据当前 options 重绘块的背景、边框和分隔线 */
  private redraw() {
    this.backgroundGraphics.clear();

    // 根据悬浮状态选择边框颜色
    const borderColor = this.isHovering
      ? this.options.borderColorHover
      : this.options.borderColor;
    const padding = this.options.padding;

    // 绘制背景 (使用圆角矩形)
    this.backgroundGraphics.roundRect(
      0,
      0,
      this.options.width,
      this.options.height,
      this.options.borderRadius,
    );
    this.backgroundGraphics.fill(this.options.backgroundColor);

    // 绘制边框
    if (this.options.borderWidth > 0) {
      this.backgroundGraphics.stroke({
        width: this.options.borderWidth,
        color: borderColor,
        alignment: 0.5, // 居中描边，视觉效果可能更好
      });
    }

    // --- 绘制标题分隔线 ---
    // 需要使用更新后的 titleText 位置和 block 宽度
    const titleBounds = this.titleText.getLocalBounds();
    const separatorY = this.titleText.y + titleBounds.height + padding / 2;
    const separatorWidth = this.options.width - padding * 2;
    const separatorColor = 0x555555; // 分隔线颜色 (深灰色)
    const separatorThickness = 1;

    if (separatorWidth > 0) {
      this.backgroundGraphics.moveTo(padding, separatorY);
      this.backgroundGraphics.lineTo(padding + separatorWidth, separatorY);
      this.backgroundGraphics.stroke({
        width: separatorThickness,
        color: separatorColor,
      });
    }
  }

  // --- 交互事件处理器 ---

  /** 按下指针开始拖动 */
  private onDragStart(event: PIXI.FederatedPointerEvent) {
    if (!this.sceneRef || !this.sceneRef.app) return; // 防御性检查

    this.isDragging = true;
    // 计算指针相对于块左上角的偏移量
    const localPos = this.toLocal(event.global);
    this.dragOffset.set(localPos.x, localPos.y);

    this.cursor = "grabbing"; // 设置块的光标为抓取中
    if (this.sceneRef.app.stage) {
      this.sceneRef.app.stage.cursor = "grabbing"; // 可选：设置全局光标为抓取中
    }

    // 将当前块置于父容器（场景）的最顶层
    this.sceneRef.addChild(this);
  }

  /** 抬起指针结束拖动 */
  private onDragEnd() {
    if (this.isDragging) {
      this.isDragging = false;
      this.cursor = "grab"; // 恢复块的光标为可抓取
      // 恢复全局光标
      if (this.sceneRef && this.sceneRef.app && this.sceneRef.app.stage) {
        this.sceneRef.app.stage.cursor = "default";
      }
    }
  }

  /** 移动指针处理拖动 */
  private onDragMove(event: PIXI.FederatedPointerEvent) {
    if (this.isDragging) {
      // 检查父容器是否存在
      if (!this.parent) return;

      // 获取指针在父容器（场景）坐标系中的位置
      const parentPos = this.parent.toLocal(event.global);

      // 计算块期望的新左上角位置
      let newX = parentPos.x - this.dragOffset.x;
      let newY = parentPos.y - this.dragOffset.y;

      // 基于场景逻辑尺寸应用边界约束
      const sceneWidth = this.sceneRef.logicalWidth;
      const sceneHeight = this.sceneRef.logicalHeight;
      // 使用选项中的宽高进行计算，因为容器的 width/height 可能基于内容
      const blockWidth = this.options.width;
      const blockHeight = this.options.height;

      // 将新位置限制在场景边界内
      newX = Math.max(0, Math.min(newX, sceneWidth - blockWidth));
      newY = Math.max(0, Math.min(newY, sceneHeight - blockHeight));

      // 更新块的位置
      this.x = newX;
      this.y = newY;
    }
  }

  /** 指针移入块 */
  private onPointerOver() {
    this.isHovering = true;
    this.redraw(); // 重绘以显示悬浮状态
  }

  /** 指针移出块 */
  private onPointerOut() {
    this.isHovering = false;
    this.redraw(); // 重绘以恢复默认状态
  }

  // --- 公共方法 ---

  /**
   * 设置块的内容区域显示的可视化组件。
   * 会移除之前的内容，并根据内容调整块的大小，然后将内容居中。
   * @param content - 要显示的 PIXI.Container (例如 ArrayVisualization 实例) 或 null。
   */
  setContent(content: PIXI.Container | null) {
    // 移除旧内容
    this.contentContainer.removeChildren();

    if (content) {
      // 将新内容添加到内容容器中 (先放在 0,0)
      this.contentContainer.addChild(content);

      // 更新块的尺寸和布局以适应新内容
      this._updateSizeAndLayout(); // 这会重绘背景/边框并重新定位 contentContainer

      // --- 内容居中 ---
      // 在块尺寸确定后，计算内容在 contentContainer 内的居中位置
      const contentBounds = content.getLocalBounds(); // 获取内容自身的本地边界

      // 计算 contentContainer 的可用宽度和高度
      // 注意：contentContainer 的 x,y 已经是考虑了 padding 和标题区的
      const availableWidth = this.options.width - 2 * this.options.padding;
      const availableHeight =
        this.options.height - this.contentContainer.y - this.options.padding;

      // 计算内容边界框在其父容器(contentContainer)中居中时的左上角目标位置
      const targetContentX = (availableWidth - contentBounds.width) / 2;
      const targetContentY = (availableHeight - contentBounds.height) / 2;

      // 设置 content 的原点位置，使得其边界框的左上角位于目标位置
      // content.x = 目标X - contentBounds.x (边界框左侧相对于原点的偏移)
      // content.y = 目标Y - contentBounds.y (边界框顶部相对于原点的偏移)
      content.x = targetContentX - contentBounds.x;
      content.y = targetContentY - contentBounds.y;
    } else {
      // 如果内容为 null，也需要更新尺寸 (会收缩到最小尺寸)
      this._updateSizeAndLayout();
    }
  }
}
