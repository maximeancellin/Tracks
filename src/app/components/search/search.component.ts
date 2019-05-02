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

  constructor(private tokenSvc: TokenService, private spotify: SpotifyService) {  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

  search(event) {
    console.log(event.target.value);

    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.search(event.target.value, 'track');
    }));
    this.stream = stream.subscribe((x) => this.data = JSON.parse(JSON.stringify(x)));
  }

}
