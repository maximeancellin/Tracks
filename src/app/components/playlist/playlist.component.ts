import {Component, OnChanges, OnDestroy, OnInit, SimpleChange} from '@angular/core';
import {Subscription} from 'rxjs';
import {TokenService} from 'spotify-auth';
import {SpotifyService} from '../../services/spotify.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy, OnChanges {
  private stream: Subscription | null = null;
  public data: {} = {};
  public tracks: [] = [];
  public tracksDetails: [] = [];

  constructor(private tokenSvc: TokenService, private spotify: SpotifyService) { }

  ngOnInit() {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.playlists();
    }));
    this.stream = stream.subscribe((x) => this.data = x);
  }

  loadDatas(id) {
    this.playlistTracks(id);
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    console.log(changes);
  }

    playlistTracks(id) {

      const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
        return this.spotify.playlistTracks(id, 'FR', 50, 0, 'items(track(id, name, artists))');
      }));
      this.stream = stream.subscribe((x) => this.tracks = JSON.parse(JSON.stringify(x)));
  }


  playlistDetails(ids) {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.tracksFeatures(ids);
    }));
    this.stream = stream.subscribe((x) => this.tracksDetails = JSON.parse(JSON.stringify(x)));
  }

  private trackIdToString(data) {
    let ids = '';

    console.log(data);
    if (data.length > 0) {
      for (const key of data.items) {
        ids += key.track.id + ',';
      }
    }

    return ids;
  }


  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

}
