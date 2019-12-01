import { Injectable } from '@angular/core';
import { CmdSVG } from 'src/services/cmd/cmd.svg';
import { KeyService } from 'src/services/key/key.service';
import { PaletteService } from 'src/services/palette/palette.service';
import { SVGText } from 'src/services/svg/element/svg.text';
import { SVGService } from 'src/services/svg/svg.service';
import { Color } from 'src/utils/color';
import { MyInjector } from 'src/utils/injector';
import { ITool } from './i-tool';
declare type callback = () => void;
@Injectable({
    providedIn: 'root',
})
export class TextTool implements ITool {

    readonly tip: string;
    private TEXTTIP = 'Text (T)';
    private UNSET = '';
    private INITIALSIZE = 15;
    private SHOWCASE_DEFAULT = 'Rebase';
    element: SVGText | null = null;
    fontSize: number;
    fontStyle: string;
    fontWeigth: string;
    fontFamily: string;
    textAlign: string;
    width: number;

    isEditing: boolean;
    clickAlign = false;

    constructor(private keyService: KeyService, private paletteService: PaletteService) {
        this.tip = this.TEXTTIP;
        this.fontWeigth = this.UNSET;
        this.fontStyle = this.UNSET;
        this.fontFamily = this.UNSET;
        this.textAlign = this.UNSET;
        this.fontSize = this.INITIALSIZE;
        this.isEditing = false;
        const DEFAULT_WIDTH = 15;
        this.width = DEFAULT_WIDTH;
    }

    onPressed(event: MouseEvent): CmdSVG | null {
        if (!this.keyService.isTextEnabled) {
            this.finishEdit();
            this.keyService.enableTextEdit();
        }
        if (!this.element) {
            this.startEdit();
            this.element = new SVGText(this.keyService, event.svgX, event.svgY, this.fontFamily,
                this.fontSize, this.textAlign, this.fontStyle, this.fontWeigth);
            this.paletteService.primaryObs$.subscribe((color: Color) => {
                if (this.element !== null) {
                    this.element.setPrimary(color.toRGBA());
                }
            });

            return new CmdSVG(this.element);
        } else if (this.element && !this.clickAlign) {
            if (this.element.isNewElement) {
                this.element.currentSubElement.innerHTML = this.UNSET;
            }
            this.finishEdit();
        }
        this.clickAlign = false;
        return null;
    }

    onMotion(event: MouseEvent): void {
        return;
    }
    onReleased(event: MouseEvent): void {
        if (this.element) {
            this.element.removeRectangle();
        }
        return;
    }

    private removeNewText() {
        const serv: SVGService = MyInjector.get(SVGService);
        if (this.element && this.element.isNewElement) {
            serv.removeObject(this.element);
        }
    }

    onUnSelect(): void {
        if (this.element) {
            this.element.removeRectangle();
        }

        this.removeNewText();
        this.element = null;
    }

    onKeydown(event: KeyboardEvent): boolean {
        if (!this.keyService.isTextEnabled) {
            this.finishEdit();
            this.keyService.enableTextEdit();
        }
        let current = this.UNSET;
        if (this.element !== null) {
            if (this.element.isNewElement) {
                this.element.currentSubElement.innerHTML = this.UNSET;
                this.element.isNewElement = false;
            }
            current = this.element.currentSubElement.innerHTML;
            const actions: { [id: string]: callback } = {
                Enter: () => {
                    if (this.element) {
                        if (this.isLineEmpty(current)) {
                            this.element.setCurrentPlaceholder();
                        }
                        this.element.setLineBreak();
                    }
                },
                Backspace: () => {
                    if (this.element) {
                        this.element.removeCharacter();
                    }
                },
                Alt: () => {
                    //
                },
                Shift: () => {
                    //
                },
            };
            if (event.key in actions) {
                const func: callback = actions[event.key];
                func();
            } else {
                current += event.key;
                this.element.currentSubElement.innerHTML = current;
            }
        }

        if (this.element) {
            this.element.setRectangle(this.element.domRect);
        }
        return true;
    }

    finishEdit(): void {
        this.isEditing = false;
        this.keyService.enableKeys();
        if (this.element) {
            this.element.removeRectangle();
        }

        this.element = null;
    }
    startEdit(): void {
        this.isEditing = true;
        this.keyService.disableKeys();
    }
    isLineEmpty(content: string): boolean {
        if (content === this.UNSET) {
            return true;
        }
        return false;
    }

    onShowcase(x: number, y: number): CmdSVG | null {

        const previousElement = this.element;
        const mouseEvent: MouseEvent = new MouseEvent('', undefined);
        mouseEvent.svgX = x / 2.0;
        mouseEvent.svgY = y / 2.0;

        const element = this.onPressed(mouseEvent);

        const textShowcase: object = {
            key: this.SHOWCASE_DEFAULT,
        };
        this.onKeydown(textShowcase as KeyboardEvent);
        this.element = previousElement;
        return element;
    }

    setTextAlign(align: string) {
        this.textAlign = align;
        if (this.element) {
            this.element.setRectangle(this.element.domRect);
        }
        this.keyService.enableTextEdit();
        this.keyService.disableKeys();
        this.clickAlign = true;
    }
}
