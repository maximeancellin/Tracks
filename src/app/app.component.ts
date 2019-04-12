import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'spotify-auth';
import {filter} from 'rxjs/operators';
import {CheckAuthService} from './services/check-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Tracks';

  constructor(private  authService:  AuthService, private  router:  Router, private auth: CheckAuthService) {
    // auth.checkConnection();
    // router.navigateByUrl('/home');
  }

  ngOnInit() {
  this.authService.authorizedStream.pipe(filter(x  =>  x)).subscribe(() => {
    this.router.navigate(['home']);
    });
  }
}
