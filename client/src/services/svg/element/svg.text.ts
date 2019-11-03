import { SVGInterface } from 'src/services/svg/element/svg.interface';
import { DOMRenderer } from 'src/utils/dom-renderer';

export class SVGText implements SVGInterface {
    element: any;

    fontSize: string;
    fontStyle: string;
    fontFamily: string;
    fontTextAlign: string;

    constructor(x: number, y: number, fontSize: string, fontStyle: string, fontFamily: string, textAlign: string) {
        this.element = DOMRenderer.createElement('text', 'svg');
        this.element.innerHTML = '';
        DOMRenderer.setAttribute(this.element, 'font-style', fontStyle);
        DOMRenderer.setAttribute(this.element, 'font-size', fontSize);
        DOMRenderer.setAttribute(this.element, 'font-family', fontFamily);
        DOMRenderer.setAttribute(this.element, 'text-align', textAlign);
        DOMRenderer.setAttribute(this.element, 'x', x.toString());
        DOMRenderer.setAttribute(this.element, 'y', y.toString());
    }
    isAt(x: number, y: number): boolean {
        throw new Error('Method not implemented.');
    }
    isIn(x: number, y: number, r: number): boolean {
        throw new Error('Method not implemented.');
    }
    getPrimary(): string {
        throw new Error('Method not implemented.');
    }
    getSecondary(): string {
        throw new Error('Method not implemented.');
    }
    setPrimary(color: string): void {
        throw new Error('Method not implemented.');
    }
    setSecondary(color: string): void {
        throw new Error('Method not implemented.');
    }
    setFontSize(size: number): void {
        this.fontSize = size + 'px';
        DOMRenderer.setAttribute(this.element, 'font-size', this.fontSize);
    }
    setFontFamily(fontfamliy: string): void {
        this.fontFamily = fontfamliy;
        DOMRenderer.setAttribute(this.element, 'font-family', this.fontFamily);
    }
    setFontStyle(style: string): void {
        this.fontStyle = style;
        DOMRenderer.setAttribute(this.element, 'font-style', this.fontStyle);
    }
    setTextAlign(align: string): void {
        this.fontTextAlign = align;
        DOMRenderer.setAttribute(this.element, 'text-align', this.fontTextAlign);
    }
}
