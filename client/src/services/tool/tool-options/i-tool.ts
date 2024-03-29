import { CmdInterface } from '../../cmd/cmd.service';

/**
 * Implementations of this interface should return raw SVGAbstract with
 * position elements without color, thickness or texture.
 */

export enum LineType {
    FullLine = 0,
    DashLine = 1,
    DotLine = 2,
}
export enum JunctionType {
    Angle = 0,
    Round = 1,
    Dot = 2,
}

export interface ITool {
    readonly tip: string;
    width?: number;

    onPressed(event: MouseEvent): CmdInterface | null;
    onMotion(event: MouseEvent): void;
    onReleased(event: MouseEvent): void;

    onWheel?(event: WheelEvent): boolean;

    onKeydown?(event: KeyboardEvent): boolean;
    onKeyup?(event: KeyboardEvent): boolean;

    onSelect?(): void;
    onUnSelect?(): void;

    onLeave?(): void;

    onShowcase?(width: number, height: number): CmdInterface | null;
}

declare global {
    interface MouseEvent { svgX: number; svgY: number; doubleClick: boolean; }
}
