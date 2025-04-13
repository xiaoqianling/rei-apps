import { CanvasEngine } from "./core/CanvasEngine";

/**
 * Options for creating a visualization canvas.
 */
export interface VisualizationCanvasOptions {
  /**
   * The initial logical width of the internal scene canvas.
   * This defines the coordinate system space for placing elements.
   * Defaults to 2000.
   */
  logicalWidth?: number;

  /**
   * The initial logical height of the internal scene canvas.
   * Defaults to 1500.
   */
  logicalHeight?: number;

  /**
   * The background color of the PixiJS stage (renderer).
   * Defaults to 0x1a1a1a (dark gray).
   */
  backgroundColor?: number;

  /**
   * Whether to use antialiasing for smoother graphics.
   * Defaults to true.
   */
  antialias?: boolean;
}

/**
 * Creates and initializes a new visualization canvas engine within the given container.
 *
 * @param container - The HTML element that will hold the canvas.
 * @param options - Optional configuration for the canvas engine.
 * @returns An instance of the CanvasEngine, which provides methods for interaction and adding visualizations.
 *
 * @example
 * import { createVisualizationCanvas } from 'rei-visualization';
 *
 * const container = document.getElementById('my-canvas-container');
 * if (container) {
 *   const engine = createVisualizationCanvas(container, {
 *     logicalWidth: 3000,
 *     backgroundColor: 0xffffff // White background
 *   });
 *   // Now you can use engine.addStructure(...) etc.
 * } else {
 *   console.error("Container element not found!");
 * }
 */
export function createVisualizationCanvas(
  container: HTMLElement,
  options?: VisualizationCanvasOptions,
): CanvasEngine {
  if (!container) {
    throw new Error(
      "Container element is required to create a visualization canvas.",
    );
  }
  return new CanvasEngine(container, options);
}

// Re-export core classes/types if needed for more advanced usage
export { CanvasEngine } from "./core/CanvasEngine";
export { Scene } from "./core/Scene";
// Export base structure components
export { Block } from "./structures/base/Block";
export { Node } from "./structures/base/Node";
export { Edge } from "./structures/base/Edge";
// Export specific visualization components
export { ArrayVisualization } from "./structures/visualizations/ArrayVisualization";
export { LinkedListVisualization } from "./structures/visualizations/LinkedListVisualization";
// Add other exports as needed (e.g., specific structure types, animator)
