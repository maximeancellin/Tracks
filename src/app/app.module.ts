import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {SpotifyAuthModule} from 'spotify-auth';
import {SpotifyAuthInterceptor2} from './interceptor/spotifyAuth.interceptor';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PlaylistComponent } from './components/playlist/playlist.component';

import {
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatMenuModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    HomeComponent,
    SearchComponent,
    ToolbarComponent,
    PlaylistComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SpotifyAuthModule.forRoot(),
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [
    {
      provide:  HTTP_INTERCEPTORS,
      // Force interception to use your new shiny headers!
      useClass:  SpotifyAuthInterceptor2,
      multi:  true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
