import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenService} from 'spotify-auth';
import {Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {SpotifyService} from '../../services/spotify.service';
import {CheckAuthService} from '../../services/check-auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  private stream: Subscription | null = null;

  public user: {} = {};

  constructor(private spotify: SpotifyService, private tokenSvc: TokenService, private auth: CheckAuthService) {
    auth.checkConnection();
  }

  ngOnInit() {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.userInfo();
    }));
    this.stream = stream.subscribe((x) => this.user = x);
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }
}
