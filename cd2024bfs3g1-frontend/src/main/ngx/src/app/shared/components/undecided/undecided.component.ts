import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-undecided',
  templateUrl: './undecided.component.html',
  styleUrls: ['./undecided.component.scss']
})
export class UndecidedComponent implements OnInit {
  
  public baseUrl: string;
  
  ngOnInit(): void {
    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }
  }


}
