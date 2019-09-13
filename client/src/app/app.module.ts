import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { DevPanelComponent } from './components/dev-panel/dev-panel.component';
import { DrawAreaComponent } from './components/draw-area/draw-area.component';
import { NewDrawingComponent } from './components/new-drawing/new-drawing.component';
import { PolyDessinComponent } from './components/poly-dessin/poly-dessin.component';
import { ColorSelectorComponent } from './components/toolbar/selector/color-selector/color-selector.component';
import { SelectorComponent } from './components/toolbar/selector/selector.component';
import { ShapeSelectorComponent } from './components/toolbar/selector/shape-selector/shape-selector.component';
import { ToolSelectorComponent } from './components/toolbar/selector/tool-selector/tool-selector.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { WorkZoneComponent } from './components/work-zone/work-zone.component';
import { KeytrackDirective } from './directive/keytrack.directive';
import { MousetrackDirective } from './directive/mousetrack.directive';
import {
    MAT_DIALOG_DATA, MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDialogRef, MatDividerModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule, MAT_DIALOG_DEFAULT_OPTIONS
} from '@angular/material';
import { EntryPointComponent } from './components/entry-point/entry-point.component';

@NgModule({
    declarations: [
        AppComponent,
        ColorSelectorComponent,
        DevPanelComponent,
        DrawAreaComponent,
        EntryPointComponent,
        KeytrackDirective,
        MousetrackDirective,
        NewDrawingComponent,
        PolyDessinComponent,
        SelectorComponent,
        ShapeSelectorComponent,
        ToolSelectorComponent,
        ToolbarComponent,
        WorkZoneComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    exports: [
        MatDividerModule,
    ],
    providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        EntryPointComponent,
    ],
})

export class AppModule {
}
