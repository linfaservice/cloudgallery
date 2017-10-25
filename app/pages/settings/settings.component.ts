import * as application from "application";
import { Page } from "ui/page";
import { Component, OnInit } from "@angular/core";
import { Util } from "../../common/util";
import * as Toast from 'nativescript-toast';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Settings from "application-settings";
import * as util from "utils/utils";
import * as Platform from "platform";
import { TranslateService } from "ng2-translate";
import * as Http from "tns-core-modules/http"
import * as  Base64 from "base-64";
import Loader from "../../common/loader";

  
@Component({
  selector: "settings",
  templateUrl: "pages/settings/settings.html",
  styleUrls: ["pages/settings/settings-common.css"],
  providers: [Util]
})


export class SettingsComponent {
 
    public isAndroid: boolean;
    public isIos: boolean;

    private language;

    private host;
    private username;
    private password;
    private rootdir;
    
    private loader = new Loader();
 
    public constructor(
      private page: Page,
	    private util: Util,
      private fonticon: TNSFontIconService,
      private translate: TranslateService
    )  {
      this.util.log("Page Init", "Settings");

      this.language = Platform.device.language;
      this.translate.setDefaultLang("en");
      this.translate.use(Platform.device.language.split("-")[0]);
    }

    private ngOnInit() {
      if (application.ios) {
        this.isAndroid = false;
        this.isIos = true;
      } else if (application.android) {
          this.isAndroid = true;
          this.isIos = false;
      }      
      this.page.actionBarHidden = true;
    }    
 
    private back() {
      this.util.navigateBack();
    }

    private isWellConfigured() {
      let configured = true;
      if(this.host==null || this.host=="") return false;
      if(this.username==null || this.username=="") return false;
      if(this.password==null || this.password=="") return false;
      if(!this.host.startsWith("https://")) {
        Toast.makeText(this.translate.instant("Nextcloud address must start with https://")).show();
        return false;
      }

      //if(!okLogin()) configured = false;
      return configured;
    }

    private save() {

      if(this.isWellConfigured()) {
        Settings.setString("host", this.util.replaceAll(this.host, " ", ""));
        Settings.setString("username", this.util.replaceAll(this.username, " ", ""));
        Settings.setString("password", this.util.replaceAll(this.password, " ", ""));
        Settings.setString("rootdir", (this.rootdir==null)?"":this.rootdir.trim()); 
        
        this.tryConnection(this.host, this.username, this.password, ()=> {
          this.loader.hideLoader();
          this.util.navigate(""); 
        });

      } else {
        Toast.makeText(this.translate.instant("Error connecting. Please check parameters")).show();
      }
    } 

    private link() {
      this.util.log("Open link for language: ", this.translate.currentLang);
      let link = "https://www.operweb.com/nextcloud-gallery-en/";
      if(this.translate.currentLang=="it") link = "https://www.operweb.com/nextcloud-gallery/";
      util.openUrl(link);
      this.util.log("Link", link);
    }


    private tryConnection(host, username, password, callOk) {

      this.loader.showLoader(this.translate.instant("Checking connection…"));

      let url = host+"/index.php/apps/gallery/api/files/list?location=&mediatypes=image/jpeg;&features=&etag";
      let headers = { 
        "OCS-APIREQUEST": "true",
        "Authorization": "Basic "+Base64.encode(username+':'+password)
      } 

      Http.request({
        url: url,
        method: "GET",
        headers: headers
      }).then((response:any)=> {

        let data = null;

        try {   
          data = response.content.toJSON();
        } catch(e) {
          Toast.makeText(this.translate.instant("Error connecting. Please check parameters")).show();
          this.util.log("Error", e);
          this.loader.hideLoader();
          return;              
        }
        
        if(data==null) {
          Toast.makeText(this.translate.instant("Error connecting. Please check parameters")).show();
          this.util.log("Error Data null", null);
          this.loader.hideLoader();
          return;   
        }

        console.log(data);
        let albums = data.albums;  
        // error loading
        if(albums==null) {
          Toast.makeText(this.translate.instant("Error connecting. Please check parameters")).show();
          this.loader.hideLoader();
          return;
        }        
        
        callOk();

      }, (e)=> {
        Toast.makeText(this.translate.instant("Error connecting. Please check parameters")).show();
        this.util.log("Error", e);
        this.loader.hideLoader();
        return;
      });       
    }
}
