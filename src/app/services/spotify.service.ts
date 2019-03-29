import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {throwError} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})

export interface SpotifyConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  authToken?: string;
  apiBase: string;
}

export interface SpotifyOptions {
  limit?: number;
  offset?: number;
  market?: string;
  album_type?: string;
  country?: string;
  type?: string;
  q?: string;
  timestamp?: string;
  locale?: string;
  public?: boolean;
  name?: string;
  time_range?: string;
  after?: string;
  before?: string;
}

interface HttpRequestOptions {
  method?: string;
  url: string;
  search?: Object;
  body?: Object;
  headers?: Headers;
}

export class SpotifyService {

  constructor(@Inject('SpotifyConfig') private config: SpotifyConfig, private http: HttpClient) {
    config.apiBase = 'https://api.spotify.com/v1';
  }

  /*
   *  Login
   */

  /*
  login() {
    const promise = new Promise((resolve, reject) => {
      const w = 400,
        h = 500,
        left = (screen.width / 2) - (w / 2),
        top = (screen.height / 2) - (h / 2);

      const params = {
        client_id: environment.spotifyClientId,//this.config.clientId,
        redirect_uri: environment.redirectUri,//this.config.redirectUri,
        scope: this.config.scope || '',
        response_type: 'token'
      };
      let authCompleted = false;
      const authWindow = this.openDialog(
        'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
        'Spotify',
        'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
        () => {
          if (!authCompleted) {
            return reject('Login rejected error');
          }
        }
      );

      const storageChanged = (e) => {
        if (e.key === 'angular2-spotify-token') {
          if (authWindow) {
            authWindow.close();
          }
          authCompleted = true;

          this.config.authToken = e.newValue;
          window.removeEventListener('storage', storageChanged, false);

          return resolve(e.newValue);
        }
      };
      window.addEventListener('storage', storageChanged, false);
    });

    // return catchError(this.handleError);
    return fromPromise(promise).pipe(
      catchError(this.handleError)
    );
  }

  /*
   *  End Login
   */

  /*
   *  Tools
   */
  /*

  private toQueryString(obj: Object): string {
    const parts = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    }
    return parts.join('&');
  }

  private getIdFromUri(uri: string) {
    return uri.indexOf('spotify:') === -1 ? uri : uri.split(':')[2];
  }

  private openDialog(uri, name, options, cb) {
    const win = window.open(uri, name, options);
    const interval = window.setInterval(() => {
      try {
        if (!win || win.closed) {
          window.clearInterval(interval);
          cb(win);
        }
      } catch (e) { }
    }, 1000000);
    return win;
  }

  private auth(isJson?: boolean): Object {
    const auth = {
      'Authorization': 'Bearer ' + this.config.authToken
    };
    if (isJson) {
      auth['Content-Type'] = 'application/json';
    }
    return auth;
  }
/*
  private getHeaders(isJson?: boolean): any {
    return new Headers(this.auth(isJson));
  }
*/
  /*
  private mountItemList(items: string | Array<string>): Array<string> {
    const itemList = Array.isArray(items) ? items : items.split(',');
    itemList.forEach((value, index) => {
      itemList[index] = this.getIdFromUri(value);
    });
    return itemList;
  }

  private handleError(error: Response) {
    console.error(error);
    return throwError(error.json() || 'Server error');
  }

  private api(requestOptions) {
    return null;
    /*
    return this.http.request(requestOptions.method || 'get', this.config.apiBase + requestOptions.url, {
      body: JSON.stringify(requestOptions.body),
      headers: requestOptions.headers,
      search: this.toQueryString(requestOptions.search),
    });
    */


    /*return this.http.request(new Request({
      url: this.config.apiBase + requestOptions.url,
      method: requestOptions.method || 'get',
      search: this.toQueryString(requestOptions.search),
      body: JSON.stringify(requestOptions.body),
      headers: requestOptions.headers
    }));*/
  // }


  /*
   *  End Tools
   */
}
