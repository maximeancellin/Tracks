import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpotifyAuthModule } from 'spotify-auth';
import {UserComponent} from './components/user/user.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {SearchComponent} from './components/search/search.component';
import {AboutComponent} from './components/about/about.component';

const routes: Routes = [
    {
      path:  '',
      redirectTo:  'login',
      pathMatch:  'full'
    },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path:  'user',
    component:  UserComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  SpotifyAuthModule.authRoutes()[0]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
