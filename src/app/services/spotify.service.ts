import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {any} from 'codelyzer/util/function';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private data: {} = {};
  private data$: BehaviorSubject<{}>;
  private apiUrl = environment.apiUrl;
  private userId;
  private market = 'FR';

  constructor(private http: HttpClient) {
    this.data$ = new BehaviorSubject<{}>(this.data);
  }

  /*
   *  User
   */


  public userInfo(): Observable<{}> {
    return this.http.get(this.apiUrl + 'me').pipe(
      tap((data: {}) => {
        // @ts-ignore
        this.userId = data.id;
        // @ts-ignore
        this.market = data.country;
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public userInfoById(id): Observable<{}> {
    return this.http.get(this.apiUrl + 'users/' + id).pipe(
      tap((data: {}) => {
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  /*
   *  END User
   */

  /*
   *  Search
   */

  public search(input, type = 'track,artist', market = this.market, limit = '20', offset = '0'): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    const parameters = this.toQueryString({
      'q': input,
      'type': type,
      'market': market,
      'limit': limit,
      'offset': offset
    });

    return this.http.get(this.apiUrl + 'search?' + parameters, {headers: head}).pipe(
      tap((data: {}) => {
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  /*
   *  END Search
   */

  /*
   *  START Playlist
   */

  public playlistDeleteTracks(id, trackUri): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    const bodyRequest = {
      tracks: [{
        uri: trackUri,
      }
      ]
    };

    return this.http.request('delete', this.apiUrl + 'playlists/' + id + '/tracks', {body: bodyRequest}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playlists(limit = 20, offset = 0): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    const parameters = this.toQueryString({
      'limit': limit,
      'offset': offset
    });


    return this.http.get(this.apiUrl + 'me/playlists?' + parameters, {headers: head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playlistsById(id, market = this.market): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    const parameters = this.toQueryString({
      'market': market
    });


    return this.http.get(this.apiUrl + 'playlists/' + id + '?' + parameters, {headers: head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playlistsByUser(id, limit = 20, offset = 0): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    const parameters = this.toQueryString({
      'limit': limit,
      'offset': offset
    });


    return this.http.get(this.apiUrl + 'users/' + id + '/playlists?' + parameters, {headers: head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playlistTracks(id, market = this.market, limit = 20, offset = 0, field = 'items(added_by.id,track(name,href,album(name,href)))')
    : Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    const parameters = this.toQueryString({
      'market': market,
      'limit': limit,
      'offset': offset,
      'fields': field
    });


    return this.http.get(this.apiUrl + 'playlists/' + id + '/tracks?' + parameters, {headers: head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playlistAddTracks(id, position, uris): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8'
    });

    const parameters = this.toQueryString({
      'position': position,
      'uris': uris
    });


    return this.http.post(this.apiUrl + 'playlists/' + id + '/tracks?' + parameters, any, {headers: head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playlistCreate(userId = this.userId, name, description = '', type = false): Observable<{}> {
    const bodyData = {
      name: name,
      description: description,
      public: type
    };

    return this.http.post(this.apiUrl + 'users/' + userId + '/playlists', bodyData).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playlistUpdate(id, name, description = '', type = false): Observable<{}> {
    const bodyData = {
      name: name,
      description: description,
      public: type
    };

    return this.http.put(this.apiUrl + 'playlists/' + id, bodyData).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playlistReorder(id, start, length, before): Observable<{}> {
    const bodyData = {
      range_start: start,
      range_length: length,
      insert_before: before
    };

    return this.http.put(this.apiUrl + 'playlists/' + id + '/tracks', bodyData).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  /*
   *  END Playlist
   */


  /*
   *  START Tracks
   */

  // TODO Tester les appels liés au tracks

  public tracks(ids, market = this.market): Observable<{}> {
    const parameters = this.toQueryString({
      'ids' : ids,
      'market' : market
    });

    return this.http.get(this.apiUrl + 'tracks?' + parameters).pipe(
      tap((data: {}) => {
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public trackAnalysis(id): Observable<{}> {

    return this.http.get(this.apiUrl + 'audio-analysis/' + id).pipe(
      tap((data: {}) => {
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public tracksFeatures(ids): Observable<{}> {
    const parameters = this.toQueryString({
      'ids' : ids
    });

    return this.http.get(this.apiUrl + 'audio-features?' + parameters).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  /*
   *  END Tracks
   */

  /*
   * START Artists
   */

  public artists(ids): Observable<{}> {
    const parameters = this.toQueryString({
      'ids' : ids
    });

    return this.http.get(this.apiUrl + 'artists?' + parameters).pipe(
      tap((data: {}) => {
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public artistAlbums(id, group = 'single,appears_on', market = this.market, limit = 1, offset = 0): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8'
    });

    const parameters = this.toQueryString({
      'include_groups' : group,
      'market' : market,
      'limit' : limit,
      'offset' : offset
    });

    return this.http.get(this.apiUrl + 'artists/' + id + '/albums?' + parameters, {headers : head}).pipe(
      tap((data: {}) => {
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public artistTopTracks(id, country): Observable<{}> {
    const parameters = this.toQueryString({
      'country' : country
    });

    return this.http.get(this.apiUrl + 'artists/' + id + '/top-tracks?' + parameters).pipe(
      tap((data: {}) => {
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public artistRelated(id): Observable<{}> {

    return this.http.get(this.apiUrl + 'artists/' + id + '/related-artists').pipe(
      tap((data: {}) => {
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  /*
   * END Artists
   */

  /*
   *  START Player
   */

  public playerRecent(limit = 10): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8'
    });

    const parameters = this.toQueryString({
      'limit' : limit,
    });

    return this.http.get(this.apiUrl + 'me/player/recently-played?' + parameters, {headers : head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerNow(): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8'
    });

    return this.http.get(this.apiUrl + 'me/player', {headers : head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerDevice(): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8'
    });

    return this.http.get(this.apiUrl + 'me/player/devices', {headers : head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerTrackNow(): Observable<{}> {
    const head = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8'
    });

    return this.http.get(this.apiUrl + 'me/player/currently-playing', {headers : head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerNext(device): Observable<{}> {
    const parameters = this.toQueryString({
      'device_id' : device,
    });

    return this.http.post(this.apiUrl + 'me/player/next?' + parameters, any).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerPrevious(device): Observable<{}> {
    const parameters = this.toQueryString({
      'device_id' : device,
    });

    return this.http.post(this.apiUrl + 'me/player/previous?' + parameters, any).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerPause(device): Observable<{}> {
    const parameters = this.toQueryString({
      'device_id' : device,
    });

    return this.http.put(this.apiUrl + 'me/player/pause?' + parameters, any).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerRepeat(device, state = 'context'): Observable<{}> {
    const parameters = this.toQueryString({
      'device_id' : device,
      'state' : state,
    });

    return this.http.put(this.apiUrl + 'me/player/repeat?' + parameters, any).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerSeek(device, time = 2500): Observable<{}> {
    const parameters = this.toQueryString({
      'device_id' : device,
      'position_ms' : time,
    });

    return this.http.put(this.apiUrl + 'me/player/seek?' + parameters, any).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerShuffle(device, state = true): Observable<{}> {
    const parameters = this.toQueryString({
      'device_id' : device,
      'state' : state,
    });

    return this.http.put(this.apiUrl + 'me/player/shuffle?' + parameters, any).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerVolume(device, volume = 100): Observable<{}> {
    const parameters = this.toQueryString({
      'device_id' : device,
      'volume_percent' : volume,
    });

    return this.http.put(this.apiUrl + 'me/player/volume?' + parameters, any).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public playerPlay(device, uri, offset = 0, time = 0): Observable<{}> {
    const parameters = this.toQueryString({
      'device_id' : device,
    });

    const requestBody = {
      context_uri : uri,
      offset : {
        position : offset
      },
      position_ms : time
    };

    return this.http.put(this.apiUrl + 'me/player/play?' + parameters, requestBody).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  /*
   *  END Player
   */

  /*
   *  Tools
   */

  private toQueryString(obj: Object): string {
    const parts = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    }

    return parts.join('&');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      (result as any) = error;
      return of(result as T);
    };
  }

  public getJson(data): {} {
    return JSON.stringify(data);
  }

  /*
   *  END Tools
   */
}
