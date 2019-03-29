import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: HttpClient, private router: Router) {
    this.user$ = new BehaviorSubject<{}>(this.user);
  }

  private apiUserUrl = 'https://api.spotify.com/v1/me';
  private apiAlbumsUrl = 'https://api.spotify.com/v1/me/albums';

  private user: {} = {};
  private user$: BehaviorSubject<{}>;

  public fetchUserInfo(): Observable<{}> {
    return this.http.get(this.apiUserUrl).pipe(
      tap((user: {}) => {
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public fetchUserAlbums(): Observable<{}> {
    return this.http.get(this.apiAlbumsUrl).pipe(
      tap((user: {}) => {
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }

  public getUserStream(): Observable<{}> {
    return this.user$.asObservable();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      (result as any) = error;
      return of(result as T);
    };
  }

}
