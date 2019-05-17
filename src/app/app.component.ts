import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'spotify-auth';
import {filter} from 'rxjs/operators';
import {CheckAuthService} from './services/check-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Tracks';

  constructor(private elementRef: ElementRef,
              private  authService:  AuthService, private  router:  Router) {
  }

  ngOnInit() {
  this.authService.authorizedStream.pipe(filter(x  =>  x)).subscribe(() => {
    this.router.navigate(['home']);
    });
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#303030';
  }
}
