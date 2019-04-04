import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
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
   *  Tools
   */

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      (result as any) = error;
      return of(result as T);
    };
  }

  /*
   *  END Tools
   */
}
