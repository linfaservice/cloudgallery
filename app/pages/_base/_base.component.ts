import { Page } from "ui/page";
import { Component, ViewChild, OnInit } from "@angular/core";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui-pro/sidedrawer/angular";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { View } from 'ui/core/view';
import * as Utils from "utils/utils";
import * as Toast from 'nativescript-toast';
import { Util } from "../../common/util";

  
@Component({
  selector: "base",
  templateUrl: "pages/_base/_base.html",
  styleUrls: ["pages/_base/_base-common.css"],
  providers: [Util]
})

export class BaseComponent implements OnInit {

    router: RouterExtensions;
 
    @ViewChild(RadSideDrawerComponent) 
    public drawerComponent: RadSideDrawerComponent;
    public drawer: SideDrawerType;
    public pages:Array<Object>;
 
    public constructor (
            private page: Page, 
            private util: Util, 
            router: RouterExtensions, 
            route: Router) {

        this.util = new Util(router, route);

        this.pages = [
        ];    
    } 

    public ngOnInit() {
        this.page.actionBarHidden = false;
    }
	
    public ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
    }
 
    public onMenuTapped(args) {
        this.util.log("Function", "onMenuTapped");

		//...
		
        this.drawer.closeDrawer(); 
    }
	
	public toggleDrawer() {
        this.util.log("Function", "toggleDrawer");
		this.drawer.toggleDrawerState();
	} 
	
	public home() {
        this.util.navigateSection("home");
    }

}
