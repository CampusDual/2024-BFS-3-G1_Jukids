import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-toys-detail',
  templateUrl: './toys-detail.component.html',
  styleUrls: ['./toys-detail.component.css']
})
export class ToysDetailComponent implements OnInit{
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
   protected sanitizer: DomSanitizer){

  }
  ngOnInit() {
   
  }
  public getImageSrc(base64: any): any {
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64.bytes) : './assets/images/no-image-transparent.png';
  }

}
