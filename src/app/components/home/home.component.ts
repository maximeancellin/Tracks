import { Component, OnInit } from '@angular/core';
import {CheckAuthService} from '../../services/check-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private auth: CheckAuthService) {
    // auth.checkConnection();
  }

  ngOnInit() {
  }

}
