"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
var Loader = /** @class */ (function () {
    function Loader() {
        this.loader = new nativescript_loading_indicator_1.LoadingIndicator();
    }
    Loader.prototype.showLoader = function (msg) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLGlGQUFrRTtBQUlsRTtJQUlJO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGlEQUFnQixFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVNLDJCQUFVLEdBQWpCLFVBQWtCLEdBQUc7UUFDakIsbUJBQW1CO1FBQ25CLHNEQUFzRDtRQUN0RCxJQUFJLE9BQU8sR0FBRztZQUNWLE9BQU8sRUFBRSxHQUFHO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUU7Z0JBQ0wsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixHQUFHLEVBQUUsR0FBRztnQkFDUixvQkFBb0IsRUFBRSxTQUFTO2dCQUMvQixxQkFBcUIsRUFBRSxJQUFJO2dCQUMzQixhQUFhLEVBQUUsQ0FBQztnQkFDaEIsaUJBQWlCLEVBQUUsQ0FBQzthQUN2QjtTQWFKLENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLDhCQUE4QjtJQUM3RCxDQUFDO0lBRU0sMkJBQVUsR0FBakI7UUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUExQ2dCLE1BQU07UUFEMUIsaUJBQVUsRUFBRTs7T0FDUSxNQUFNLENBMkMxQjtJQUFELGFBQUM7Q0FBQSxBQTNDRCxJQTJDQztrQkEzQ29CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExvYWRpbmdJbmRpY2F0b3IgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWxvYWRpbmctaW5kaWNhdG9yXCI7XHJcblxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkZXIge1xyXG5cclxuICAgIGxvYWRlcjpMb2FkaW5nSW5kaWNhdG9yO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubG9hZGVyID0gbmV3IExvYWRpbmdJbmRpY2F0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd0xvYWRlcihtc2cpIHtcclxuICAgICAgICAvLyBvcHRpb25hbCBvcHRpb25zXHJcbiAgICAgICAgLy8gYW5kcm9pZCBhbmQgaW9zIGhhdmUgc29tZSBwbGF0Zm9ybSBzcGVjaWZpYyBvcHRpb25zXHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1zZyxcclxuICAgICAgICAgICAgcHJvZ3Jlc3M6IDAuNjUsXHJcbiAgICAgICAgICAgIGFuZHJvaWQ6IHtcclxuICAgICAgICAgICAgICAgIGluZGV0ZXJtaW5hdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1heDogMTAwLFxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NOdW1iZXJGb3JtYXQ6IFwiJTFkLyUyZFwiLFxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NQZXJjZW50Rm9ybWF0OiAwLjUzLFxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NTdHlsZTogMSxcclxuICAgICAgICAgICAgICAgIHNlY29uZGFyeVByb2dyZXNzOiAxXHJcbiAgICAgICAgICAgIH0sIC8qXHJcbiAgICAgICAgICAgIGlvczoge1xyXG4gICAgICAgICAgICAgICAgZGV0YWlsczogXCJBZGRpdGlvbmFsIGRldGFpbCBub3RlIVwiLFxyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgICAgIGRpbUJhY2tncm91bmQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogXCIjNEI5RUQ2XCIsIC8vIGNvbG9yIG9mIGluZGljYXRvciBhbmQgbGFiZWxzXHJcbiAgICAgICAgICAgICAgICAvLyBiYWNrZ3JvdW5kIGJveCBhcm91bmQgaW5kaWNhdG9yXHJcbiAgICAgICAgICAgICAgICAvLyBoaWRlQmV6ZWwgd2lsbCBvdmVycmlkZSB0aGlzIGlmIHRydWVcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ5ZWxsb3dcIixcclxuICAgICAgICAgICAgICAgIGhpZGVCZXplbDogdHJ1ZSwgLy8gZGVmYXVsdCBmYWxzZSwgY2FuIGhpZGUgdGhlIHN1cnJvdW5kaW5nIGJlemVsXHJcbiAgICAgICAgICAgICAgICB2aWV3OiBVSVZpZXcsIC8vIFRhcmdldCB2aWV3IHRvIHNob3cgb24gdG9wIG9mIChEZWZhdWx0cyB0byBlbnRpcmUgd2luZG93KVxyXG4gICAgICAgICAgICAgICAgbW9kZTogLy8gc2VlIGlPUyBzcGVjaWZpYyBvcHRpb25zIGJlbG93XHJcbiAgICAgICAgICAgIH0gKi9cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRlci5zaG93KG9wdGlvbnMpOyAvLyBvcHRpb25zIGlzIG9wdGlvbmFsICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlkZUxvYWRlcigpIHtcclxuICAgICAgICB0aGlzLmxvYWRlci5oaWRlKCk7XHJcbiAgICB9ICAgIFxyXG59Il19