import { TraceType } from 'src/services/tool/tool-options/abs-shape-tool';
import { SVGEllipse } from './svg.ellipse';
import { DOMRenderer } from 'src/utils/dom-renderer';

describe('SVGEllipse', () => {

    let renderer: any;
    let ellipse: SVGEllipse;

    beforeEach(() => {
        renderer = jasmine.createSpyObj('Renderer2', ['createElement', 'appendChild', 'setAttribute']);
        DOMRenderer.renderer = renderer;

        ellipse = new SVGEllipse(0, 0, TraceType.FillAndBorder);
    });

    it('should exits', () => {
        expect(ellipse).toBeDefined();
    });

    it('should be clicked on', () => {
        ellipse.setCursor(10, 10, false);
        expect(ellipse.isAt(5, 5)).toBe(true);
        expect(ellipse.isAt(0, 0)).toBe(false);
    });
});