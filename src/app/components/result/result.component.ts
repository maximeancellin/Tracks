import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {TokenService} from 'spotify-auth';
import {CheckAuthService} from '../../services/check-auth.service';
import {count, switchMap} from 'rxjs/operators';
import {SpotifyService} from '../../services/spotify.service';
import {Subscription} from 'rxjs';
import {isDefined} from '@angular/compiler/src/util';
import {DeleteDialogComponent} from '../delete-dialog/delete-dialog.component';
import {MatDialog} from '@angular/material';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent implements OnInit, OnDestroy, OnChanges {
  private stream: Subscription | null = null;
  private tracksDetails;
  public result = [];
  private player;
  @Input() data = null;
  @Input() listId = null;
  @Input() type;
  displayedColumns: string[] = ['select', 'index', 'name', 'artist', 'BPM', 'key', 'duration', 'demo'];

  public test;

  constructor(private tokenSvc: TokenService, private auth: CheckAuthService, private spotify: SpotifyService, private dialog: MatDialog) {
    this.player = new Audio();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (this.type === 0) {
        this.result = this.data;
      }
      if (this.type === 1) {
        if (this.data.hasOwnProperty('tracks')) {
          this.result = this.data.tracks.items;
        }
      }
      const ids = this.trackIdToString(this.result);
      this.playlistDetails(ids);
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

  playlistDetails(ids) {
    if (ids !== '') {
      const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
        return this.spotify.tracksFeatures(ids);
      }));
      this.stream = stream.subscribe((x) => {
        this.tracksDetails = JSON.parse(JSON.stringify(x)).audio_features;
        this.tracksDetails.forEach((item, index) => {
          if (this.type === 0 && item !== null) {
            this.result[index].track['index'] = index;
            this.result[index].track['BPM'] = item.tempo;
            this.result[index].track['key'] = item.key;
            this.result[index].track['time'] = item.duration_ms;
          }
          if (this.type === 1 && item !== null && !!this.result[index]) {
            this.result[index]['index'] = index;
            this.result[index]['BPM'] = item.tempo;
            this.result[index]['key'] = item.key;
            this.result[index]['time'] = item.duration_ms;
          }
        });
      });
    }
  }

  private trackIdToString(data) {
    let ids = '';

    if (data) {
      for (const key of data) {
        if (this.type === 0) {
          ids += key.track.id + ',';
        }
        if (this.type === 1) {
          ids += key.id + ',';
        }
      }
    }

    return ids;
  }

  playDemo(url) {
    console.log('url', url);
    this.player.stop();
    this.player.src = url;
    this.player.load();
    this.player.play();
    console.log('play');
  }

  openDeleteDialog(trackUri) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
          return this.spotify.playlistDeleteTracks(this.listId, trackUri);
        }));
        this.stream = stream.subscribe((x) => console.log(x));
      }
    });
  }

  openAddDialog(trackUri) {
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
          return this.spotify.playlistAddTracks(result, 0, trackUri);
        }));
        this.stream = stream.subscribe((x) => console.log(x));
      }
    });
  }
}
