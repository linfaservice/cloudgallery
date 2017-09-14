export class GalleryItem {
    constructor(
        public nodeid?: string,
        public isAlbum: boolean = false, 
        public items: Array<GalleryItem> = null,
        public data: {} = "",
        public title: string = "", 
        public description: string = "", 
        public path:string = "",
        public src: string = "",
        public url: string = "",        
        public loaded: boolean = false, 
        public mtime: string = "", 
        public owner: string = "",
        public totAlbum: string = "",
        public totImages: string = "") {
    }
}