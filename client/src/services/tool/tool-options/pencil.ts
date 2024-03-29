import { Injectable } from '@angular/core';
import { CmdSVG } from 'src/services/cmd/cmd.svg';
import { PaletteService } from 'src/services/palette/palette.service';
import { SVGPencil } from 'src/services/svg/element/svg.pencil';
import { ITool } from './i-tool';

@Injectable({
    providedIn: 'root',
})
export class PencilTool implements ITool {

    private readonly DEFAULT_WIDTH = 5;
    private readonly PENCIL_TIP = 'Pencil (C)';
    readonly tip: string;

    element: SVGPencil | null;
    width: number;

    constructor(private paletteService: PaletteService) {
        this.tip = this.PENCIL_TIP;
        this.element = null;
        this.width = this.DEFAULT_WIDTH;
     }

    onPressed(event: MouseEvent): CmdSVG | null {
        let cmd: CmdSVG | null = null;
        if (!this.element) {
            const x = event.svgX;
            const y = event.svgY;
            this.element = new SVGPencil();
            this.element.setWidth(this.width);
            this.element.addPoint(x, y);
            this.element.addPoint(x, y);

            this.element.setPrimary(this.paletteService.getPrimary());

            cmd = new CmdSVG(this.element);
        }
        return cmd;
    }
    onMotion(event: MouseEvent): void {
        if (this.element) {
            const x = event.svgX;
            const y = event.svgY;
            this.element.addPoint(x, y);
        }
    }
    onReleased(event: MouseEvent): void {
        this.element = null;
    }

}
