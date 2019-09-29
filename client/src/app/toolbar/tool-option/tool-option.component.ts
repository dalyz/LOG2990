import { Component, OnInit, ViewChild } from '@angular/core';
import { BlurTexture } from 'src/services/svg/element/texture/blur';
import { CircleTexture } from 'src/services/svg/element/texture/circle';
import { ITexture } from 'src/services/svg/element/texture/i-texture';
import { RectTexture } from 'src/services/svg/element/texture/rect';
import { BrushTool } from 'src/services/tool/tool-options/brush';
import { ITool } from 'src/services/tool/tool-options/i-tool';
import { PencilTool } from 'src/services/tool/tool-options/pencil';
import { ToolService } from 'src/services/tool/tool.service';
import { WidthComponent } from '../width/width.component';

@Component({
    selector: 'app-tool-option',
    templateUrl: './tool-option.component.html',
    styleUrls: ['./tool-option.component.scss', '../toolbar-option.scss'],
})
export class ToolOptionComponent implements OnInit {
    private readonly FILE_LOCATION = '../../../../assets/images/';

    @ViewChild(WidthComponent, {static: true})
    widthComponent: WidthComponent;

    textures: ITexture[];
    tools: ITool[];
    currentTool: ITool;

    constructor(private toolService: ToolService, pencil: PencilTool, brush: BrushTool) {
        this.textures = [new BlurTexture(), new CircleTexture(), new RectTexture()];

        brush.texture = this.textures[2];

        this.tools = [ pencil, brush];
        this.selectTool(this.tools[0]);
    }

    ngOnInit() {
        //
    }

    selectTool(tool: ITool): void {
        this.currentTool = tool;
        this.toolService.currentTool = tool;
    }

    setWidth(width: number) {
        if (this.currentTool.width !== null) {
            this.currentTool.width = width;
        }
    }

    getFilesource(tool: ITool): string {
        return this.FILE_LOCATION + tool.BUTTON_FILENAME;
    }
}
