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
                this.loader.showLoader("Checking for internet connection...");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFFM0MsbUNBQTZCO0FBQzdCLDRDQUErQztBQUkvQztJQUtJLGlCQUFvQixNQUFhO1FBQWIsV0FBTSxHQUFOLE1BQU0sQ0FBTztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRU8sMkJBQVMsR0FBakIsVUFBa0IsSUFBSTtRQUF0QixpQkEwQkM7UUF4QkcsSUFBSSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQ3JCLFVBQUMsT0FBTztnQkFDSixLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbkIsVUFBVSxDQUFDLGNBQU0sS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRCxDQUFDLEVBQ0QsVUFBQyxLQUFLO2dCQUNGLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNwQixVQUFVLENBQUMsY0FBTSxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FDSixDQUFDO1FBQ04sQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsRUFBRTtRQUNOLENBQUM7UUFFRCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMscUNBQXFDLENBQUMsQ0FBQztZQUNsRSxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFTSxnQ0FBYyxHQUFyQixVQUFzQixJQUFJO1FBQ3RCLHFEQUFxRDtRQUNyRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUF6Q2dCLE9BQU87UUFEM0IsaUJBQVUsRUFBRTt5Q0FNa0IsZ0JBQU07T0FMaEIsT0FBTyxDQTBDM0I7SUFBRCxjQUFDO0NBQUEsQUExQ0QsSUEwQ0M7a0JBMUNvQixPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4vdXRpbFwiXHJcbmltcG9ydCBMb2FkZXIgZnJvbSBcIi4vbG9hZGVyXCJcclxuaW1wb3J0IGh0dHAgPSByZXF1aXJlKFwidG5zLWNvcmUtbW9kdWxlcy9odHRwXCIpO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9uaXRvciB7XHJcblxyXG4gICAgb25saW5lOmJvb2xlYW47XHJcbiAgICBwaW5nOmJvb2xlYW47IFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9hZGVyOkxvYWRlcikge1xyXG4gICAgICAgIHRoaXMub25saW5lID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5waW5nID0gZmFsc2U7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIHByaXZhdGUgcGluZ0FsaXZlKHNpdGUpIHtcclxuICAgICAgICBcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBodHRwLmdldFN0cmluZyhzaXRlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ubGluZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+eyB0aGlzLnBpbmdBbGl2ZShzaXRlKTsgfSwgMzAwMCk7XHJcbiAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25saW5lID0gZmFsc2U7IFxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PnsgdGhpcy5waW5nQWxpdmUoc2l0ZSk7IH0sIDUwMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gY2F0Y2goZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLm9ubGluZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnBpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKFwiQ2hlY2tpbmcgZm9yIGludGVybmV0IGNvbm5lY3Rpb24uLi5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0UGluZ0FsaXZlKHNpdGUpIHtcclxuICAgICAgICAvL3NldEludGVydmFsKCgpPT50aGlzLnBpbmdBbGl2ZShzaXRlKSwgMzAwMCk7ICAgICAgIFxyXG4gICAgICAgIHRoaXMucGluZ0FsaXZlKHNpdGUpO1xyXG4gICAgfSAgICBcclxufSJdfQ==