"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var dialogs = require("ui/dialogs");
var nativescript_exit_1 = require("nativescript-exit");
var Util = /** @class */ (function () {
    function Util(router, route) {
        this.router = router;
        this.route = route;
        this.DEBUG = false;
        this.id = "UTIL_" + this.getTimestamp();
    }
    Util.prototype.getID = function () {
        return this.id;
    };
    Util.prototype.replaceAll = function (text, search, replacement) {
        return text.replace(new RegExp(search, 'g'), replacement);
    };
    Util.prototype.log = function (tag, obj) {
        if (this.DEBUG) {
            console.log(tag);
            try {
                console.log(JSON.stringify(obj, null, 10));
            }
            catch (ex) { }
        }
    };
    Util.prototype.sleep = function (time) {
        return new Promise(function (resolve) { return setTimeout(resolve, time); });
        /* Usage!
            util.sleep(500).then(() => {
                // Do something after the sleep!
            })
        */
    };
    Util.prototype.exit = function () {
        nativescript_exit_1.exit();
    };
    Util.prototype.navigate = function (to) {
        var path = [to];
        this.log("Navigate to", path);
        this.router.navigate(path, {
            transition: {
                name: "fadeIn",
                duration: 500,
                curve: "linear"
            }
        });
    };
    Util.prototype.navigatePage = function (to) {
        var path = ['root', { outlets: { rootoutlet: [to] } }];
        this.log("Navigate to", path);
        this.router.navigate(path, {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "linear"
            }
        });
    };
    Util.prototype.navigateSection = function (to) {
        var path = ['base', { outlets: { baseoutlet: [to] } }];
        this.log("Navigate to", path);
        this.router.navigate(path, {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "linear"
            }
        });
    };
    /* handle android back button */
    Util.prototype.navigateBack = function () {
        this.log("Navigate back", this.route.url);
        if (this.route.url != "/root/(rootoutlet:login)" &&
            this.route.url != "/base/(baseoutlet:home)") {
            this.router.back();
        }
        else {
            dialogs.confirm({
                title: "",
                message: "Sei sicuro di voler uscire dall'app?",
                okButtonText: "Esci",
                cancelButtonText: "Non ancora"
            }).then(function (confirm) {
                if (confirm)
                    nativescript_exit_1.exit();
            });
        }
    };
    Util.prototype.onTouchEffect = function (e) {
        if (e.type = "tap" && e.action == "down") {
            e.view.style.opacity = "0.5";
        }
        if (e.type = "tap" && e.action == "up") {
            e.view.style.opacity = "1";
        }
    };
    Util.prototype.getTimestamp = function () {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        var year_s = String("0000" + year).slice(-4);
        var month_s = String("00" + month).slice(-2);
        var day_s = String("00" + day).slice(-2);
        var hour_s = String("00" + hour).slice(-2);
        var minute_s = String("00" + minute).slice(-2);
        var second_s = String("00" + second).slice(-2);
        var timestamp = year_s + month_s + day_s + hour_s + minute_s + second_s;
        return timestamp;
    };
    Util.prototype.isValidEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    Util = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_2.RouterExtensions,
            router_1.Router])
    ], Util);
    return Util;
}());
exports.Util = Util;
