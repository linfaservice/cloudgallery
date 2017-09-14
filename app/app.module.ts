import { NgModule, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Page } from "ui/page";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptUISideDrawerModule } from "nativescript-telerik-ui-pro/sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-telerik-ui-pro/listview/angular";
import { NativeScriptUIChartModule } from "nativescript-telerik-ui-pro/chart/angular";
import { NativeScriptUICalendarModule } from "nativescript-telerik-ui-pro/calendar/angular";
import { DropDownModule } from "nativescript-drop-down/angular";
import { setCurrentOrientation , orientationCleanup } from "nativescript-screen-orientation"
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { MaskedTextFieldModule } from "nativescript-masked-text-field/angular";
import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { ImageModalComponent } from "./pages/gallery/image-modal.component";
import { routes, navigatableComponents } from "./app.routing";
import { Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from "ng2-translate";
import { Util } from "./common/util";
import Loader from "./common/loader";
import GalleryCache from "./common/gallery.cache";
import * as Settings from "application-settings";
import * as utf8 from "utf8";
import * as  Base64 from "base-64"; 

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, '/i18n', '.json');
}  

@NgModule({
  declarations: [
    AppModule,
    ImageModalComponent,
    ...navigatableComponents
  ],
  entryComponents: [
    ImageModalComponent
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes),
	  NativeScriptUISideDrawerModule ,
    NativeScriptUIListViewModule,
    NativeScriptUIChartModule,
    NativeScriptUICalendarModule,
    DropDownModule,
    MaskedTextFieldModule,
    TNSFontIconModule.forRoot({
		  'fa': './css/font-awesome.css',
		  /* 'ion': './css/ionicons.css' */
    }),
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
    })
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppModule],
  providers: [Loader, Util, GalleryCache]  
}) 


@Component({
  selector: "main-app",
  template: `<page-router-outlet></page-router-outlet>`
}) 
export class AppModule {
  public constructor(
    page:Page,
    private loader: Loader,
    private util: Util, 
  )  {
    /*
    setCurrentOrientation("portrait", function() {        
      //console.log("Set portrait orientation");    
    });  
    */      

    /*      
    page.on("navigatedTo",function() {
      setCurrentOrientation("portrait",function() {
        console.log("portrait orientation");
      });
    });
    page.on("navigatingFrom",function() {
      orientationCleanup();
    });
    */
  };  
  
  private isWellConfigured(host, username, password) {
    let configured = true;
    if(host==null || host=="") return false;
    if(username==null || username=="") return false;
    if(password==null || password=="") return false;

    //if(!okLogin()) configured = false;
    return configured;
  }

  public ngAfterViewInit() {

    let host = Settings.getString("host");
    let username = Settings.getString("username");
    let password = Settings.getString("password");

    this.util.log("Host", host);
    this.util.log("Username", username);
    this.util.log("Password", (password==null||password=="")? password:"*****");

    if(this.isWellConfigured(host, username, password)) this.util.navigate("");
    else this.util.navigate("settings");

	// into the contructor it seems to be triggered twice
    /*
    if (application.android) {
      application.android.on(
          AndroidApplication.activityBackPressedEvent, 
          (data: AndroidActivityBackPressedEventData) => {
              data.cancel = true; // prevents default back button behavior
              this.util.navigateBack();
          } 
      );       
    }   
    */
  }  
}
 