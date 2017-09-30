"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var loader_1 = require("./loader");
var http = require("tns-core-modules/http");
var Monitor = /** @class */ (function () {
    function Monitor(loader) {
        this.loader = loader;
        this.online = false;
        this.ping = false;
    }
    Monitor.prototype.pingAlive = function (site) {
        var _this = this;
        try {
            http.getString(site).then(function (success) {
                _this.online = true;
                setTimeout(function () { _this.pingAlive(site); }, 3000);
            }, function (error) {
                _this.online = false;
                setTimeout(function () { _this.pingAlive(site); }, 5000);
            });
        }
        catch (exception) {
            //
        }
        if (this.online) {
            this.ping = false;
            this.loader.hideLoader();
        }
        else {
            if (!this.ping) {
                this.ping = true;
                this.loader.showLoader("Checking for internet connection…");
            }
        }
    };
    Monitor.prototype.startPingAlive = function (site) {
        //setInterval(()=>this.pingAlive(site), 3000);       
        this.pingAlive(site);
    };
    Monitor = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [loader_1.default])
    ], Monitor);
    return Monitor;
}());
exports.default = Monitor;
