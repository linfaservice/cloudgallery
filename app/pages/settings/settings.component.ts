import { Page } from "ui/page";
import { Component, OnInit } from "@angular/core";
import { Util } from "../../common/util";
import * as Toast from 'nativescript-toast';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Settings from "application-settings";
import * as util from "utils/utils";
import * as Platform from "platform";
import { TranslateService } from "ng2-translate";


  
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
        this.util.navigate("");
      } else {
        Toast.makeText(this.translate.instant("Error connecting. Please check parameters")).show();
      }
    } 

    private link() {
      util.openUrl("https://www.operweb.com/nextcloud-gallery/");
    }

}
