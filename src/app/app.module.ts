import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { SpotifyAuthComponent } from './spotify-auth/spotify-auth.component';
import { SpotifyGraphComponent } from './spotify-graph/spotify-graph.component';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    SpotifyAuthComponent,
    SpotifyGraphComponent
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
