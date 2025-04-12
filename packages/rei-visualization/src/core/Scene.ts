import * as PIXI from 'pixi.js';
import { Block, BlockOptions } from '../structures/base/Block'; // Use standard import

/**
 * 代表 PixiJS 应用中的主场景/画布。
 * 该容器持有所有可视化元素（数据结构块等），
 * 并处理平移、缩放和边界约束。
 */
export class Scene extends PIXI.Container {
    public app: PIXI.Application;        // 对 Pixi 应用的引用 (公开给 Block 访问)
    public logicalWidth: number;       // 场景的逻辑宽度 (公开给 Block 访问)
    public logicalHeight: number;      // 场景的逻辑高度 (公开给 Block 访问)
    private border: PIXI.Graphics;       // 场景边框图形 (私有)
    private gridBackground: PIXI.Graphics; // 网格背景图形 (私有)

    // 定义缩放限制
    private minZoom = 0.1; // 默认最小缩放比例，将被更新
    private maxZoom = 5.0; // 示例：最大缩放比例

    // 动画状态
    private targetScale: number = 1;
    private targetX: number = 0;
    private targetY: number = 0;
    private isAnimating: boolean = false;
    private readonly animationLerpFactor: number = 0.2; // 插值系数 (0 到 1，越大越快)

    constructor(app: PIXI.Application, initialWidth: number, initialHeight: number) {
        super();
        this.app = app;
        this.logicalWidth = initialWidth;
        this.logicalHeight = initialHeight;
        this.eventMode = 'static'; // 使场景本身也能响应事件（如果需要）

        // 首先创建并添加网格背景 (添加到索引 0，即最底层)
        this.gridBackground = new PIXI.Graphics();
        this.addChildAt(this.gridBackground, 0);
        this.drawGridBackground();

        // 创建边框图形以可视化场景边界
        this.border = new PIXI.Graphics();
        this.drawBorder();
        this.addChild(this.border); // 添加到顶层

        // 可选：添加一个纯色背景矩形
        // const background = new PIXI.Graphics()
        //     .rect(0, 0, this.logicalWidth, this.logicalHeight)
        //     .fill(0xffffff); // 例如白色背景
        // this.addChildAt(background, 0); // 添加到网格背景之后，边框之前

        this.targetScale = this.scale.x; // 初始化目标缩放为当前缩放
        this.targetX = this.x;
        this.targetY = this.y;

        // 将动画更新方法绑定到 ticker
        // 使用 bind 确保 this 上下文正确
        this.app.ticker.add(this.updateAnimation, this);
    }

    /** 绘制场景边框 */
    private drawBorder() {
        this.border.clear();
        // 绘制简单的矩形边框
        this.border.rect(0, 0, this.logicalWidth, this.logicalHeight);
        // 使用 strokeStyle (PIXI v8+)
         this.border.stroke({ width: 2, color: 0xAAAAAA, alignment: 1 }); // 内部对齐描边
    }

    /** 绘制网格点阵背景 */
    private drawGridBackground() {
        const gridSpacing = 50; // 网格线之间的像素距离
        const dotRadius = 2;    // 网格点的大小
        const dotColor = 0xCCCCCC; // 使用高对比度颜色 (浅灰色)

        this.gridBackground.clear();
        // 恢复原始的点绘制逻辑，使用高对比度颜色
        for (let x = gridSpacing; x < this.logicalWidth; x += gridSpacing) {
            for (let y = gridSpacing; y < this.logicalHeight; y += gridSpacing) {
                // 在循环内设置填充以进行测试（确保每个点都设置了颜色）
                this.gridBackground.fill(dotColor); 
                // 绘制每个交叉点的小圆圈
                this.gridBackground.circle(x, y, dotRadius);
            }
        }
    }

    // --- 变换操作 ---

    /**
     * 通过给定的增量值平移场景。
     * @param dx - X 坐标的变化量。
     * @param dy - Y 坐标的变化量。
     */
    pan(dx: number, dy: number) {
        // 更新目标位置
        this.targetX += dx;
        this.targetY += dy;

        // 启动动画
        this.isAnimating = true;
    }

    /**
     * 围绕指定点按给定的比例因子缩放场景。
     * @param scale - 缩放因子 (例如，1.1 表示放大，0.9 表示缩小)。
     * @param pointX - 缩放中心的 X 坐标 (在渲染器/容器空间中)。
     * @param pointY - 缩放中心的 Y 坐标 (在渲染器/容器空间中)。
     */
    zoom(scale: number, pointX: number, pointY: number) {
        // --- 计算目标缩放 --- 
        const currentScale = this.targetScale; // 使用目标值作为起点，避免累积误差
        let newTargetScale = currentScale * scale;

        // 将缩放比例限制在最小/最大值之间
        newTargetScale = Math.max(this.minZoom, Math.min(this.maxZoom, newTargetScale));

        // 如果目标缩放没有实际变化，则无需继续
        if (newTargetScale === this.targetScale) {
             return;
        }

        // 计算缩放前指针位置对应的场景本地坐标
        const worldPos = new PIXI.Point(pointX, pointY);
        // 注意：这里使用当前的实际 scale 和 position 来计算本地坐标
        const beforeScaleLocalPos = this.toLocal(worldPos); 

        // --- 计算缩放后的虚拟位置（如果立即应用缩放）---
        // 为了计算目标 X, Y，我们需要模拟如果立刻应用 newTargetScale 会发生什么
        const scaleRatio = newTargetScale / this.scale.x; //相对于当前实际scale的比例

        // 模拟缩放后的本地坐标 (相对于当前实际scale)
        // (或者更准确地说，我们需要知道应用 targetScale 后，相对于原点，beforeScaleLocalPos 会移动到哪里)
        // 缩放操作是围绕 (0,0) 点的，所以本地坐标会按比例变化
        const afterSimulatedScaleLocalPos = new PIXI.Point(
             beforeScaleLocalPos.x * scaleRatio, 
             beforeScaleLocalPos.y * scaleRatio
        );

        // --- 计算目标 X, Y --- 
        // 目标 X, Y 应该是调整后的位置，使得缩放后鼠标下的内容保持不变
        // 目标 X = 当前 X - (缩放后本地 X - 缩放前本地 X) * 目标缩放
        // 目标 Y = 当前 Y - (缩放后本地 Y - 缩放前本地 Y) * 目标缩放
        // 注意：这里的计算是基于 **目标** 缩放值，但移动补偿是相对于 **当前** 位置计算的
        let targetX = this.x - (afterSimulatedScaleLocalPos.x - beforeScaleLocalPos.x) * newTargetScale;
        let targetY = this.y - (afterSimulatedScaleLocalPos.y - beforeScaleLocalPos.y) * newTargetScale;

        // --- 更新目标状态 --- 
        this.targetScale = newTargetScale;
        this.targetX = targetX;
        this.targetY = targetY;

        // 启动动画循环（如果尚未运行）
        this.isAnimating = true;
        // ticker 已在构造函数中添加，无需重复添加
        // this.app.ticker.add(this.updateAnimation, this);
    }

    // --- 边界约束 ---

    /**
     * 调整场景的位置和缩放，确保其边框不进入可见的容器区域。
     * 这个方法现在也应用于目标 X, Y 值。
     * @param targetX 要约束的X坐标
     * @param targetY 要约束的Y坐标
     * @param targetScale 要约束的缩放值
     * @param containerWidth 容器宽度
     * @param containerHeight 容器高度
     * @returns 返回约束后的 { x, y, scale } 对象
     */
    applyConstraintsToTarget(targetX: number, targetY: number, targetScale: number, containerWidth?: number, containerHeight?: number): { x: number, y: number, scale: number } {
        const cw = containerWidth ?? this.app.screen.width;
        const ch = containerHeight ?? this.app.screen.height;

        // 计算场景在渲染器坐标系中的可见尺寸
        const sceneVisibleWidth = this.logicalWidth * targetScale;
        const sceneVisibleHeight = this.logicalHeight * targetScale;

        let constrainedX = targetX;
        let constrainedY = targetY;
        let constrainedScale = targetScale;

        // --- 位置约束 (保持边框在容器外部或边缘) ---

        // 左边界约束：场景左边缘 (this.x) 不能 > 0
        if (constrainedX > 0) {
            constrainedX = 0;
        }
        // 右边界约束：场景右边缘 (this.x + sceneVisibleWidth) 必须 >= 容器宽度
        if (constrainedX + sceneVisibleWidth < cw) {
             constrainedX = cw - sceneVisibleWidth; // 推左边缘
        }
        // 上边界约束：场景上边缘 (this.y) 不能 > 0
        if (constrainedY > 0) {
            constrainedY = 0;
        }
        // 下边界约束：场景下边缘 (this.y + sceneVisibleHeight) 必须 >= 容器高度
        if (constrainedY + sceneVisibleHeight < ch) {
            constrainedY = ch - sceneVisibleHeight; // 推上边缘
        }

        // --- 缩放约束 (确保缩放不小于最小覆盖比例) ---
        const minScale = this.calculateMinScaleToCover(cw, ch);
        if (constrainedScale < minScale) {
            constrainedScale = minScale;
            // 如果缩放被强制增大，可能需要重新计算位置约束
            // 简单起见，我们可以在动画循环的下一帧重新应用约束
            // 或者在这里递归调用一次（注意避免死循环）
            // 为了简化，暂时只调整 scale
        }

        return { x: constrainedX, y: constrainedY, scale: constrainedScale };
    }

    /**
     * 初始时或容器发生显著尺寸变化时，使场景适配容器。
     * 计算初始缩放比例以确保场景覆盖容器，
     * 然后应用约束来正确定位它。
     */
    fitToContainer(containerWidth: number, containerHeight: number) {
        this.updateMinZoom(containerWidth, containerHeight); // 根据当前容器尺寸更新 minZoom

        const currentScale = this.scale.x; // 假设统一缩放
        const minScale = this.calculateMinScaleToCover(containerWidth, containerHeight);

        // 如果当前缩放小于最小覆盖缩放，则设置为最小覆盖缩放
        if (currentScale < minScale) {
             this.scale.set(minScale);
        }

         // 确保最小缩放后，应用约束来正确定位。
         // 初始时将视图居中。计算居中所需的左上角 (x,y)。
         const sceneVisibleWidth = this.logicalWidth * this.scale.x;
         const sceneVisibleHeight = this.logicalHeight * this.scale.y;

         this.x = (containerWidth - sceneVisibleWidth) / 2;
         this.y = (containerHeight - sceneVisibleHeight) / 2;

        // 应用约束，确保居中位置有效
        const constrained = this.applyConstraintsToTarget(this.x, this.y, this.scale.x, containerWidth, containerHeight);
        this.x = constrained.x;
        this.y = constrained.y;
        this.scale.set(constrained.scale);

        // 同步目标状态
        this.targetX = this.x;
        this.targetY = this.y;
        this.targetScale = this.scale.x;
    }

    /**
     * 计算场景覆盖容器尺寸所需的最小缩放比例。
     */
    private calculateMinScaleToCover(containerWidth?: number, containerHeight?: number): number {
        const cw = containerWidth ?? this.app.screen.width;
        const ch = containerHeight ?? this.app.screen.height;

        // 如果尺寸无效，返回一个默认的最小缩放值
        if (cw <= 0 || ch <= 0 || this.logicalWidth <= 0 || this.logicalHeight <= 0) {
            return 0.1; // 回退到默认 minZoom
        }

        const scaleX = cw / this.logicalWidth;
        const scaleY = ch / this.logicalHeight;
        // 返回需要覆盖容器的最大比例，确保比例为正数
        return Math.max(scaleX, scaleY, 0.01); 
    }

    /**
     * 根据容器尺寸更新允许的最小缩放级别。
     * 确保场景不能缩小到无法覆盖容器的程度。
     */
    private updateMinZoom(containerWidth?: number, containerHeight?: number): void {
        this.minZoom = this.calculateMinScaleToCover(containerWidth, containerHeight);
    }

    // --- 内容管理 ---

    /**
     * 使用给定的选项创建一个新的 Block 实例并将其添加到场景中。
     * @param options - 块的配置选项。
     * @returns 新创建的 Block 实例。
     */
    addBlock(options: BlockOptions): Block {
        const block = new Block(this, options);
        this.addChild(block); // 将块添加到场景
        return block;
    }

    /**
     * 动画更新循环，由 ticker 调用。
     */
    private updateAnimation() {
        if (!this.isAnimating) {
            return; // 如果没有动画目标，则不执行
        }

        // 应用约束到目标值
        const constrainedTarget = this.applyConstraintsToTarget(this.targetX, this.targetY, this.targetScale);
        this.targetX = constrainedTarget.x;
        this.targetY = constrainedTarget.y;
        this.targetScale = constrainedTarget.scale;

        // 插值计算当前帧的 scale, x, y
        const currentScale = this.scale.x; // 假设统一缩放
        const currentX = this.x;
        const currentY = this.y;

        const nextScale = currentScale + (this.targetScale - currentScale) * this.animationLerpFactor;
        const nextX = currentX + (this.targetX - currentX) * this.animationLerpFactor;
        const nextY = currentY + (this.targetY - currentY) * this.animationLerpFactor;

        // 应用计算出的下一帧状态
        this.scale.set(nextScale);
        this.x = nextX;
        this.y = nextY;

        // 检查是否足够接近目标值以停止动画
        // 使用一个小的阈值来判断
        const scaleThreshold = 0.001;
        const positionThreshold = 0.1; 

        if (
            Math.abs(this.targetScale - nextScale) < scaleThreshold &&
            Math.abs(this.targetX - nextX) < positionThreshold &&
            Math.abs(this.targetY - nextY) < positionThreshold
        ) {
            // 非常接近目标，直接设置为目标值并停止动画
            this.scale.set(this.targetScale);
            this.x = this.targetX;
            this.y = this.targetY;
            this.isAnimating = false;
            // console.log("Animation stopped");
            // 注意：我们不从 ticker 中移除，让它一直运行，但只在 isAnimating 为 true 时执行插值
            // this.app.ticker.remove(this.updateAnimation, this);
        } else {
            // console.log(`Animating: scale=${nextScale.toFixed(3)}, x=${nextX.toFixed(1)}, y=${nextY.toFixed(1)}`);
        }
    }

    // removeBlock(block: PIXI.Container) {
    //   this.removeChild(block);
    // }
} 