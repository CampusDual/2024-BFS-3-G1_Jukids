import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { DialogService, ODialogConfig, OTranslateService,  OntimizeService} from 'ontimize-web-ngx';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent {
  public selectedStar: number = 0;
  @ViewChild('comment') protected comment: ElementRef;

  // Propiedades para traducciones
  protected ACKNOWLEDGEMENT_IN_SURVEY: string;
  protected EXPERIENCE_IN_SURVEY: string;
  protected JUKID_POINTS: string;
  protected COMMENT_IN_SURVEY: string;
  protected RATE_BUTTON_IN_SURVEY: string;

  // Información del producto que se va a valorar
  toyId: number | null = null;
  toyPhoto: string | null = null;
  toyName: string | null =null;
  sellerId: number | null = null;
  sellerName: string | null = null;
  buyerId: number | null = null;

  public ghostColors = [
    { base: '#ff5a5a', outline: '#f04646' },
    { base: '#ff9c5a', outline: '#f09846' },
    { base: '#fcff5a', outline: '#f0ed46' },
    { base: '#5a5dff', outline: '#4673f0' },
    { base: '#60ff5a', outline: '#5af046' }
  ];

  ontimizeService: OntimizeService;

  constructor (
    private translateService: OTranslateService,
    private sharedDataService: SharedDataService,
    protected dialogService: DialogService,
    protected injector: Injector) {
      this.ontimizeService = this.injector.get(OntimizeService);
      let conf = this.ontimizeService.getDefaultServiceConfiguration('surveys');
      this.ontimizeService.configureService(conf)
    }

  // Traducciones
  ngOnInit(): void {
    this.ACKNOWLEDGEMENT_IN_SURVEY = this.translateService.get("ACKNOWLEDGEMENT_IN_SURVEY");
    this.EXPERIENCE_IN_SURVEY = this.translateService.get("EXPERIENCE_IN_SURVEY");
    this.JUKID_POINTS = this.translateService.get("JUKID_POINTS");
    this.COMMENT_IN_SURVEY = this.translateService.get("COMMENT_IN_SURVEY");
    this.RATE_BUTTON_IN_SURVEY = this.translateService.get("RATE_BUTTON_IN_SURVEY");

    // Obtener los datos del producto, vendedor y comprador
    const data = this.sharedDataService.getData();

    if (data) {
      this.toyId = data.toyId;
      this.toyPhoto = data.toyPhoto;
      this.toyName = data.toyName;
      this.sellerId = data.sellerId;
      this.sellerName = data.sellerName;
      this.buyerId = data.buyerId;
    } else {
      window.location.href = window.location.origin + '/main/user-profile/buylist';
    }
  }

  // Colores dinámicos para fantasmas de valoración
  getOutlineColor( idx: number ){
    return this.ghostColors[idx].outline;
  }

  getBaseColor( idx: number ){
    return this.ghostColors[idx].base;
  }

  setStar(star: number): void {
    this.selectedStar = star;
  }

  // Controlar excepciones y validaciones
  submit():void {
    let arrayErrores: any [] = [];
    let errorStars = "ERROR_STARS_VALIDATION";
    let errorComment = "ERROR_COMMENT_VALIDATION";

    if (this.selectedStar == 0){
      arrayErrores.push(this.translateService.get(errorStars));
    }

    if (this.comment.nativeElement.value == ''){
      arrayErrores.push(this.translateService.get(errorComment));
    }

    if (arrayErrores.length > 0 ) {
      let stringErrores = "";

      for(let i = 0; i < arrayErrores.length; i++){
        stringErrores += "</br>" + (arrayErrores[i] + "</br>");
      }

      this.showCustom("error", "Ok", this.translateService.get("COMPLETE_FIELDS_VALIDATION"), stringErrores);

    } else {

      let data = {
        'toy_id': this.toyId,
        'seller_id': this.sellerId,
        'buyer_id': this.buyerId,
        'rating': this.selectedStar,
        'comment': this.comment.nativeElement.value
      }

      this.ontimizeService.insert(data, 'survey').subscribe(result => {
        window.location.href = window.location.origin + '/main/user-profile/buylist';
      })
    }
  }

  showCustom(
    icon: string,
    btnText: string,
    dialogTitle: string,
    dialogText: string,
  ) {
    if (this.dialogService) {
      const config: ODialogConfig = {
        icon: icon,
        okButtonText: btnText
      };
      this.dialogService.info(dialogTitle, dialogText, config);
    }
  }
}
