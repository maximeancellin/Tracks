import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {TokenService} from 'spotify-auth';
import {CheckAuthService} from '../../services/check-auth.service';
import {switchMap} from 'rxjs/operators';
import {SpotifyService} from '../../services/spotify.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent implements OnInit, OnDestroy, OnChanges {
  private stream: Subscription | null = null;
  private tracksDetails;
  public result = [];
  @Input() data;
  displayedColumns: string[] = ['name', 'artist', 'BPM', 'key', 'duration'];

  constructor(private tokenSvc: TokenService, private auth: CheckAuthService, private spotify: SpotifyService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.result = this.data.items;
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
          this.result[index].track['BPM'] = item.tempo;
          this.result[index].track['key'] = item.key;
          this.result[index].track['time'] = item.duration_ms;
        });
      });
    }
  }

  private trackIdToString(data) {
    let ids = '';

    if (data) {
      for (const key of data) {
        ids += key.track.id + ',';
      }
    }

    return ids;
  }
}
