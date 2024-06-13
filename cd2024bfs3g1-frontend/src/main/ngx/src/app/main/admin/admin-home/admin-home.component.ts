import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit{

  constructor(){}

  ngOnInit(): void {
    this.dateFormat = this.dateFormat.bind(this);
  }

  public dateFormat(date: number): string {    
    const formattedDate = (date !== undefined) ? new Date(date).toLocaleDateString('es-ES', { month: '2-digit', year: '2-digit' }) : '';
    return formattedDate;
  }

}
