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
      /*
       *  User
       */
      console.log('START USER');
      console.log(this.spotify.userInfo());
      console.log(this.spotify.userInfoById('smedjan'));
      console.log('END USER');

      /*
       *  Search
       */
      console.log('START SEARCH');
      console.log(this.spotify.search(''));
      console.log('END SEARCH');

      /*
       *  Playlist
       */
      console.log('START PLAYLIST');
      console.log(this.spotify.playlistCreate('', '', ''));
      console.log(this.spotify.playlistReorder('', 0, 1, 2));
      console.log(this.spotify.playlistUpdate('', '', ''));
      console.log(this.spotify.playlistsById(''));
      console.log(this.spotify.playlistDeleteTracks('', ''));
      console.log(this.spotify.playlists());
      console.log(this.spotify.playlistAddTracks('', '', ''));
      console.log(this.spotify.playlistsByUser(''));
      console.log(this.spotify.playlistTracks(''));
      console.log('END PLAYLIST');

      /*
       *  Tracks
       */
      console.log('START TRACKS');
      console.log(this.spotify.tracks('7ouMYWpwJ422jRcDASZB7P'));
      console.log(this.spotify.trackAnalysis('7ouMYWpwJ422jRcDASZB7P'));
      console.log(this.spotify.tracksFeatures('7ouMYWpwJ422jRcDASZB7P'));
      console.log('END TRACKS');

      /*
       *  Artists
       */
      console.log('START ARTISTS');
      console.log(this.spotify.artists(''));
      console.log(this.spotify.artistAlbums(''));
      console.log(this.spotify.artistTopTracks('', 'FR'));
      console.log(this.spotify.artistRelated(''));
      console.log('END ARTISTS');

      /*
       *  Player
       */
      console.log('START PLAYER');
      console.log(this.spotify.playerRecent());
      console.log(this.spotify.playerNow());
      console.log(this.spotify.playerDevice());
      console.log(this.spotify.playerTrackNow());
      console.log(this.spotify.playerNext(''));
      console.log(this.spotify.playerPrevious(''));
      console.log(this.spotify.playerPause(''));
      console.log(this.spotify.playerRepeat(''));
      console.log(this.spotify.playerSeek(''));
      console.log(this.spotify.playerShuffle(''));
      console.log(this.spotify.playerVolume(''));
      console.log(this.spotify.playerPlay('', ''));
      console.log('END PLAYER');

      return null;
    }));
    this.stream = stream.subscribe((x) => this.data = x);
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

}
