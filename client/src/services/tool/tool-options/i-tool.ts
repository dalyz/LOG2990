import { SVGInterface } from 'src/services/svg/element/svg.interface';

/**
 * Implementations of this interface should return raw SVGInterface with
 * position elements without color, thickness or texture.
 */
export interface ITool {
    width: number | null;

    onPressed(event: MouseEvent): SVGInterface | null;
    onMotion(event: MouseEvent): void;
    onReleased(event: MouseEvent): void;

    onKeydown?(event: KeyboardEvent): boolean;
    onKeyup?(event: KeyboardEvent): boolean;
    onWheel?(event: WheelEvent): boolean;
}

declare global {
    interface MouseEvent { svgX: number; svgY: number; doubleClick: boolean; }
}
