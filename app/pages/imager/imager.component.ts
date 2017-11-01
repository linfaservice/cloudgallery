import { Page } from "ui/page";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { Util } from "../../common/util";
import Loader from "../../common/loader";
import * as Toast from 'nativescript-toast';
import * as Http from "tns-core-modules/http";
import * as SocialShare from 'nativescript-social-share';
import { ImageSource } from "image-source";
import * as Platform from "platform";
import { TranslateService } from "ng2-translate";
import * as Settings from "application-settings";
import * as  Base64 from "base-64";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { GalleryItem } from "../../common/gallery.item";
import GalleryCache from "../../common/gallery.cache";

import {registerElement} from "nativescript-angular/element-registry";
registerElement("Slide", () => require("nativescript-slides").Slide);
registerElement("SlideContainer", () => require("nativescript-slides").SlideContainer);
  
@Component({
  selector: "imager",
  templateUrl: "pages/imager/imager.html",
  styleUrls: ["pages/imager/imager.css"],
  providers: []
})


export class ImagerComponent {

  private language;
  private host;
  private username;
  private password;
  private rootdir;
  private headers;  

  public images: Array<any> = [];

  @ViewChild("slideContainer") slideContainerView: ElementRef;
  
  public constructor(
    private page: Page,
    private translate: TranslateService,
    private fonticon: TNSFontIconService,
    private util: Util,
    private cache: GalleryCache,
    private loader: Loader
  )  { 

    this.language = Platform.device.language;
    this.translate.setDefaultLang("en");
    this.translate.use(Platform.device.language.split("-")[0]);
 
    this.host = Settings.getString("host");
    this.username = Settings.getString("username");
    this.password = Settings.getString("password");
    this.rootdir = Settings.getString("rootdir");  
    this.rootdir = (this.rootdir==null)? "":this.rootdir;
    this.headers = { 
      "OCS-APIREQUEST": "true",
      "Authorization": "Basic "+Base64.encode(this.username+':'+this.password)
    } 
   
  }
 
  ngOnInit() {    
    this.page.actionBarHidden = false;       
    this.buildSlider();

    if (application.android) {
      application.android.on(
          AndroidApplication.activityBackPressedEvent, 
          (data: AndroidActivityBackPressedEventData) => {
              data.cancel = true; // prevents default back button behavior
              this.back();
          } 
      );       
    }

    // search position of selected image
    let k = 0;
    let currentImageIndex = 0;
    let currentImageUrl = this.cache.currentImage.url;
    for(let i in this.cache.currentAlbum.items) {
      let img = this.cache.currentAlbum.items[i];
      if(img.url==currentImageUrl) {
        currentImageIndex = k;
        break;
      }
      k++;
    }
 
    setTimeout(()=>{ 
      let slideContainer = this.slideContainerView.nativeElement;
      slideContainer.constructView();    
      slideContainer.goToSlide(currentImageIndex);
    }, 10);     
  }    

  back() { 
    this.util.navigateBack();
  }

  
  buildSlider() {
    for(let i in this.cache.currentAlbum.items) {
      let image = this.cache.currentAlbum.items[i];
      this.images.push(image);
    }       
  }
   
  

  ngAfterViewInit() {       
    this.loader.hideLoader();

    // load high resolution image in background
    //console.log("Image Loading: " + this.item.url + "/500/500");

    /*
    if(!this.item.loaded) {
      Http.request({
          url: this.item.url + "/500/500",
          method: "GET",
          headers: this.headers
      }).then((response:any)=> {

          response.content.toImage()
            .then((image)=> {
              let base64 = image.toBase64String("jpg");
              let highsrc = base64;
              this.item.src = highsrc;
              this.item.loaded = true;

              this.images[0].src = highsrc;
            })
            .catch((error)=> {
              //util.log("error", error);
            });  

      }, (e)=> {
          //Toast.makeText("Si è verificato un problema durante il caricamento dell'immagine ad alta risoluzione").show();
      });       
    }
    */
  }

  onTap(item) { 
    let image = new ImageSource();
    image.loadFromBase64(item.src);
    SocialShare.shareImage(image, this.translate.instant("Share") + " " + item.title);  
  } 

  onSwipe(event, item) {
    this.util.log("onSlide", event);
  }
 
}
