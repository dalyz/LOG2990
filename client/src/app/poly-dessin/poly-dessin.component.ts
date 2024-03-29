import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/services/dialog/dialog.service';
import { KeyService } from 'src/services/key/key.service';
import { NewDrawingComponent } from '../popups/new-drawing/new-drawing.component';

@Component({
    selector: 'app-poly-dessin',
    templateUrl: './poly-dessin.component.html',
    styleUrls: ['./poly-dessin.component.scss'],
})
export class PolyDessinComponent implements OnInit {

    constructor(private dialogService: DialogService, private keyService: KeyService) { }

    isWelcomeShown: boolean;

    ngOnInit(): void {
        this.keyService.isShortcutsEnabled = false;
        const IS_WELCOME_HIDDEN = 'false';
        const WELCOME_DIALOG_COOKIE = 'HideWelcomeDialog';

        this.isWelcomeShown =
            (!sessionStorage.getItem(WELCOME_DIALOG_COOKIE) || sessionStorage.getItem(WELCOME_DIALOG_COOKIE) === IS_WELCOME_HIDDEN);
        if (this.isWelcomeShown) {
            this.dialogService.openEntryPoint(WELCOME_DIALOG_COOKIE);

            this.dialogService.isClosedWelcomeObservable.subscribe((isClosedWelcome: boolean) => {
                if (isClosedWelcome) {
                    this.dialogService.openDialog(NewDrawingComponent).afterClosed().subscribe(() =>
                        this.keyService.isShortcutsEnabled = true,
                    );
                }
            });
        } else {
            this.dialogService.openDialog(NewDrawingComponent).afterClosed().subscribe(() =>
                this.keyService.isShortcutsEnabled = true,
            );
        }
    }
}
