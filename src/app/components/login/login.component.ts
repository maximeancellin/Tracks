import { Component, OnInit } from '@angular/core';
import {AuthConfig, AuthService, ScopesBuilder, TokenService} from 'spotify-auth';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private  authService:  AuthService, private  tokenSvc:  TokenService, private  router:  Router) {
  }

  ngOnInit() {
  }

  public spotifyLogin() {
    const scopes = new ScopesBuilder()/* .withScopes(ScopesBuilder.LIBRARY) */.build();
    const ac:  AuthConfig  = {
      client_id:  environment.spotifyClientId,
      response_type:  'token',
      redirect_uri:  'http://localhost:4200/authorized',
      state:  '',
      show_dialog:  true,
      scope:  scopes
    };
    this.authService.configure(ac).authorize();
  }

}
