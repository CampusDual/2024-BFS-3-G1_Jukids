import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OGridComponent, OTranslateService, OntimizeService } from 'ontimize-web-ngx';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { OMapComponent } from 'ontimize-web-ngx-map';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EventEmitter } from 'stream';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('oMapBasic') oMapBasic: OMapComponent;
  @ViewChild('figuresGrid') figuresGrid: OGridComponent;
  @ViewChild('plushiesGrid') plushiesGrid: OGridComponent;
  @ViewChild('childrensToysGrid') childrensToysGrid: OGridComponent;
  @ViewChild('boardGrid') boardGrid: OGridComponent;
  @ViewChild('dollsGrid') dollsGrid: OGridComponent;
  @ViewChild('actionToysGrid') actionToysGrid: OGridComponent;
  @ViewChild('videogamesGrid') videogamesGrid: OGridComponent;
  @ViewChild('craftsGrid') craftsGrid: OGridComponent;
  @ViewChild('pedagogicalGrid') pedagogicalGrid: OGridComponent;
  @ViewChild('sportGrid') sportGrid: OGridComponent;
  @ViewChild('electronicGrid') electronicGrid: OGridComponent;
  @ViewChild('collectiblesGrid') collectiblesGrid: OGridComponent;
  @ViewChild('antiquesGrid') antiquesGrid: OGridComponent;
  @ViewChild('cardsGrid') cardsGrid: OGridComponent;

  public hasFigures: boolean;
  public hasPlushies: boolean;
  public hasChildGames: boolean;
  public hasBoardGames: boolean;
  public hasDolls: boolean;
  public hasActionToys: boolean;
  public hasVGames: boolean;
  public hasCraftsToys: boolean;
  public hasPedagogical: boolean;
  public hasSportsToys: boolean;
  public hasElectronicalToys: boolean;
  public hasCollectives: boolean;
  public hasAntiques: boolean;
  public hasCardGames: boolean;

  private latitude: any;
  private longitude: any;
  private location: any;
  public cols: number = 5;
  public queryRows: number = 5;
  public language: string = "es";
  private autoplayInterval = null; //Variable para el carrusel

  //============== Variable de URL BASE =================
  public baseUrl: string;

  private layoutChanges = this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ]);

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService,
    private toysMapService: ToysMapService,
    private breakpointObserver: BreakpointObserver,
    private translate: OTranslateService,
  ) {
    //Configuración del servicio para poder ser usado
    const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
    this.ontimizeService.configureService(conf);
    this.language = translate.getStoredLanguage();
  }

  ngOnInit() {
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });

    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }

    this.hasFigures = true;
    this.hasPlushies = true;
    this.hasChildGames = true;
    this.hasBoardGames = true;
    this.hasDolls = true;
    this.hasActionToys = true;
    this.hasVGames = true;
    this.hasCraftsToys = true;
    this.hasPedagogical = true;
    this.hasSportsToys = true;
    this.hasElectronicalToys = true;
    this.hasCollectives = true;
    this.hasAntiques = true;
    this.hasCardGames = true;

    // Control de columnas en o-grid
    this.layoutChanges.subscribe((result) => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.cols = 2;
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.cols = 3;
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.cols = 4;
      } else if (result.breakpoints[Breakpoints.Large]) {
        this.cols = 5;
      } else if (result.breakpoints[Breakpoints.XLarge]) {
        this.cols = 5;
      }
    });

    this.translate.onLanguageChanged.subscribe(data => {
      this.language = data;
      console.log(data);
    });

    setTimeout(() => {
      // Iniciar autoplay con un intervalo de 5 segundos.
      this.startAutoplay(5000)
    }, 5);
  }

  navigate() {
    this.router.navigate(['../', 'login'], { relativeTo: this.actRoute });
  }

  //Insercion de la longuitud y la latitud del punto marcado en el mapa
  onMapClick(e) {
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;
    let date: Date = new Date();

    this.oMapBasic.addMarker(
      1,
      this.latitude,
      this.longitude,
      false,
      true,
      false,
      false,
      false
    );

    const toy = {
      "data": {
        "name": "Locationontimize",
        "description": "Locationteamontimize",
        "dateadded": date.toISOString().split('T')[0],
        "price": 23.12,
        "photo": "sdad",
        "latitude": this.latitude,
        "longitude": this.longitude
      }
    };

    fetch('http://localhost:8080/toys/toy', {

      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('admin' + ":" + 'adminuser'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toy)
    })
  }

  public openDetail(data: any): void {
    // Aquí redirigimos a la ruta de detalle de juguete y pasamos el ID como parámetro
    const toyId = data.toyid; // Asegúrate de obtener el ID correcto de tu objeto de datos
    this.router.navigate(["./toys/toysDetail", toyId]);
  }

  searchCategory(category):void {
      this.router.navigate(['/main/toys'], {queryParams:{category: category}});
    }

  checkHasToys(category: string):void {
    ((category === 'cat_Figures') && (this.figuresGrid.dataArray.length == 0)) && (this.hasFigures = false);
    ((category === 'cat_Plushies') && (this.plushiesGrid.dataArray.length == 0)) && (this.hasPlushies = false);
    ((category === 'cat_ChildrensToys') && (this.childrensToysGrid.dataArray.length == 0)) && (this.hasChildGames = false);
    ((category === 'cat_Board') && (this.boardGrid.dataArray.length == 0)) && (this.hasBoardGames = false);
    ((category === 'cat_Dolls') && (this.dollsGrid.dataArray.length == 0)) && (this.hasDolls = false);
    ((category === 'cat_ActionToys') && (this.actionToysGrid.dataArray.length == 0)) && (this.hasActionToys = false);
    ((category === 'cat_Videogames') && (this.videogamesGrid.dataArray.length == 0)) && (this.hasVGames = false);
    ((category === 'cat_Crafts') && (this.craftsGrid.dataArray.length == 0)) && (this.hasCraftsToys = false);
    ((category === 'cat_Pedagogical') && (this.pedagogicalGrid.dataArray.length == 0)) && (this.hasPedagogical = false);
    ((category === 'cat_Sport') && (this.sportGrid.dataArray.length == 0)) && (this.hasSportsToys = false);
    ((category === 'cat_Electronic') && (this.electronicGrid.dataArray.length == 0)) && (this.hasElectronicalToys = false);
    ((category === 'cat_Collectibles') && (this.collectiblesGrid.dataArray.length == 0)) && (this.hasCollectives = false);
    ((category === 'cat_Antiques') && (this.antiquesGrid.dataArray.length == 0)) && (this.hasAntiques = false);
    ((category === 'cat_Cards') && (this.cardsGrid.dataArray.length == 0)) && (this.hasCardGames = false);
  }

  //----------------- Carrusel -----------------
  public startAutoplay(interval) {
    clearInterval(this.autoplayInterval);  // Detiene cualquier autoplay anterior para evitar múltiples intervalos.
    let index = 0
    const bannerContainer = document.querySelector('.banner-container');
    const total = document.querySelectorAll('.banner-svg');
    const totalImages = document.querySelectorAll('.banner-svg').length;
    this.autoplayInterval = setInterval(() => {
      console.log(index, "-----------------------------------")
      console.log(index == totalImages - 1);
      this.carrusel(index);  // Navega a la siguiente imagen cada intervalo de tiempo.
      (index == totalImages - 1) ? index = 0 : index++;
    }, interval);
  }

  public carrusel(index) {
    const bannerContainer = document.querySelector('.banner-container');
    const totalImages = document.querySelectorAll('.banner-svg');
    console.log(bannerContainer.children[totalImages.length - 1])
    totalImages.forEach((element, key) => {
      if (key == index) {
        element.classList.remove("hidden")
      } else {
        element.classList.add("hidden")
      }
    });
  }
}
