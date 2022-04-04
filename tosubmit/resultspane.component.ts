import { Component, Input, ViewChild } from '@angular/core';
import { ForecastPaneComponent } from '../forecast/forecastpane.component';
import { FavoritesComponent } from '../favorites/favorites.component';
import { HttpClient } from '@angular/common/http';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-resultspane',
    templateUrl: './resultspane.component.html',
    styleUrls: ['./resultspane.component.css']
})

export class ResultsPaneComponent {

    favorites = false;
    active = 1;
    @Input() locData: any;
    @Input() searchResults: any;
    @Input() results:boolean = false;
    @ViewChild(ForecastPaneComponent) forecastPane : ForecastPaneComponent;
    @ViewChild(FavoritesComponent) fav:FavoritesComponent;
    
    constructor(private http: HttpClient) {}
    
    keepHidden = true;
    
    errorLoad = false;
    
    
    onNavChange(changeEvent: NgbNavChangeEvent) {
        console.log(this.active);
    }
    
    showResults(searchJson:any) {
        if (!this.keepHidden && !this.favorites) {
            this.searchResults = searchJson;
            this.results = true;
            this.favorites = false;
            this.http.get('https://cs571hwk8.appspot.com/'+this.searchResults.lat+','+this.searchResults.long).subscribe(data => {
                this.active = 1;
                this.forecastPane.load(data);
                this.errorLoad = !this.forecastPane.receivedData;
            });
            
            
        }
        
        
    }
    
    navResults() {
        if (this.favorites && !this.keepHidden) {
            this.forecastPane.progressBarShow = false;
            this.results = true;
            this.favorites = false;
            this.active = 1;
        }
        if (this.favorites && this.keepHidden) {
            this.favorites = false;
            this.active = 1;
        }
    }
    
    showFavorites() {
        this.favorites = true;
        this.results = false;
        this.fav.loadFavorites();
    }
    
    resetComponent() {
        this.navResults();
        this.forecastPane.resetForecast();
        this.errorLoad = false;
        this.active = 1;
    }
    
    loadFromFav($event:any) {
            this.keepHidden = false;
            this.searchResults = $event;
            this.results = true;
            this.favorites = false;
            this.http.get('https://cs571hwk8.appspot.com/'+$event.lat+','+$event.long).subscribe(data => {
                this.forecastPane.notFav = false;
                this.active = 1;
                this.forecastPane.load(data);
            });
    }
}