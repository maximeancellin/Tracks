import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {TokenService} from 'spotify-auth';
import {SpotifyService} from '../../services/spotify.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {

  private stream: Subscription | null = null;
  private data: {} = {};

  constructor(private tokenSvc: TokenService, private spotify: SpotifyService) { }

  ngOnInit() {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.tracks('7ouMYWpwJ422jRcDASZB7P');
      return this.spotify.tracksFeatures('7ouMYWpwJ422jRcDASZB7P');
      return this.spotify.trackAnalysis('7ouMYWpwJ422jRcDASZB7P');
    }));
    this.stream = stream.subscribe((x) => this.data = x);
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

}
