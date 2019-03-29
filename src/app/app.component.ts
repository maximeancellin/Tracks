import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService, TokenService} from 'spotify-auth';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Tracks';


  // constructor(private oauthService: OAuthService, private http: HttpClient) {
    // this.oauthService.redirectUri = window.location.origin + '/index.html';
    // this.oauthService.clientId = environment.spotifyClientId;
    // this.oauthService.loginUrl = 'https://accounts.spotify.com/authorize';
    /*
    this.oauthService.configure({
      clientId: environment.spotifyClientId,
      redirectUri: window.location.origin + '/',
      loginUrl: 'https://accounts.spotify.com/authorize',
      issuer: 'https://accounts.spotify.com/authorize',
      responseType: 'code'
    });
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
*/
  // }
  constructor(private  tokenSvc:  TokenService, private  authService:  AuthService, private  router:  Router) {
}

  ngOnInit() {
  this.authService.authorizedStream.pipe(filter(x  =>  x)).subscribe(() => {
    this.router.navigate(['user']);
  });
}

}
