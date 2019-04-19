import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

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
      'Content-Type' : 'application/json; charset=utf-8'
    });

    const parameters = this.toQueryString({
      'q' : input,
      'type' : type,
      'market' : market,
      'limit' : limit,
      'offset' : offset
    });

    return this.http.get(this.apiUrl + 'search?' + parameters, {headers : head}).pipe(
      tap((data: {}) => {
        console.log(data);
        this.data$.next(this.data);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  /*
   *  END Search
   */


  /*
   *  START Tracks
   */

  // TODO Tester les appels liés au tracks

  public tracks(ids, market = 'FR'): Observable<{}> {
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

  public artistAlbums(id, group = 'single,appears_on', market = 'FR', limit = 1, offset = 0): Observable<{}> {
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
