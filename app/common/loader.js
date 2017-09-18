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
