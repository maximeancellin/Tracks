import { Component, OnInit } from '@angular/core';
import {CheckAuthService} from '../../services/check-auth.service';
import {Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {SpotifyService} from '../../services/spotify.service';
import {TokenService} from 'spotify-auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private stream: Subscription | null = null;

  constructor(private auth: CheckAuthService, private tokenSvc: TokenService, private spotify: SpotifyService) {
    // auth.checkConnection();
  }

  ngOnInit() {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.userInfo();
    }));
    this.stream = stream.subscribe((x) => this.user = x);
  }

}
