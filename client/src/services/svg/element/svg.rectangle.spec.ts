import { Renderer2 } from '@angular/core';
import { TraceType } from 'src/services/tool/tool-options/abs-shape-tool';
import { DOMRenderer } from 'src/utils/dom-renderer';
import { SVGRectangle } from './svg.rectangle';

describe('SVGRectangle', () => {
    jasmine.getEnv().allowRespy(true);

    let renderer: Renderer2;
    let element: any;
    let perimeter: any;
    let baseElement: any;
    let children: any;
    let rect: SVGRectangle;

    beforeEach(() => {
        renderer = jasmine.createSpyObj('Renderer2', ['createElement', 'setAttribute', 'appendChild']);

        element = jasmine.createSpyObj('any', ['children']);
        perimeter = jasmine.createSpyObj('any', ['']);
        baseElement = jasmine.createSpyObj('any', ['']);
        children = [perimeter, baseElement];
        element.children = children;

        DOMRenderer.renderer = renderer;

        spyOn(renderer, 'createElement').and.returnValue(element);

        rect = new SVGRectangle(0, 0, TraceType.FillOnly);
    });

    it('should exits', () => {
        expect(rect).toBeDefined();
    });

    it('should be clicked on', () => {
        expect(rect.isAt(0, 0)).toBe(true);
        expect(rect.isAt(-10000, -10000)).toBe(false);
    });
});
