import * as application from "application";
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "ui/dialogs";
import { exit } from 'nativescript-exit';
import * as Settings from "application-settings";


@Injectable()
export class Util {

    public DEBUG = true;
    public LOGTOSETTINGS = true;
    private id;

    constructor(
        private router:RouterExtensions, 
        private route: Router
    ) {
        this.id = "UTIL_" + this.getTimestamp();   
        this.loggerReset();     
    }

    public getID() {
        return this.id;
    }

    public replaceAll(text, search, replacement) {
        return text.replace(new RegExp(search, 'g'), replacement);
    } 

    public loggerReset() {
        var LOGAGE = Settings.getNumber("_LOGAGE");
        if(LOGAGE==null) LOGAGE = 0;
        if(LOGAGE>=1) {
            LOGAGE = 0;
            Settings.setString("_LOG", "");
        }
        Settings.setNumber("_LOGAGE", LOGAGE+1);
    }

    public loggerAppend(newLog) {
        var log = Settings.getString("_LOG");
        Settings.setString("_LOG", log + newLog);
    }

    public log(tag, obj) {
        if(this.DEBUG) {
            try {
                if(this.LOGTOSETTINGS) {
                    this.loggerAppend(tag + "\n");
                    this.loggerAppend(JSON.stringify(obj, null, 10) + "\n");
                }
                console.log(tag);
                console.log(JSON.stringify(obj, null, 10));
            } catch(ex) {}
        }
    }

    public sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));

        /* Usage!
            util.sleep(500).then(() => {
                // Do something after the sleep!
            })
        */
    }

    public exit() {
        exit();
    }

    public navigate(to) {
        let path = [to];
        this.log("Navigate to", path);
        this.router.navigate(path,
            {
                transition: {
                    name: "fadeIn",
                    duration: 500,
                    curve: "linear"
                }
            }
        );          
    }
    
    public navigatePage(to) {
        let path = ['root', { outlets: { rootoutlet: [to] } } ];
        this.log("Navigate to", path);
        this.router.navigate(path,
            {
                transition: {
                    name: "slideLeft",
                    duration: 500,
                    curve: "linear"
                }
            }
        );          
    }

    public navigateSection(to) { 
        let path = ['base', { outlets: { baseoutlet: [to] } } ];
        this.log("Navigate to", path);
        this.router.navigate(path,
            {
                transition: {
                    name: "slideLeft",
                    duration: 500,
                    curve: "linear"
                }
            }
        );          
    }

    /* handle android back button */
    public navigateBack() {
        this.log("Navigate back", this.route.url);
        if(this.route.url!="/root/(rootoutlet:login)" &&
            this.route.url!="/base/(baseoutlet:home)") {
                this.router.back();
        } else {
            dialogs.confirm({
                title: "",
                message: "Sei sicuro di voler uscire dall'app?",
                okButtonText: "Esci",
                cancelButtonText: "Non ancora"
            }).then(confirm => {
                if(confirm) exit();
            });            
        }
    }

    public onTouchEffect(e) {
        if(e.type="tap" && e.action=="down") { 
            e.view.style.opacity = "0.5"; 
        } 
        if(e.type="tap" && e.action=="up") { 
            e.view.style.opacity = "1"; 
        }       
    }

    public getTimestamp() {
        var now     = new Date(); 
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 

        let year_s = String("0000" + year).slice(-4);
        let month_s = String("00" + month).slice(-2);
        let day_s = String("00" + day).slice(-2);
        let hour_s = String("00" + hour).slice(-2);
        let minute_s = String("00" + minute).slice(-2);
        let second_s = String("00" + second).slice(-2);

        var timestamp = year_s + month_s + day_s + hour_s + minute_s + second_s;   
        return timestamp;
    }         

    isValidEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }    

}