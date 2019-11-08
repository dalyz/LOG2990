import { SelectorTool, State } from './selector';

fdescribe('SelectorTool', () => {

    let tool: SelectorTool;
    let svg: any;

    beforeEach(() => {
        svg = jasmine.createSpyObj('SVGService', ['addElement', 'removeElement', 'getInRect', 'findAt', 'entry']);

        const entry = jasmine.createSpyObj('any', ['nativeElement']);
        const nativeElement = jasmine.createSpyObj('any', ['getBoundingClientRect']);
        svg.entry = entry;
        entry.nativeElement = nativeElement;

        svg.getInRect.and.returnValue(new Set<any>([]));
        svg.findAt.and.returnValue(new Set<any>([]));
        tool = new SelectorTool(svg);

    });

    it('should construct correctly', () => {
        expect(tool).toBeTruthy();
    });

    it('should to nothing on wheel event', () => {
        tool.onPressed(new MouseEvent('mousedown', { button: 1 }));
        expect(tool.state).toEqual(State.idle);
    });

    it('should set the correct policy', () => {
        tool.onPressed(new MouseEvent('mousedown', { button: 0 }));
        expect(tool.policy).toBeFalsy();
        tool.onPressed(new MouseEvent('mousedown', { button: 2 }));
        expect(tool.policy).toBeTruthy();
    });

    it('should change state to maybe if idle', () => {
        expect(tool.state).toEqual(State.idle);
        tool.onPressed(new MouseEvent('mousedown', { button: 0 }));
        expect(tool.state).toEqual(State.maybe);
    });

    it('should set the anchor on the first motion', () => {
        tool.onPressed(new MouseEvent('mousedown', { button: 0 }));
        tool.onMotion(new MouseEvent('mousedown', { button: 0 }));
        expect(tool.state).toEqual(State.selecting);
    });

    it('should set the cursor on continous motion', () => {
        tool.onPressed(new MouseEvent('mousedown', { button: 0 }));
        tool.onMotion(new MouseEvent('mousedown', { button: 0 }));
        tool.onMotion(new MouseEvent('mousedown', { button: 0 }));
        expect(tool.state).toEqual(State.selecting);
    });

    it('should reset to state idle when released', () => {
        tool.onPressed(new MouseEvent('mousedown', { button: 0 }));
        tool.onMotion(new MouseEvent('mousedown', { button: 0 }));
        tool.onMotion(new MouseEvent('mousedown', { button: 0 }));
        tool.onReleased(new MouseEvent('mousedown', { button: 0 }));
        expect(tool.state).toEqual(State.idle);
    });

});
