import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenService} from 'spotify-auth';
import {Subscription} from 'rxjs';
import {InfoService} from '../../services/info.service';
import {switchMap} from 'rxjs/operators';
import {isEmpty} from 'rxjs-compat/operator/isEmpty';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  constructor(private infoSvc: InfoService, private tokenSvc: TokenService) { }

  public get jUser(): {} {
    return JSON.stringify(this.user, null, 2);
  }

  private stream: Subscription | null = null;

  public user: {} = {};

  ngOnInit() {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.infoSvc.fetchUserInfo();
    }));
    this.stream = stream.subscribe((x) => this.user = x);
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

  public hasUser(): boolean {
    return !!this.user;
  }

}
