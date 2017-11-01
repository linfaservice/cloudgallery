export class GalleryItem {
    constructor(
        public nodeid?: string,
        public data: {} = "",
        public title: string = "", 
        public description: string = "", 
        public path:string = "",
        public src: string = "",
        public url: string = "",        
        public loaded: boolean = false, 
        public mtime: string = "", 
        public owner: string = "",

        // album attributes
        public isAlbum: boolean = false,
        public items: Array<GalleryItem> = null,        
        public totAlbums: number = 0,
        public totImages: number = 0
    ) {}
}