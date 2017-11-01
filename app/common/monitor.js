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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFFM0MsbUNBQTZCO0FBQzdCLDRDQUErQztBQUMvQywrQ0FBaUQ7QUFJakQ7SUFLSSxpQkFDWSxNQUFhLEVBQ2IsU0FBMkI7UUFEM0IsV0FBTSxHQUFOLE1BQU0sQ0FBTztRQUNiLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBRW5DLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFTywyQkFBUyxHQUFqQixVQUFrQixJQUFJO1FBQXRCLGlCQTBCQztRQXhCRyxJQUFJLENBQUM7WUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDckIsVUFBQyxPQUFPO2dCQUNKLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixVQUFVLENBQUMsY0FBTSxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BELENBQUMsRUFDRCxVQUFDLEtBQUs7Z0JBQ0YsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLFVBQVUsQ0FBQyxjQUFNLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNoQixFQUFFO1FBQ04sQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM3QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUM7WUFDeEYsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU0sZ0NBQWMsR0FBckIsVUFBc0IsSUFBSTtRQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUEzQ2dCLE9BQU87UUFEM0IsaUJBQVUsRUFBRTt5Q0FPVSxnQkFBTTtZQUNGLGdDQUFnQjtPQVB0QixPQUFPLENBNEMzQjtJQUFELGNBQUM7Q0FBQSxBQTVDRCxJQTRDQztrQkE1Q29CLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi91dGlsXCJcclxuaW1wb3J0IExvYWRlciBmcm9tIFwiLi9sb2FkZXJcIlxyXG5pbXBvcnQgaHR0cCA9IHJlcXVpcmUoXCJ0bnMtY29yZS1tb2R1bGVzL2h0dHBcIik7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwibmcyLXRyYW5zbGF0ZVwiO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9uaXRvciB7XHJcblxyXG4gICAgb25saW5lOmJvb2xlYW47XHJcbiAgICBwaW5nOmJvb2xlYW47IFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgbG9hZGVyOkxvYWRlcixcclxuICAgICAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMub25saW5lID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5waW5nID0gZmFsc2U7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIHByaXZhdGUgcGluZ0FsaXZlKHNpdGUpIHtcclxuICAgICAgICBcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBodHRwLmdldFN0cmluZyhzaXRlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ubGluZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+eyB0aGlzLnBpbmdBbGl2ZShzaXRlKTsgfSwgMzAwMCk7XHJcbiAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25saW5lID0gZmFsc2U7IFxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PnsgdGhpcy5waW5nQWxpdmUoc2l0ZSk7IH0sIDUwMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gY2F0Y2goZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLm9ubGluZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnBpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJDaGVja2luZyBmb3IgaW50ZXJuZXQgY29ubmVjdGlvbuKAplwiKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0UGluZ0FsaXZlKHNpdGUpIHsgICAgICBcclxuICAgICAgICB0aGlzLnBpbmdBbGl2ZShzaXRlKTtcclxuICAgIH0gICAgXHJcbn1cclxuIl19