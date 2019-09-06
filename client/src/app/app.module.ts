import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './components/app/app.component';
import { DrawAreaComponent } from './components/draw-area/draw-area.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { WorkZoneComponent } from './components/work-zone/work-zone.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    DrawAreaComponent,
    WorkZoneComponent,
    EntryPointComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
