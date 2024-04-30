import { Component, ViewChild} from '@angular/core';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';

@Component({
  selector: 'app-toys-new',
  templateUrl: './toys-new.component.html',
  styleUrls: ['./toys-new.component.css']
})
export class ToysNewComponent{
  private location: any;

  constructor(
    private toysMapService: ToysMapService,
  ) {}

  ngOnInit() {
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });
  }
  
  @ViewChild('NewToy') protected formToy: any;
  @ViewChild('latitude') protected lat: any;
  @ViewChild('longitude') protected lon: any;
  
  handleCoordinates(e) {
    let latitude = this.location.latitude;
    let longitude = this.location.longitude;
    document.getElementById('latitude').innerText = latitude;
    document.getElementById('longitude').innerText = longitude;
  }

}
