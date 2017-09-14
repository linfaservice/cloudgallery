import { Injectable } from '@angular/core';
import { LoadingIndicator } from "nativescript-loading-indicator";


@Injectable()
export default class Loader {

    loader:LoadingIndicator;

    constructor() {
        this.loader = new LoadingIndicator();
    }

    public showLoader(msg) {
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
            }, /*
            ios: {
                details: "Additional detail note!",
                margin: 10,
                dimBackground: true,
                color: "#4B9ED6", // color of indicator and labels
                // background box around indicator
                // hideBezel will override this if true
                backgroundColor: "yellow",
                hideBezel: true, // default false, can hide the surrounding bezel
                view: UIView, // Target view to show on top of (Defaults to entire window)
                mode: // see iOS specific options below
            } */
        };

        this.loader.show(options); // options is optional        
    }

    public hideLoader() {
        this.loader.hide();
    }    
}