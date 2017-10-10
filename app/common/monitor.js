"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var loader_1 = require("./loader");
var http = require("tns-core-modules/http");
var ng2_translate_1 = require("ng2-translate");
var Monitor = /** @class */ (function () {
    function Monitor(loader, translate) {
        this.loader = loader;
        this.translate = translate;
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
                this.loader.showLoader(this.translate.instant("Checking for internet connection…"));
            }
        }
    };
    Monitor.prototype.startPingAlive = function (site) {
        //setInterval(()=>this.pingAlive(site), 3000);       
        this.pingAlive(site);
    };
    Monitor = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [loader_1.default,
            ng2_translate_1.TranslateService])
    ], Monitor);
    return Monitor;
}());
exports.default = Monitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFFM0MsbUNBQTZCO0FBQzdCLDRDQUErQztBQUMvQywrQ0FBaUQ7QUFJakQ7SUFLSSxpQkFDWSxNQUFhLEVBQ2IsU0FBMkI7UUFEM0IsV0FBTSxHQUFOLE1BQU0sQ0FBTztRQUNiLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBRW5DLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFTywyQkFBUyxHQUFqQixVQUFrQixJQUFJO1FBQXRCLGlCQTBCQztRQXhCRyxJQUFJLENBQUM7WUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDckIsVUFBQyxPQUFPO2dCQUNKLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixVQUFVLENBQUMsY0FBTSxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BELENBQUMsRUFDRCxVQUFDLEtBQUs7Z0JBQ0YsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLFVBQVUsQ0FBQyxjQUFNLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNoQixFQUFFO1FBQ04sQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM3QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUM7WUFDeEYsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU0sZ0NBQWMsR0FBckIsVUFBc0IsSUFBSTtRQUN0QixxREFBcUQ7UUFDckQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBNUNnQixPQUFPO1FBRDNCLGlCQUFVLEVBQUU7eUNBT1UsZ0JBQU07WUFDRixnQ0FBZ0I7T0FQdEIsT0FBTyxDQTZDM0I7SUFBRCxjQUFDO0NBQUEsQUE3Q0QsSUE2Q0M7a0JBN0NvQixPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4vdXRpbFwiXHJcbmltcG9ydCBMb2FkZXIgZnJvbSBcIi4vbG9hZGVyXCJcclxuaW1wb3J0IGh0dHAgPSByZXF1aXJlKFwidG5zLWNvcmUtbW9kdWxlcy9odHRwXCIpO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vbml0b3Ige1xyXG5cclxuICAgIG9ubGluZTpib29sZWFuO1xyXG4gICAgcGluZzpib29sZWFuOyBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGxvYWRlcjpMb2FkZXIsXHJcbiAgICAgICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLm9ubGluZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucGluZyA9IGZhbHNlO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICBwcml2YXRlIHBpbmdBbGl2ZShzaXRlKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaHR0cC5nZXRTdHJpbmcoc2l0ZSkudGhlbihcclxuICAgICAgICAgICAgICAgIChzdWNjZXNzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmxpbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PnsgdGhpcy5waW5nQWxpdmUoc2l0ZSk7IH0sIDMwMDApO1xyXG4gICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ubGluZSA9IGZhbHNlOyBcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57IHRoaXMucGluZ0FsaXZlKHNpdGUpOyB9LCA1MDAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGNhdGNoKGV4Y2VwdGlvbikge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5vbmxpbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5waW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZighdGhpcy5waW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiQ2hlY2tpbmcgZm9yIGludGVybmV0IGNvbm5lY3Rpb27igKZcIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydFBpbmdBbGl2ZShzaXRlKSB7XHJcbiAgICAgICAgLy9zZXRJbnRlcnZhbCgoKT0+dGhpcy5waW5nQWxpdmUoc2l0ZSksIDMwMDApOyAgICAgICBcclxuICAgICAgICB0aGlzLnBpbmdBbGl2ZShzaXRlKTtcclxuICAgIH0gICAgXHJcbn1cclxuIl19