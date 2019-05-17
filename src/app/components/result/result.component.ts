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
import {MoveDialogComponent} from '../move-dialog/move-dialog.component';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data = null;
  @Input() listId = null;
  @Input() type;
  private stream: Subscription | null = null;
  private tracksDetails;
  private pitchRelation: string[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
  ];
  public result = [];
  public displayedColumns: string[] = ['select', 'index', 'name', 'artist', 'BPM', 'key', 'duration', 'demo'];

  constructor(private tokenSvc: TokenService, private auth: CheckAuthService, private spotify: SpotifyService, private dialog: MatDialog) {
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
            this.result[index].track['key'] = this.pitchRelation[item.key];
            this.result[index].track['time'] = item.duration_ms;
          }
          if (this.type === 1 && item !== null && !!this.result[index]) {
            console.log('index result', this.result[index]);
            this.result[index]['index'] = index;
            this.result[index]['BPM'] = item.tempo;
            this.result[index]['key'] = this.pitchRelation[item.key];
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

  msToTime(duration) {
    let minutes = Math.floor(duration / (1000 * 60) % 60);
    let seconds = Math.floor(duration / 1000 % 60);

    // @ts-ignore
    minutes = minutes < 10 ? '0' + minutes : minutes;
    // @ts-ignore
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return  + minutes + ':' + seconds;
  }

  openDeleteDialog(trackUri) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
          return this.spotify.playlistDeleteTracks(this.listId, trackUri);
        }));
        this.stream = stream.subscribe();
      }
    });
  }

  openAddDialog(trackUri) {
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
          return this.spotify.playlistAddTracks(result, 0, trackUri);
        }));
        this.stream = stream.subscribe();
      }
    });
  }

  openMoveDialog(trackUri, trackIndex) {
    const dialogRef = this.dialog.open(MoveDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
          return this.spotify.playlistReorder(this.listId, trackIndex, Number(result));
        }));
        this.stream = stream.subscribe();
      }
    });
  }
}
