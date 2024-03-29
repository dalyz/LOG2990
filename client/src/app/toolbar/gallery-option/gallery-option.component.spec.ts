import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatMenuModule, MatSnackBarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomAlertComponent } from 'src/app/popups/custom-alert/custom-alert.component';
import { Drawing } from 'src/services/draw-area/i-drawing';
import { WebClientService } from 'src/services/web-client/web-client.service';
import { GalleryOptionComponent } from './gallery-option.component';

describe('GalleryOptionComponent', () => {
    let component: GalleryOptionComponent;
    let fixture: ComponentFixture<GalleryOptionComponent>;
    let filterInput: ElementRef<HTMLInputElement>;
    let filteredDrawings: Drawing[];
    let webClientService: WebClientService;
    beforeEach(async(() => {
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [CustomAlertComponent],
            },
        });
        TestBed.configureTestingModule({
            declarations: [GalleryOptionComponent, CustomAlertComponent],
            imports: [MatMenuModule, MatDialogModule,
                MatSnackBarModule, BrowserAnimationsModule, BrowserDynamicTestingModule, HttpClientModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryOptionComponent);
        component = fixture.componentInstance;
        filteredDrawings = [{
            _id: '17',

            name: 'test',
            tags: ['allo'],
            holder: { entry: 'entry', elements: ['vide'] },

            backgroundColor: 'rgba(255, 255, 255, 1)',
            width: 200,
            height: 200,

            createdAt: new Date(),
        }];
        component.drawings = filteredDrawings;
        component.filteredDrawings = filteredDrawings;

        fixture.detectChanges();
        webClientService = jasmine.createSpyObj('WebClientService', ['deleteDrawing', 'getAllDrawings', 'addTag']);
        (component as any).webClientService = webClientService;
        filterInput = jasmine.createSpyObj('ElementRef<HTMLInputElement>', ['nativeElement', 'entry']);
        component.filterInput = filterInput;
        component.ngOnInit();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should delete the drawing', () => {
        component.onDelete(component.drawings[0]);
        expect(webClientService.deleteDrawing).toHaveBeenCalled();
    });

    it('should filter drawings', () => {
        const filterValue = 'filterTest';
        component.filter = filterValue;
        component.filterDrawings(filterValue);
        expect(component.filter).toEqual(filterValue.toLowerCase());
    });

    it('should clear filters', () => {
        component.filterInput.nativeElement.value = '';
        component.clearFilters();
        expect(component.filteredDrawings).toEqual(filteredDrawings);
        expect(filterInput.nativeElement.value).toEqual('');
        expect(component.isTagExists).toBeTruthy();
    });

    it('should select', () => {
        expect(component.select()).toBeUndefined();
    });

    it('should get gallery image', () => {
        const IMAGE = '../../../assets/images/gallery.png';
        expect(component.getImage()).toEqual(IMAGE);
    });

    it('should stop event propagation', () => {
        expect(component.stopEventPropagation(new MouseEvent('click'))).toEqual(new MouseEvent('click').stopPropagation());
    });

    it('should go to the previous page', () => {
        const previousPage = 2;
        component.page = 3;
        component.previousPage();
        expect(component.page).toEqual(previousPage);
    });

    it('should go to the next page', () => {
        component.nPages = 4;
        component.page = 1;
        component.nextPage();
        expect(component.page).toEqual(component.nPages);
    });

    it('should filter the page when endPage ends up lower then the lenght of filteredDrawings', () => {
        for (let i = 0; i < 9; i++) {
            const tempDrawing = new Drawing();
            component.filteredDrawings.push(tempDrawing);
        }
        component.page = 1;
        component.filterPage();
        expect(component.beginPage).toEqual(0);
        expect(component.endPage).toEqual(8);

    });

    it('should filter the page when endPage ends up greater then the lenght of filteredDrawings', () => {
        for (let i = 0; i < 9; i++) {
            const tempDrawing = new Drawing();
            component.filteredDrawings.push(tempDrawing);
        }
        component.page = 2;
        component.filterPage();
        expect(component.endPage).toEqual(filteredDrawings.length);

    });

    it('onAddTag should return right away from addTag if drawing parameter has no id', () => {
        const tempDrawing = new Drawing();
        tempDrawing._id = null;
        const tempString = '';
        component.onAddTag(tempDrawing);
        expect(component.tagInput).toEqual(tempString);
    });

    it('onAddTag should call webClientService.addTag if drawing parameter has an id', () => {
        const tempDrawing = new Drawing();
        tempDrawing._id = '4';
        component.onAddTag(tempDrawing);
        expect(webClientService.addTag).toHaveBeenCalled();
    });

    it('#getDate should output correct date format according to elapsed time', () => {

        const drawing = new Drawing();
        drawing.createdAt = new Date();
        const today = new Date();

        let days = 2;
        let hours = 2;
        drawing.createdAt.setDate(today.getDate() - days);
        drawing.createdAt.setHours(today.getHours() - hours);
        component.getDate(drawing);
        expect(component.getDate(drawing)).toEqual(`${days} day(s) and ${hours} hour(s) ago`);

        days = 2;
        drawing.createdAt = new Date();
        drawing.createdAt.setDate(today.getDate() - days);
        component.getDate(drawing);
        expect(component.getDate(drawing)).toEqual(`${days} day(s) ago`);

        hours = 2;
        drawing.createdAt = new Date();
        drawing.createdAt.setHours(today.getHours() - hours);
        component.getDate(drawing);
        expect(component.getDate(drawing)).toEqual(`${hours} hour(s) ago`);

        days = 8;
        hours = 2;
        drawing.createdAt = new Date();
        drawing.createdAt.setDate(today.getDate() - days);
        drawing.createdAt.setHours(today.getHours() - hours);
        component.getDate(drawing);
        expect(component.getDate(drawing)).toEqual(
            drawing.createdAt.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }),
        );

    });

});
