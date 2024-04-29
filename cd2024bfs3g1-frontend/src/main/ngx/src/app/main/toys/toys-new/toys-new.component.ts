import { Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-toys-new',
  templateUrl: './toys-new.component.html',
  styleUrls: ['./toys-new.component.css']
})
export class ToysNewComponent{
  
  @ViewChild('NewToy') protected formToy: any;
  @ViewChild('latitude') protected lat: any;
  @ViewChild('longitude') protected lon: any;
  
  handleCoordinates(e) {
    console.log("Holi")
    // this.lat = e.latlng.lat;
    // this.lon = e.latlng.lng;
    console.log(e.target);
  }

}
