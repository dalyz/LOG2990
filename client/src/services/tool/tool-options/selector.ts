import { Injectable } from '@angular/core';
import { CmdInterface } from 'src/services/cmd/cmd.service';
import { SVGAbstract } from 'src/services/svg/element/svg.abstract';
import { SVGComposite } from 'src/services/svg/element/svg.composite';
import { SelectorBox, SelectorState } from 'src/services/tool/tool-options/selector-box';
import { SVGService } from 'src/services/svg/svg.service';
import { Rect } from 'src/utils/geo-primitives';
import { ITool } from './i-tool';
import { vectorMinus, vectorDivideVector, vectorPlus, vectorMultiplyVector, vectorMultiplyConst } from 'src/utils/math';

//declare type callback = () => void;

@Injectable({
    providedIn: 'root',
})
export class SelectorTool implements ITool {

    static BASE_OFFSET = 30;

    dupOffset: number[] = [SelectorTool.BASE_OFFSET, SelectorTool.BASE_OFFSET];

    readonly tip = 'Selector (S)';

    state: SelectorState = SelectorState.NONE;
    compositeElement: SVGComposite;

    distanceToCenter: number[];

    private firstMousePosition: number[]
    private lastMousePosition: number[];
    private selectorBox: SelectorBox;

    constructor(private svg: SVGService) {

        this.firstMousePosition = [0, 0];
        this.lastMousePosition = [0, 0];
        this.distanceToCenter = [];
        this.compositeElement = new SVGComposite();

        this.selectorBox = new SelectorBox(svg);
    }

    onPressed(event: MouseEvent): CmdInterface | null {
        this.firstMousePosition = [event.svgX, event.svgY];
        this.lastMousePosition = [event.svgX, event.svgY];

        switch (event.button) {
            case 0:
                this.onLeftClick(event.svgX, event.svgY);
                break;

            case 2:
                this.state = SelectorState.DESELECTING;
                break;

            default:
                break;
        }

        return null;
    }

    onMotion(event: MouseEvent): void {
        if (this.state === SelectorState.NONE) {
            return;
        }

        const previousMousePosition = [this.lastMousePosition[0], this.lastMousePosition[1]];
        this.lastMousePosition = [event.svgX, event.svgY];

        switch (this.state) {
            case SelectorState.SELECTING:
                this.select();
                break;
            case SelectorState.DESELECTING:
                this.deselect();
                break;
            case SelectorState.MOVING:
                const toMove = vectorMinus(this.lastMousePosition, previousMousePosition);
                this.compositeElement.translate(toMove[0], toMove[1]);
                this.selectorBox.setPeview(this.compositeElement.domRect);
                break;
            case SelectorState.SCALING:
                const opposite: number[] = this.selectorBox.getOppositeAnchorPosition();
                const multiplier: number[] = this.selectorBox.getScalingMultiplier();

                const toMoveStable = vectorMultiplyConst(vectorMinus(this.lastMousePosition, previousMousePosition), -1);
                this.compositeElement.translate(toMoveStable[0], toMoveStable[1]);

                let toScale = [1, 1];
                const lastDiff = vectorMinus(previousMousePosition, [0, 0]);
                const currentDiff = vectorMinus(this.lastMousePosition, previousMousePosition);

                const rescaling = vectorDivideVector(currentDiff, lastDiff);

                toScale = vectorPlus(toScale, vectorMultiplyVector(rescaling, multiplier));
                this.compositeElement.rescale(toScale[0], toScale[1]);
                this.selectorBox.setPeview(this.compositeElement.domRect);
                break;
            default:
                break;
        }
    }

    private onLeftClick(x: number, y: number) {
        const previewState: SelectorState = this.selectorBox.onPressed(x, y);

        if (previewState !== SelectorState.OFF) {
            this.state = previewState;
            return;
        }

        if (this.isEmpty()) {
            this.select();
        } else {
            this.clearSelection();
        }

        this.state = SelectorState.SELECTING;
    }

    private select(): void {
        const rect: Rect = new Rect(
            Math.min(this.firstMousePosition[0], this.lastMousePosition[0]),
            Math.min(this.firstMousePosition[1], this.lastMousePosition[1]),
            Math.max(this.firstMousePosition[0], this.lastMousePosition[0]),
            Math.max(this.firstMousePosition[1], this.lastMousePosition[1]));

        this.compositeElement.clear();
        const elementsInRect: Set<SVGAbstract> = this.svg.getInRect(rect);

        elementsInRect.forEach((element) => {
            this.compositeElement.addChild(element);
        });

        this.selectorBox.setPeview(this.compositeElement.domRect);
    }

    private deselect() {
        const rect: Rect = new Rect(
            this.firstMousePosition[0],
            this.firstMousePosition[1],
            this.lastMousePosition[0],
            this.lastMousePosition[1]);

        const elementsInRect: Set<SVGAbstract> = this.svg.getInRect(rect);

        elementsInRect.forEach((element) => {
            this.compositeElement.removeChild(element);
        });
    }


    private isEmpty(): boolean {
        return this.compositeElement.children.size === 0;
    }

    private clearSelection() {
        this.compositeElement.clear();
        this.selectorBox.hidePreview();
    }

    onWheel(event: WheelEvent): boolean {
        /*switch (this.state) {
            case State.selected:
                this.state = State.rotating;
                if (this.transforms) {
                    CmdService.execute(this.transforms);
                }
                const transforms: CmdArray<CmdMatrix> = new CmdArray<CmdMatrix>();
                this.selected.forEach((obj: SVGAbstract) => {
                    transforms.cmds.push(new CmdMatrix(obj));
                });
                this.transforms = transforms;
            // tslint:disable-next-line: no-switch-case-fall-through
            case State.rotating:
                break;
            default:
                return false;
        }
        if (!this.transforms) {
            return false;
        }
        const angle = Math.sign(event.deltaY) * (Math.PI / 180) * (event.altKey ? 1 : 15);
        if (event.shiftKey) {
            this.transforms.cmds.forEach((cmd) => {
                const rect = MyInjector.get(SVGService).getElementRect(cmd.element);
                cmd.rotate(angle, rect.x + rect.width / 2, rect.y + rect.height / 2);
                cmd.execute();
            });
        } else {
            this.transforms.cmds.forEach((cmd) => {
                cmd.rotate(angle,
                    Number(this.points[Compass.C].getAttribute('cx')),
                    Number(this.points[Compass.C].getAttribute('cy')));
                cmd.execute();
            });
        }*/
        return true;
    }

    onReleased(event: MouseEvent): void {
        this.state = SelectorState.NONE;
    }

    /*onKeydown(event: KeyboardEvent): boolean {
        const kbd: { [id: string]: callback } = {
            'C-a': () => this.selectAll(),
            'C-d': () => this.duplicate(),
            delete: () => this.erase(),

        };
        let keys = '';
        if (event.ctrlKey) {
            keys += 'C-';
        }
        keys += event.key.toLowerCase();
        if (kbd[keys]) {
            const func: callback = kbd[keys];
            func();
            return true;
        }
        return false;
    }

    duplicate(): void {
        this.dupOffset = this.nextOffset(this.dupOffset);
        CmdService.execute(new CmdDup(Array.from(this.selected), this.dupOffset));
    }

    erase(): void {
        const cmd: CmdEraser = new CmdEraser();
        this.selected.forEach((obj) => {
            cmd.eraseObject(obj);
        });
        CmdService.execute(cmd);
        this.reset();
    }

    

    nextOffset(currentOffset: number[]): number[] {
        const newOffset: number[] = vectorPlus(currentOffset, [SelectorTool.BASE_OFFSET, SelectorTool.BASE_OFFSET]);
        let finalOffset: number[];

        // 0: correct
        // +1: outside on the right
        // +2: outside on the bottom
        let outsideState = 0;

        const currentXSteps = newOffset[0] / SelectorTool.BASE_OFFSET;
        const currentYSteps = newOffset[1] / SelectorTool.BASE_OFFSET;

        const baseHorizontalSteps = currentXSteps - currentYSteps;

        this.selected.forEach((object) => {
            object.translate(newOffset[0], newOffset[1]);
            const state = this.elementState(object);
            if (outsideState !== 0) {
                outsideState = Math.min(outsideState, state);
            } else {
                outsideState = state;
            }
            object.translate(-newOffset[0], -newOffset[1]);
        });
        switch (outsideState) {
            case 1:
                finalOffset = vectorMultiply([-1, -1], SelectorTool.BASE_OFFSET);
                break;
            case 2:
                finalOffset = vectorMultiply([baseHorizontalSteps + 1, 0], SelectorTool.BASE_OFFSET);
                break;
            default:
                finalOffset = newOffset;
        }

        return finalOffset;
    }

    private elementState(element: SVGAbstract): number {
        const rect: DOMRect = element.domRect;
        const entryPositions: DOMRect = this.svg.entry.nativeElement.getBoundingClientRect();

        const right = rect.right - entryPositions.left;
        const bottom = rect.bottom - entryPositions.top;

        let currentState = 0;
        if (right > entryPositions.right) {
            currentState = 1;
        } else if (bottom > entryPositions.bottom) {
            currentState = 2;
        }

        return currentState;
    }

    */

    onShowcase(): null {
        return null;
    }
}
