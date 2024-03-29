import { Injectable } from '@angular/core';
import { CmdSVG } from 'src/services/cmd/cmd.svg';
import { PaletteService } from 'src/services/palette/palette.service';
import { SVGBucketFill } from 'src/services/svg/element/svg.bucket-fill';
import { SVGService } from 'src/services/svg/svg.service';
import { svgToImage } from 'src/utils/element-parser';
import { MyInjector } from 'src/utils/injector';
import { ITool } from './i-tool';

@Injectable({
    providedIn: 'root',
})
export class BucketTool implements ITool {
    readonly tip: string = 'Pixel Fill (B)';

    private isLoaded: boolean;
    private imageData: ImageData;
    colorToleranceDelta: number;

    constructor(private palette: PaletteService) {
        this.isLoaded = false;
        this.colorToleranceDelta = 0;
    }

    onPressed(event: MouseEvent): CmdSVG | null {
        if (!this.isLoaded) {
            return null;
        }

        MyInjector.get(SVGService).cursor = 'none';

        const x = event.svgX;
        const y = event.svgY;
        const bucketFill = new SVGBucketFill([x, y], this.palette.primary, this.imageData, this.colorToleranceDelta);
        const command = new CmdSVG(bucketFill);

        MyInjector.get(SVGService).resetCursor();
        return command;
    }

    onMotion(event: MouseEvent): void {
        return;
    }

    onReleased(event: MouseEvent): void {
        return;
    }

    onSelect(): void {
        this.isLoaded = false;

        const createImageData = (svgImage: HTMLImageElement, ctx: CanvasRenderingContext2D): void => {
            ctx.drawImage(svgImage, 0, 0);
            this.imageData = ctx.getImageData(0, 0, svgImage.width, svgImage.height);

            this.isLoaded = true;
        };

        svgToImage(MyInjector.get(SVGService).entry, createImageData);
    }

    onShowcase(): null {
        return null;
    }
}
