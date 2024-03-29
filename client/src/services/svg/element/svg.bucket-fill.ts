import { BreadthFirst } from 'src/utils/breadth-first';
import { Color } from 'src/utils/color';
import { DOMRenderer } from 'src/utils/dom-renderer';
import { ImageManipulations } from 'src/utils/image-manipulations';
import { vectorMinus } from 'src/utils/math';
import { SVGAbstract } from './svg.abstract';

export class SVGBucketFill extends SVGAbstract {

    element: any;

    private imagePosition: number[];
    private size: number[];

    constructor(position: number[], color: Color, image: ImageData, tolerance: number) {
        super();

        const filledBooleans = new BreadthFirst(position, image, tolerance);
        const pixelPositions: number[][] = filledBooleans.positions;
        this.findDimensions(pixelPositions);
        this.normalizePositions(pixelPositions);
        const canvasHref = ImageManipulations.generateImageData(pixelPositions, color, this.size[0], this.size[1]);

        this.element = DOMRenderer.createElement('image', 'svg');
        DOMRenderer.setAttribute(this.element, 'href', canvasHref);
        DOMRenderer.setAttribute(this.element, 'width', this.size[0].toString());
        DOMRenderer.setAttribute(this.element, 'height', this.size[1].toString());
        DOMRenderer.setAttribute(this.element, 'x', this.imagePosition[0].toString());
        DOMRenderer.setAttribute(this.element, 'y', this.imagePosition[1].toString());
    }

    private normalizePositions(positions: number[][]): void {
        for (let i = 0; i < positions.length; i++) {
            positions[i] = vectorMinus(positions[i], this.imagePosition);
        }
    }

    private findDimensions(positions: number[][]): void {
        const xRange = [Infinity, -Infinity];
        const yRange = [Infinity, -Infinity];

        positions.forEach((pos: number[]) => {
            if (pos[0] < xRange[0]) {
                xRange[0] = pos[0];
            }
            if (pos[0] > xRange[1]) {
                xRange[1] = pos[0];
            }
            if (pos[1] < yRange[0]) {
                yRange[0] = pos[1];
            }
            if (pos[1] > yRange[1]) {
                yRange[1] = pos[1];
            }
        });

        this.imagePosition = [xRange[0], yRange[0]];
        this.size = [xRange[1] - xRange[0] + 1, yRange[1] - yRange[0] + 1];
    }

    isIn(x: number, y: number, r: number): boolean {
        return false;
    }

    getPrimary(): string {
        return '';
    }
    getSecondary(): string {
        return '';
    }
    setPrimary(color: string): void {
        return;
    }
    setSecondary(color: string): void {
        return;
    }

    protected isAtAdjusted(x: number, y: number): boolean {
        return false;
    }
}
