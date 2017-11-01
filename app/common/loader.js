"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
var Loader = /** @class */ (function () {
    function Loader() {
        this.loader = new nativescript_loading_indicator_1.LoadingIndicator();
    }
    Loader.prototype.showLoader = function (msg) {
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
            }
        };
        this.loader.show(options); // options is optional  
    };
    Loader.prototype.hideLoader = function () {
        this.loader.hide();
    };
    Loader = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], Loader);
    return Loader;
}());
exports.default = Loader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRTNDLGlGQUFrRTtBQU9sRTtJQUlJO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGlEQUFnQixFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVNLDJCQUFVLEdBQWpCLFVBQWtCLEdBQUc7UUFFakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVuQixtQkFBbUI7UUFDbkIsc0RBQXNEO1FBQ3RELElBQUksT0FBTyxHQUFHO1lBQ1YsT0FBTyxFQUFFLEdBQUc7WUFDWixRQUFRLEVBQUUsSUFBSTtZQUVkLE9BQU8sRUFBRTtnQkFDTCxhQUFhLEVBQUUsSUFBSTtnQkFDbkIsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLG9CQUFvQixFQUFFLFNBQVM7Z0JBQy9CLHFCQUFxQixFQUFFLElBQUk7Z0JBQzNCLGFBQWEsRUFBRSxDQUFDO2dCQUNoQixpQkFBaUIsRUFBRSxDQUFDO2FBQ3ZCO1lBQ0QsR0FBRyxFQUFFO2dCQUNELE9BQU8sRUFBRSxFQUFFO2FBV2Q7U0FFSixDQUFDO1FBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyx3QkFBd0I7SUFDdkQsQ0FBQztJQUdNLDJCQUFVLEdBQWpCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBakRnQixNQUFNO1FBRDFCLGlCQUFVLEVBQUU7O09BQ1EsTUFBTSxDQWtEMUI7SUFBRCxhQUFDO0NBQUEsQUFsREQsSUFrREM7a0JBbERvQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IHsgTG9hZGluZ0luZGljYXRvciB9IGZyb20gXCJuYXRpdmVzY3JpcHQtbG9hZGluZy1pbmRpY2F0b3JcIjtcclxuaW1wb3J0ICogYXMgcGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBBY3Rpdml0eUluZGljYXRvciB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2FjdGl2aXR5LWluZGljYXRvclwiO1xyXG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRlciB7XHJcblxyXG4gICAgbG9hZGVyOkxvYWRpbmdJbmRpY2F0b3I7XHJcbiAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgTG9hZGluZ0luZGljYXRvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93TG9hZGVyKG1zZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubG9hZGVyLmhpZGUoKTtcclxuXHJcbiAgICAgICAgLy8gb3B0aW9uYWwgb3B0aW9uc1xyXG4gICAgICAgIC8vIGFuZHJvaWQgYW5kIGlvcyBoYXZlIHNvbWUgcGxhdGZvcm0gc3BlY2lmaWMgb3B0aW9uc1xyXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBtc2csXHJcbiAgICAgICAgICAgIHByb2dyZXNzOiAwLjY1LCBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGFuZHJvaWQ6IHtcclxuICAgICAgICAgICAgICAgIGluZGV0ZXJtaW5hdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1heDogMTAwLFxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NOdW1iZXJGb3JtYXQ6IFwiJTFkLyUyZFwiLFxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NQZXJjZW50Rm9ybWF0OiAwLjUzLFxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NTdHlsZTogMSxcclxuICAgICAgICAgICAgICAgIHNlY29uZGFyeVByb2dyZXNzOiAxXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGlvczoge1xyXG4gICAgICAgICAgICAgICAgZGV0YWlsczogXCJcIixcclxuICAgICAgICAgICAgICAgIC8vbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgICAgIC8vZGltQmFja2dyb3VuZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIC8vY29sb3I6IFwiIzRCOUVENlwiLCAvLyBjb2xvciBvZiBpbmRpY2F0b3IgYW5kIGxhYmVsc1xyXG4gICAgICAgICAgICAgICAgLy8gYmFja2dyb3VuZCBib3ggYXJvdW5kIGluZGljYXRvclxyXG4gICAgICAgICAgICAgICAgLy8gaGlkZUJlemVsIHdpbGwgb3ZlcnJpZGUgdGhpcyBpZiB0cnVlXHJcbiAgICAgICAgICAgICAgICAvL2JhY2tncm91bmRDb2xvcjogXCJ5ZWxsb3dcIixcclxuICAgICAgICAgICAgICAgIC8vdXNlckludGVyYWN0aW9uRW5hYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQgdHJ1ZS4gU2V0IGZhbHNlIHNvIHRoYXQgdGhlIHRvdWNoZXMgd2lsbCBmYWxsIHRocm91Z2ggaXQuXHJcbiAgICAgICAgICAgICAgICAvL2hpZGVCZXplbDogdHJ1ZSwgLy8gZGVmYXVsdCBmYWxzZSwgY2FuIGhpZGUgdGhlIHN1cnJvdW5kaW5nIGJlemVsXHJcbiAgICAgICAgICAgICAgICAvL3ZpZXc6IG51bGwsIC8vIFRhcmdldCB2aWV3IHRvIHNob3cgb24gdG9wIG9mIChEZWZhdWx0cyB0byBlbnRpcmUgd2luZG93KVxyXG4gICAgICAgICAgICAgICAgLy9tb2RlOiBNQlByb2dyZXNzSFVETW9kZS5EZXRlcm1pbmF0ZSAvLyBzZWUgaU9TIHNwZWNpZmljIG9wdGlvbnMgYmVsb3dcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRlci5zaG93KG9wdGlvbnMpOyAvLyBvcHRpb25zIGlzIG9wdGlvbmFsICBcclxuICAgIH0gICAgXHJcblxyXG5cclxuICAgIHB1YmxpYyBoaWRlTG9hZGVyKCkge1xyXG4gICAgICAgIHRoaXMubG9hZGVyLmhpZGUoKTtcclxuICAgIH0gICAgXHJcbn0iXX0=