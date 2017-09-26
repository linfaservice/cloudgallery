"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var util_1 = require("../../common/util");
var loader_1 = require("../../common/loader");
var gallery_item_1 = require("../../common/gallery.item");
var gallery_cache_1 = require("../../common/gallery.cache");
var Toast = require("nativescript-toast");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var image_modal_component_1 = require("./image-modal.component");
var Http = require("tns-core-modules/http");
var timer = require("timer");
var Settings = require("application-settings");
var Platform = require("platform");
var ng2_translate_1 = require("ng2-translate");
var Base64 = require("base-64");
var application = require("application");
var application_1 = require("application");
var dialogs_1 = require("ui/dialogs");
var appversion = require("nativescript-appversion");
var email = require("nativescript-email");
var elementRegistryModule = require("nativescript-angular/element-registry");
elementRegistryModule.registerElement("CardView", function () { return require("nativescript-cardview").CardView; });
var GalleryComponent = /** @class */ (function () {
    function GalleryComponent(page, util, fonticon, modalService, vcRef, translate, cache) {
        var _this = this;
        this.page = page;
        this.util = util;
        this.fonticon = fonticon;
        this.modalService = modalService;
        this.vcRef = vcRef;
        this.translate = translate;
        this.cache = cache;
        /*
        private images = new ObservableArray<ObservableArray<GalleryItem>>();
        private current = new ObservableArray<GalleryItem>();
        private history = new Array();
        */
        //private nodeid;
        //private path;
        //private title;
        this.current = new observable_array_1.ObservableArray();
        this.progressNum = 0;
        this.progressTot = 0;
        this.progressVal = 0;
        this.footer = "";
        this.loader = new loader_1.default();
        appversion.getVersionName().then(function (v) {
            _this.version = "Version " + v;
        });
        this.language = Platform.device.language;
        this.translate.setDefaultLang("en");
        this.translate.use(Platform.device.language.split("-")[0]).subscribe(function () {
            _this.host = Settings.getString("host");
            _this.username = Settings.getString("username");
            _this.password = Settings.getString("password");
            _this.rootdir = Settings.getString("rootdir");
            _this.rootdir = (_this.rootdir == null) ? "" : _this.rootdir;
            _this.headers = {
                "OCS-APIREQUEST": "true",
                "Authorization": "Basic " + Base64.encode(_this.username + ':' + _this.password)
            };
            _this.cache.images = new Array();
            _this.home();
        });
    }
    GalleryComponent.prototype.clearCurrent = function () {
        while (this.current.length > 0) {
            this.current.pop();
        }
    };
    GalleryComponent.prototype.home = function () {
        this.cache.history = new Array();
        this.cache.currentAlbum.path = this.rootdir;
        this.cache.currentAlbum.nodeid = "/";
        this.loadGallery({
            path: this.cache.currentAlbum.path,
            nodeid: this.cache.currentAlbum.nodeid
        });
    };
    GalleryComponent.prototype.back = function () {
        var _this = this;
        if (this.cache.history.length > 1) {
            var current = this.cache.history.pop();
            var back = this.cache.history.pop();
            this.loadGallery(back);
        }
        else {
            var options = {
                title: this.translate.instant("Exit?"),
                message: this.translate.instant("Are you sure you want to exit?"),
                okButtonText: this.translate.instant("Yes"),
                cancelButtonText: this.translate.instant("No")
            };
            this.util.log("Back", "confirm exit?");
            dialogs_1.confirm(options).then(function (result) {
                _this.util.log("Back", result);
                if (result) {
                    _this.util.exit();
                }
            });
        }
    };
    GalleryComponent.prototype.exit = function () {
        Settings.setString("host", "");
        Settings.setString("username", "");
        Settings.setString("password", "");
        Settings.setString("rootdir", "");
        this.util.navigate("settings");
    };
    GalleryComponent.prototype.loadGallery = function (item) {
        var _this = this;
        this.loader.showLoader(this.translate.instant("Loading albums..."));
        this.util.log("loadGallery", item);
        var path = item.path;
        var nodeid = item.nodeid;
        if (this.cache.images[nodeid] == null) {
            this.cache.images[nodeid] = new gallery_item_1.GalleryItem();
        }
        this.clearCurrent();
        this.footer = "";
        this.cache.currentAlbum.nodeid = nodeid;
        this.cache.currentAlbum.path = path;
        var path_chunk = path.split("/");
        this.cache.currentAlbum.title = path_chunk[path_chunk.length - 1];
        this.cache.currentAlbum.title = (this.cache.currentAlbum.title == "") ? this.host.split("//")[1] : this.cache.currentAlbum.title;
        this.progressVal = 0;
        // string sanitize
        var pathsan = this.util.replaceAll(path, "&", "%26");
        var url = this.host + "/index.php/apps/gallery/api/files/list?location=" + pathsan + "&mediatypes=image/jpeg;image/gif;image/png&features=&etag";
        this.util.log("GET", url);
        // try from cache first
        this.util.log("Get Album Cache", this.cache.images[this.cache.currentAlbum.nodeid]);
        if (this.cache.images[this.cache.currentAlbum.nodeid].loaded) {
            this.util.log("Cache Found!", "Retrieving from cache");
            for (var a in this.cache.images[this.cache.currentAlbum.nodeid].items) {
                var item_1 = this.cache.images[this.cache.currentAlbum.nodeid].items[a];
                this.util.log("Cache album added", item_1);
                this.current.push(item_1);
            }
            this.updateFooter(this.cache.images[this.cache.currentAlbum.nodeid].totAlbums, 0);
            var data_1 = this.cache.images[this.cache.currentAlbum.nodeid].data;
            // otherwise too fast :)
            timer.setTimeout(function () {
                _this.loader.hideLoader();
                _this.scanImages(data_1.files, nodeid);
            }, 800);
        }
        else {
            this.util.log("Cache Not Found :(", "Retrieving from cloud...");
            Http.request({
                url: url,
                method: "GET",
                headers: this.headers
            }).then(function (response) {
                var data = null;
                try {
                    data = response.content.toJSON();
                }
                catch (e) {
                    Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                    _this.util.log("Error", e);
                    _this.loader.hideLoader();
                    return;
                }
                if (data == null) {
                    Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                    _this.util.log("Error", "Data null");
                    _this.loader.hideLoader();
                    return;
                }
                _this.util.log("response to ", path + "(" + nodeid + "), current album:" + _this.cache.currentAlbum.nodeid);
                var albums = data.albums;
                // error loading
                if (albums == null) {
                    Toast.makeText(_this.translate.instant("Error loading. Please exit and reconfigure")).show();
                    _this.loader.hideLoader();
                    return;
                }
                var totAlbums = 0;
                _this.progressTot = albums.length;
                _this.progressNum = 0;
                for (var j in albums) {
                    if (albums[j].size != 0) {
                        var albumObj = new gallery_item_1.GalleryItem();
                        albumObj.path = albums[j].path;
                        var path_chunk_1 = albumObj.path.split("/");
                        var current_chunk = _this.cache.currentAlbum.path.split("/");
                        albumObj.title = path_chunk_1[path_chunk_1.length - 1];
                        albumObj.isAlbum = true;
                        albumObj.src = "";
                        albumObj.nodeid = albums[j].nodeid;
                        albumObj.items = new Array();
                        if (albumObj.path == data.albumpath) {
                            // excludes current album
                        }
                        else if (path_chunk_1.length > current_chunk.length + 1) {
                            // excludes more levels albums
                        }
                        else {
                            _this.current.push(albumObj);
                            if (_this.cache.images[_this.cache.currentAlbum.nodeid].items == null) {
                                _this.cache.images[_this.cache.currentAlbum.nodeid].items = new Array();
                            }
                            _this.cache.images[_this.cache.currentAlbum.nodeid].items.push(albumObj);
                            totAlbums++;
                            _this.util.log("Album added to " + nodeid + ":", albumObj);
                        }
                    }
                    _this.progressNum++;
                    _this.progressVal = (_this.progressNum * 100) / _this.progressTot;
                }
                _this.progressVal = 100;
                _this.cache.images[_this.cache.currentAlbum.nodeid].loaded = true;
                _this.cache.images[_this.cache.currentAlbum.nodeid].totAlbums = totAlbums;
                _this.cache.images[_this.cache.currentAlbum.nodeid].data = data;
                _this.util.log("Set Album Cache", _this.cache.images[_this.cache.currentAlbum.nodeid]);
                _this.updateFooter(totAlbums, 0);
                _this.loader.hideLoader();
                _this.scanImages(data.files, nodeid);
            }, function (e) {
                Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                _this.util.log("Error", e);
                _this.loader.hideLoader();
                return;
            });
        }
        this.cache.history.push({ path: this.cache.currentAlbum.path, nodeid: this.cache.currentAlbum.nodeid });
    };
    GalleryComponent.prototype.scanImages = function (files, nodeid) {
        var _this = this;
        // checks for available images
        var toShowLoader = false;
        var totFiles = 0;
        var totAlbums = this.cache.images[this.cache.currentAlbum.nodeid].totAlbums;
        for (var i in files) {
            var filepath = "";
            var filepath_chunk = files[i].path.split("/");
            for (var c = 0; c < filepath_chunk.length - 1; c++) {
                filepath += filepath_chunk[c] + "/";
            }
            if (filepath == this.cache.currentAlbum.path + "/") {
                totFiles++;
                toShowLoader = true;
            }
        }
        if (toShowLoader) {
            this.loader.showLoader(this.translate.instant("Loading images..."));
            this.progressNum = 0;
            this.progressTot = totFiles;
            this.progressVal = 0;
            this.updateFooter(totAlbums, totFiles);
        }
        var _loop_1 = function (i) {
            this_1.imageScanner = timer.setTimeout(function () { _this.loadImages(nodeid, files[files.length - 1 - (+i)]); }, 300 * (+i));
        };
        var this_1 = this;
        for (var i in files) {
            _loop_1(i);
        }
    };
    GalleryComponent.prototype.loadImages = function (albumid, item) {
        var _this = this;
        if (albumid == this.cache.currentAlbum.nodeid) {
            var filepath = "";
            var filepath_chunk_1 = item.path.split("/");
            for (var c = 0; c < filepath_chunk_1.length - 1; c++) {
                filepath += filepath_chunk_1[c] + "/";
            }
            if (filepath == this.cache.currentAlbum.path + "/") {
                var imgurlroot_1 = this.host + "/index.php/apps/gallery/api/preview/" + item.nodeid;
                Http.request({
                    url: imgurlroot_1 + "/150/150",
                    method: "GET",
                    headers: this.headers
                }).then(function (response) {
                    if (albumid == _this.cache.currentAlbum.nodeid) {
                        var imgObj_1 = new gallery_item_1.GalleryItem();
                        response.content.toImage()
                            .then(function (image) {
                            var base64 = image.toBase64String();
                            imgObj_1.src = base64;
                            imgObj_1.title = filepath_chunk_1[filepath_chunk_1.length - 1];
                            imgObj_1.url = imgurlroot_1;
                            imgObj_1.mtime = item.mtime;
                            _this.current.push(imgObj_1);
                            /*
                            if(this.cache.images[this.cache.currentAlbum.nodeid].images==null) {
                              this.cache.images[this.cache.currentAlbum.nodeid].images = new Array<GalleryItem>();
                            }
                            this.cache.images[this.cache.currentAlbum.nodeid].images[item.nodeid] = imgObj;
                            */
                            _this.progressNum++;
                            _this.progressVal = (_this.progressNum * 100) / _this.progressTot;
                            _this.util.log("file added to " + albumid + ": ", "(" + item.nodeid + ") " + item.path + " - " + item.mtime);
                        })
                            .catch(function (error) {
                            //this.util.log("error", error);
                        });
                        // hide the loader when first image in directory is loaded
                        _this.loader.hideLoader();
                    }
                }, function (e) {
                    Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                });
            }
        }
        else {
            timer.clearTimeout(this.imageScanner);
        }
    };
    GalleryComponent.prototype.updateFooter = function (numAlbums, numFiles) {
        var footerAlbum = (numAlbums > 0) ? numAlbums + " " + this.translate.instant("Collections") : "";
        var footerFiles = (numFiles > 0) ? numFiles + " " + this.translate.instant("Files") : "";
        this.footer = "";
        this.footer += footerAlbum;
        this.footer += (numAlbums > 0 && numFiles > 0) ? " / " : "";
        this.footer += footerFiles;
        this.util.log("updateFooter", this.footer);
    };
    GalleryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = false;
        this.util.log("Page Init", "Gallery");
        if (application.android) {
            application.android.on(application_1.AndroidApplication.activityBackPressedEvent, function (data) {
                data.cancel = true; // prevents default back button behavior
                _this.back();
            });
        }
        /*
        applicationOn(resumeEvent, (args: ApplicationEventData)=> {
            this.loadGallery({path: this.path, nodeid: this.nodeid});
        });
        */
    };
    GalleryComponent.prototype.ngAfterViewInit = function () {
    };
    GalleryComponent.prototype.onTapFolder = function (item) {
        this.util.log("tap", item);
        this.loadGallery(item);
    };
    GalleryComponent.prototype.onTapImage = function (item) {
        this.util.log("tap", item.title);
        this.loader.showLoader(this.translate.instant("Loading image..."));
        var options = {
            context: {
                loader: this.loader,
                item: item
            },
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modalService.showModal(image_modal_component_1.ImageModalComponent, options)
            .then(function (result) {
        });
    };
    GalleryComponent.prototype.sendLog = function () {
        if (this.util.DEBUG && this.util.LOGTOSETTINGS) {
            email.compose({
                subject: "Cloud Gallery Log",
                body: Settings.getString("_LOG"),
                to: ['info@linfaservice.it']
            });
        }
    };
    GalleryComponent = __decorate([
        core_1.Component({
            selector: "gallery",
            templateUrl: "pages/gallery/gallery.html",
            styleUrls: ["pages/gallery/gallery.css"],
            providers: [modal_dialog_1.ModalDialogService]
        }),
        __metadata("design:paramtypes", [page_1.Page,
            util_1.Util,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            modal_dialog_1.ModalDialogService,
            core_1.ViewContainerRef,
            ng2_translate_1.TranslateService,
            gallery_cache_1.default])
    ], GalleryComponent);
    return GalleryComponent;
}());
exports.GalleryComponent = GalleryComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxsZXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUErQjtBQUMvQixzQ0FBb0U7QUFDcEUsMENBQXlDO0FBQ3pDLDhDQUF5QztBQUN6QywwREFBd0Q7QUFDeEQsNERBQXNEO0FBQ3RELDBDQUE0QztBQUM1Qyx1RUFBK0Q7QUFDL0QsMkVBQXlFO0FBQ3pFLGtFQUF1RTtBQUN2RSxpRUFBOEQ7QUFFOUQsNENBQTZDO0FBRTdDLDZCQUErQjtBQUMvQiwrQ0FBaUQ7QUFDakQsbUNBQXFDO0FBQ3JDLCtDQUFpRDtBQUdqRCxnQ0FBbUM7QUFDbkMseUNBQTJDO0FBQzNDLDJDQUFzRjtBQUN0RixzQ0FBcUM7QUFDckMsb0RBQXNEO0FBQ3RELDBDQUE0QztBQUU1Qyw2RUFBK0U7QUFDL0UscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsUUFBUSxFQUF6QyxDQUF5QyxDQUFDLENBQUM7QUFXbkc7SUE4QkksMEJBQ1UsSUFBVSxFQUNYLElBQVUsRUFDVCxRQUE0QixFQUM1QixZQUFnQyxFQUNoQyxLQUF1QixFQUN2QixTQUEyQixFQUMzQixLQUFtQjtRQVA3QixpQkE4QkM7UUE3QlMsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNYLFNBQUksR0FBSixJQUFJLENBQU07UUFDVCxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUFDaEMsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFDdkIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsVUFBSyxHQUFMLEtBQUssQ0FBYztRQTFCN0I7Ozs7VUFJRTtRQUVGLGlCQUFpQjtRQUNqQixlQUFlO1FBQ2YsZ0JBQWdCO1FBRVIsWUFBTyxHQUFHLElBQUksa0NBQWUsRUFBZSxDQUFDO1FBQzdD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LHVCQUFnQjtZQUNaLGdDQUFnQjtZQUNwQix1QkFBWTtPQXJDcEIsZ0JBQWdCLENBc1o1QjtJQUFELHVCQUFDO0NBQUEsQUF0WkQsSUFzWkM7QUF0WlksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXRpbCB9IGZyb20gXCIuLi8uLi9jb21tb24vdXRpbFwiO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gXCIuLi8uLi9jb21tb24vbG9hZGVyXCI7XHJcbmltcG9ydCB7IEdhbGxlcnlJdGVtIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9nYWxsZXJ5Lml0ZW1cIjtcclxuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbGxlcnkuY2FjaGVcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcbmltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZS1hcnJheVwiO1xyXG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XHJcbmltcG9ydCB7IEltYWdlTW9kYWxDb21wb25lbnQgfSBmcm9tIFwiLi9pbWFnZS1tb2RhbC5jb21wb25lbnRcIjtcclxuaW1wb3J0ICogYXMgSW1hZ2VTb3VyY2VNb2R1bGUgZnJvbSBcImltYWdlLXNvdXJjZVwiO1xyXG5pbXBvcnQgKiBhcyBIdHRwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2h0dHBcIlxyXG5pbXBvcnQgeyBSYWRMaXN0VmlldyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vbGlzdHZpZXdcIlxyXG5pbXBvcnQgKiBhcyB0aW1lciBmcm9tIFwidGltZXJcIjtcclxuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzIFBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgb24gYXMgYXBwbGljYXRpb25PbiwgbGF1bmNoRXZlbnQsIHN1c3BlbmRFdmVudCwgcmVzdW1lRXZlbnQsIGV4aXRFdmVudCwgbG93TWVtb3J5RXZlbnQsIHVuY2F1Z2h0RXJyb3JFdmVudCwgQXBwbGljYXRpb25FdmVudERhdGEsIHN0YXJ0IGFzIGFwcGxpY2F0aW9uU3RhcnQgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0ICogYXMgdXRmOCBmcm9tIFwidXRmOFwiOyBcclxuaW1wb3J0ICogYXMgIEJhc2U2NCBmcm9tIFwiYmFzZS02NFwiO1xyXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgQW5kcm9pZEFwcGxpY2F0aW9uLCBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBjb25maXJtIH0gZnJvbSBcInVpL2RpYWxvZ3NcIjtcclxuaW1wb3J0ICogYXMgYXBwdmVyc2lvbiBmcm9tIFwibmF0aXZlc2NyaXB0LWFwcHZlcnNpb25cIjsgXHJcbmltcG9ydCAqIGFzIGVtYWlsIGZyb20gXCJuYXRpdmVzY3JpcHQtZW1haWxcIjtcclxuXHJcbmltcG9ydCAqIGFzIGVsZW1lbnRSZWdpc3RyeU1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcclxuZWxlbWVudFJlZ2lzdHJ5TW9kdWxlLnJlZ2lzdGVyRWxlbWVudChcIkNhcmRWaWV3XCIsICgpID0+IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtY2FyZHZpZXdcIikuQ2FyZFZpZXcpO1xyXG5cclxuICBcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiZ2FsbGVyeVwiLFxyXG4gIHRlbXBsYXRlVXJsOiBcInBhZ2VzL2dhbGxlcnkvZ2FsbGVyeS5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9nYWxsZXJ5L2dhbGxlcnkuY3NzXCJdLFxyXG4gIHByb3ZpZGVyczogW01vZGFsRGlhbG9nU2VydmljZV1cclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgR2FsbGVyeUNvbXBvbmVudCB7XHJcblxyXG4gICAgcHJpdmF0ZSBsYW5ndWFnZTtcclxuICAgIHByaXZhdGUgdmVyc2lvbjtcclxuXHJcbiAgICBwcml2YXRlIGhvc3Q7XHJcbiAgICBwcml2YXRlIHVzZXJuYW1lO1xyXG4gICAgcHJpdmF0ZSBwYXNzd29yZDtcclxuICAgIHByaXZhdGUgcm9vdGRpcjtcclxuICAgIHByaXZhdGUgaGVhZGVycztcclxuXHJcbiAgICAvKlxyXG4gICAgcHJpdmF0ZSBpbWFnZXMgPSBuZXcgT2JzZXJ2YWJsZUFycmF5PE9ic2VydmFibGVBcnJheTxHYWxsZXJ5SXRlbT4+KCk7XHJcbiAgICBwcml2YXRlIGN1cnJlbnQgPSBuZXcgT2JzZXJ2YWJsZUFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG4gICAgcHJpdmF0ZSBoaXN0b3J5ID0gbmV3IEFycmF5KCk7XHJcbiAgICAqL1xyXG5cclxuICAgIC8vcHJpdmF0ZSBub2RlaWQ7XHJcbiAgICAvL3ByaXZhdGUgcGF0aDtcclxuICAgIC8vcHJpdmF0ZSB0aXRsZTtcclxuXHJcbiAgICBwcml2YXRlIGN1cnJlbnQgPSBuZXcgT2JzZXJ2YWJsZUFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG4gICAgcHJpdmF0ZSBwcm9ncmVzc051bSA9IDA7XHJcbiAgICBwcml2YXRlIHByb2dyZXNzVG90ID0gMDtcclxuICAgIHByaXZhdGUgcHJvZ3Jlc3NWYWwgPSAwO1xyXG4gICAgcHJpdmF0ZSBmb290ZXIgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XHJcbiAgICBwcml2YXRlIGltYWdlU2Nhbm5lcjtcclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG5cdCAgICBwcml2YXRlIHV0aWw6IFV0aWwsXHJcbiAgICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgICAgcHJpdmF0ZSBtb2RhbFNlcnZpY2U6IE1vZGFsRGlhbG9nU2VydmljZSwgXHJcbiAgICAgIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsXHJcbiAgICAgIHByaXZhdGUgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxyXG4gICAgICBwcml2YXRlIGNhY2hlOiBHYWxsZXJ5Q2FjaGVcclxuICAgICkgIHtcclxuXHJcbiAgICAgIGFwcHZlcnNpb24uZ2V0VmVyc2lvbk5hbWUoKS50aGVuKCh2OiBzdHJpbmcpPT4ge1xyXG4gICAgICAgICAgdGhpcy52ZXJzaW9uID0gXCJWZXJzaW9uIFwiICsgdjtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmxhbmd1YWdlID0gUGxhdGZvcm0uZGV2aWNlLmxhbmd1YWdlO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZyhcImVuXCIpO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0ZS51c2UoUGxhdGZvcm0uZGV2aWNlLmxhbmd1YWdlLnNwbGl0KFwiLVwiKVswXSkuc3Vic2NyaWJlKCgpPT4ge1xyXG4gICAgICAgIHRoaXMuaG9zdCA9IFNldHRpbmdzLmdldFN0cmluZyhcImhvc3RcIik7XHJcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IFNldHRpbmdzLmdldFN0cmluZyhcInVzZXJuYW1lXCIpO1xyXG4gICAgICAgIHRoaXMucGFzc3dvcmQgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJwYXNzd29yZFwiKTtcclxuICAgICAgICB0aGlzLnJvb3RkaXIgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJyb290ZGlyXCIpOyAgXHJcbiAgICAgICAgdGhpcy5yb290ZGlyID0gKHRoaXMucm9vdGRpcj09bnVsbCk/IFwiXCI6dGhpcy5yb290ZGlyO1xyXG4gICAgICAgIHRoaXMuaGVhZGVycyA9IHsgXHJcbiAgICAgICAgICBcIk9DUy1BUElSRVFVRVNUXCI6IFwidHJ1ZVwiLFxyXG4gICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiQmFzaWMgXCIrQmFzZTY0LmVuY29kZSh0aGlzLnVzZXJuYW1lKyc6Jyt0aGlzLnBhc3N3b3JkKVxyXG4gICAgICAgIH0gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXMgPSBuZXcgQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICAgICAgdGhpcy5ob21lKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xlYXJDdXJyZW50KCkge1xyXG4gICAgICB3aGlsZSh0aGlzLmN1cnJlbnQubGVuZ3RoPjApIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnQucG9wKCk7ICAgXHJcbiAgICAgIH1cclxuICAgIH0gIFxyXG5cclxuICAgIHByaXZhdGUgaG9tZSgpIHtcclxuICAgICAgdGhpcy5jYWNoZS5oaXN0b3J5ID0gbmV3IEFycmF5KCk7XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGggPSB0aGlzLnJvb3RkaXI7IFxyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQgPSBcIi9cIjtcclxuICAgICAgdGhpcy5sb2FkR2FsbGVyeSh7XHJcbiAgICAgICAgcGF0aDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCwgXHJcbiAgICAgICAgbm9kZWlkOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBiYWNrKCkge1xyXG4gICAgICBpZih0aGlzLmNhY2hlLmhpc3RvcnkubGVuZ3RoPjEpIHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IHRoaXMuY2FjaGUuaGlzdG9yeS5wb3AoKTtcclxuICAgICAgICBsZXQgYmFjayA9IHRoaXMuY2FjaGUuaGlzdG9yeS5wb3AoKTtcclxuICAgICAgICB0aGlzLmxvYWRHYWxsZXJ5KGJhY2spOyBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFeGl0P1wiKSxcclxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBleGl0P1wiKSxcclxuICAgICAgICAgICAgb2tCdXR0b25UZXh0OiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiWWVzXCIpLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTm9cIilcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiQmFja1wiLCBcImNvbmZpcm0gZXhpdD9cIik7IFxyXG4gICAgICAgIGNvbmZpcm0ob3B0aW9ucykudGhlbigocmVzdWx0OiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJCYWNrXCIsIHJlc3VsdCk7ICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihyZXN1bHQpIHtcclxuICAgICAgICAgICAgICB0aGlzLnV0aWwuZXhpdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7ICAgICAgICBcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXhpdCgpIHtcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwiaG9zdFwiLCBcIlwiKTtcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwidXNlcm5hbWVcIiwgXCJcIik7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInBhc3N3b3JkXCIsIFwiXCIpO1xyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJyb290ZGlyXCIsIFwiXCIpOyAgICAgICAgXHJcbiAgICAgIHRoaXMudXRpbC5uYXZpZ2F0ZShcInNldHRpbmdzXCIpO1xyXG4gICAgfVxyXG4gXHJcbiAgICBwcml2YXRlIGxvYWRHYWxsZXJ5KGl0ZW0pIHtcclxuICAgICAgIFxyXG4gICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJMb2FkaW5nIGFsYnVtcy4uLlwiKSk7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJsb2FkR2FsbGVyeVwiLCBpdGVtKTsgXHJcblxyXG4gICAgICBsZXQgcGF0aCA9IGl0ZW0ucGF0aDtcclxuICAgICAgbGV0IG5vZGVpZCA9IGl0ZW0ubm9kZWlkO1xyXG5cclxuICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbbm9kZWlkXT09bnVsbCkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW25vZGVpZF0gPSBuZXcgR2FsbGVyeUl0ZW0oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jbGVhckN1cnJlbnQoKTtcclxuXHJcbiAgICAgIHRoaXMuZm9vdGVyID0gXCJcIjtcclxuXHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCA9IG5vZGVpZDtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCA9IHBhdGg7XHJcbiAgICAgIGxldCBwYXRoX2NodW5rID0gcGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlID0gcGF0aF9jaHVua1twYXRoX2NodW5rLmxlbmd0aC0xXTtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGUgPSAodGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGU9PVwiXCIpPyB0aGlzLmhvc3Quc3BsaXQoXCIvL1wiKVsxXSA6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlO1xyXG5cclxuICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9IDA7XHJcblxyXG4gICAgICAvLyBzdHJpbmcgc2FuaXRpemVcclxuICAgICAgbGV0IHBhdGhzYW4gPSB0aGlzLnV0aWwucmVwbGFjZUFsbChwYXRoLCBcIiZcIiwgXCIlMjZcIik7ICAgICAgXHJcbiAgICAgIGxldCB1cmwgPSB0aGlzLmhvc3QrXCIvaW5kZXgucGhwL2FwcHMvZ2FsbGVyeS9hcGkvZmlsZXMvbGlzdD9sb2NhdGlvbj1cIitwYXRoc2FuK1wiJm1lZGlhdHlwZXM9aW1hZ2UvanBlZztpbWFnZS9naWY7aW1hZ2UvcG5nJmZlYXR1cmVzPSZldGFnXCI7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJHRVRcIiwgdXJsKTtcclxuXHJcbiAgICAgIC8vIHRyeSBmcm9tIGNhY2hlIGZpcnN0XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJHZXQgQWxidW0gQ2FjaGVcIiwgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXSk7XHJcbiAgICAgIGlmKHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0ubG9hZGVkKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIkNhY2hlIEZvdW5kIVwiLCBcIlJldHJpZXZpbmcgZnJvbSBjYWNoZVwiKTtcclxuICAgICAgICBmb3IobGV0IGEgaW4gdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcykge1xyXG4gICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zW2FdO1xyXG4gICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkNhY2hlIGFsYnVtIGFkZGVkXCIsIGl0ZW0pO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlRm9vdGVyKHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0udG90QWxidW1zLCAwKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uZGF0YTtcclxuXHJcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHRvbyBmYXN0IDopXHJcbiAgICAgICAgdGltZXIuc2V0VGltZW91dCgoKT0+IHsgXHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7IFxyXG4gICAgICAgICAgdGhpcy5zY2FuSW1hZ2VzKGRhdGEuZmlsZXMsIG5vZGVpZCk7XHJcbiAgICAgICAgfSwgODAwKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJDYWNoZSBOb3QgRm91bmQgOihcIiwgXCJSZXRyaWV2aW5nIGZyb20gY2xvdWQuLi5cIik7XHJcbiAgICAgIFxyXG4gICAgICAgIEh0dHAucmVxdWVzdCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVyc1xyXG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlOmFueSk9PiB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgZGF0YSA9IHJlc3BvbnNlLmNvbnRlbnQudG9KU09OKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3JcIiwgZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybjsgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihkYXRhPT1udWxsKSB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvclwiLCBcIkRhdGEgbnVsbFwiKTtcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuOyAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwicmVzcG9uc2UgdG8gXCIsIHBhdGgrXCIoXCIrbm9kZWlkK1wiKSwgY3VycmVudCBhbGJ1bTpcIiArIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxidW1zID0gZGF0YS5hbGJ1bXM7ICBcclxuICAgICAgICAgICAgLy8gZXJyb3IgbG9hZGluZ1xyXG4gICAgICAgICAgICBpZihhbGJ1bXM9PW51bGwpIHtcclxuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgbG9hZGluZy4gUGxlYXNlIGV4aXQgYW5kIHJlY29uZmlndXJlXCIpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRvdEFsYnVtcyA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NUb3QgPSBhbGJ1bXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzTnVtID0gMDtcclxuICAgICAgICAgICAgZm9yKGxldCBqIGluIGFsYnVtcykge1xyXG4gICAgICAgICAgICAgIGlmKGFsYnVtc1tqXS5zaXplIT0wKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWxidW1PYmogPSBuZXcgR2FsbGVyeUl0ZW0oKTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLnBhdGggPSBhbGJ1bXNbal0ucGF0aDtcclxuICAgICAgICAgICAgICAgIGxldCBwYXRoX2NodW5rID0gYWxidW1PYmoucGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudF9jaHVuayA9IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmoudGl0bGUgPSBwYXRoX2NodW5rW3BhdGhfY2h1bmsubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmouaXNBbGJ1bSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5zcmMgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmoubm9kZWlkID0gYWxidW1zW2pdLm5vZGVpZDtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLml0ZW1zID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGFsYnVtT2JqLnBhdGg9PWRhdGEuYWxidW1wYXRoKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGV4Y2x1ZGVzIGN1cnJlbnQgYWxidW1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihwYXRoX2NodW5rLmxlbmd0aD5jdXJyZW50X2NodW5rLmxlbmd0aCsxKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGV4Y2x1ZGVzIG1vcmUgbGV2ZWxzIGFsYnVtc1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goYWxidW1PYmopO1xyXG4gICAgICAgICAgICAgICAgICBpZih0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zPT1udWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zLnB1c2goYWxidW1PYmopO1xyXG4gICAgICAgICAgICAgICAgICB0b3RBbGJ1bXMrKztcclxuICAgICAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkFsYnVtIGFkZGVkIHRvIFwiK25vZGVpZCtcIjpcIiwgYWxidW1PYmopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzTnVtKys7XHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9ICh0aGlzLnByb2dyZXNzTnVtKjEwMCkvdGhpcy5wcm9ncmVzc1RvdDtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9IDEwMDtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLnRvdEFsYnVtcyA9IHRvdEFsYnVtcztcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIlNldCBBbGJ1bSBDYWNoZVwiLCB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm9vdGVyKHRvdEFsYnVtcywgMCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5zY2FuSW1hZ2VzKGRhdGEuZmlsZXMsIG5vZGVpZCk7XHJcbiBcclxuICAgICAgICAgIH0sIChlKT0+IHtcclxuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgbG9hZGluZy4gUGxlYXNlIHJldHJ5XCIpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yXCIsIGUpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9KTsgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2FjaGUuaGlzdG9yeS5wdXNoKHtwYXRoOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoLCBub2RlaWQ6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNjYW5JbWFnZXMoZmlsZXMsIG5vZGVpZCkge1xyXG4gICAgICAvLyBjaGVja3MgZm9yIGF2YWlsYWJsZSBpbWFnZXNcclxuICAgICAgbGV0IHRvU2hvd0xvYWRlciA9IGZhbHNlO1xyXG4gICAgICBsZXQgdG90RmlsZXMgPSAwO1xyXG4gICAgICBsZXQgdG90QWxidW1zID0gdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS50b3RBbGJ1bXM7XHJcblxyXG4gICAgICBmb3IobGV0IGkgaW4gZmlsZXMpIHtcclxuICAgICAgICBsZXQgZmlsZXBhdGggPSBcIlwiO1xyXG4gICAgICAgIGxldCBmaWxlcGF0aF9jaHVuayA9IGZpbGVzW2ldLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIGZvcihsZXQgYz0wOyBjPGZpbGVwYXRoX2NodW5rLmxlbmd0aC0xOyBjKyspIHtcclxuICAgICAgICAgIGZpbGVwYXRoICs9IGZpbGVwYXRoX2NodW5rW2NdICsgXCIvXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZmlsZXBhdGg9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGgrXCIvXCIpIHtcclxuICAgICAgICAgIHRvdEZpbGVzKys7XHJcbiAgICAgICAgICB0b1Nob3dMb2FkZXIgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYodG9TaG93TG9hZGVyKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTG9hZGluZyBpbWFnZXMuLi5cIikpO1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NOdW0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NUb3QgPSB0b3RGaWxlcztcclxuICAgICAgICB0aGlzLnByb2dyZXNzVmFsID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVGb290ZXIodG90QWxidW1zLCB0b3RGaWxlcyk7XHJcbiAgICAgIH0gXHJcblxyXG4gICAgICBmb3IobGV0IGkgaW4gZmlsZXMpIHsgXHJcbiAgICAgICAgdGhpcy5pbWFnZVNjYW5uZXIgPSB0aW1lci5zZXRUaW1lb3V0KFxyXG4gICAgICAgICAgKCk9PiB7IHRoaXMubG9hZEltYWdlcyhub2RlaWQsIGZpbGVzW2ZpbGVzLmxlbmd0aC0xLSgraSldKSB9LCBcclxuICAgICAgICAgIDMwMCooK2kpKTtcclxuICAgICAgfSAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRJbWFnZXMoYWxidW1pZCwgaXRlbSkge1xyXG4gICAgICBpZihhbGJ1bWlkPT10aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQpIHsgXHJcbiAgICAgICAgbGV0IGZpbGVwYXRoID0gXCJcIjtcclxuICAgICAgICBsZXQgZmlsZXBhdGhfY2h1bmsgPSBpdGVtLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIGZvcihsZXQgYz0wOyBjPGZpbGVwYXRoX2NodW5rLmxlbmd0aC0xOyBjKyspIHtcclxuICAgICAgICAgIGZpbGVwYXRoICs9IGZpbGVwYXRoX2NodW5rW2NdICsgXCIvXCJcclxuICAgICAgICB9XHJcbiBcclxuICAgICAgICBpZihmaWxlcGF0aD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCtcIi9cIikge1xyXG4gICAgICAgICAgbGV0IGltZ3VybHJvb3QgPSB0aGlzLmhvc3QrXCIvaW5kZXgucGhwL2FwcHMvZ2FsbGVyeS9hcGkvcHJldmlldy9cIiArIGl0ZW0ubm9kZWlkO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgSHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICB1cmw6IGltZ3VybHJvb3QgKyBcIi8xNTAvMTUwXCIsXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVyc1xyXG4gICAgICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmKGFsYnVtaWQ9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCkgeyBcclxuICAgICAgICAgICAgICBsZXQgaW1nT2JqID0gbmV3IEdhbGxlcnlJdGVtKCk7XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuY29udGVudC50b0ltYWdlKClcclxuICAgICAgICAgICAgICAgIC50aGVuKChpbWFnZSk9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBiYXNlNjQgPSBpbWFnZS50b0Jhc2U2NFN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmouc3JjID0gYmFzZTY0O1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoudGl0bGUgPSBmaWxlcGF0aF9jaHVua1tmaWxlcGF0aF9jaHVuay5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai51cmwgPSBpbWd1cmxyb290O1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoubXRpbWUgPSBpdGVtLm10aW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goaW1nT2JqKTtcclxuICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pbWFnZXM9PW51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmltYWdlcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmltYWdlc1tpdGVtLm5vZGVpZF0gPSBpbWdPYmo7XHJcbiAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NOdW0rKztcclxuICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9ICh0aGlzLnByb2dyZXNzTnVtKjEwMCkvdGhpcy5wcm9ncmVzc1RvdDtcclxuICAgICAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcImZpbGUgYWRkZWQgdG8gXCIrYWxidW1pZCtcIjogXCIsIFwiKFwiICsgaXRlbS5ub2RlaWQgKyBcIikgXCIgKyBpdGVtLnBhdGggKyBcIiAtIFwiICsgaXRlbS5tdGltZSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PiB7XHJcbiAgICAgICAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcImVycm9yXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pOyAgXHJcblxyXG5cdFx0XHRcdC8vIGhpZGUgdGhlIGxvYWRlciB3aGVuIGZpcnN0IGltYWdlIGluIGRpcmVjdG9yeSBpcyBsb2FkZWRcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9LCAoZSk9PiB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgfSk7ICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRpbWVyLmNsZWFyVGltZW91dCh0aGlzLmltYWdlU2Nhbm5lcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUZvb3RlcihudW1BbGJ1bXMsIG51bUZpbGVzKSB7XHJcbiAgICAgIGxldCBmb290ZXJBbGJ1bSA9IChudW1BbGJ1bXM+MCk/IG51bUFsYnVtcyArIFwiIFwiICsgdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkNvbGxlY3Rpb25zXCIpIDogXCJcIjtcclxuICAgICAgbGV0IGZvb3RlckZpbGVzID0gKG51bUZpbGVzPjApPyBudW1GaWxlcyArIFwiIFwiICsgdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkZpbGVzXCIpIDogXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgPSBcIlwiO1xyXG4gICAgICB0aGlzLmZvb3RlciArPSBmb290ZXJBbGJ1bTtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gKG51bUFsYnVtcz4wICYmIG51bUZpbGVzPjApPyBcIiAvIFwiIDogXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gZm9vdGVyRmlsZXM7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJ1cGRhdGVGb290ZXJcIiwgdGhpcy5mb290ZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiUGFnZSBJbml0XCIsIFwiR2FsbGVyeVwiKTsgICAgICBcclxuXHJcbiAgICAgIGlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XHJcbiAgICAgICAgYXBwbGljYXRpb24uYW5kcm9pZC5vbihcclxuICAgICAgICAgICAgQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgXHJcbiAgICAgICAgICAgIChkYXRhOiBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5jYW5jZWwgPSB0cnVlOyAvLyBwcmV2ZW50cyBkZWZhdWx0IGJhY2sgYnV0dG9uIGJlaGF2aW9yXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2soKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICApOyAgICAgICBcclxuICAgICAgfVxyXG5cclxuICAgICAgLypcclxuICAgICAgYXBwbGljYXRpb25PbihyZXN1bWVFdmVudCwgKGFyZ3M6IEFwcGxpY2F0aW9uRXZlbnREYXRhKT0+IHtcclxuICAgICAgICAgIHRoaXMubG9hZEdhbGxlcnkoe3BhdGg6IHRoaXMucGF0aCwgbm9kZWlkOiB0aGlzLm5vZGVpZH0pO1xyXG4gICAgICB9KTsgICBcclxuICAgICAgKi8gXHJcbiAgICB9XHJcblxyXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIG9uVGFwRm9sZGVyKGl0ZW0pIHtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcInRhcFwiLCBpdGVtKTtcclxuICAgICAgdGhpcy5sb2FkR2FsbGVyeShpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBvblRhcEltYWdlKGl0ZW0pIHtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcInRhcFwiLCBpdGVtLnRpdGxlKTtcclxuICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTG9hZGluZyBpbWFnZS4uLlwiKSk7IFxyXG5cclxuICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICBjb250ZXh0OiB7XHJcbiAgICAgICAgICAgIGxvYWRlcjogdGhpcy5sb2FkZXIsXHJcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZSxcclxuICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWZcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMubW9kYWxTZXJ2aWNlLnNob3dNb2RhbChJbWFnZU1vZGFsQ29tcG9uZW50LCBvcHRpb25zKVxyXG4gICAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHsgICAgICBcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZExvZygpIHtcclxuICAgICAgaWYodGhpcy51dGlsLkRFQlVHICYmIHRoaXMudXRpbC5MT0dUT1NFVFRJTkdTKSB7XHJcbiAgICAgICAgZW1haWwuY29tcG9zZSh7XHJcbiAgICAgICAgICBzdWJqZWN0OiBcIkNsb3VkIEdhbGxlcnkgTG9nXCIsXHJcbiAgICAgICAgICBib2R5OiBTZXR0aW5ncy5nZXRTdHJpbmcoXCJfTE9HXCIpLFxyXG4gICAgICAgICAgdG86IFsnaW5mb0BsaW5mYXNlcnZpY2UuaXQnXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgIFxyXG5cclxufVxyXG4iXX0=