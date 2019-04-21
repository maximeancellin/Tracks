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

  constructor(private http: HttpClient) {
    this.data$ = new BehaviorSubject<{}>(this.data);
  }

  /*
   *  User
   */


  public userInfo(): Observable<{}> {
    return this.http.get(this.apiUrl + 'me').pipe(
      tap((data: {}) => {
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

  public search(input, type = 'track,artist', market = 'FR', limit = '20', offset = '0'): Observable<{}> {
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

  public playlistsById(id, market = 'fr'): Observable<{}> {
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

  public playlistTracks(id, market = 'FR', limit = 20, offset = 0, field = 'items(added_by.id,track(name,href,album(name,href)))')
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

  public playlistCreate(userId, name, description = '', type = false): Observable<{}> {
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
