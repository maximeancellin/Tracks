import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenService} from 'spotify-auth';
import {Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {SpotifyService} from '../../services/spotify.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  private stream: Subscription | null = null;
  private data: {} = {};

  constructor(private tokenSvc: TokenService, private spotify: SpotifyService) {  }

  ngOnInit() {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.search('muse');
    }));
    this.stream = stream.subscribe((x) => this.data = x);
    // console.log(this.data);
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

}
