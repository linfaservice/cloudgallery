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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxsZXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUErQjtBQUMvQixzQ0FBb0U7QUFDcEUsMENBQXlDO0FBQ3pDLDhDQUF5QztBQUN6QywwREFBd0Q7QUFDeEQsNERBQXNEO0FBQ3RELDBDQUE0QztBQUM1Qyx1RUFBK0Q7QUFDL0QsMkVBQXlFO0FBQ3pFLGtFQUF1RTtBQUN2RSxpRUFBOEQ7QUFFOUQsNENBQTZDO0FBRTdDLDZCQUErQjtBQUMvQiwrQ0FBaUQ7QUFDakQsbUNBQXFDO0FBQ3JDLCtDQUFpRDtBQUdqRCxnQ0FBbUM7QUFDbkMseUNBQTJDO0FBQzNDLDJDQUFzRjtBQUN0RixzQ0FBcUM7QUFDckMsb0RBQXNEO0FBRXRELDZFQUErRTtBQUMvRSxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGNBQU0sT0FBQSxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxRQUFRLEVBQXpDLENBQXlDLENBQUMsQ0FBQztBQVduRztJQThCSSwwQkFDVSxJQUFVLEVBQ1gsSUFBVSxFQUNULFFBQTRCLEVBQzVCLFlBQWdDLEVBQ2hDLEtBQXVCLEVBQ3ZCLFNBQTJCLEVBQzNCLEtBQW1CO1FBUDdCLGlCQThCQztRQTdCUyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1gsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNULGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLGlCQUFZLEdBQVosWUFBWSxDQUFvQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixVQUFLLEdBQUwsS0FBSyxDQUFjO1FBMUI3Qjs7OztVQUlFO1FBRUYsaUJBQWlCO1FBQ2pCLGVBQWU7UUFDZixnQkFBZ0I7UUFFUixZQUFPLEdBQUcsSUFBSSxrQ0FBZSxFQUFlLENBQUM7UUFDN0MsZ0JBQVcsR0FBRyxD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QUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFFbkUsSUFBSSxPQUFPLEdBQUc7WUFDVixPQUFPLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixJQUFJLEVBQUUsSUFBSTthQUNYO1lBQ0QsVUFBVSxFQUFFLEtBQUs7WUFDakIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDL0IsQ0FBQztRQUVGLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLDJDQUFtQixFQUFFLE9BQU8sQ0FBQzthQUN4RCxJQUFJLENBQUMsVUFBQyxNQUFXO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQXpZUSxnQkFBZ0I7UUFSNUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxTQUFTO1lBQ25CLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsU0FBUyxFQUFFLENBQUMsMkJBQTJCLENBQUM7WUFDeEMsU0FBUyxFQUFFLENBQUMsaUNBQWtCLENBQUM7U0FDaEMsQ0FBQzt5Q0FrQ2tCLFdBQUk7WUFDTCxXQUFJO1lBQ0MsOENBQWtCO1lBQ2QsaUNBQWtCO1lBQ3pCLHVCQUFnQjtZQUNaLGdDQUFnQjtZQUNwQix1QkFBWTtPQXJDcEIsZ0JBQWdCLENBNlk1QjtJQUFELHVCQUFDO0NBQUEsQUE3WUQsSUE2WUM7QUE3WVksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXRpbCB9IGZyb20gXCIuLi8uLi9jb21tb24vdXRpbFwiO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gXCIuLi8uLi9jb21tb24vbG9hZGVyXCI7XHJcbmltcG9ydCB7IEdhbGxlcnlJdGVtIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9nYWxsZXJ5Lml0ZW1cIjtcclxuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbGxlcnkuY2FjaGVcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcbmltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZS1hcnJheVwiO1xyXG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XHJcbmltcG9ydCB7IEltYWdlTW9kYWxDb21wb25lbnQgfSBmcm9tIFwiLi9pbWFnZS1tb2RhbC5jb21wb25lbnRcIjtcclxuaW1wb3J0ICogYXMgSW1hZ2VTb3VyY2VNb2R1bGUgZnJvbSBcImltYWdlLXNvdXJjZVwiO1xyXG5pbXBvcnQgKiBhcyBIdHRwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2h0dHBcIlxyXG5pbXBvcnQgeyBSYWRMaXN0VmlldyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vbGlzdHZpZXdcIlxyXG5pbXBvcnQgKiBhcyB0aW1lciBmcm9tIFwidGltZXJcIjtcclxuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzIFBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgb24gYXMgYXBwbGljYXRpb25PbiwgbGF1bmNoRXZlbnQsIHN1c3BlbmRFdmVudCwgcmVzdW1lRXZlbnQsIGV4aXRFdmVudCwgbG93TWVtb3J5RXZlbnQsIHVuY2F1Z2h0RXJyb3JFdmVudCwgQXBwbGljYXRpb25FdmVudERhdGEsIHN0YXJ0IGFzIGFwcGxpY2F0aW9uU3RhcnQgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0ICogYXMgdXRmOCBmcm9tIFwidXRmOFwiOyBcclxuaW1wb3J0ICogYXMgIEJhc2U2NCBmcm9tIFwiYmFzZS02NFwiO1xyXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgQW5kcm9pZEFwcGxpY2F0aW9uLCBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBjb25maXJtIH0gZnJvbSBcInVpL2RpYWxvZ3NcIjtcclxuaW1wb3J0ICogYXMgYXBwdmVyc2lvbiBmcm9tIFwibmF0aXZlc2NyaXB0LWFwcHZlcnNpb25cIjsgXHJcblxyXG5pbXBvcnQgKiBhcyBlbGVtZW50UmVnaXN0cnlNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XHJcbmVsZW1lbnRSZWdpc3RyeU1vZHVsZS5yZWdpc3RlckVsZW1lbnQoXCJDYXJkVmlld1wiLCAoKSA9PiByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWNhcmR2aWV3XCIpLkNhcmRWaWV3KTtcclxuXHJcbiAgXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcImdhbGxlcnlcIixcclxuICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9nYWxsZXJ5L2dhbGxlcnkuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wicGFnZXMvZ2FsbGVyeS9nYWxsZXJ5LmNzc1wiXSxcclxuICBwcm92aWRlcnM6IFtNb2RhbERpYWxvZ1NlcnZpY2VdXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEdhbGxlcnlDb21wb25lbnQge1xyXG5cclxuICAgIHByaXZhdGUgbGFuZ3VhZ2U7XHJcbiAgICBwcml2YXRlIHZlcnNpb247XHJcblxyXG4gICAgcHJpdmF0ZSBob3N0O1xyXG4gICAgcHJpdmF0ZSB1c2VybmFtZTtcclxuICAgIHByaXZhdGUgcGFzc3dvcmQ7XHJcbiAgICBwcml2YXRlIHJvb3RkaXI7XHJcbiAgICBwcml2YXRlIGhlYWRlcnM7XHJcblxyXG4gICAgLypcclxuICAgIHByaXZhdGUgaW1hZ2VzID0gbmV3IE9ic2VydmFibGVBcnJheTxPYnNlcnZhYmxlQXJyYXk8R2FsbGVyeUl0ZW0+PigpO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50ID0gbmV3IE9ic2VydmFibGVBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgIHByaXZhdGUgaGlzdG9yeSA9IG5ldyBBcnJheSgpO1xyXG4gICAgKi9cclxuXHJcbiAgICAvL3ByaXZhdGUgbm9kZWlkO1xyXG4gICAgLy9wcml2YXRlIHBhdGg7XHJcbiAgICAvL3ByaXZhdGUgdGl0bGU7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50ID0gbmV3IE9ic2VydmFibGVBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgIHByaXZhdGUgcHJvZ3Jlc3NOdW0gPSAwO1xyXG4gICAgcHJpdmF0ZSBwcm9ncmVzc1RvdCA9IDA7XHJcbiAgICBwcml2YXRlIHByb2dyZXNzVmFsID0gMDtcclxuICAgIHByaXZhdGUgZm9vdGVyID0gXCJcIjtcclxuICAgIHByaXZhdGUgbG9hZGVyID0gbmV3IExvYWRlcigpO1xyXG4gICAgcHJpdmF0ZSBpbWFnZVNjYW5uZXI7XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgIHByaXZhdGUgcGFnZTogUGFnZSxcclxuXHQgICAgcHJpdmF0ZSB1dGlsOiBVdGlsLFxyXG4gICAgICBwcml2YXRlIGZvbnRpY29uOiBUTlNGb250SWNvblNlcnZpY2UsXHJcbiAgICAgIHByaXZhdGUgbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UsIFxyXG4gICAgICBwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxyXG4gICAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcclxuICAgICAgcHJpdmF0ZSBjYWNoZTogR2FsbGVyeUNhY2hlXHJcbiAgICApICB7XHJcblxyXG4gICAgICBhcHB2ZXJzaW9uLmdldFZlcnNpb25OYW1lKCkudGhlbigodjogc3RyaW5nKT0+IHtcclxuICAgICAgICAgIHRoaXMudmVyc2lvbiA9IFwiVmVyc2lvbiBcIiArIHY7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5sYW5ndWFnZSA9IFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcoXCJlblwiKTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUudXNlKFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZS5zcGxpdChcIi1cIilbMF0pLnN1YnNjcmliZSgoKT0+IHtcclxuICAgICAgICB0aGlzLmhvc3QgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0XCIpO1xyXG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VybmFtZVwiKTtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwicGFzc3dvcmRcIik7XHJcbiAgICAgICAgdGhpcy5yb290ZGlyID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwicm9vdGRpclwiKTsgIFxyXG4gICAgICAgIHRoaXMucm9vdGRpciA9ICh0aGlzLnJvb3RkaXI9PW51bGwpPyBcIlwiOnRoaXMucm9vdGRpcjtcclxuICAgICAgICB0aGlzLmhlYWRlcnMgPSB7IFxyXG4gICAgICAgICAgXCJPQ1MtQVBJUkVRVUVTVFwiOiBcInRydWVcIixcclxuICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJhc2ljIFwiK0Jhc2U2NC5lbmNvZGUodGhpcy51c2VybmFtZSsnOicrdGhpcy5wYXNzd29yZClcclxuICAgICAgICB9ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG4gICAgICAgIHRoaXMuaG9tZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsZWFyQ3VycmVudCgpIHtcclxuICAgICAgd2hpbGUodGhpcy5jdXJyZW50Lmxlbmd0aD4wKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50LnBvcCgpOyAgIFxyXG4gICAgICB9XHJcbiAgICB9ICBcclxuXHJcbiAgICBwcml2YXRlIGhvbWUoKSB7XHJcbiAgICAgIHRoaXMuY2FjaGUuaGlzdG9yeSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoID0gdGhpcy5yb290ZGlyOyBcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkID0gXCIvXCI7XHJcbiAgICAgIHRoaXMubG9hZEdhbGxlcnkoe1xyXG4gICAgICAgIHBhdGg6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGgsIFxyXG4gICAgICAgIG5vZGVpZDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmFjaygpIHtcclxuICAgICAgaWYodGhpcy5jYWNoZS5oaXN0b3J5Lmxlbmd0aD4xKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzLmNhY2hlLmhpc3RvcnkucG9wKCk7XHJcbiAgICAgICAgbGV0IGJhY2sgPSB0aGlzLmNhY2hlLmhpc3RvcnkucG9wKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkR2FsbGVyeShiYWNrKTsgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXhpdD9cIiksXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZXhpdD9cIiksXHJcbiAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIlllc1wiKSxcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIk5vXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIkJhY2tcIiwgXCJjb25maXJtIGV4aXQ/XCIpOyBcclxuICAgICAgICBjb25maXJtKG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiQmFja1wiLCByZXN1bHQpOyAgICAgICAgICBcclxuICAgICAgICAgICAgaWYocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlsLmV4aXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4aXQoKSB7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcImhvc3RcIiwgXCJcIik7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInVzZXJuYW1lXCIsIFwiXCIpO1xyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJwYXNzd29yZFwiLCBcIlwiKTtcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwicm9vdGRpclwiLCBcIlwiKTsgICAgICAgIFxyXG4gICAgICB0aGlzLnV0aWwubmF2aWdhdGUoXCJzZXR0aW5nc1wiKTtcclxuICAgIH1cclxuIFxyXG4gICAgcHJpdmF0ZSBsb2FkR2FsbGVyeShpdGVtKSB7XHJcbiAgICAgICBcclxuICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTG9hZGluZyBhbGJ1bXMuLi5cIikpO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwibG9hZEdhbGxlcnlcIiwgaXRlbSk7IFxyXG5cclxuICAgICAgbGV0IHBhdGggPSBpdGVtLnBhdGg7XHJcbiAgICAgIGxldCBub2RlaWQgPSBpdGVtLm5vZGVpZDtcclxuXHJcbiAgICAgIGlmKHRoaXMuY2FjaGUuaW1hZ2VzW25vZGVpZF09PW51bGwpIHtcclxuICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1tub2RlaWRdID0gbmV3IEdhbGxlcnlJdGVtKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2xlYXJDdXJyZW50KCk7XHJcblxyXG4gICAgICB0aGlzLmZvb3RlciA9IFwiXCI7XHJcblxyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQgPSBub2RlaWQ7XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGggPSBwYXRoO1xyXG4gICAgICBsZXQgcGF0aF9jaHVuayA9IHBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS50aXRsZSA9IHBhdGhfY2h1bmtbcGF0aF9jaHVuay5sZW5ndGgtMV07XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlID0gKHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlPT1cIlwiKT8gdGhpcy5ob3N0LnNwbGl0KFwiLy9cIilbMV0gOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS50aXRsZTtcclxuXHJcbiAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAwO1xyXG5cclxuICAgICAgLy8gc3RyaW5nIHNhbml0aXplXHJcbiAgICAgIGxldCBwYXRoc2FuID0gdGhpcy51dGlsLnJlcGxhY2VBbGwocGF0aCwgXCImXCIsIFwiJTI2XCIpOyAgICAgIFxyXG4gICAgICBsZXQgdXJsID0gdGhpcy5ob3N0K1wiL2luZGV4LnBocC9hcHBzL2dhbGxlcnkvYXBpL2ZpbGVzL2xpc3Q/bG9jYXRpb249XCIrcGF0aHNhbitcIiZtZWRpYXR5cGVzPWltYWdlL2pwZWc7aW1hZ2UvZ2lmO2ltYWdlL3BuZyZmZWF0dXJlcz0mZXRhZ1wiO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiR0VUXCIsIHVybCk7XHJcblxyXG4gICAgICAvLyB0cnkgZnJvbSBjYWNoZSBmaXJzdFxyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiR2V0IEFsYnVtIENhY2hlXCIsIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0pO1xyXG4gICAgICBpZih0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmxvYWRlZCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJDYWNoZSBGb3VuZCFcIiwgXCJSZXRyaWV2aW5nIGZyb20gY2FjaGVcIik7XHJcbiAgICAgICAgZm9yKGxldCBhIGluIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMpIHtcclxuICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtc1thXTtcclxuICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJDYWNoZSBhbGJ1bSBhZGRlZFwiLCBpdGVtKTtcclxuICAgICAgICAgIHRoaXMuY3VycmVudC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUZvb3Rlcih0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLnRvdEFsYnVtcywgMCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmRhdGE7XHJcblxyXG4gICAgICAgIC8vIG90aGVyd2lzZSB0b28gZmFzdCA6KVxyXG4gICAgICAgIHRpbWVyLnNldFRpbWVvdXQoKCk9PiB7IFxyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpOyBcclxuICAgICAgICAgIHRoaXMuc2NhbkltYWdlcyhkYXRhLmZpbGVzLCBub2RlaWQpO1xyXG4gICAgICAgIH0sIDgwMCk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiQ2FjaGUgTm90IEZvdW5kIDooXCIsIFwiUmV0cmlldmluZyBmcm9tIGNsb3VkLi4uXCIpO1xyXG4gICAgICBcclxuICAgICAgICBIdHRwLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnNcclxuICAgICAgICB9KS50aGVuKChyZXNwb25zZTphbnkpPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGRhdGEgPSByZXNwb25zZS5jb250ZW50LnRvSlNPTigpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgbG9hZGluZy4gUGxlYXNlIHJldHJ5XCIpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yXCIsIGUpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoZGF0YT09bnVsbCkge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3JcIiwgXCJEYXRhIG51bGxcIik7XHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybjsgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcInJlc3BvbnNlIHRvIFwiLCBwYXRoK1wiKFwiK25vZGVpZCtcIiksIGN1cnJlbnQgYWxidW06XCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsYnVtcyA9IGRhdGEuYWxidW1zOyAgXHJcbiAgICAgICAgICAgIC8vIGVycm9yIGxvYWRpbmdcclxuICAgICAgICAgICAgaWYoYWxidW1zPT1udWxsKSB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSBleGl0IGFuZCByZWNvbmZpZ3VyZVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0b3RBbGJ1bXMgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzVG90ID0gYWxidW1zLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc051bSA9IDA7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiBpbiBhbGJ1bXMpIHtcclxuICAgICAgICAgICAgICBpZihhbGJ1bXNbal0uc2l6ZSE9MCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFsYnVtT2JqID0gbmV3IEdhbGxlcnlJdGVtKCk7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5wYXRoID0gYWxidW1zW2pdLnBhdGg7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGF0aF9jaHVuayA9IGFsYnVtT2JqLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRfY2h1bmsgPSB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLnRpdGxlID0gcGF0aF9jaHVua1twYXRoX2NodW5rLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLmlzQWxidW0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmouc3JjID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLm5vZGVpZCA9IGFsYnVtc1tqXS5ub2RlaWQ7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5pdGVtcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihhbGJ1bU9iai5wYXRoPT1kYXRhLmFsYnVtcGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAvLyBleGNsdWRlcyBjdXJyZW50IGFsYnVtXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYocGF0aF9jaHVuay5sZW5ndGg+Y3VycmVudF9jaHVuay5sZW5ndGgrMSkge1xyXG4gICAgICAgICAgICAgICAgICAvLyBleGNsdWRlcyBtb3JlIGxldmVscyBhbGJ1bXNcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC5wdXNoKGFsYnVtT2JqKTtcclxuICAgICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcz09bnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMgPSBuZXcgQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcy5wdXNoKGFsYnVtT2JqKTtcclxuICAgICAgICAgICAgICAgICAgdG90QWxidW1zKys7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJBbGJ1bSBhZGRlZCB0byBcIitub2RlaWQrXCI6XCIsIGFsYnVtT2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc051bSsrO1xyXG4gICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAodGhpcy5wcm9ncmVzc051bSoxMDApL3RoaXMucHJvZ3Jlc3NUb3Q7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAxMDA7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS50b3RBbGJ1bXMgPSB0b3RBbGJ1bXM7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJTZXQgQWxidW0gQ2FjaGVcIiwgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZvb3Rlcih0b3RBbGJ1bXMsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbkltYWdlcyhkYXRhLmZpbGVzLCBub2RlaWQpO1xyXG4gXHJcbiAgICAgICAgICB9LCAoZSk9PiB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvclwiLCBlKTtcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfSk7IFxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNhY2hlLmhpc3RvcnkucHVzaCh7cGF0aDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCwgbm9kZWlkOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWR9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzY2FuSW1hZ2VzKGZpbGVzLCBub2RlaWQpIHtcclxuICAgICAgLy8gY2hlY2tzIGZvciBhdmFpbGFibGUgaW1hZ2VzXHJcbiAgICAgIGxldCB0b1Nob3dMb2FkZXIgPSBmYWxzZTtcclxuICAgICAgbGV0IHRvdEZpbGVzID0gMDtcclxuICAgICAgbGV0IHRvdEFsYnVtcyA9IHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0udG90QWxidW1zO1xyXG5cclxuICAgICAgZm9yKGxldCBpIGluIGZpbGVzKSB7XHJcbiAgICAgICAgbGV0IGZpbGVwYXRoID0gXCJcIjtcclxuICAgICAgICBsZXQgZmlsZXBhdGhfY2h1bmsgPSBmaWxlc1tpXS5wYXRoLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICBmb3IobGV0IGM9MDsgYzxmaWxlcGF0aF9jaHVuay5sZW5ndGgtMTsgYysrKSB7XHJcbiAgICAgICAgICBmaWxlcGF0aCArPSBmaWxlcGF0aF9jaHVua1tjXSArIFwiL1wiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGZpbGVwYXRoPT10aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoK1wiL1wiKSB7XHJcbiAgICAgICAgICB0b3RGaWxlcysrO1xyXG4gICAgICAgICAgdG9TaG93TG9hZGVyID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKHRvU2hvd0xvYWRlcikge1xyXG4gICAgICAgIHRoaXMubG9hZGVyLnNob3dMb2FkZXIodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkxvYWRpbmcgaW1hZ2VzLi4uXCIpKTtcclxuICAgICAgICB0aGlzLnByb2dyZXNzTnVtID0gMDtcclxuICAgICAgICB0aGlzLnByb2dyZXNzVG90ID0gdG90RmlsZXM7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlRm9vdGVyKHRvdEFsYnVtcywgdG90RmlsZXMpO1xyXG4gICAgICB9IFxyXG5cclxuICAgICAgZm9yKGxldCBpIGluIGZpbGVzKSB7IFxyXG4gICAgICAgIHRoaXMuaW1hZ2VTY2FubmVyID0gdGltZXIuc2V0VGltZW91dChcclxuICAgICAgICAgICgpPT4geyB0aGlzLmxvYWRJbWFnZXMobm9kZWlkLCBmaWxlc1tmaWxlcy5sZW5ndGgtMS0oK2kpXSkgfSwgXHJcbiAgICAgICAgICAzMDAqKCtpKSk7XHJcbiAgICAgIH0gICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2FkSW1hZ2VzKGFsYnVtaWQsIGl0ZW0pIHtcclxuICAgICAgaWYoYWxidW1pZD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkKSB7IFxyXG4gICAgICAgIGxldCBmaWxlcGF0aCA9IFwiXCI7XHJcbiAgICAgICAgbGV0IGZpbGVwYXRoX2NodW5rID0gaXRlbS5wYXRoLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICBmb3IobGV0IGM9MDsgYzxmaWxlcGF0aF9jaHVuay5sZW5ndGgtMTsgYysrKSB7XHJcbiAgICAgICAgICBmaWxlcGF0aCArPSBmaWxlcGF0aF9jaHVua1tjXSArIFwiL1wiXHJcbiAgICAgICAgfVxyXG4gXHJcbiAgICAgICAgaWYoZmlsZXBhdGg9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGgrXCIvXCIpIHtcclxuICAgICAgICAgIGxldCBpbWd1cmxyb290ID0gdGhpcy5ob3N0K1wiL2luZGV4LnBocC9hcHBzL2dhbGxlcnkvYXBpL3ByZXZpZXcvXCIgKyBpdGVtLm5vZGVpZDtcclxuICAgICAgICBcclxuICAgICAgICAgIEh0dHAucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgdXJsOiBpbWd1cmxyb290ICsgXCIvMTUwLzE1MFwiLFxyXG4gICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnNcclxuICAgICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlOmFueSk9PiB7XHJcblxyXG4gICAgICAgICAgICBpZihhbGJ1bWlkPT10aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQpIHsgXHJcbiAgICAgICAgICAgICAgbGV0IGltZ09iaiA9IG5ldyBHYWxsZXJ5SXRlbSgpO1xyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmNvbnRlbnQudG9JbWFnZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoaW1hZ2UpPT4ge1xyXG4gICAgICAgICAgICAgICAgICBsZXQgYmFzZTY0ID0gaW1hZ2UudG9CYXNlNjRTdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgaW1nT2JqLnNyYyA9IGJhc2U2NDtcclxuICAgICAgICAgICAgICAgICAgaW1nT2JqLnRpdGxlID0gZmlsZXBhdGhfY2h1bmtbZmlsZXBhdGhfY2h1bmsubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoudXJsID0gaW1ndXJscm9vdDtcclxuICAgICAgICAgICAgICAgICAgaW1nT2JqLm10aW1lID0gaXRlbS5tdGltZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC5wdXNoKGltZ09iaik7XHJcbiAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaW1hZ2VzPT1udWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pbWFnZXMgPSBuZXcgQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pbWFnZXNbaXRlbS5ub2RlaWRdID0gaW1nT2JqO1xyXG4gICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzTnVtKys7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAodGhpcy5wcm9ncmVzc051bSoxMDApL3RoaXMucHJvZ3Jlc3NUb3Q7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJmaWxlIGFkZGVkIHRvIFwiK2FsYnVtaWQrXCI6IFwiLCBcIihcIiArIGl0ZW0ubm9kZWlkICsgXCIpIFwiICsgaXRlbS5wYXRoICsgXCIgLSBcIiArIGl0ZW0ubXRpbWUpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvL3RoaXMudXRpbC5sb2coXCJlcnJvclwiLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTsgIFxyXG5cclxuXHRcdFx0XHQvLyBoaWRlIHRoZSBsb2FkZXIgd2hlbiBmaXJzdCBpbWFnZSBpbiBkaXJlY3RvcnkgaXMgbG9hZGVkXHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSwgKGUpPT4ge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgIH0pOyAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aW1lci5jbGVhclRpbWVvdXQodGhpcy5pbWFnZVNjYW5uZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVGb290ZXIobnVtQWxidW1zLCBudW1GaWxlcykge1xyXG4gICAgICBsZXQgZm9vdGVyQWxidW0gPSAobnVtQWxidW1zPjApPyBudW1BbGJ1bXMgKyBcIiBcIiArIHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJDb2xsZWN0aW9uc1wiKSA6IFwiXCI7XHJcbiAgICAgIGxldCBmb290ZXJGaWxlcyA9IChudW1GaWxlcz4wKT8gbnVtRmlsZXMgKyBcIiBcIiArIHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJGaWxlc1wiKSA6IFwiXCI7XHJcbiAgICAgIHRoaXMuZm9vdGVyID0gXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gZm9vdGVyQWxidW07XHJcbiAgICAgIHRoaXMuZm9vdGVyICs9IChudW1BbGJ1bXM+MCAmJiBudW1GaWxlcz4wKT8gXCIgLyBcIiA6IFwiXCI7XHJcbiAgICAgIHRoaXMuZm9vdGVyICs9IGZvb3RlckZpbGVzO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwidXBkYXRlRm9vdGVyXCIsIHRoaXMuZm9vdGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSBmYWxzZTtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlBhZ2UgSW5pdFwiLCBcIkdhbGxlcnlcIik7ICAgICAgXHJcblxyXG4gICAgICBpZiAoYXBwbGljYXRpb24uYW5kcm9pZCkge1xyXG4gICAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oXHJcbiAgICAgICAgICAgIEFuZHJvaWRBcHBsaWNhdGlvbi5hY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnQsIFxyXG4gICAgICAgICAgICAoZGF0YTogQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGRhdGEuY2FuY2VsID0gdHJ1ZTsgLy8gcHJldmVudHMgZGVmYXVsdCBiYWNrIGJ1dHRvbiBiZWhhdmlvclxyXG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrKCk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgKTsgICAgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qXHJcbiAgICAgIGFwcGxpY2F0aW9uT24ocmVzdW1lRXZlbnQsIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSk9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRHYWxsZXJ5KHtwYXRoOiB0aGlzLnBhdGgsIG5vZGVpZDogdGhpcy5ub2RlaWR9KTtcclxuICAgICAgfSk7ICAgXHJcbiAgICAgICovIFxyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBvblRhcEZvbGRlcihpdGVtKSB7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJ0YXBcIiwgaXRlbSk7XHJcbiAgICAgIHRoaXMubG9hZEdhbGxlcnkoaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25UYXBJbWFnZShpdGVtKSB7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJ0YXBcIiwgaXRlbS50aXRsZSk7XHJcbiAgICAgIHRoaXMubG9hZGVyLnNob3dMb2FkZXIodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkxvYWRpbmcgaW1hZ2UuLi5cIikpOyBcclxuXHJcbiAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgY29udGV4dDoge1xyXG4gICAgICAgICAgICBsb2FkZXI6IHRoaXMubG9hZGVyLFxyXG4gICAgICAgICAgICBpdGVtOiBpdGVtXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZnVsbHNjcmVlbjogZmFsc2UsXHJcbiAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLnZjUmVmXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLm1vZGFsU2VydmljZS5zaG93TW9kYWwoSW1hZ2VNb2RhbENvbXBvbmVudCwgb3B0aW9ucylcclxuICAgICAgLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7ICAgICAgXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgXHJcblxyXG59XHJcbiJdfQ==