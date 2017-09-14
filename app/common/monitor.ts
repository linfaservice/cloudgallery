import { Injectable } from '@angular/core';
import { Util } from "./util"
import Loader from "./loader"
import http = require("tns-core-modules/http");


@Injectable()
export default class Monitor {

    online:boolean;
    ping:boolean; 

    constructor(private loader:Loader) {
        this.online = false;
        this.ping = false;
    }    

    private pingAlive(site) {
        
        try {
            http.getString(site).then(
                (success) => {
                    this.online = true;
                    setTimeout(()=>{ this.pingAlive(site); }, 3000);
                }, 
                (error) => {
                    this.online = false; 
                    setTimeout(()=>{ this.pingAlive(site); }, 5000);
                }
            );
        } catch(exception) {
            //
        }

        if(this.online) {
            this.ping = false;
            this.loader.hideLoader();
        } else {
            if(!this.ping) {
                this.ping = true;
                this.loader.showLoader("Checking for internet connection...");
            }
        }
    }

    public startPingAlive(site) {
        //setInterval(()=>this.pingAlive(site), 3000);       
        this.pingAlive(site);
    }    
}