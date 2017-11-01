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
var Http = require("tns-core-modules/http");
var listview_1 = require("nativescript-telerik-ui-pro/listview");
var timer = require("timer");
var Settings = require("application-settings");
var Platform = require("platform");
var ng2_translate_1 = require("ng2-translate");
var application_1 = require("application");
var Base64 = require("base-64");
var application = require("application");
var application_2 = require("application");
var dialogs_1 = require("ui/dialogs");
var appversion = require("nativescript-appversion");
var email = require("nativescript-email");
var platform_1 = require("tns-core-modules/platform/platform");
var elementRegistryModule = require("nativescript-angular/element-registry");
elementRegistryModule.registerElement("CardView", function () { return require("nativescript-cardview").CardView; });
var GalleryComponent = /** @class */ (function () {
    function GalleryComponent(page, util, fonticon, translate, cache, loader) {
        var _this = this;
        this.page = page;
        this.util = util;
        this.fonticon = fonticon;
        this.translate = translate;
        this.cache = cache;
        this.loader = loader;
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
        //calc dimensions for responsive view
        var nCol1 = Math.floor(platform_1.screen.mainScreen.heightDIPs / 320) * 3;
        var nCol2 = Math.floor(platform_1.screen.mainScreen.widthDIPs / 320) * 3;
        if (nCol1 > nCol2) {
            this.nColMax = nCol1;
            this.nColMin = nCol2;
        }
        else {
            this.nColMax = nCol2;
            this.nColMin = nCol1;
        }
        this.util.log("Responsive columns: ", this.nColMax + " or " + this.nColMin);
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
            _this.cache.items = new Array();
            _this.home();
        });
    }
    GalleryComponent.prototype.onRadListLoaded = function (args) {
        this.radList = args.object;
        this.util.log("View Size: " + this.radList.getMeasuredWidth() + "x" + this.radList.getMeasuredHeight(), null);
        this.util.log("Initial screen orientation: ", platform_1.screen.mainScreen.widthDIPs + "x" + platform_1.screen.mainScreen.heightDIPs);
        if (platform_1.screen.mainScreen.widthDIPs > platform_1.screen.mainScreen.heightDIPs) {
            this.orientation = "landscape";
        }
        else {
            this.orientation = "portrait";
        }
        this.updateView();
    };
    GalleryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = false;
        this.util.log("Page Init Gallery", null);
        this.updateView();
        if (application.android) {
            application.android.on(application_2.AndroidApplication.activityBackPressedEvent, function (data) {
                data.cancel = true; // prevents default back button behavior
                _this.back();
            });
        }
        /*
        applicationOn(resumeEvent, (args: ApplicationEventData)=> {
            this.loadGallery({path: this.path, nodeid: this.nodeid});
        });
        */
        application_1.on("orientationChanged", function (e) {
            _this.orientation = e.newValue;
            _this.updateView();
        });
    };
    GalleryComponent.prototype.ngOnDestroy = function () {
        application_1.off("orientationChanged", this.updateView);
    };
    GalleryComponent.prototype.updateView = function () {
        try {
            this.util.log("Update view on orientation: ", this.orientation);
            if (this.orientation == "portrait") {
                var staggeredLayout = new listview_1.ListViewStaggeredLayout();
                staggeredLayout.spanCount = this.nColMin;
                staggeredLayout.scrollDirection = "Vertical";
                this.radList.listViewLayout = staggeredLayout;
            }
            else {
                var staggeredLayout = new listview_1.ListViewStaggeredLayout();
                staggeredLayout.spanCount = this.nColMax;
                staggeredLayout.scrollDirection = "Vertical";
                this.radList.listViewLayout = staggeredLayout;
            }
        }
        catch (e) {
            this.util.log("Error update view", e);
        }
    };
    GalleryComponent.prototype.clearCurrent = function () {
        while (this.current.length > 0) {
            this.current.pop();
        }
    };
    GalleryComponent.prototype.home = function () {
        this.util.log("home", null);
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
        if (this.util.getCurrentRoute() != "/imager") {
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
                this.util.log("Back confirm exit?", null);
                dialogs_1.confirm(options).then(function (result) {
                    _this.util.log("Back", result);
                    if (result) {
                        _this.util.exit();
                    }
                });
            }
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
        this.loader.showLoader(this.translate.instant("Loading albums…"));
        this.util.log("Load Gallery", item);
        //this.util.log("Load Gallery", null); 
        var path = item.path;
        var nodeid = item.nodeid;
        if (this.cache.items[nodeid] == null) {
            this.cache.items[nodeid] = new gallery_item_1.GalleryItem();
        }
        this.clearCurrent();
        this.footer = "";
        this.cache.currentAlbum.nodeid = nodeid;
        this.cache.currentAlbum.path = path;
        var path_chunk = path.split("/");
        this.cache.currentAlbum.title = path_chunk[path_chunk.length - 1];
        this.cache.currentAlbum.title = (this.cache.currentAlbum.title == "") ? this.host.split("//")[1] : this.cache.currentAlbum.title;
        this.progressNum = 0;
        this.progressVal = 0;
        // string sanitize
        var pathsan = this.util.replaceAll(path, "&", "%26");
        pathsan = this.util.replaceAll(pathsan, " ", "%20");
        var url = this.host + "/index.php/apps/gallery/api/files/list?location=" + pathsan + "&mediatypes=image/jpeg;image/gif;image/png;image/x-xbitmap;image/bmp&features=&etag";
        this.util.log("GET list", null);
        // try from cache first
        //this.util.log("Get Album Cache", this.cache.images[this.cache.currentAlbum.nodeid]);
        this.util.log("Get Album Cache: " + this.cache.currentAlbum.nodeid, null);
        if (this.cache.items[this.cache.currentAlbum.nodeid].isAlbum
            && this.cache.items[this.cache.currentAlbum.nodeid].loaded) {
            this.util.log("Cache Found! Retrieving from cache", null);
            for (var a in this.cache.items[this.cache.currentAlbum.nodeid].items) {
                var item_1 = this.cache.items[this.cache.currentAlbum.nodeid].items[a];
                if (item_1.isAlbum) {
                    //this.util.log("Cache album added", item); 
                    this.util.log("Cache album added: " + a, null);
                    this.current.push(item_1);
                }
            }
            // reverse order
            var cacheImagesIndex = [];
            for (var a in this.cache.items[this.cache.currentAlbum.nodeid].items) {
                cacheImagesIndex.push(a);
            }
            cacheImagesIndex.reverse();
            for (var b in cacheImagesIndex) {
                var item_2 = this.cache.items[this.cache.currentAlbum.nodeid].items[cacheImagesIndex[b]];
                if (!item_2.isAlbum) {
                    //this.util.log("Cache image added", item); 
                    this.util.log("Cache image added: " + b, null);
                    this.current.push(item_2);
                    this.progressNum++;
                }
            }
            this.updateFooter(this.cache.items[this.cache.currentAlbum.nodeid].totAlbums, this.cache.items[this.cache.currentAlbum.nodeid].totImages);
            var data_1 = this.cache.items[this.cache.currentAlbum.nodeid].data;
            // otherwise too fast :)
            timer.setTimeout(function () {
                _this.loader.hideLoader();
                _this.scanImages(data_1.files, nodeid);
            }, 800);
            this.progressVal = 100;
        }
        else {
            this.util.log("Cache Not Found :( Retrieving from cloud…", null);
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
                    _this.util.log("Error loading data", e);
                    _this.loader.hideLoader();
                    return;
                }
                if (data == null) {
                    Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                    _this.util.log("Error Data null", null);
                    _this.loader.hideLoader();
                    return;
                }
                //this.util.log("response to ", path+"("+nodeid+"), current album:" + this.cache.currentAlbum.nodeid);
                _this.util.log("Response to (" + nodeid + "), Current album:" + _this.cache.currentAlbum.nodeid, null);
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
                            if (_this.cache.items[_this.cache.currentAlbum.nodeid].items == null) {
                                _this.cache.items[_this.cache.currentAlbum.nodeid].items = new Array();
                            }
                            _this.cache.items[_this.cache.currentAlbum.nodeid].items.push(albumObj);
                            totAlbums++;
                            //this.util.log("Album added to "+nodeid+":", albumObj);
                            _this.util.log("Album added to " + nodeid, null);
                        }
                    }
                    _this.progressNum++;
                    _this.progressVal = (_this.progressNum * 100) / _this.progressTot;
                }
                _this.progressVal = 100;
                _this.cache.items[_this.cache.currentAlbum.nodeid].isAlbum = true;
                _this.cache.items[_this.cache.currentAlbum.nodeid].loaded = true;
                _this.cache.items[_this.cache.currentAlbum.nodeid].totAlbums = totAlbums;
                _this.cache.items[_this.cache.currentAlbum.nodeid].data = data;
                _this.cache.currentAlbum.totAlbums = totAlbums;
                //this.util.log("Set Album Cache", this.cache.images[this.cache.currentAlbum.nodeid]);
                _this.util.log("Set Album Cache: " + _this.cache.currentAlbum.nodeid, null);
                _this.updateFooter(totAlbums, 0);
                _this.updateView();
                _this.scanImages(data.files, nodeid);
            }, function (e) {
                Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                _this.util.log("Error Http", e);
                console.log(e);
                _this.loader.hideLoader();
                return;
            });
        }
        var historyItem = new gallery_item_1.GalleryItem();
        historyItem.isAlbum = true;
        historyItem.path = this.cache.currentAlbum.path;
        historyItem.nodeid = this.cache.currentAlbum.nodeid;
        this.cache.history.push(historyItem);
    };
    GalleryComponent.prototype.scanImages = function (files, nodeid) {
        var _this = this;
        try {
            // checks for available images
            var toShowLoader = false;
            var totFiles = 0;
            var totAlbums = this.cache.items[nodeid].totAlbums;
            this.cache.currentAlbum.items = new Array();
            for (var i in files) {
                var lastIndex = files.length - 1 - (+i);
                var filepath = "";
                var filepath_chunk = files[lastIndex].path.split("/");
                for (var c = 0; c < filepath_chunk.length - 1; c++) {
                    filepath += filepath_chunk[c] + "/";
                }
                if (filepath == this.cache.currentAlbum.path + "/") {
                    totFiles++;
                    if (this.cache.items[nodeid] == null ||
                        this.cache.items[nodeid].items == null ||
                        this.cache.items[nodeid].items[files[lastIndex].nodeid] == null ||
                        !this.cache.items[nodeid].items[files[lastIndex].nodeid].loaded) {
                        toShowLoader = true;
                    }
                    else {
                        var imgObj = this.cache.items[nodeid].items[files[lastIndex].nodeid];
                        this.cache.currentAlbum.items.push(imgObj);
                    }
                }
            }
            this.cache.items[nodeid].totImages = totFiles;
            this.cache.currentAlbum.totImages = totFiles;
            if (toShowLoader) {
                this.loader.showLoader(this.translate.instant("Loading images…"));
                //this.progressNum = 0;
                this.progressTot = totFiles;
                this.progressVal = 0;
                this.updateFooter(totAlbums, totFiles);
            }
            else {
                this.loader.hideLoader();
            }
            var _loop_1 = function (i) {
                var lastIndex = files.length - 1 - (+i);
                if (this_1.cache.items[nodeid] == null ||
                    this_1.cache.items[nodeid].items == null ||
                    this_1.cache.items[nodeid].items[files[lastIndex].nodeid] == null ||
                    !this_1.cache.items[nodeid].items[files[lastIndex].nodeid].loaded) {
                    this_1.imageScanner = timer.setTimeout(function () { _this.loadImages(nodeid, files[lastIndex]); }, 200 * (+i));
                }
            };
            var this_1 = this;
            for (var i in files) {
                _loop_1(i);
            }
        }
        catch (e) {
            this.util.log("Error scan images", e);
            Toast.makeText(this.translate.instant("Error loading. Please retry")).show();
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
                            imgObj_1.loaded = true;
                            _this.current.push(imgObj_1);
                            if (_this.cache.currentAlbum.items == null) {
                                _this.cache.currentAlbum.items = new Array();
                            }
                            _this.cache.currentAlbum.items.push(imgObj_1);
                            if (_this.cache.items[_this.cache.currentAlbum.nodeid].items == null) {
                                _this.cache.items[_this.cache.currentAlbum.nodeid].items = new Array();
                            }
                            _this.cache.items[_this.cache.currentAlbum.nodeid].items[item.nodeid] = imgObj_1;
                            _this.progressNum++;
                            _this.progressVal = (_this.progressNum * 100) / _this.progressTot;
                            //this.util.log("file added to "+albumid+": ", "(" + item.nodeid + ") " + item.path + " - " + item.mtime);
                            _this.util.log("File added to " + albumid + " (" + item.nodeid + ") - " + item.mtime, null);
                        })
                            .catch(function (error) {
                            _this.util.log("Error toImage", error);
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
    GalleryComponent.prototype.onTapFolder = function (item) {
        //this.util.log("tap", item);
        this.util.log("Tap item folder", null);
        this.loadGallery(item);
    };
    GalleryComponent.prototype.onTapImage = function (item) {
        //this.util.log("tap", item.title);
        this.util.log("Tap item image", null);
        this.cache.currentImage = item;
        this.loader.showLoader(this.translate.instant("Loading image…"));
        this.util.navigate("imager");
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
            providers: [util_1.Util]
        }),
        __metadata("design:paramtypes", [page_1.Page,
            util_1.Util,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            ng2_translate_1.TranslateService,
            gallery_cache_1.default,
            loader_1.default])
    ], GalleryComponent);
    return GalleryComponent;
}());
exports.GalleryComponent = GalleryComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxsZXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUErQjtBQUMvQixzQ0FBa0Q7QUFDbEQsMENBQXlDO0FBQ3pDLDhDQUF5QztBQUN6QywwREFBd0Q7QUFDeEQsNERBQXNEO0FBQ3RELDBDQUE0QztBQUM1Qyx1RUFBK0Q7QUFDL0QsMkVBQXlFO0FBRXpFLDRDQUE2QztBQUM3QyxpRUFBMkY7QUFDM0YsNkJBQStCO0FBQy9CLCtDQUFpRDtBQUNqRCxtQ0FBcUM7QUFDckMsK0NBQWlEO0FBQ2pELDJDQUFpTjtBQUVqTixnQ0FBbUM7QUFDbkMseUNBQTJDO0FBQzNDLDJDQUFzRjtBQUN0RixzQ0FBcUM7QUFDckMsb0RBQXNEO0FBQ3RELDBDQUE0QztBQUM1QywrREFBeUQ7QUFFekQsNkVBQStFO0FBQy9FLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLFFBQVEsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO0FBV25HO0lBaUNJLDBCQUNVLElBQVUsRUFDWCxJQUFVLEVBQ1QsUUFBNEIsRUFDNUIsU0FBMkIsRUFDM0IsS0FBbUIsRUFDbkIsTUFBYztRQU54QixpQkFxQ0M7UUFwQ1MsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNYLFNBQUksR0FBSixJQUFJLENBQU07UUFDVCxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixVQUFLLEdBQUwsS0FBSyxDQUFjO1FBQ25CLFdBQU0sR0FBTixNQUFNLENBQVE7UUF2QnhCOzs7O1VBSUU7UUFFRixpQkFBaUI7UUFDakIsZUFBZTtRQUNmLGdCQUFnQjtRQUVSLFlBQU8sR0FBRyxJQUFJLGtDQUFlLEVBQWUsQ0FBQztRQUM3QyxnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixn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USxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2hDLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2FBQzdCLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBNWdCUSxnQkFBZ0I7UUFSNUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxTQUFTO1lBQ25CLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsU0FBUyxFQUFFLENBQUMsMkJBQTJCLENBQUM7WUFDeEMsU0FBUyxFQUFFLENBQUMsV0FBSSxDQUFDO1NBQ2xCLENBQUM7eUNBcUNrQixXQUFJO1lBQ0wsV0FBSTtZQUNDLDhDQUFrQjtZQUNqQixnQ0FBZ0I7WUFDcEIsdUJBQVk7WUFDWCxnQkFBTTtPQXZDZixnQkFBZ0IsQ0ErZ0I1QjtJQUFELHVCQUFDO0NBQUEsQUEvZ0JELElBK2dCQztBQS9nQlksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXRpbCB9IGZyb20gXCIuLi8uLi9jb21tb24vdXRpbFwiO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gXCIuLi8uLi9jb21tb24vbG9hZGVyXCI7XHJcbmltcG9ydCB7IEdhbGxlcnlJdGVtIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9nYWxsZXJ5Lml0ZW1cIjtcclxuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbGxlcnkuY2FjaGVcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcbmltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZS1hcnJheVwiO1xyXG5pbXBvcnQgKiBhcyBJbWFnZVNvdXJjZU1vZHVsZSBmcm9tIFwiaW1hZ2Utc291cmNlXCI7XHJcbmltcG9ydCAqIGFzIEh0dHAgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvaHR0cFwiXHJcbmltcG9ydCB7IFJhZExpc3RWaWV3LCBMaXN0Vmlld1N0YWdnZXJlZExheW91dCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vbGlzdHZpZXdcIlxyXG5pbXBvcnQgKiBhcyB0aW1lciBmcm9tIFwidGltZXJcIjtcclxuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzIFBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgb24gYXMgYXBwbGljYXRpb25Pbiwgb2ZmIGFzIGFwcGxpY2F0aW9uT2ZmLCBsYXVuY2hFdmVudCwgc3VzcGVuZEV2ZW50LCByZXN1bWVFdmVudCwgZXhpdEV2ZW50LCBsb3dNZW1vcnlFdmVudCwgdW5jYXVnaHRFcnJvckV2ZW50LCBBcHBsaWNhdGlvbkV2ZW50RGF0YSwgc3RhcnQgYXMgYXBwbGljYXRpb25TdGFydCB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgKiBhcyB1dGY4IGZyb20gXCJ1dGY4XCI7IFxyXG5pbXBvcnQgKiBhcyAgQmFzZTY0IGZyb20gXCJiYXNlLTY0XCI7XHJcbmltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCB7IGNvbmZpcm0gfSBmcm9tIFwidWkvZGlhbG9nc1wiO1xyXG5pbXBvcnQgKiBhcyBhcHB2ZXJzaW9uIGZyb20gXCJuYXRpdmVzY3JpcHQtYXBwdmVyc2lvblwiOyBcclxuaW1wb3J0ICogYXMgZW1haWwgZnJvbSBcIm5hdGl2ZXNjcmlwdC1lbWFpbFwiO1xyXG5pbXBvcnQge3NjcmVlbn0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm0vcGxhdGZvcm1cIlxyXG5cclxuaW1wb3J0ICogYXMgZWxlbWVudFJlZ2lzdHJ5TW9kdWxlIGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xyXG5lbGVtZW50UmVnaXN0cnlNb2R1bGUucmVnaXN0ZXJFbGVtZW50KFwiQ2FyZFZpZXdcIiwgKCkgPT4gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1jYXJkdmlld1wiKS5DYXJkVmlldyk7XHJcblxyXG4gIFxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJnYWxsZXJ5XCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvZ2FsbGVyeS9nYWxsZXJ5Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcInBhZ2VzL2dhbGxlcnkvZ2FsbGVyeS5jc3NcIl0sXHJcbiAgcHJvdmlkZXJzOiBbVXRpbF1cclxufSlcclxuIFxyXG5cclxuZXhwb3J0IGNsYXNzIEdhbGxlcnlDb21wb25lbnQge1xyXG5cclxuICAgIHByaXZhdGUgbGFuZ3VhZ2U7XHJcbiAgICBwcml2YXRlIHZlcnNpb247XHJcblxyXG4gICAgcHJpdmF0ZSBob3N0O1xyXG4gICAgcHJpdmF0ZSB1c2VybmFtZTtcclxuICAgIHByaXZhdGUgcGFzc3dvcmQ7XHJcbiAgICBwcml2YXRlIHJvb3RkaXI7XHJcbiAgICBwcml2YXRlIGhlYWRlcnM7XHJcblxyXG4gICAgcHJpdmF0ZSByYWRMaXN0OiBSYWRMaXN0VmlldztcclxuICAgIHByaXZhdGUgb3JpZW50YXRpb247XHJcbiAgICBwcml2YXRlIG5Db2xNaW47XHJcbiAgICBwcml2YXRlIG5Db2xNYXg7XHJcblxyXG4gICAgLypcclxuICAgIHByaXZhdGUgaW1hZ2VzID0gbmV3IE9ic2VydmFibGVBcnJheTxPYnNlcnZhYmxlQXJyYXk8R2FsbGVyeUl0ZW0+PigpO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50ID0gbmV3IE9ic2VydmFibGVBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgIHByaXZhdGUgaGlzdG9yeSA9IG5ldyBBcnJheSgpO1xyXG4gICAgKi9cclxuXHJcbiAgICAvL3ByaXZhdGUgbm9kZWlkO1xyXG4gICAgLy9wcml2YXRlIHBhdGg7XHJcbiAgICAvL3ByaXZhdGUgdGl0bGU7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50ID0gbmV3IE9ic2VydmFibGVBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgIHByaXZhdGUgcHJvZ3Jlc3NOdW0gPSAwO1xyXG4gICAgcHJpdmF0ZSBwcm9ncmVzc1RvdCA9IDA7XHJcbiAgICBwcml2YXRlIHByb2dyZXNzVmFsID0gMDtcclxuICAgIHByaXZhdGUgZm9vdGVyID0gXCJcIjtcclxuICAgIHByaXZhdGUgaW1hZ2VTY2FubmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG5cdCAgICBwcml2YXRlIHV0aWw6IFV0aWwsXHJcbiAgICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgICAgIHByaXZhdGUgY2FjaGU6IEdhbGxlcnlDYWNoZSxcclxuICAgICAgcHJpdmF0ZSBsb2FkZXI6IExvYWRlciAgICBcclxuICAgICkgIHtcclxuXHJcbiAgICAgIC8vY2FsYyBkaW1lbnNpb25zIGZvciByZXNwb25zaXZlIHZpZXdcclxuICAgICAgbGV0IG5Db2wxID0gTWF0aC5mbG9vcihzY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRESVBzLzMyMCkqMztcclxuICAgICAgbGV0IG5Db2wyID0gTWF0aC5mbG9vcihzY3JlZW4ubWFpblNjcmVlbi53aWR0aERJUHMvMzIwKSozO1xyXG4gICAgICBpZihuQ29sMT5uQ29sMikgeyB0aGlzLm5Db2xNYXg9bkNvbDE7IHRoaXMubkNvbE1pbj1uQ29sMn1cclxuICAgICAgZWxzZSB7IHRoaXMubkNvbE1heD1uQ29sMjsgdGhpcy5uQ29sTWluPW5Db2wxfVxyXG4gICAgICBcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlJlc3BvbnNpdmUgY29sdW1uczogXCIsIHRoaXMubkNvbE1heCArIFwiIG9yIFwiICsgdGhpcy5uQ29sTWluKTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgYXBwdmVyc2lvbi5nZXRWZXJzaW9uTmFtZSgpLnRoZW4oKHY6IHN0cmluZyk9PiB7XHJcbiAgICAgICAgICB0aGlzLnZlcnNpb24gPSBcIlZlcnNpb24gXCIgKyB2O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2U7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKFwiZW5cIik7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnVzZShQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2Uuc3BsaXQoXCItXCIpWzBdKS5zdWJzY3JpYmUoKCk9PiB7XHJcbiAgICAgICAgdGhpcy5ob3N0ID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaG9zdFwiKTtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcm5hbWVcIik7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IFNldHRpbmdzLmdldFN0cmluZyhcInBhc3N3b3JkXCIpO1xyXG4gICAgICAgIHRoaXMucm9vdGRpciA9IFNldHRpbmdzLmdldFN0cmluZyhcInJvb3RkaXJcIik7ICBcclxuICAgICAgICB0aGlzLnJvb3RkaXIgPSAodGhpcy5yb290ZGlyPT1udWxsKT8gXCJcIjp0aGlzLnJvb3RkaXI7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJzID0geyBcclxuICAgICAgICAgIFwiT0NTLUFQSVJFUVVFU1RcIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCYXNpYyBcIitCYXNlNjQuZW5jb2RlKHRoaXMudXNlcm5hbWUrJzonK3RoaXMucGFzc3dvcmQpXHJcbiAgICAgICAgfSAgICBcclxuXHJcbiAgICAgICAgdGhpcy5jYWNoZS5pdGVtcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICB0aGlzLmhvbWUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SYWRMaXN0TG9hZGVkKGFyZ3MpIHtcclxuICAgICAgdGhpcy5yYWRMaXN0ID0gPFJhZExpc3RWaWV3PmFyZ3Mub2JqZWN0OyAgXHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJWaWV3IFNpemU6IFwiICsgdGhpcy5yYWRMaXN0LmdldE1lYXN1cmVkV2lkdGgoKSArIFwieFwiICsgdGhpcy5yYWRMaXN0LmdldE1lYXN1cmVkSGVpZ2h0KCksIG51bGwpO1xyXG5cclxuICAgICAgdGhpcy51dGlsLmxvZyhcIkluaXRpYWwgc2NyZWVuIG9yaWVudGF0aW9uOiBcIiwgc2NyZWVuLm1haW5TY3JlZW4ud2lkdGhESVBzICsgXCJ4XCIgKyBzY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRESVBzKTtcclxuICAgICAgaWYoc2NyZWVuLm1haW5TY3JlZW4ud2lkdGhESVBzPnNjcmVlbi5tYWluU2NyZWVuLmhlaWdodERJUHMpIHtcclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gXCJsYW5kc2NhcGVcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gXCJwb3J0cmFpdFwiO1xyXG4gICAgICB9ICBcclxuICAgICAgdGhpcy51cGRhdGVWaWV3KCk7ICAgXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSBmYWxzZTtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlBhZ2UgSW5pdCBHYWxsZXJ5XCIsIG51bGwpOyBcclxuICAgICAgdGhpcy51cGRhdGVWaWV3KCk7ICAgICAgXHJcblxyXG4gICAgICBpZiAoYXBwbGljYXRpb24uYW5kcm9pZCkge1xyXG4gICAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oXHJcbiAgICAgICAgICAgIEFuZHJvaWRBcHBsaWNhdGlvbi5hY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnQsIFxyXG4gICAgICAgICAgICAoZGF0YTogQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGRhdGEuY2FuY2VsID0gdHJ1ZTsgLy8gcHJldmVudHMgZGVmYXVsdCBiYWNrIGJ1dHRvbiBiZWhhdmlvclxyXG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrKCk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgKTsgICAgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qXHJcbiAgICAgIGFwcGxpY2F0aW9uT24ocmVzdW1lRXZlbnQsIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSk9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRHYWxsZXJ5KHtwYXRoOiB0aGlzLnBhdGgsIG5vZGVpZDogdGhpcy5ub2RlaWR9KTtcclxuICAgICAgfSk7ICAgXHJcbiAgICAgICovIFxyXG5cclxuICAgICAgYXBwbGljYXRpb25PbihcIm9yaWVudGF0aW9uQ2hhbmdlZFwiLCAoZSk9PnsgXHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IGUubmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7IFxyXG4gICAgICB9KTsgICBcclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgYXBwbGljYXRpb25PZmYoXCJvcmllbnRhdGlvbkNoYW5nZWRcIiwgdGhpcy51cGRhdGVWaWV3KTtcclxuICAgIH0gICAgXHJcbiBcclxuICAgIHVwZGF0ZVZpZXcoKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIlVwZGF0ZSB2aWV3IG9uIG9yaWVudGF0aW9uOiBcIiwgdGhpcy5vcmllbnRhdGlvbik7XHJcbiAgICAgICAgaWYodGhpcy5vcmllbnRhdGlvbiA9PSBcInBvcnRyYWl0XCIpIHtcclxuICAgICAgICAgICAgbGV0IHN0YWdnZXJlZExheW91dCA9IG5ldyBMaXN0Vmlld1N0YWdnZXJlZExheW91dCgpO1xyXG4gICAgICAgICAgICBzdGFnZ2VyZWRMYXlvdXQuc3BhbkNvdW50ID0gdGhpcy5uQ29sTWluO1xyXG4gICAgICAgICAgICBzdGFnZ2VyZWRMYXlvdXQuc2Nyb2xsRGlyZWN0aW9uID0gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgICAgICB0aGlzLnJhZExpc3QubGlzdFZpZXdMYXlvdXQgPSBzdGFnZ2VyZWRMYXlvdXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHN0YWdnZXJlZExheW91dCA9IG5ldyBMaXN0Vmlld1N0YWdnZXJlZExheW91dCgpO1xyXG4gICAgICAgICAgICBzdGFnZ2VyZWRMYXlvdXQuc3BhbkNvdW50ID0gdGhpcy5uQ29sTWF4O1xyXG4gICAgICAgICAgICBzdGFnZ2VyZWRMYXlvdXQuc2Nyb2xsRGlyZWN0aW9uID0gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgICAgICB0aGlzLnJhZExpc3QubGlzdFZpZXdMYXlvdXQgPSBzdGFnZ2VyZWRMYXlvdXQ7XHJcbiAgICAgICAgfSAgICAgIFxyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3IgdXBkYXRlIHZpZXdcIiwgZSk7XHJcbiAgICAgIH0gICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsZWFyQ3VycmVudCgpIHtcclxuICAgICAgd2hpbGUodGhpcy5jdXJyZW50Lmxlbmd0aD4wKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50LnBvcCgpOyAgIFxyXG4gICAgICB9XHJcbiAgICB9ICBcclxuXHJcbiAgICBwcml2YXRlIGhvbWUoKSB7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJob21lXCIsIG51bGwpO1xyXG4gICAgICB0aGlzLmNhY2hlLmhpc3RvcnkgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCA9IHRoaXMucm9vdGRpcjsgXHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCA9IFwiL1wiO1xyXG4gICAgICB0aGlzLmxvYWRHYWxsZXJ5KHtcclxuICAgICAgICBwYXRoOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoLCBcclxuICAgICAgICBub2RlaWQ6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJhY2soKSB7XHJcbiAgICAgIGlmKHRoaXMudXRpbC5nZXRDdXJyZW50Um91dGUoKSE9XCIvaW1hZ2VyXCIpIHtcclxuICAgICAgICBpZih0aGlzLmNhY2hlLmhpc3RvcnkubGVuZ3RoPjEpIHtcclxuICAgICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5jYWNoZS5oaXN0b3J5LnBvcCgpO1xyXG4gICAgICAgICAgbGV0IGJhY2sgPSB0aGlzLmNhY2hlLmhpc3RvcnkucG9wKCk7XHJcbiAgICAgICAgICB0aGlzLmxvYWRHYWxsZXJ5KGJhY2spOyBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFeGl0P1wiKSxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGV4aXQ/XCIpLFxyXG4gICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIlllc1wiKSxcclxuICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTm9cIilcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkJhY2sgY29uZmlybSBleGl0P1wiLCBudWxsKTsgXHJcbiAgICAgICAgICBjb25maXJtKG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJCYWNrXCIsIHJlc3VsdCk7ICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51dGlsLmV4aXQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXhpdCgpIHtcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwiaG9zdFwiLCBcIlwiKTtcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwidXNlcm5hbWVcIiwgXCJcIik7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInBhc3N3b3JkXCIsIFwiXCIpO1xyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJyb290ZGlyXCIsIFwiXCIpOyAgICAgICAgXHJcbiAgICAgIHRoaXMudXRpbC5uYXZpZ2F0ZShcInNldHRpbmdzXCIpO1xyXG4gICAgfVxyXG4gXHJcbiAgICBwcml2YXRlIGxvYWRHYWxsZXJ5KGl0ZW0pIHtcclxuICAgICAgIFxyXG4gICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJMb2FkaW5nIGFsYnVtc+KAplwiKSk7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJMb2FkIEdhbGxlcnlcIiwgaXRlbSk7IFxyXG4gICAgICAvL3RoaXMudXRpbC5sb2coXCJMb2FkIEdhbGxlcnlcIiwgbnVsbCk7IFxyXG5cclxuICAgICAgbGV0IHBhdGggPSBpdGVtLnBhdGg7XHJcbiAgICAgIGxldCBub2RlaWQgPSBpdGVtLm5vZGVpZDtcclxuXHJcbiAgICAgIGlmKHRoaXMuY2FjaGUuaXRlbXNbbm9kZWlkXT09bnVsbCkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUuaXRlbXNbbm9kZWlkXSA9IG5ldyBHYWxsZXJ5SXRlbSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNsZWFyQ3VycmVudCgpO1xyXG5cclxuICAgICAgdGhpcy5mb290ZXIgPSBcIlwiO1xyXG5cclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkID0gbm9kZWlkO1xyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoID0gcGF0aDtcclxuICAgICAgbGV0IHBhdGhfY2h1bmsgPSBwYXRoLnNwbGl0KFwiL1wiKTtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGUgPSBwYXRoX2NodW5rW3BhdGhfY2h1bmsubGVuZ3RoLTFdO1xyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS50aXRsZSA9ICh0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS50aXRsZT09XCJcIik/IHRoaXMuaG9zdC5zcGxpdChcIi8vXCIpWzFdIDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGU7XHJcblxyXG4gICAgICB0aGlzLnByb2dyZXNzTnVtID0gMDtcclxuICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9IDA7XHJcblxyXG4gICAgICAvLyBzdHJpbmcgc2FuaXRpemVcclxuICAgICAgbGV0IHBhdGhzYW4gPSB0aGlzLnV0aWwucmVwbGFjZUFsbChwYXRoLCBcIiZcIiwgXCIlMjZcIik7IFxyXG4gICAgICBwYXRoc2FuID0gdGhpcy51dGlsLnJlcGxhY2VBbGwocGF0aHNhbiwgXCIgXCIsIFwiJTIwXCIpOyAgICAgICBcclxuICAgICAgbGV0IHVybCA9IHRoaXMuaG9zdCtcIi9pbmRleC5waHAvYXBwcy9nYWxsZXJ5L2FwaS9maWxlcy9saXN0P2xvY2F0aW9uPVwiK3BhdGhzYW4rXCImbWVkaWF0eXBlcz1pbWFnZS9qcGVnO2ltYWdlL2dpZjtpbWFnZS9wbmc7aW1hZ2UveC14Yml0bWFwO2ltYWdlL2JtcCZmZWF0dXJlcz0mZXRhZ1wiO1xyXG5cclxuICAgICAgdGhpcy51dGlsLmxvZyhcIkdFVCBsaXN0XCIsIG51bGwpO1xyXG5cclxuICAgICAgLy8gdHJ5IGZyb20gY2FjaGUgZmlyc3RcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwiR2V0IEFsYnVtIENhY2hlXCIsIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0pO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiR2V0IEFsYnVtIENhY2hlOiBcIiArIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCwgbnVsbCk7XHJcbiAgICAgIGlmKHRoaXMuY2FjaGUuaXRlbXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pc0FsYnVtXHJcbiAgICAgICAgJiYgdGhpcy5jYWNoZS5pdGVtc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmxvYWRlZCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJDYWNoZSBGb3VuZCEgUmV0cmlldmluZyBmcm9tIGNhY2hlXCIsIG51bGwpO1xyXG4gICAgICAgIGZvcihsZXQgYSBpbiB0aGlzLmNhY2hlLml0ZW1zW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMpIHtcclxuICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5jYWNoZS5pdGVtc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zW2FdO1xyXG4gICAgICAgICAgaWYoaXRlbS5pc0FsYnVtKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcIkNhY2hlIGFsYnVtIGFkZGVkXCIsIGl0ZW0pOyBcclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkNhY2hlIGFsYnVtIGFkZGVkOiBcIiArIGEsIG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQucHVzaChpdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldmVyc2Ugb3JkZXJcclxuICAgICAgICBsZXQgY2FjaGVJbWFnZXNJbmRleCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgYSBpbiB0aGlzLmNhY2hlLml0ZW1zW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMpIHtcclxuICAgICAgICAgIGNhY2hlSW1hZ2VzSW5kZXgucHVzaChhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FjaGVJbWFnZXNJbmRleC5yZXZlcnNlKClcclxuICAgICAgICBmb3IobGV0IGIgaW4gY2FjaGVJbWFnZXNJbmRleCkge1xyXG4gICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmNhY2hlLml0ZW1zW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXNbY2FjaGVJbWFnZXNJbmRleFtiXV07XHJcbiAgICAgICAgICBpZighaXRlbS5pc0FsYnVtKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcIkNhY2hlIGltYWdlIGFkZGVkXCIsIGl0ZW0pOyBcclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkNhY2hlIGltYWdlIGFkZGVkOiBcIiArIGIsIG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc051bSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgICAgICBcclxuICAgICAgICB0aGlzLnVwZGF0ZUZvb3Rlcih0aGlzLmNhY2hlLml0ZW1zW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0udG90QWxidW1zLCB0aGlzLmNhY2hlLml0ZW1zW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0udG90SW1hZ2VzKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuY2FjaGUuaXRlbXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5kYXRhO1xyXG5cclxuICAgICAgICAvLyBvdGhlcndpc2UgdG9vIGZhc3QgOilcclxuICAgICAgICB0aW1lci5zZXRUaW1lb3V0KCgpPT4geyBcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTsgXHJcbiAgICAgICAgICB0aGlzLnNjYW5JbWFnZXMoZGF0YS5maWxlcywgbm9kZWlkKTtcclxuICAgICAgICB9LCA4MDApOyBcclxuXHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9IDEwMDtcclxuIFxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiQ2FjaGUgTm90IEZvdW5kIDooIFJldHJpZXZpbmcgZnJvbSBjbG91ZOKAplwiLCBudWxsKTtcclxuICAgICAgXHJcbiAgICAgICAgSHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzXHJcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBkYXRhID0gcmVzcG9uc2UuY29udGVudC50b0pTT04oKTtcclxuICAgICAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvciBsb2FkaW5nIGRhdGFcIiwgZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybjsgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihkYXRhPT1udWxsKSB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvciBEYXRhIG51bGxcIiwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybjsgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy90aGlzLnV0aWwubG9nKFwicmVzcG9uc2UgdG8gXCIsIHBhdGgrXCIoXCIrbm9kZWlkK1wiKSwgY3VycmVudCBhbGJ1bTpcIiArIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCk7XHJcbiAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJSZXNwb25zZSB0byAoXCIrbm9kZWlkK1wiKSwgQ3VycmVudCBhbGJ1bTpcIiArIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCwgbnVsbCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxidW1zID0gZGF0YS5hbGJ1bXM7ICBcclxuICAgICAgICAgICAgLy8gZXJyb3IgbG9hZGluZ1xyXG4gICAgICAgICAgICBpZihhbGJ1bXM9PW51bGwpIHtcclxuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgbG9hZGluZy4gUGxlYXNlIGV4aXQgYW5kIHJlY29uZmlndXJlXCIpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRvdEFsYnVtcyA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NUb3QgPSBhbGJ1bXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzTnVtID0gMDtcclxuICAgICAgICAgICAgZm9yKGxldCBqIGluIGFsYnVtcykge1xyXG4gICAgICAgICAgICAgIGlmKGFsYnVtc1tqXS5zaXplIT0wKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWxidW1PYmogPSBuZXcgR2FsbGVyeUl0ZW0oKTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLnBhdGggPSBhbGJ1bXNbal0ucGF0aDtcclxuICAgICAgICAgICAgICAgIGxldCBwYXRoX2NodW5rID0gYWxidW1PYmoucGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudF9jaHVuayA9IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmoudGl0bGUgPSBwYXRoX2NodW5rW3BhdGhfY2h1bmsubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmouaXNBbGJ1bSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5zcmMgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmoubm9kZWlkID0gYWxidW1zW2pdLm5vZGVpZDtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLml0ZW1zID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGFsYnVtT2JqLnBhdGg9PWRhdGEuYWxidW1wYXRoKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGV4Y2x1ZGVzIGN1cnJlbnQgYWxidW1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihwYXRoX2NodW5rLmxlbmd0aD5jdXJyZW50X2NodW5rLmxlbmd0aCsxKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGV4Y2x1ZGVzIG1vcmUgbGV2ZWxzIGFsYnVtc1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goYWxidW1PYmopO1xyXG4gICAgICAgICAgICAgICAgICBpZih0aGlzLmNhY2hlLml0ZW1zW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXM9PW51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLml0ZW1zW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMgPSBuZXcgQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pdGVtc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zLnB1c2goYWxidW1PYmopO1xyXG4gICAgICAgICAgICAgICAgICB0b3RBbGJ1bXMrKztcclxuICAgICAgICAgICAgICAgICAgLy90aGlzLnV0aWwubG9nKFwiQWxidW0gYWRkZWQgdG8gXCIrbm9kZWlkK1wiOlwiLCBhbGJ1bU9iaik7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJBbGJ1bSBhZGRlZCB0byBcIitub2RlaWQsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzTnVtKys7XHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9ICh0aGlzLnByb2dyZXNzTnVtKjEwMCkvdGhpcy5wcm9ncmVzc1RvdDtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9IDEwMDtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pdGVtc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmlzQWxidW0gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlLml0ZW1zW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pdGVtc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLnRvdEFsYnVtcyA9IHRvdEFsYnVtcztcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pdGVtc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS50b3RBbGJ1bXMgPSB0b3RBbGJ1bXM7XHJcbiAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcIlNldCBBbGJ1bSBDYWNoZVwiLCB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdKTtcclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIlNldCBBbGJ1bSBDYWNoZTogXCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVGb290ZXIodG90QWxidW1zLCAwKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7IFxyXG4gICAgICAgICAgICB0aGlzLnNjYW5JbWFnZXMoZGF0YS5maWxlcywgbm9kZWlkKTtcclxuXHJcbiAgICAgICAgICB9LCAoZSk9PiB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvciBIdHRwXCIsIGUpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9KTsgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBoaXN0b3J5SXRlbSA9IG5ldyBHYWxsZXJ5SXRlbSgpO1xyXG4gICAgICBoaXN0b3J5SXRlbS5pc0FsYnVtID0gdHJ1ZTtcclxuICAgICAgaGlzdG9yeUl0ZW0ucGF0aCA9IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGg7XHJcbiAgICAgIGhpc3RvcnlJdGVtLm5vZGVpZCA9IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZDtcclxuICAgICAgdGhpcy5jYWNoZS5oaXN0b3J5LnB1c2goaGlzdG9yeUl0ZW0pOyBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNjYW5JbWFnZXMoZmlsZXMsIG5vZGVpZCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIC8vIGNoZWNrcyBmb3IgYXZhaWxhYmxlIGltYWdlc1xyXG4gICAgICAgIGxldCB0b1Nob3dMb2FkZXIgPSBmYWxzZTtcclxuICAgICAgICBsZXQgdG90RmlsZXMgPSAwO1xyXG4gICAgICAgIGxldCB0b3RBbGJ1bXMgPSB0aGlzLmNhY2hlLml0ZW1zW25vZGVpZF0udG90QWxidW1zO1xyXG5cclxuICAgICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5pdGVtcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpIGluIGZpbGVzKSB7XHJcbiAgICAgICAgICBsZXQgbGFzdEluZGV4ID0gZmlsZXMubGVuZ3RoLTEtKCtpKTtcclxuXHJcbiAgICAgICAgICBsZXQgZmlsZXBhdGggPSBcIlwiO1xyXG4gICAgICAgICAgbGV0IGZpbGVwYXRoX2NodW5rID0gZmlsZXNbbGFzdEluZGV4XS5wYXRoLnNwbGl0KFwiL1wiKTtcclxuXHJcbiAgICAgICAgICBmb3IobGV0IGM9MDsgYzxmaWxlcGF0aF9jaHVuay5sZW5ndGgtMTsgYysrKSB7XHJcbiAgICAgICAgICAgIGZpbGVwYXRoICs9IGZpbGVwYXRoX2NodW5rW2NdICsgXCIvXCJcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZihmaWxlcGF0aD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCtcIi9cIikge1xyXG4gICAgICAgICAgICB0b3RGaWxlcysrO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pdGVtc1tub2RlaWRdPT1udWxsIHx8XHJcbiAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pdGVtc1tub2RlaWRdLml0ZW1zPT1udWxsIHx8XHJcbiAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pdGVtc1tub2RlaWRdLml0ZW1zW2ZpbGVzW2xhc3RJbmRleF0ubm9kZWlkXT09bnVsbCB8fFxyXG4gICAgICAgICAgICAgICF0aGlzLmNhY2hlLml0ZW1zW25vZGVpZF0uaXRlbXNbZmlsZXNbbGFzdEluZGV4XS5ub2RlaWRdLmxvYWRlZCkgeyBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB0b1Nob3dMb2FkZXIgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgaW1nT2JqID0gdGhpcy5jYWNoZS5pdGVtc1tub2RlaWRdLml0ZW1zW2ZpbGVzW2xhc3RJbmRleF0ubm9kZWlkXTtcclxuICAgICAgICAgICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5pdGVtcy5wdXNoKGltZ09iaik7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNhY2hlLml0ZW1zW25vZGVpZF0udG90SW1hZ2VzID0gdG90RmlsZXM7XHJcbiAgICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0udG90SW1hZ2VzID0gdG90RmlsZXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodG9TaG93TG9hZGVyKSB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJMb2FkaW5nIGltYWdlc+KAplwiKSk7ICAgICAgICAgIFxyXG4gICAgICAgICAgLy90aGlzLnByb2dyZXNzTnVtID0gMDtcclxuICAgICAgICAgIHRoaXMucHJvZ3Jlc3NUb3QgPSB0b3RGaWxlcztcclxuICAgICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAwO1xyXG5cclxuICAgICAgICAgIHRoaXMudXBkYXRlRm9vdGVyKHRvdEFsYnVtcywgdG90RmlsZXMpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGkgaW4gZmlsZXMpIHsgXHJcbiAgICAgICAgICBsZXQgbGFzdEluZGV4ID0gZmlsZXMubGVuZ3RoLTEtKCtpKTtcclxuXHJcbiAgICAgICAgICBpZih0aGlzLmNhY2hlLml0ZW1zW25vZGVpZF09PW51bGwgfHxcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pdGVtc1tub2RlaWRdLml0ZW1zPT1udWxsIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuaXRlbXNbbm9kZWlkXS5pdGVtc1tmaWxlc1tsYXN0SW5kZXhdLm5vZGVpZF09PW51bGwgfHxcclxuICAgICAgICAgICAgIXRoaXMuY2FjaGUuaXRlbXNbbm9kZWlkXS5pdGVtc1tmaWxlc1tsYXN0SW5kZXhdLm5vZGVpZF0ubG9hZGVkKSB7IFxyXG5cclxuICAgICAgICAgICAgdGhpcy5pbWFnZVNjYW5uZXIgPSB0aW1lci5zZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAgICgpPT4geyB0aGlzLmxvYWRJbWFnZXMobm9kZWlkLCBmaWxlc1tsYXN0SW5kZXhdKSB9LCBcclxuICAgICAgICAgICAgICAyMDAqKCtpKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSAgXHJcblxyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3Igc2NhbiBpbWFnZXNcIiwgZSk7XHJcbiAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICB9ICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRJbWFnZXMoYWxidW1pZCwgaXRlbSkge1xyXG4gICAgICBpZihhbGJ1bWlkPT10aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQpIHsgXHJcbiAgICAgICAgbGV0IGZpbGVwYXRoID0gXCJcIjtcclxuICAgICAgICBsZXQgZmlsZXBhdGhfY2h1bmsgPSBpdGVtLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIGZvcihsZXQgYz0wOyBjPGZpbGVwYXRoX2NodW5rLmxlbmd0aC0xOyBjKyspIHtcclxuICAgICAgICAgIGZpbGVwYXRoICs9IGZpbGVwYXRoX2NodW5rW2NdICsgXCIvXCJcclxuICAgICAgICB9XHJcbiBcclxuICAgICAgICBpZihmaWxlcGF0aD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCtcIi9cIikge1xyXG4gICAgICAgICAgbGV0IGltZ3VybHJvb3QgPSB0aGlzLmhvc3QrXCIvaW5kZXgucGhwL2FwcHMvZ2FsbGVyeS9hcGkvcHJldmlldy9cIiArIGl0ZW0ubm9kZWlkO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgSHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICB1cmw6IGltZ3VybHJvb3QgKyBcIi8xNTAvMTUwXCIsXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVyc1xyXG4gICAgICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmKGFsYnVtaWQ9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCkgeyBcclxuICAgICAgICAgICAgICBsZXQgaW1nT2JqID0gbmV3IEdhbGxlcnlJdGVtKCk7XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuY29udGVudC50b0ltYWdlKClcclxuICAgICAgICAgICAgICAgIC50aGVuKChpbWFnZSk9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBiYXNlNjQgPSBpbWFnZS50b0Jhc2U2NFN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmouc3JjID0gYmFzZTY0O1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoudGl0bGUgPSBmaWxlcGF0aF9jaHVua1tmaWxlcGF0aF9jaHVuay5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai51cmwgPSBpbWd1cmxyb290O1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoubXRpbWUgPSBpdGVtLm10aW1lO1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoubG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC5wdXNoKGltZ09iaik7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBpZih0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5pdGVtcz09bnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLml0ZW1zID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLml0ZW1zLnB1c2goaW1nT2JqKTsgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUuaXRlbXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcz09bnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaXRlbXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLml0ZW1zW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXNbaXRlbS5ub2RlaWRdID0gaW1nT2JqO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzTnVtKys7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAodGhpcy5wcm9ncmVzc051bSoxMDApL3RoaXMucHJvZ3Jlc3NUb3Q7XHJcbiAgICAgICAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcImZpbGUgYWRkZWQgdG8gXCIrYWxidW1pZCtcIjogXCIsIFwiKFwiICsgaXRlbS5ub2RlaWQgKyBcIikgXCIgKyBpdGVtLnBhdGggKyBcIiAtIFwiICsgaXRlbS5tdGltZSk7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJGaWxlIGFkZGVkIHRvIFwiK2FsYnVtaWQrXCIgKFwiICsgaXRlbS5ub2RlaWQgKyBcIikgLSBcIiArIGl0ZW0ubXRpbWUsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT4ge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3IgdG9JbWFnZVwiLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTsgIFxyXG5cclxuXHRcdFx0XHQgICAgICAvLyBoaWRlIHRoZSBsb2FkZXIgd2hlbiBmaXJzdCBpbWFnZSBpbiBkaXJlY3RvcnkgaXMgbG9hZGVkXHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSwgKGUpPT4ge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgIH0pOyAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aW1lci5jbGVhclRpbWVvdXQodGhpcy5pbWFnZVNjYW5uZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVGb290ZXIobnVtQWxidW1zLCBudW1GaWxlcykge1xyXG4gICAgICBsZXQgZm9vdGVyQWxidW0gPSAobnVtQWxidW1zPjApPyBudW1BbGJ1bXMgKyBcIiBcIiArIHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJDb2xsZWN0aW9uc1wiKSA6IFwiXCI7XHJcbiAgICAgIGxldCBmb290ZXJGaWxlcyA9IChudW1GaWxlcz4wKT8gbnVtRmlsZXMgKyBcIiBcIiArIHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJGaWxlc1wiKSA6IFwiXCI7XHJcbiAgICAgIHRoaXMuZm9vdGVyID0gXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gZm9vdGVyQWxidW07XHJcbiAgICAgIHRoaXMuZm9vdGVyICs9IChudW1BbGJ1bXM+MCAmJiBudW1GaWxlcz4wKT8gXCIgLyBcIiA6IFwiXCI7XHJcbiAgICAgIHRoaXMuZm9vdGVyICs9IGZvb3RlckZpbGVzO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwidXBkYXRlRm9vdGVyXCIsIHRoaXMuZm9vdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBvblRhcEZvbGRlcihpdGVtKSB7XHJcbiAgICAgIC8vdGhpcy51dGlsLmxvZyhcInRhcFwiLCBpdGVtKTtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlRhcCBpdGVtIGZvbGRlclwiLCBudWxsKTtcclxuICAgICAgdGhpcy5sb2FkR2FsbGVyeShpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBvblRhcEltYWdlKGl0ZW0pIHtcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwidGFwXCIsIGl0ZW0udGl0bGUpO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiVGFwIGl0ZW0gaW1hZ2VcIiwgbnVsbCk7XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEltYWdlID0gaXRlbTtcclxuICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTG9hZGluZyBpbWFnZeKAplwiKSk7IFxyXG4gICAgICB0aGlzLnV0aWwubmF2aWdhdGUoXCJpbWFnZXJcIik7XHJcbiAgICB9IFxyXG5cclxuICAgIHNlbmRMb2coKSB7XHJcbiAgICAgIGlmKHRoaXMudXRpbC5ERUJVRyAmJiB0aGlzLnV0aWwuTE9HVE9TRVRUSU5HUykge1xyXG4gICAgICAgIGVtYWlsLmNvbXBvc2Uoe1xyXG4gICAgICAgICAgc3ViamVjdDogXCJDbG91ZCBHYWxsZXJ5IExvZ1wiLFxyXG4gICAgICAgICAgYm9keTogU2V0dGluZ3MuZ2V0U3RyaW5nKFwiX0xPR1wiKSxcclxuICAgICAgICAgIHRvOiBbJ2luZm9AbGluZmFzZXJ2aWNlLml0J11cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICBcclxuXHJcbn1cclxuIl19