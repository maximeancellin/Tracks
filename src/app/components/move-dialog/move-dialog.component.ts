import {Component, Inject, OnInit} from '@angular/core';
import {TokenService} from 'spotify-auth';
import {SpotifyService} from '../../services/spotify.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';

@Component({
  selector: 'app-move-dialog',
  templateUrl: './move-dialog.component.html',
  styleUrls: ['./move-dialog.component.scss']
})
export class MoveDialogComponent implements OnInit {

  constructor(private tokenSvc: TokenService, private spotify: SpotifyService, public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close({data: this.listId});
  }

  getInput(event: any) {
    this.dialogData = event.target.value;
  }
}

