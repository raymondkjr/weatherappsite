import { Component, Output, EventEmitter } from '@angular/core';


const FAVKEY = 'favoriteData';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.css']
})

export class FavoritesComponent {
    hasFavorites = true;
    favArray : any = [];
    
    @Output() favSearchEvent = new EventEmitter<any>();
    
    loadFavorites() {
        console.log("loading favorites");
        console.log(localStorage.getItem(FAVKEY));
        var dataArr = localStorage.getItem(FAVKEY);
        if(dataArr) {
            this.hasFavorites = true;
            this.favArray = JSON.parse(dataArr);
            console.log(this.favArray);
        }
        else {
            this.hasFavorites = false;
        }
    }
    
    favClick(ind:any) {
        console.log("favClick: clicked on " + ind);
        this.favSearchEvent.emit(this.favArray[ind]);
    }
    
    deleteFav(ind:any) {
        console.log("clicked on" + ind);
        this.favArray.splice(ind,1);
        if(this.favArray.length == 0) {
            localStorage.clear();
            this.hasFavorites=false;
        }
        else {
            localStorage.setItem(FAVKEY,this.favArray);
        }
    }
}