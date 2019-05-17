import {Component, OnChanges, OnDestroy, OnInit, SimpleChange} from '@angular/core';
import {Subscription} from 'rxjs';
import {TokenService} from 'spotify-auth';
import {SpotifyService} from '../../services/spotify.service';
import {switchMap} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy, OnChanges {
  private stream: Subscription | null = null;
  public data: {} = {};
  public tracks: [] = [];
  public playlist: [] = [];
  public listId;

  private name;
  private description;

  constructor(private tokenSvc: TokenService, private spotify: SpotifyService, private snackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.loadPlaylist();
  }

  loadPlaylist() {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.playlists();
    }));
    this.stream = stream.subscribe((x) => this.data = x);
  }

  loadDatas(id) {
    this.listId = id;
    this.playlistTracks(id);
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  }

    playlistTracks(id) {

      const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
        return this.spotify.playlistTracks(id, 'FR', 50, 0, 'items(track(id, name, artists, preview_url, uri))');
      }));
      this.stream = stream.subscribe((x) => this.tracks = JSON.parse(JSON.stringify(x)));
  }

  createPlaylist(f: NgForm) {
    if (f.valid) {
      const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
        return this.spotify.playlistCreate(f.value.name, f.value.description);
      }));
      this.stream = stream.subscribe((x) => {
        this.playlist = JSON.parse(JSON.stringify(x));
        // @ts-ignore
        if (!!this.playlist.uri) {
          // @ts-ignore
          this.snackbar.open('Playlist ' + this.playlist.description + ' created !', 'Ok', {
            duration: 3000
          });
          this.loadPlaylist();
        } else {
          this.snackbar.open('Error !', 'Ok', {
            duration: 3000
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }
}
