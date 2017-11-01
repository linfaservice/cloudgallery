import { Injectable } from '@angular/core';
import { GalleryItem } from "./gallery.item";


@Injectable()
export default class GalleryCache {

    public items:Array<GalleryItem>;
    public currentAlbum:GalleryItem; 
    public currentImage:GalleryItem;  
    public history:Array<GalleryItem>;    
    
    constructor() {
        this.items = new Array<GalleryItem>();
        this.currentAlbum = new GalleryItem(); 
        this.currentAlbum.isAlbum = true;
        this.currentImage = new GalleryItem();  
        this.currentImage.isAlbum = false;
        this.history = new Array<GalleryItem>();
    }
}