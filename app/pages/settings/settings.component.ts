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
import * as email from "nativescript-email";


  
@Component({
  selector: "settings",
  templateUrl: "pages/settings/settings.html",
  styleUrls: ["pages/settings/settings-common.css"],
  providers: [Util]
})


export class SettingsComponent {
 
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
      if(!this.host.startsWith("http://") && !this.host.startsWith("https://")) {
        Toast.makeText(this.translate.instant("Nextcloud address must start with https:// or http://")).show();
        return false;
      }
      if(this.host.startsWith("http://")) {
        Toast.makeText(this.translate.instant("Connection is not secure. Please configure your server on https")).show();
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
      /*
      this.util.log("Open link for language: ", this.translate.currentLang);
      let link = "https://www.operweb.com/nextcloud-gallery-en/";
      if(this.translate.currentLang=="it") link = "https://www.operweb.com/nextcloud-gallery/";
      util.openUrl(link);
      */
      email.compose({
        subject: this.translate.instant("Request for Cloud Gallery unlimited"),
        body: this.translate.instant("Hello, I'm interested to obtain unlimited space for Cloud Gallery. Thanks"),
        to: ['helpdesk@linfaservice.it']
      }).then(
        function() {
          this.util.log("Email compose for Cloud Gallery unlimited request", "Email composer closed");
        }, function(err) {
          this.util.log("Email compose error", err);
      });      
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
