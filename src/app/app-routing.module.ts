import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpotifyAuthModule } from 'spotify-auth';

const routes: Routes = [
    {
      path:  '',
      redirectTo:  'user',
      pathMatch:  'full'
    },
  /*
    {
      path:  'user',
      component:  UserComponent
    },
    */
  SpotifyAuthModule.authRoutes()[0]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
