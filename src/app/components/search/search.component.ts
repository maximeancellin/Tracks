import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenService} from 'spotify-auth';
import {Subscription} from 'rxjs';
import {SpotifyService} from '../../services/spotify.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private stream: Subscription | null = null;
  private data: [] = [];
  private filterParameters: {} = {
    type: 'track,artist',
  };
  private currentSearch = '';

  constructor(private tokenSvc: TokenService, private spotify: SpotifyService) {  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

  filter(event) {
    // @ts-ignore
    this.filterParameters.type = event.value;
  }

  search(event) {
    if (!!event.target && event.target.value !== '') {
      this.currentSearch = event.target.value;
    }

    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      // @ts-ignore
      return this.spotify.search(this.currentSearch, this.filterParameters.type);
    }));
    this.stream = stream.subscribe((x) => this.data = JSON.parse(JSON.stringify(x)));
  }

}
