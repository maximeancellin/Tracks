import { Injectable } from '@angular/core';
import {TokenService} from 'spotify-auth';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckAuthService {

  private tokenValue;

  constructor(private token: TokenService, private route: Router) {
    this.tokenValue = token.oAuthToken;
  }

  checkConnection() {
    if (this.tokenValue) {
      return true;
    } else {
      this.route.navigateByUrl('login');
    }
    return false;
  }
}
