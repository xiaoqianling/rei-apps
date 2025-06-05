import { AnimPlayer, AnimProvider } from "./anim";

export class ReiNode extends AnimPlayer {
  readonly pivot: { readonly x: number; readonly y: number };
  readonly position: { readonly x: number; readonly y: number };
  readonly abs: { readonly x: number; readonly y: number };

  name?: string;

  constructor(x: number, y: number);

  render(api: { ctx: CanvasRenderingContext2D }): void;

  setPositon(x: number, y: number): void;

  setPivot(x: number, y: number): void;

  _updateCoord(): void;

  moveX(
    timestamp: number,
    provider: { key: string; anmi: AnimProvider },
    rm,
  ): void;

  moveY(
    timestamp: number,
    provider: { key: string; anmi: AnimProvider },
    rm,
  ): void;
}

export class Group extends ReiNode {
  children: ReiNode[];

  add(n: ReiNode): void;

  removeChild(n: ReiNode): void;

  removeAllChild: () => void;

  render(api: { ctx: CanvasRenderingContext2D }): void;

  setPositon: (x: number, y: number) => void;

  setPivot: (x: number, y: number) => void;

  findChildByName(name: string): ReiNode;

  /** 代价不小，少调用 */
  isAnimAllOver(): boolean;

  _updateChildPivot(): void;
}

export class Scene extends Group {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement);

  render(api: { ctx: CanvasRenderingContext2D }): void;

  onResize: () => void;

  clear(): void;
}
