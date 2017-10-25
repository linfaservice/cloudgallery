import { Injectable } from '@angular/core';
import { Page } from "ui/page";
import { LoadingIndicator } from "nativescript-loading-indicator";
import * as platform from "platform";
import * as application from "application";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import * as dialogs from "ui/dialogs";
//var dialog = require("nativescript-dialog");

//declare var UIActivityIndicatorView;
//declare var UIActivityIndicatorViewStyle;
//declare var android;

@Injectable()
export default class Loader {

    loader:LoadingIndicator;
  
    constructor() { 
        this.loader = new LoadingIndicator();
    }

    public showLoader(msg) {
        
        this.loader.hide();

        // optional options
        // android and ios have some platform specific options
        var options = {
            message: msg,
            progress: 0.65, 
            
            android: {
                indeterminate: true,
                cancelable: false,
                max: 100,
                progressNumberFormat: "%1d/%2d",
                progressPercentFormat: 0.53,
                progressStyle: 1,
                secondaryProgress: 1
            },
            ios: {
                details: "",
                //margin: 10,
                //dimBackground: true,
                //color: "#4B9ED6", // color of indicator and labels
                // background box around indicator
                // hideBezel will override this if true
                //backgroundColor: "yellow",
                //userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
                //hideBezel: true, // default false, can hide the surrounding bezel
                //view: null, // Target view to show on top of (Defaults to entire window)
                //mode: MBProgressHUDMode.Determinate // see iOS specific options below
            }
            
        };

        this.loader.show(options); // options is optional  
    }    


    public hideLoader() {
        this.loader.hide();
    }    
}