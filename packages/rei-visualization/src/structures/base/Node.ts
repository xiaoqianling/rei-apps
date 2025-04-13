import * as PIXI from "pixi.js";

// --- 节点选项接口 ---
export interface NodeOptions {
  value: string | number; // 节点显示的值
  x?: number; // 初始位置 X
  y?: number; // 初始位置 Y
  radius?: number; // 节点半径
  backgroundColor?: number; // 背景色
  borderColor?: number; // 边框颜色
  borderColorHover?: number; // 悬浮时边框颜色
  borderWidth?: number; // 边框宽度
  valueStyle?: Partial<PIXI.TextStyle>; // 值的文本样式
}

// --- 默认节点选项 ---
const DEFAULT_NODE_OPTIONS: Required<Omit<NodeOptions, "value" | "x" | "y">> &
  Pick<NodeOptions, "x" | "y"> = {
  x: 0,
  y: 0,
  radius: 25,
  backgroundColor: 0x1e90ff, // 道奇蓝
  borderColor: 0xffffff, // 白色边框
  borderColorHover: 0xffd700, // 金色悬浮边框
  borderWidth: 2,
  valueStyle: {
    fill: 0xffffff, // 白色文字
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Arial",
    align: "center",
  },
};

// 定义合并后的内部选项类型 (所有字段除了 value 都是 required)
// x, y 保证是 number 类型
type InternalNodeOptions = Required<Omit<NodeOptions, "value">> & {
  value: string | number;
};

/**
 * 代表一个可视化的节点（例如，用于树、图、链表）。
 */
export class Node extends PIXI.Container {
  private options: InternalNodeOptions;
  private circleGraphics: PIXI.Graphics; // 用于绘制圆形背景和边框
  private valueText: PIXI.Text; // 用于显示节点值
  private isHovering = false; // 标记悬浮状态

  constructor(options: NodeOptions) {
    super();

    // 1. 先合并所有可能包含 undefined 的选项
    const initialMerge = {
      ...DEFAULT_NODE_OPTIONS, // 提供 radius, colors, borderWidth, valueStyle 等默认值
      ...options, // 用户传入的选项覆盖默认值 (x, y 可能还是 undefined)
      value: options.value, // value 是必需的
      // 合并 valueStyle
      valueStyle: {
        ...DEFAULT_NODE_OPTIONS.valueStyle,
        ...(options.valueStyle ?? {}),
      },
    };

    // 2. 创建最终的 options 对象, 确保 x 和 y 是 number
    this.options = {
      // 从 initialMerge 继承所有 Required<Omit<NodeOptions, 'value'|'x'|'y'>> 的属性
      radius: initialMerge.radius,
      backgroundColor: initialMerge.backgroundColor,
      borderColor: initialMerge.borderColor,
      borderColorHover: initialMerge.borderColorHover,
      borderWidth: initialMerge.borderWidth,
      valueStyle: initialMerge.valueStyle,
      // 显式处理 value, x, y 以满足 InternalNodeOptions
      value: initialMerge.value,
      x: initialMerge.x ?? DEFAULT_NODE_OPTIONS.x,
      y: initialMerge.y ?? DEFAULT_NODE_OPTIONS.y,
    } as InternalNodeOptions;

    this.x = this.options.x;
    this.y = this.options.y;
    // 设置 Container 的 hitArea 为一个覆盖节点的圆形区域，以便精确交互
    // 半径可以稍微大一点点，方便用户交互
    this.hitArea = new PIXI.Circle(
      0,
      0,
      this.options.radius + this.options.borderWidth,
    );

    // --- 创建子元素 ---
    this.circleGraphics = new PIXI.Graphics();
    this.valueText = new PIXI.Text({
      text: String(this.options.value), // 确保转为字符串
      style: this.options.valueStyle,
    });

    this.addChild(this.circleGraphics);
    this.addChild(this.valueText);

    // --- 布局与绘制 ---
    this.updateLayout();
    this.redraw();

    // --- 交互 ---
    this.eventMode = "static"; // 使节点可交互
    this.cursor = "pointer"; // 设置光标为指针

    this.on("pointerover", this.onPointerOver, this);
    this.on("pointerout", this.onPointerOut, this);
    // 监听 pointertap 事件，它结合了 pointerdown 和 pointerup，更适合点击
    this.on("pointertap", this.onPointerTap, this);
  }

  /** 更新值的布局（居中） */
  private updateLayout() {
    this.valueText.anchor.set(0.5); // 设置锚点为中心
    this.valueText.x = 0; // 定位在容器中心 X
    this.valueText.y = 0; // 定位在容器中心 Y
  }

  /** 重绘节点背景和边框 */
  private redraw() {
    this.circleGraphics.clear();

    const borderColor = this.isHovering
      ? this.options.borderColorHover
      : this.options.borderColor;

    // 绘制背景圆
    this.circleGraphics.circle(0, 0, this.options.radius);
    this.circleGraphics.fill(this.options.backgroundColor);

    // 绘制边框
    if (this.options.borderWidth > 0) {
      this.circleGraphics.stroke({
        width: this.options.borderWidth,
        color: borderColor,
        alignment: 0.5, // 0.5 表示描边跨越路径内外 (居中描边)
      });
    }
  }

  // --- 事件处理器 ---

  private onPointerOver() {
    this.isHovering = true;
    this.redraw();
    this.emit("nodeHover", this); // 发出悬浮事件
  }

  private onPointerOut() {
    this.isHovering = false;
    this.redraw();
    this.emit("nodeOut", this); // 发出移出事件
  }

  private onPointerTap() {
    // console.log('Node clicked:', this.options.value);
    this.emit("nodeClick", this); // 发出点击事件，传递节点实例
  }

  // --- 公共方法 (用于外部更新节点状态) ---

  /** 更新节点显示的值 */
  setValue(value: string | number) {
    this.options.value = value;
    this.valueText.text = String(value);
    this.updateLayout(); // 值可能改变大小，需要重新布局
  }

  /** 获取节点的值 */
  getValue(): string | number {
    return this.options.value;
  }

  /** 获取节点的半径 */
  getRadius(): number {
    return this.options.radius;
  }

  /** 更新节点样式 (部分更新) */
  updateStyle(styleChanges: Partial<NodeOptions>) {
    // 接受部分 NodeOptions
    // 谨慎合并样式，特别是嵌套的 valueStyle
    const oldOptions = { ...this.options }; // 复制旧选项

    // 创建一个临时的新选项对象，包含所有可能的字段（以满足 InternalNodeOptions）
    const newOptionsCandidate = {
      ...oldOptions,
      ...styleChanges,
      // 如果传入了 valueStyle，需要合并
      valueStyle: {
        ...oldOptions.valueStyle, // 使用旧的完整样式
        ...(styleChanges.valueStyle ?? {}), // 合并传入的部分样式
      },
    };

    // 确保 x 和 y 仍然是 number (如果 styleChanges 中没有提供，它们来自 oldOptions)
    newOptionsCandidate.x = newOptionsCandidate.x ?? DEFAULT_NODE_OPTIONS.x;
    newOptionsCandidate.y = newOptionsCandidate.y ?? DEFAULT_NODE_OPTIONS.y;

    // 现在 newOptionsCandidate 应该满足 InternalNodeOptions 的类型要求
    this.options = newOptionsCandidate as InternalNodeOptions;

    // 更新文本样式和重绘
    // @ts-ignore // PIXI.Text style accepts a TextStyle instance or object literal
    this.valueText.style = this.options.valueStyle;
    this.updateLayout();
    this.redraw();
  }
}
