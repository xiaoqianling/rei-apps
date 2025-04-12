import * as PIXI from 'pixi.js';
import { Scene } from '../../core/Scene'; // Adjust path as needed

export interface BlockOptions {
    title: string;
    x?: number; // Initial position X
    y?: number; // Initial position Y
    width?: number; // Width
    height?: number; // Height
    backgroundColor?: number; // Background color
    borderColor?: number;     // Border color
    borderColorHover?: number;// Border color when hovered
    borderWidth?: number;    // Border width
    borderRadius?: number;   // Border radius
    padding?: number;        // Padding
    titleStyle?: Partial<PIXI.TextStyle>; // Title style (PIXI.TextStyle)
    dataStructureType?: string; // Data structure type (future use)
}

// Define the required options shape after defaults are applied
// Explicitly state x and y are numbers, keep dataStructureType optional
type InternalBlockOptions = Required<Omit<BlockOptions, 'dataStructureType' | 'x' | 'y'>>
                           & { x: number; y: number }
                           & Pick<BlockOptions, 'dataStructureType'>;

const DEFAULT_BLOCK_OPTIONS: Required<Omit<BlockOptions, 'title' | 'dataStructureType' | 'x' | 'y'>> & Pick<BlockOptions, 'x' | 'y'> = {
    x: 50,
    y: 50,
    width: 200,
    height: 150,
    backgroundColor: 0x2A2A2A, // Dark gray background
    borderColor: 0x888888,     // Gray border
    borderColorHover: 0xFFFFFF, // White border when hovered
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    titleStyle: {
        fill: 0xFFFFFF,         // 白色文字
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        align: 'center'
    }
};

/**
 * Represents a draggable block on the scene, used to display a variable/data structure.
 */
export class Block extends PIXI.Container {
    private options: InternalBlockOptions;
    private sceneRef: Scene; // Reference to parent scene for bounds
    private backgroundGraphics: PIXI.Graphics;
    private titleText: PIXI.Text;

    private isDragging = false;
    private dragOffset = new PIXI.Point(); // Offset from pointer to block origin during drag
    private isHovering = false;

    constructor(scene: Scene, options: BlockOptions) {
        super();
        this.sceneRef = scene;

        // Merge provided options with defaults
        // Explicitly handle title as it's required
        const mergedOptions: InternalBlockOptions = { 
            ...DEFAULT_BLOCK_OPTIONS, 
            ...options, // User options override defaults
            title: options.title, // Ensure title is always present
            x: (options.x ?? DEFAULT_BLOCK_OPTIONS.x) as number,
            y: (options.y ?? DEFAULT_BLOCK_OPTIONS.y) as number,
            dataStructureType: options.dataStructureType // Optional, keep as potentially undefined
        };
        this.options = mergedOptions;

        this.x = this.options.x;
        this.y = this.options.y;

        // --- Create Children ---
        this.backgroundGraphics = new PIXI.Graphics();
        this.titleText = new PIXI.Text({text:this.options.title, style: this.options.titleStyle}); 
        this.titleText.resolution = 5;

        // Add children
        this.addChild(this.backgroundGraphics);
        this.addChild(this.titleText);

        // --- Setup Layout & Initial Draw ---
        this.updateLayout();
        this.redraw(); // Initial drawing

        // --- Enable Interaction ---
        this.eventMode = 'static'; // Make the block interactive
        this.cursor = 'grab';     // Set default cursor

        this.on('pointerdown', this.onDragStart, this);
        this.on('pointerup', this.onDragEnd, this);
        this.on('pointerupoutside', this.onDragEnd, this);
        this.on('pointermove', this.onDragMove, this);
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
    }

    /** Updates layout of title and content area */
    private updateLayout() {
        // Position title text (centered horizontally, near top with padding)
        this.titleText.anchor.set(0.5, 0);
        this.titleText.x = this.options.width / 2;
        this.titleText.y = this.options.padding;

        // Define content area bounds (below title + padding)
        // const contentY = this.titleText.y + this.titleText.height + this.options.padding;
        // const contentHeight = this.options.height - contentY - this.options.padding;
        // TODO: Add placeholder for content area visualization later
    }

    /** Redraws the block background and border based on current state */
    private redraw() {
        this.backgroundGraphics.clear();

        const borderColor = this.isHovering ? this.options.borderColorHover : this.options.borderColor;

        // Draw background
        this.backgroundGraphics.roundRect(0, 0, this.options.width, this.options.height, this.options.borderRadius);
        this.backgroundGraphics.fill(this.options.backgroundColor);

        // Draw border
        if (this.options.borderWidth > 0) {
            this.backgroundGraphics.stroke({ 
                width: this.options.borderWidth, 
                color: borderColor, 
                alignment: 0 // Stroke draws inside the path
            });
        }

        // --- 绘制标题分隔线 ---
        const separatorY = this.titleText.y + this.titleText.height + this.options.padding / 2;
        const separatorWidth = this.options.width - this.options.padding * 2;
        const separatorColor = 0x555555; // 分隔线颜色 (深灰色)
        const separatorThickness = 1;

        if (separatorWidth > 0) {
            this.backgroundGraphics.moveTo(this.options.padding, separatorY);
            this.backgroundGraphics.lineTo(this.options.padding + separatorWidth, separatorY);
            this.backgroundGraphics.stroke({ width: separatorThickness, color: separatorColor });
            // 注意: PIXI v8+ 的 stroke 是链式调用的，但这里我们对不同的线段应用不同的样式，
            // 所以分开调用 moveTo/lineTo 再 stroke 是合适的。
            // 如果用 fill/stroke API v8+，需要更复杂的路径构建或多个 Graphics 对象。
        }
    }

    // --- Interaction Handlers ---

    private onDragStart(event: PIXI.FederatedPointerEvent) {
        if (!this.sceneRef || !this.sceneRef.app) return; // Defensive check

        this.isDragging = true;
        // Calculate the offset from the pointer to the block's top-left corner
        const localPos = this.toLocal(event.global);
        this.dragOffset.set(localPos.x, localPos.y);
        
        this.cursor = 'grabbing';
        if (this.sceneRef.app.stage) {
            this.sceneRef.app.stage.cursor = 'grabbing'; // Optional: Set global cursor
        }

        // Bring block to top within the scene
        this.sceneRef.addChild(this); 
    }

    private onDragEnd() {
        if (this.isDragging) {
            this.isDragging = false;
            this.cursor = 'grab';
            if (this.sceneRef && this.sceneRef.app && this.sceneRef.app.stage) {
                this.sceneRef.app.stage.cursor = 'default'; 
            }
        }
    }

    private onDragMove(event: PIXI.FederatedPointerEvent) {
        if (this.isDragging) {
            // Check if parent exists
            if (!this.parent) return;

            // Get the pointer position in the parent's coordinate system (the Scene)
            const parentPos = this.parent.toLocal(event.global);
            
            // Calculate the desired new top-left position of the block
            let newX = parentPos.x - this.dragOffset.x;
            let newY = parentPos.y - this.dragOffset.y;

            // Apply constraints based on scene logical dimensions
            const sceneWidth = this.sceneRef.logicalWidth; 
            const sceneHeight = this.sceneRef.logicalHeight;
            // Use options' width/height for calculation, as container's width/height may be based on content
            const blockWidth = this.options.width;
            const blockHeight = this.options.height;

            // Update the block's position
            this.x = newX;
            this.y = newY;
        }
    }

    private onPointerOver() {
        this.isHovering = true;
        this.redraw();
    }

    private onPointerOut() {
        this.isHovering = false;
        this.redraw();
    }

     // --- Public Methods (Optional) ---
    // Method to update title or other properties dynamically?
    // updateTitle(newTitle: string) { ... this.options.title = newTitle; this.titleText.text = newTitle; this.updateLayout(); }
} 