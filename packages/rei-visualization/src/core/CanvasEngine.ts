import * as PIXI from 'pixi.js';
import { Scene } from './Scene';

// 设置 PixiJS 全局设置以提高清晰度
// PixiJS v8+ 设置像素舍入的方式
// (注意：ROUND_PIXELS 可能在 v8 中已移除或效果不同，更推荐处理分辨率和抗锯齿)
// PIXI.BaseTexture.defaultOptions.ROUND_PIXELS = true; // 尝试旧方式，但不确定是否有效
// 或者确保渲染器抗锯齿关闭可能有助于锐化，但通常不推荐用于图形
// this.app.init({ ..., antialias: false }); 
// 最可靠的方法是下面 Block.ts 中的 TextStyle resolution

/**
 * 管理 PixiJS 应用、场景以及可视化画布的交互。
 */
export class CanvasEngine {
    private app: PIXI.Application | null = null; // Pixi 应用实例，允许为 null
    private scene: Scene | null = null;         // 主场景实例，允许为 null
    private container: HTMLElement | null;        // 包含 Canvas 的 HTML 容器，允许为 null (在构造函数中赋值)

    // 交互状态变量
    private isDragging = false; // 是否正在拖拽画布
    private lastPointerPosition = { x: 0, y: 0 }; // 上一次指针位置（用于计算拖拽增量）

    // 存储绑定的方法和观察器以便清理
    private boundOnWheel: ((event: WheelEvent) => void) | null = null; // 绑定的滚轮事件处理器，允许为 null
    private resizeObserver?: ResizeObserver; // 容器尺寸变化观察器

    // 标记以防止重复销毁和竞态条件
    private isDestroyed = false;

    /**
     * 创建并初始化 PixiJS 应用和场景。
     * @param container - 包含画布的 HTML 元素。
     * @param options - 引擎的可选配置。
     */
    constructor(container: HTMLElement, options?: {
        logicalWidth?: number;     // 场景的逻辑宽度
        logicalHeight?: number;    // 场景的逻辑高度
        backgroundColor?: number;  // 渲染器背景色
        antialias?: boolean;       // 是否开启抗锯齿
    }) {
        this.container = container;

        const defaultOptions = {
            logicalWidth: 2000,       // 场景画布的默认逻辑尺寸
            logicalHeight: 1500,
            backgroundColor: 0x1a1a1a, // 深灰色背景
            antialias: true,
        };
        const config = { ...defaultOptions, ...options }; // 合并用户选项

        // 初始化 PixiJS 应用实例 (同步部分)
        this.app = new PIXI.Application();

        // 存储绑定的滚轮处理器（在异步 init 之前）
        this.boundOnWheel = this.onWheel.bind(this);

        // 使用 requestAnimationFrame 推迟异步初始化，直到浏览器准备好绘制
        requestAnimationFrame(() => {
            // 在开始初始化前检查是否已被销毁
            if (this.isDestroyed || !this.container || !this.app) {
                console.warn("初始化跳过：引擎在初始化开始前已被销毁或容器无效。");
                return;
            }

            // 初始化前检查容器尺寸
            const initialWidth = this.container.clientWidth;
            const initialHeight = this.container.clientHeight;
            if (initialWidth <= 0 || initialHeight <= 0) {
                console.warn(`PixiJS 初始化跳过：容器尺寸为零 (${initialWidth}x${initialHeight})。请确保其可见并已布局。`);
                return;
            }

            // 初始化 Pixi 应用 (异步部分)
            this.app.init({
                width: initialWidth,
                height: initialHeight,
                backgroundColor: config.backgroundColor,
                antialias: config.antialias,
                resolution: window.devicePixelRatio || 1, // 设置渲染器分辨率以匹配设备
                autoDensity: true, // 自动调整视图样式密度
                // resizeTo: this.container // 移除：通过 ResizeObserver 手动管理尺寸调整
            }).then(() => {
                // 在异步初始化过程中检查是否已被销毁
                if (this.isDestroyed || !this.app) return;

                // 创建主场景
                this.scene = new Scene(this.app, config.logicalWidth, config.logicalHeight);
                // 检查舞台是否存在后再添加子元素
                if (this.app.stage) {
                    this.app.stage.addChild(this.scene);
                } else {
                     console.error("PixiJS stage 在初始化后不可用。正在尝试销毁...");
                     this.destroy(); // 如果舞台丢失，则清理
                     return;
                }

                // 初始适配/定位场景
                if (this.scene && this.container) {
                    this.scene.fitToContainer(this.container.clientWidth, this.container.clientHeight);
                }

                // 添加 PixiJS 视图 (canvas 元素) 到容器中
                if (this.container && this.app.canvas) {
                    // 确保如果 init 多次运行（理论上不应发生），canvas 不会被重复添加
                    if (!this.container.contains(this.app.canvas)) {
                        this.container.appendChild(this.app.canvas);
                    }
                } else if (!this.isDestroyed) {
                    console.warn("容器在 PixiJS 画布可以附加之前已被移除。");
                }

                // 设置交互监听器
                this.setupInteractions();
            }).catch((err: any) => {
                // 记录错误前检查是否已被销毁
                if (this.isDestroyed) return;
                console.error("PixiJS 初始化失败:", err);
            });
        }); // requestAnimationFrame 回调结束
    }

    /**
     * 设置用于平移和缩放的事件监听器。
     */
    private setupInteractions(): void {
        // 使舞台可交互以捕获全局鼠标/指针事件
        // 注意：确保在 app 初始化之后运行
        if (this.isDestroyed || !this.app || !this.app.stage || !this.container) {
            console.warn("setupInteractions 在 PixiJS 应用舞台就绪前或引擎销毁后被调用。",{
                isDestroyed: this.isDestroyed,
                appReady: !!this.app,
                stageReady: !!this.app?.stage,
                containerReady: !!this.container
            });
            return;
        }

        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen; // 确保舞台捕获整个屏幕的事件

        // 平移监听器
        this.app.stage.on('pointerdown', this.onDragStart, this);
        this.app.stage.on('pointerup', this.onDragEnd, this);
        this.app.stage.on('pointerupoutside', this.onDragEnd, this);
        this.app.stage.on('pointermove', this.onDragMove, this);

        // 缩放监听器 - 使用存储的绑定函数
        if (this.boundOnWheel) { // 检查绑定函数是否存在
            this.container.addEventListener('wheel', this.boundOnWheel, { passive: false });
        } else {
             console.warn("滚轮监听器未附加：绑定函数缺失。");
        }

        // 处理尺寸调整
        // 使用 ResizeObserver 进行稳健的容器尺寸检测
        this.resizeObserver = new ResizeObserver(entries => {
             if (this.isDestroyed) return; // 如果已销毁，不处理
            for (let entry of entries) {
                // 手动调整渲染器尺寸并应用场景约束
                const { width, height } = entry.contentRect;
                if (this.app && this.app.renderer) {
                     // 更新 PixiJS 渲染器尺寸
                     try {
                        this.app.renderer.resize(width, height);
                     } catch (e) {
                         console.error("调整 PixiJS 渲染器尺寸时出错:", e);
                     }
                }
                if(this.scene) { // 确保场景已初始化
                     this.scene.applyConstraints(width, height);
                }
            }
        });
        // 检查容器是否存在后再观察
        if (this.resizeObserver && this.container) {
            this.resizeObserver.observe(this.container);
        } else {
            console.warn("ResizeObserver 未启动：观察器或容器缺失。")
        }
    }

    /** 指针按下事件处理器（画布拖动开始） */
    private onDragStart(event: PIXI.FederatedPointerEvent): void {
        // 仅当直接目标是舞台或场景本身时才开始拖动
        // 这可以防止在与场景上的未来元素交互时触发画布拖动
        if (this.app && this.app.stage && this.scene && (event.target === this.app.stage || event.target === this.scene)) {
            this.isDragging = true;
            this.lastPointerPosition = { x: event.global.x, y: event.global.y };
            // 在舞台上设置光标样式
            if (this.app.stage) {
                this.app.stage.cursor = 'grabbing'; // 改变光标为抓取手势
            }
        }
    }

     /** 指针抬起事件处理器（画布拖动结束） */
    private onDragEnd(): void {
        if (this.isDragging) {
            this.isDragging = false;
             // 恢复舞台光标
            if (this.app && this.app.stage) {
                this.app.stage.cursor = 'grab'; // 恢复光标为可抓取手势 (或 'default')
            }
        }
    }

    /** 指针移动事件处理器（处理画布拖动） */
    private onDragMove(event: PIXI.FederatedPointerEvent): void {
        if (this.isDragging) {
            const currentPosition = event.global;
            const dx = currentPosition.x - this.lastPointerPosition.x;;
            const dy = currentPosition.y - this.lastPointerPosition.y;;

            // 平移场景 (?. 确保 scene 存在)
            this.scene?.pan(dx, dy);

            this.lastPointerPosition = { x: currentPosition.x, y: currentPosition.y };
        }
    }

    /** 滚轮事件处理器（处理画布缩放） */
    private onWheel(event: WheelEvent): void {
        event.preventDefault(); // 阻止页面滚动

        // 检查容器和场景是否存在
        if (!this.container || !this.scene) return;

        const scaleFactor = event.deltaY < 0 ? 1.05 : 0.95; // 缩放因子
        // 计算指针在容器内的相对坐标
        const rect = this.container.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;

        // 缩放场景
        this.scene.zoom(scaleFactor, pointerX, pointerY);
    }

    /**
     * 销毁 PixiJS 应用并移除画布。
     */
    destroy(): void {
        // 防止重复执行
        if (this.isDestroyed) {
            return;
        }
        this.isDestroyed = true; // 立即设置标记

        // 1. 首先移除事件监听器和观察器
        if (this.container && this.boundOnWheel) {
            this.container.removeEventListener('wheel', this.boundOnWheel);
        }
        this.resizeObserver?.disconnect();

        // 2. 仅在 Pixi 应用成功初始化后才销毁它 (检查 scene 和 app)
        if (this.scene && this.app) {
            // Pixi 的 destroy(true) 应该会处理将画布从 DOM 中移除
             try {
                 this.app.destroy(true, { children: true, texture: true });
             } catch (e) {
                console.error("销毁 PixiJS 应用时出错:", e);
                // 如果 destroy 中途失败，尝试回退手动移除 canvas
                if (this.app && this.app.canvas && this.app.canvas.parentNode) {
                    this.app.canvas.parentNode.removeChild(this.app.canvas);
                }
             }
        } else {
             console.warn("CanvasEngine.destroy 在初始化完成前或失败后被调用。正在尝试清理...");
             // 如果 app 存在但初始化未完成，尝试手动移除 canvas
             // 避免访问 this.app.canvas 如果 init 未完成。
             // 相反，尝试在容器内查找并移除任何 canvas。
            if (this.container) {
                const canvasElement = this.container.querySelector('canvas');
                if (canvasElement && canvasElement.parentNode === this.container) {
                    try {
                        this.container.removeChild(canvasElement);
                    } catch (e) {
                        console.error("清理过程中直接从容器移除 canvas 时出错:", e);
                    }
                }
             }
             // 如果 app 存在但初始化失败，它可能仍持有资源，但销毁它有风险。
             // 我们专注于清理 DOM 和监听器。
        }

        // 3. 将引用置为 null 以帮助垃圾回收并防止进一步使用
        this.app = null;
        this.scene = null;
        this.container = null;
        this.boundOnWheel = null;
        this.resizeObserver = undefined;
    }

    // --- 公共 API --- 

    /**
     * 获取底层的 Pixi Application 实例。
     * @returns Pixi 应用实例，如果尚未初始化则返回 null。
     */
    getApp(): PIXI.Application | null {
        return this.app;
    }

    /**
     * 获取主 Scene 实例。
     * @returns Scene 实例，如果尚未初始化则返回 null。
     */
    getScene(): Scene | null {
        return this.scene;
    }
} 