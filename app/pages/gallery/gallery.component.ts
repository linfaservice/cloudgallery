import { Page } from "ui/page";
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Util } from "../../common/util";
import Loader from "../../common/loader";
import { GalleryItem } from "../../common/gallery.item";
import GalleryCache from "../../common/gallery.cache";
import * as Toast from 'nativescript-toast';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { ImageModalComponent } from "./image-modal.component";
import * as ImageSourceModule from "image-source";
import * as Http from "tns-core-modules/http"
import { RadListView } from "nativescript-telerik-ui-pro/listview"
import * as timer from "timer";
import * as Settings from "application-settings";
import * as Platform from "platform";
import { TranslateService } from "ng2-translate";
import { on as applicationOn, launchEvent, suspendEvent, resumeEvent, exitEvent, lowMemoryEvent, uncaughtErrorEvent, ApplicationEventData, start as applicationStart } from "application";
import * as utf8 from "utf8"; 
import * as  Base64 from "base-64";
import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { confirm } from "ui/dialogs";
import * as appversion from "nativescript-appversion"; 

import * as elementRegistryModule from 'nativescript-angular/element-registry';
elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);

  
@Component({
  selector: "gallery",
  templateUrl: "pages/gallery/gallery.html",
  styleUrls: ["pages/gallery/gallery.css"],
  providers: [ModalDialogService]
})


export class GalleryComponent {

    private language;
    private version;

    private host;
    private username;
    private password;
    private rootdir;
    private headers;

    /*
    private images = new ObservableArray<ObservableArray<GalleryItem>>();
    private current = new ObservableArray<GalleryItem>();
    private history = new Array();
    */

    //private nodeid;
    //private path;
    //private title;

    private current = new ObservableArray<GalleryItem>();
    private progressNum = 0;
    private progressTot = 0;
    private progressVal = 0;
    private footer = "";
    private loader = new Loader();
    private imageScanner;

    
    public constructor(
      private page: Page,
	    private util: Util,
      private fonticon: TNSFontIconService,
      private modalService: ModalDialogService, 
      private vcRef: ViewContainerRef,
      private translate: TranslateService,
      private cache: GalleryCache
    )  {

      appversion.getVersionName().then((v: string)=> {
          this.version = "Version " + v;
      });

      this.language = Platform.device.language;
      this.translate.setDefaultLang("en");
      this.translate.use(Platform.device.language.split("-")[0]).subscribe(()=> {
        this.host = Settings.getString("host");
        this.username = Settings.getString("username");
        this.password = Settings.getString("password");
        this.rootdir = Settings.getString("rootdir");  
        this.rootdir = (this.rootdir==null)? "":this.rootdir;
        this.headers = { 
          "OCS-APIREQUEST": "true",
          "Authorization": "Basic "+Base64.encode(this.username+':'+this.password)
        }            

        this.home();
      });
    }

    private clearCurrent() {
      while(this.current.length>0) {
        this.current.pop();   
      }
    }  

    private home() {
      this.cache.history = new Array();
      this.cache.currentAlbum.path = this.rootdir; 
      this.cache.currentAlbum.nodeid = "/";
      this.loadGallery({
        path: this.cache.currentAlbum.path, 
        nodeid: this.cache.currentAlbum.nodeid
      });
    }

    private back() {
      if(this.cache.history.length>1) {
        let current = this.cache.history.pop();
        let back = this.cache.history.pop();
        this.loadGallery(back); 
      } else {
        let options = {
            title: this.translate.instant("Exit?"),
            message: this.translate.instant("Are you sure you want to exit?"),
            okButtonText: this.translate.instant("Yes"),
            cancelButtonText: this.translate.instant("No")
        };

        this.util.log("Back", "confirm exit?"); 
        confirm(options).then((result: boolean) => {
            this.util.log("Back", result);          
            if(result) {
              this.util.exit();
            }
        });        
      }
    }

    private exit() {
      Settings.setString("host", "");
      Settings.setString("username", "");
      Settings.setString("password", "");
      Settings.setString("rootdir", "");        
      this.util.navigate("settings");
    }
 
    private loadGallery(item) {
       
      this.loader.showLoader(this.translate.instant("Loading albums..."));
      this.util.log("loadGallery", item); 

      let path = item.path;
      let nodeid = item.nodeid;

      if(this.cache.images[nodeid]==null) {
        this.cache.images[nodeid] = new GalleryItem();
      }

      this.clearCurrent();

      this.footer = "";

      this.cache.currentAlbum.nodeid = nodeid;
      this.cache.currentAlbum.path = path;
      let path_chunk = path.split("/");
      this.cache.currentAlbum.title = path_chunk[path_chunk.length-1];
      this.cache.currentAlbum.title = (this.cache.currentAlbum.title=="")? this.host.split("//")[1] : this.cache.currentAlbum.title;

      this.progressVal = 0;

      // string sanitize
      let pathsan = this.util.replaceAll(path, "&", "%26");      
      let url = this.host+"/index.php/apps/gallery/api/files/list?location="+pathsan+"&mediatypes=image/jpeg;image/gif;image/png&features=&etag";
      this.util.log("GET", url);

      // try from cache first
      this.util.log("Get Album Cache", this.cache.images[this.cache.currentAlbum.nodeid]);
      if(this.cache.images[this.cache.currentAlbum.nodeid].loaded) {

        for(let a in this.cache.images[this.cache.currentAlbum.nodeid].items) {
          let item = this.cache.images[this.cache.currentAlbum.nodeid].items[a];
          this.util.log("Cache album added", item);
          this.current.push(item);
        }
        this.updateFooter(this.cache.images[this.cache.currentAlbum.nodeid].totAlbums, 0);
        let data = this.cache.images[this.cache.currentAlbum.nodeid].data;

        // otherwise too fast :)
        timer.setTimeout(()=> { 
          this.loader.hideLoader(); 
          this.scanImages(data.files, nodeid);
        }, 800);

      } else {
      
        Http.request({
            url: url,
            method: "GET",
            headers: this.headers
        }).then((response:any)=> {
            let data = response.content.toJSON();
            this.util.log("response to ", path+"("+nodeid+"), current album:" + this.cache.currentAlbum.nodeid);

            let albums = data.albums;  
            // error loading
            if(albums==null) {
              Toast.makeText(this.translate.instant("Error loading. Please exit and reconfigure")).show();
              this.loader.hideLoader();
              return;
            }

            let totAlbums = 0;
            this.progressTot = albums.length;
            this.progressNum = 0;
            for(let j in albums) {
              if(albums[j].size!=0) {
                let albumObj = new GalleryItem();
                albumObj.path = albums[j].path;
                let path_chunk = albumObj.path.split("/");
                let current_chunk = this.cache.currentAlbum.path.split("/");
                albumObj.title = path_chunk[path_chunk.length-1];
                albumObj.isAlbum = true;
                albumObj.src = "";
                albumObj.nodeid = albums[j].nodeid;
                albumObj.items = new Array<GalleryItem>();

                if(albumObj.path==data.albumpath) {
                  // excludes current album
                } else if(path_chunk.length>current_chunk.length+1) {
                  // excludes more levels albums
                } else {
                  this.current.push(albumObj);
                  if(this.cache.images[this.cache.currentAlbum.nodeid].items==null) {
                    this.cache.images[this.cache.currentAlbum.nodeid].items = new Array<GalleryItem>();
                  }
                  this.cache.images[this.cache.currentAlbum.nodeid].items.push(albumObj);
                  totAlbums++;
                  this.util.log("Album added to "+nodeid+":", albumObj);
                }
              }
              this.progressNum++;
              this.progressVal = (this.progressNum*100)/this.progressTot;
            } 
            this.progressVal = 100;
            this.cache.images[this.cache.currentAlbum.nodeid].loaded = true;
            this.cache.images[this.cache.currentAlbum.nodeid].totAlbums = totAlbums;
            this.cache.images[this.cache.currentAlbum.nodeid].data = data;
            this.util.log("Set Album Cache", this.cache.images[this.cache.currentAlbum.nodeid]);

            this.updateFooter(totAlbums, 0);
            this.loader.hideLoader();
            this.scanImages(data.files, nodeid);
 
          }, (e)=> {
              Toast.makeText(this.translate.instant("Error loading. Please retry")).show();
              this.util.log("Error", e);
              this.loader.hideLoader();
              return;
          }); 
      }

      this.cache.history.push({path: this.cache.currentAlbum.path, nodeid: this.cache.currentAlbum.nodeid});

    }

    private scanImages(files, nodeid) {
      // checks for available images
      let toShowLoader = false;
      let totFiles = 0;
      let totAlbums = this.cache.images[this.cache.currentAlbum.nodeid].totAlbums;

      for(let i in files) {
        let filepath = "";
        let filepath_chunk = files[i].path.split("/");
        for(let c=0; c<filepath_chunk.length-1; c++) {
          filepath += filepath_chunk[c] + "/"
        }
        if(filepath==this.cache.currentAlbum.path+"/") {
          totFiles++;
          toShowLoader = true;
        }
      }

      if(toShowLoader) {
        this.loader.showLoader(this.translate.instant("Loading images..."));
        this.progressNum = 0;
        this.progressTot = totFiles;
        this.progressVal = 0;

        this.updateFooter(totAlbums, totFiles);
      } 

      for(let i in files) { 
        this.imageScanner = timer.setTimeout(
          ()=> { this.loadImages(nodeid, files[files.length-1-(+i)]) }, 
          300*(+i));
      }       
    }

    private loadImages(albumid, item) {
      if(albumid==this.cache.currentAlbum.nodeid) { 
        let filepath = "";
        let filepath_chunk = item.path.split("/");
        for(let c=0; c<filepath_chunk.length-1; c++) {
          filepath += filepath_chunk[c] + "/"
        }
 
        if(filepath==this.cache.currentAlbum.path+"/") {
          let imgurlroot = this.host+"/index.php/apps/gallery/api/preview/" + item.nodeid;
        
          Http.request({
              url: imgurlroot + "/150/150",
              method: "GET",
              headers: this.headers
          }).then((response:any)=> {

            if(albumid==this.cache.currentAlbum.nodeid) { 
              let imgObj = new GalleryItem();
              response.content.toImage()
                .then((image)=> {
                  let base64 = image.toBase64String();
                  imgObj.src = base64;
                  imgObj.title = filepath_chunk[filepath_chunk.length-1];
                  imgObj.url = imgurlroot;
                  imgObj.mtime = item.mtime;

                  this.current.push(imgObj);
                  /*
                  if(this.cache.images[this.cache.currentAlbum.nodeid].images==null) {
                    this.cache.images[this.cache.currentAlbum.nodeid].images = new Array<GalleryItem>();
                  }
                  this.cache.images[this.cache.currentAlbum.nodeid].images[item.nodeid] = imgObj;
                  */
                  this.progressNum++;
                  this.progressVal = (this.progressNum*100)/this.progressTot;
                  this.util.log("file added to "+albumid+": ", "(" + item.nodeid + ") " + item.path + " - " + item.mtime);
                })
                .catch((error)=> {
                  //this.util.log("error", error);
                });  

				// hide the loader when first image in directory is loaded
              this.loader.hideLoader();
            }

          }, (e)=> {
              Toast.makeText(this.translate.instant("Error loading. Please retry")).show();
          });      
        }
      } else {
        timer.clearTimeout(this.imageScanner);
      }
    }

    private updateFooter(numAlbums, numFiles) {
      let footerAlbum = (numAlbums>0)? numAlbums + " " + this.translate.instant("Collections") : "";
      let footerFiles = (numFiles>0)? numFiles + " " + this.translate.instant("Files") : "";
      this.footer = "";
      this.footer += footerAlbum;
      this.footer += (numAlbums>0 && numFiles>0)? " / " : "";
      this.footer += footerFiles;
      this.util.log("updateFooter", this.footer);
    }
    
    ngOnInit() {
      this.page.actionBarHidden = false;
      this.util.log("Page Init", "Gallery");      

      if (application.android) {
        application.android.on(
            AndroidApplication.activityBackPressedEvent, 
            (data: AndroidActivityBackPressedEventData) => {
                data.cancel = true; // prevents default back button behavior
                this.back();
            } 
        );       
      }

      /*
      applicationOn(resumeEvent, (args: ApplicationEventData)=> {
          this.loadGallery({path: this.path, nodeid: this.nodeid});
      });   
      */ 
    }

    ngAfterViewInit() {
        
    }

    onTapFolder(item) {
      this.util.log("tap", item);
      this.loadGallery(item);
    }

    onTapImage(item) {
      this.util.log("tap", item.title);
      this.loader.showLoader(this.translate.instant("Loading image...")); 

      let options = {
          context: {
            loader: this.loader,
            item: item
          },
          fullscreen: false,
          viewContainerRef: this.vcRef
      };

      this.modalService.showModal(ImageModalComponent, options)
      .then((result: any) => {      
      });
    }

   

}
