import { SVGInterface } from './svg.interface';
import { TraceType } from 'src/services/tool/tool-options/abs-shape-tool';
import { vectorMultiply, vectorPlus, vectorMinus } from 'src/utils/math';
import { RendererProvider } from 'src/services/renderer-provider/renderer-provider';

export abstract class AbsSVGShape implements SVGInterface {
    element: any;
    protected shapeElement: any;

    protected startingPoint: number[];
    protected endingPoint: number[];

    protected center: number[];
    protected size: number[];

    protected pointSize: number;

    private perimeter: any;

    private fillOpacity: number;
    private strokeOpacity: number;

    constructor(x: number, y: number, traceType: TraceType) {
        this.startingPoint = [x, y];
        this.endingPoint = [x, y];
        this.size = [0, 0];
        this.pointSize = 0;

        switch (traceType) {
            case TraceType.BorderOnly:
                this.fillOpacity = 0;
                this.strokeOpacity = 1;
                break;
            case TraceType.FillOnly:
                this.fillOpacity = 1;
                this.strokeOpacity = 0;
                break;
            case TraceType.FillAndBorder:
                this.fillOpacity = 1;
                this.strokeOpacity = 1;
                break;
        }
        this.element = RendererProvider.renderer.createElement('g', 'svg');

        this.perimeter = RendererProvider.renderer.createElement('rect', 'svg');

        RendererProvider.renderer.setAttribute(this.perimeter, 'stroke-width', '0.5');
        RendererProvider.renderer.setAttribute(this.perimeter, 'fill', 'transparent');
        RendererProvider.renderer.setAttribute(this.element, 'x', `${x}`);
        RendererProvider.renderer.setAttribute(this.element, 'y', `${y}`);
        RendererProvider.renderer.appendChild(this.element, this.perimeter);

        this.showPerimeter();
    }

    protected abstract isInside(x: number, y: number): boolean;
    protected abstract isAtBorder(x: number, y: number): boolean;

    isAt(x: number, y: number): boolean {
        let inside = false;
        let atBorder = false;

        if (this.fillOpacity === 1) {
            inside = this.isInside(x, y);
        }
        if (this.strokeOpacity === 1) {
            atBorder = this.isAtBorder(x, y);
        }
        return inside || atBorder;
    }

    abstract isIn(x: number, y: number, r: number): boolean;

    setPointSize(pointSize: number): void {
        this.pointSize = this.strokeOpacity === 0 ? 0 : pointSize;
        RendererProvider.renderer.setAttribute(this.shapeElement, 'stroke-width', this.pointSize.toString());
    }

    setPrimary(color: string): void {
        if (this.fillOpacity === 1) {
            RendererProvider.renderer.setAttribute(this.shapeElement, 'fill', color);
        }
    }
    setSecondary(color: string): void {
        if (this.strokeOpacity === 1) {
            RendererProvider.renderer.setAttribute(this.shapeElement, 'stroke', color);
        }
    }

    protected setOpacities() {
        RendererProvider.renderer.setAttribute(this.shapeElement, 'fill-opacity', `${this.fillOpacity}`);
        RendererProvider.renderer.setAttribute(this.shapeElement, 'stroke-opacity', `${this.strokeOpacity}`);
    }

    abstract setCursor(x: number, y: number, isShift: boolean): void;
    abstract release(): void;

    protected updateCoordinates(x: number, y: number, isShift: boolean) {
        this.endingPoint = [x, y];
        const VECTOR_TO_CENTER = vectorMultiply(vectorMinus(this.endingPoint, this.startingPoint), 0.5);

        if (isShift) {
            const RADIUS = Math.min(Math.abs(VECTOR_TO_CENTER[0]), Math.abs(VECTOR_TO_CENTER[1]));
            VECTOR_TO_CENTER[0] = Math.sign(VECTOR_TO_CENTER[0]) * RADIUS;
            VECTOR_TO_CENTER[1] = Math.sign(VECTOR_TO_CENTER[1]) * RADIUS;
        }

        this.size = [Math.abs(VECTOR_TO_CENTER[0]), Math.abs(VECTOR_TO_CENTER[1])];
        this.center = vectorPlus(VECTOR_TO_CENTER, this.startingPoint);
    }

    protected abstract setPositionAttributes(): void;

    protected updatePerimeter() {
        RendererProvider.renderer.setAttribute(this.perimeter, 'x',
            `${Math.min(this.endingPoint[0], this.startingPoint[0]) - this.pointSize / 2}`);
        RendererProvider.renderer.setAttribute(this.perimeter, 'y',
            `${Math.min(this.endingPoint[1], this.startingPoint[1]) - this.pointSize / 2}`);
        RendererProvider.renderer.setAttribute(this.perimeter, 'width',
            `${Math.abs(this.startingPoint[0] - this.endingPoint[0]) + this.pointSize}`);
        RendererProvider.renderer.setAttribute(this.perimeter, 'height',
            `${Math.abs(this.startingPoint[1] - this.endingPoint[1]) + this.pointSize}`);
    }

    protected showPerimeter() {
        RendererProvider.renderer.setAttribute(this.perimeter, 'stroke', 'gray');
    }

    protected hidePerimeter() {
        RendererProvider.renderer.setAttribute(this.perimeter, 'stroke', 'transparent');
    }

    abstract onShift(isShift: boolean): void;
}