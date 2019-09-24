import { Component, OnInit } from '@angular/core';
import { PaletteService } from 'src/services/palette/palette.service';

@Component({
    selector: 'app-color-option',
    templateUrl: './color-option.component.html',
    styleUrls: ['./color-option.component.scss', '../toolbar-option.scss'],
})
export class ColorOptionComponent implements OnInit {

    constructor(private paletteService: PaletteService) { }

    ngOnInit() { }

    get primary(): string { return this.paletteService.getPrimary(); }

    get secondary(): string { return this.paletteService.getSecondary(); }

    swap(): void { this.paletteService.swap(); }
}