import { Page } from "ui/page";
import { Component, ViewChild, OnInit } from "@angular/core";
import * as Utils from "utils/utils";
import * as Toast from 'nativescript-toast';
import { Util } from "../../common/util";

  
@Component({
  selector: "root",
  templateUrl: "pages/_root/_root.html",
  styleUrls: ["pages/_root/_root-common.css"],
  providers: [Util]
})

export class RootComponent implements OnInit {
 
    public constructor (
            private page: Page, 
            private util: Util
        ) {

    } 

    public ngOnInit() {
        this.page.actionBarHidden = false;
    }

}
