import { Component, OnInit } from '@angular/core';
import { OTranslateService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-about-jukids',
  templateUrl: './about-jukids.component.html',
  styleUrls: ['./about-jukids.component.scss']
})
export class AboutJukidsComponent implements OnInit{
  public language: string = "es";


  constructor(
    private translate: OTranslateService,

  ){
    this.language = translate.getStoredLanguage();
  }
  ngOnInit(): void {
    this.translate.onLanguageChanged.subscribe(data => {
      this.language = data;
    });
  }
}
