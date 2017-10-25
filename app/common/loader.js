"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
//var dialog = require("nativescript-dialog");
//declare var UIActivityIndicatorView;
//declare var UIActivityIndicatorViewStyle;
//declare var android;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRTNDLGlGQUFrRTtBQUtsRSw4Q0FBOEM7QUFFOUMsc0NBQXNDO0FBQ3RDLDJDQUEyQztBQUMzQyxzQkFBc0I7QUFHdEI7SUFJSTtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxpREFBZ0IsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFTSwyQkFBVSxHQUFqQixVQUFrQixHQUFHO1FBRWpCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbkIsbUJBQW1CO1FBQ25CLHNEQUFzRDtRQUN0RCxJQUFJLE9BQU8sR0FBRztZQUNWLE9BQU8sRUFBRSxHQUFHO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFFZCxPQUFPLEVBQUU7Z0JBQ0wsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixHQUFHLEVBQUUsR0FBRztnQkFDUixvQkFBb0IsRUFBRSxTQUFTO2dCQUMvQixxQkFBcUIsRUFBRSxJQUFJO2dCQUMzQixhQUFhLEVBQUUsQ0FBQztnQkFDaEIsaUJBQWlCLEVBQUUsQ0FBQzthQUN2QjtZQUNELEdBQUcsRUFBRTtnQkFDRCxPQUFPLEVBQUUsRUFBRTthQVdkO1NBRUosQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsd0JBQXdCO0lBQ3ZELENBQUM7SUFHTSwyQkFBVSxHQUFqQjtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQWpEZ0IsTUFBTTtRQUQxQixpQkFBVSxFQUFFOztPQUNRLE1BQU0sQ0FrRDFCO0lBQUQsYUFBQztDQUFBLEFBbERELElBa0RDO2tCQWxEb0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IExvYWRpbmdJbmRpY2F0b3IgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWxvYWRpbmctaW5kaWNhdG9yXCI7XHJcbmltcG9ydCAqIGFzIHBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xyXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgQWN0aXZpdHlJbmRpY2F0b3IgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9hY3Rpdml0eS1pbmRpY2F0b3JcIjtcclxuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiO1xyXG4vL3ZhciBkaWFsb2cgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWRpYWxvZ1wiKTtcclxuXHJcbi8vZGVjbGFyZSB2YXIgVUlBY3Rpdml0eUluZGljYXRvclZpZXc7XHJcbi8vZGVjbGFyZSB2YXIgVUlBY3Rpdml0eUluZGljYXRvclZpZXdTdHlsZTtcclxuLy9kZWNsYXJlIHZhciBhbmRyb2lkO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkZXIge1xyXG5cclxuICAgIGxvYWRlcjpMb2FkaW5nSW5kaWNhdG9yO1xyXG4gIFxyXG4gICAgY29uc3RydWN0b3IoKSB7IFxyXG4gICAgICAgIHRoaXMubG9hZGVyID0gbmV3IExvYWRpbmdJbmRpY2F0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd0xvYWRlcihtc2cpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxvYWRlci5oaWRlKCk7XHJcblxyXG4gICAgICAgIC8vIG9wdGlvbmFsIG9wdGlvbnNcclxuICAgICAgICAvLyBhbmRyb2lkIGFuZCBpb3MgaGF2ZSBzb21lIHBsYXRmb3JtIHNwZWNpZmljIG9wdGlvbnNcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbWVzc2FnZTogbXNnLFxyXG4gICAgICAgICAgICBwcm9ncmVzczogMC42NSwgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBhbmRyb2lkOiB7XHJcbiAgICAgICAgICAgICAgICBpbmRldGVybWluYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzTnVtYmVyRm9ybWF0OiBcIiUxZC8lMmRcIixcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzUGVyY2VudEZvcm1hdDogMC41MyxcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzU3R5bGU6IDEsXHJcbiAgICAgICAgICAgICAgICBzZWNvbmRhcnlQcm9ncmVzczogMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpb3M6IHtcclxuICAgICAgICAgICAgICAgIGRldGFpbHM6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAvL21hcmdpbjogMTAsXHJcbiAgICAgICAgICAgICAgICAvL2RpbUJhY2tncm91bmQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAvL2NvbG9yOiBcIiM0QjlFRDZcIiwgLy8gY29sb3Igb2YgaW5kaWNhdG9yIGFuZCBsYWJlbHNcclxuICAgICAgICAgICAgICAgIC8vIGJhY2tncm91bmQgYm94IGFyb3VuZCBpbmRpY2F0b3JcclxuICAgICAgICAgICAgICAgIC8vIGhpZGVCZXplbCB3aWxsIG92ZXJyaWRlIHRoaXMgaWYgdHJ1ZVxyXG4gICAgICAgICAgICAgICAgLy9iYWNrZ3JvdW5kQ29sb3I6IFwieWVsbG93XCIsXHJcbiAgICAgICAgICAgICAgICAvL3VzZXJJbnRlcmFjdGlvbkVuYWJsZWQ6IGZhbHNlLCAvLyBkZWZhdWx0IHRydWUuIFNldCBmYWxzZSBzbyB0aGF0IHRoZSB0b3VjaGVzIHdpbGwgZmFsbCB0aHJvdWdoIGl0LlxyXG4gICAgICAgICAgICAgICAgLy9oaWRlQmV6ZWw6IHRydWUsIC8vIGRlZmF1bHQgZmFsc2UsIGNhbiBoaWRlIHRoZSBzdXJyb3VuZGluZyBiZXplbFxyXG4gICAgICAgICAgICAgICAgLy92aWV3OiBudWxsLCAvLyBUYXJnZXQgdmlldyB0byBzaG93IG9uIHRvcCBvZiAoRGVmYXVsdHMgdG8gZW50aXJlIHdpbmRvdylcclxuICAgICAgICAgICAgICAgIC8vbW9kZTogTUJQcm9ncmVzc0hVRE1vZGUuRGV0ZXJtaW5hdGUgLy8gc2VlIGlPUyBzcGVjaWZpYyBvcHRpb25zIGJlbG93XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkZXIuc2hvdyhvcHRpb25zKTsgLy8gb3B0aW9ucyBpcyBvcHRpb25hbCAgXHJcbiAgICB9ICAgIFxyXG5cclxuXHJcbiAgICBwdWJsaWMgaGlkZUxvYWRlcigpIHtcclxuICAgICAgICB0aGlzLmxvYWRlci5oaWRlKCk7XHJcbiAgICB9ICAgIFxyXG59Il19