import { Page } from "ui/page";
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Util } from "../../common/util";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import * as Toast from 'nativescript-toast';
import * as Platform from "platform";
import { TranslateService } from "ng2-translate";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';

 
 
@Component({
  selector: "loader",
  templateUrl: "components/loader/loader.html",
  styleUrls: ["components/loader/loader.css"],
  providers: [ModalDialogService]
})


export class LoaderComponent {

  private language;

  public constructor(
    private page: Page,
    private translate: TranslateService,
    private fonticon: TNSFontIconService,
    private util: Util,
    private modalService: ModalDialogService, 
    private vcRef: ViewContainerRef,    
  )  {

    this.language = Platform.device.language;
    this.translate.setDefaultLang("en");
    this.translate.use(Platform.device.language.split("-")[0]);
  }
 
  ngOnInit() {    
  }    

  ngAfterViewInit() {  

  }

  showLoader(msg) {
    let options = {
      context: {
      },
      fullscreen: false,
      viewContainerRef: this.vcRef
    };

    this.modalService.showModal(LoaderComponent, options)
    .then((result: any) => { 

    }); 
  }

  hideLoader() {
    /*
      this.params.closeCallback({
        "close": true
      }); 
    */
  }

  onTouchEffect(e) {
      if(e.type="tap" && e.action=="down") { 
          e.view.style.opacity = "0.5"; 
      } 
      if(e.type="tap" && e.action=="up") { 
          e.view.style.opacity = "1"; 
      }       
  }  
 
}
