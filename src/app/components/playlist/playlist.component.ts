import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {TokenService} from 'spotify-auth';
import {SpotifyService} from '../../services/spotify.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {
  private stream: Subscription | null = null;
  public data: {} = {};

  constructor(private tokenSvc: TokenService, private spotify: SpotifyService) { }

  ngOnInit() {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.playlists();
    }));
    this.stream = stream.subscribe((x) => this.data = x);
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

}
