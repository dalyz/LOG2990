import { Injectable } from '@angular/core';
import { PaletteService } from 'src/services/palette/palette.service';
import { TraceType, AbsShapeTool } from './abs-shape-tool';
import { SVGEllipse } from 'src/services/svg/element/svg.ellipse';
import { AbsSVGShape } from 'src/services/svg/element/svg.abs-shape';

@Injectable({
    providedIn: 'root',
})
export class EllipseTool extends AbsShapeTool {
    width: number;
    traceType: TraceType;

    constructor(private paletteService: PaletteService) {
        super();
        this.width = 5;
        this.traceType = TraceType.FillAndBorder;
    }

    onPressed(event: MouseEvent): AbsSVGShape {
        this.element = new SVGEllipse(event.svgX, event.svgY, this.traceType);
        this.setElementAttributes(this.paletteService.getPrimary(), this.paletteService.getSecondary(), this.width);
        return this.element;
    }
}