import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {switchMap} from 'rxjs/operators';
import {TokenService} from 'spotify-auth';
import {SpotifyService} from '../../services/spotify.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {
  private stream: Subscription | null = null;
  public data: {} = {};
  private listId;

  constructor(private tokenSvc: TokenService, private spotify: SpotifyService, public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) { }

  ngOnInit() {
    const stream = this.tokenSvc.authTokens.pipe(switchMap((x) => {
      return this.spotify.playlists();
    }));
    this.stream = stream.subscribe((x) => this.data = x);
  }

  onNoClick(): void {
    this.dialogRef.close({data: this.listId});
  }

  selectedList(id) {
    this.dialogData = id;
  }

}
