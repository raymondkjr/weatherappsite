import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartComponent } from './highcharts/chart.component';
import { MeteogramComponent } from './highcharts/meteogram.component';

const FAVKEY = 'favoriteData';
@Component({
    selector: 'app-forecastpane',
    templateUrl: './forecastpane.component.html',
    styleUrls: ['./forecastpane.component.css']
})

export class ForecastPaneComponent {
    @Input() weatherData: any;
    @ViewChild(ChartComponent) chart : ChartComponent;
    @ViewChild(MeteogramComponent) meteogram: MeteogramComponent;
    @ViewChild('map') gmapElement: any;
    @ViewChild('favButton') favBtn:any;
    map: google.maps.Map;
    
    toChart : any =[];
    toMeteogram : any = [];
    
    progressBarShow = true;
    
    twitterText:string = '';
    
    isResultsVisible = true;
    detailsVisited = false;
    
    readyToLoad = false;
    
    receivedData:boolean;
    
    dailyData : any;
    dailyDates : any;
    
    notFav=true;
    
    detailData : any = [];
    detailsDate : any;
    
    weatherCodeMap : Map<number, string>;
    weatherCodeImgMap : Map<number, string>;
    
    constructor() {
        this.weatherCodeMap = new Map();
        this.weatherCodeMap.set(4201, "Heavy Rain");
        this.weatherCodeMap.set(4001, "Rain");
        this.weatherCodeMap.set(4200, "Light Rain");
        this.weatherCodeMap.set(6201, "Heavy Freezing Rain");
        this.weatherCodeMap.set(6001, "Freezing Rain");
        this.weatherCodeMap.set(6200, "Light Freezing Rain");
        this.weatherCodeMap.set(6000, "Freezing Drizzle");
        this.weatherCodeMap.set(4000, "Drizzle");
        this.weatherCodeMap.set(7101, "Heavy Ice Pellets");
        this.weatherCodeMap.set(7000, "Ice Pellets");
        this.weatherCodeMap.set(7102, "Light Ice Pellets");
        this.weatherCodeMap.set(5101, "Heavy Snow");
        this.weatherCodeMap.set(5000, "Snow");
        this.weatherCodeMap.set(5100, "Light Snow");
        this.weatherCodeMap.set(5001, "Light Flurries");
        this.weatherCodeMap.set(8000, "Thunderstorm");
        this.weatherCodeMap.set(3000, "Light Wind");
        this.weatherCodeMap.set(3001, "Wind");
        this.weatherCodeMap.set(3002, "Strong Wind");
        this.weatherCodeMap.set(2100, "Light Fog");
        this.weatherCodeMap.set(2000, "Fog");
        this.weatherCodeMap.set(1001, "Cloudy");
        this.weatherCodeMap.set(1102, "Mostly Cloudy");
        this.weatherCodeMap.set(1101, "Partly Cloudy");
        this.weatherCodeMap.set(1100, "Mostly Clear");
        this.weatherCodeMap.set(1000, "Clear");
        
        this.weatherCodeImgMap = new Map();
        this.weatherCodeImgMap.set(4201, "/assets/static/img/rain_heavy.svg");
        this.weatherCodeImgMap.set(4001, "/assets/static/img/rain.svg");
        this.weatherCodeImgMap.set(4200, "/assets/static/img/rain_light.svg");
        this.weatherCodeImgMap.set(6201, "/assets/static/img/freezing_rain_heavy.svg");
        this.weatherCodeImgMap.set(6001, "/assets/static/img/freezing_rain.svg");
        this.weatherCodeImgMap.set(6200, "/assets/static/img/freesing_rain_light.svg");
        this.weatherCodeImgMap.set(6000, "/assets/static/img/freezing_drizzle.svg");
        this.weatherCodeImgMap.set(4000, "/assets/static/img/drizzle.svg");
        this.weatherCodeImgMap.set(7101, "/assets/static/img/ice_pellets_heavy.svg");
        this.weatherCodeImgMap.set(7000, "/assets/static/img/ice_pellets.svg");
        this.weatherCodeImgMap.set(7102, "/assets/static/img/ice_pellets_light.svg");
        this.weatherCodeImgMap.set(5101, "/assets/static/img/snow_heavy.svg");
        this.weatherCodeImgMap.set(5000, "/assets/static/img/snow.svg");
        this.weatherCodeImgMap.set(5100, "/assets/static/img/snow_light.svg");
        this.weatherCodeImgMap.set(5001, "/assets/static/img/flurries.svg");
        this.weatherCodeImgMap.set(8000, "/assets/static/img/tstorm.svg");
        this.weatherCodeImgMap.set(3000, "/assets/static/img/light_wind.jpg");
        this.weatherCodeImgMap.set(3001,"/assets/static/img/wind.png");
        this.weatherCodeImgMap.set(3002, "/assets/static/img/strong-wind.png");
        this.weatherCodeImgMap.set(2100, "/assets/static/img/fog_light.svg");
        this.weatherCodeImgMap.set(2000, "/assets/static/img/fog.svg");
        this.weatherCodeImgMap.set(1001, "/assets/static/img/cloudy.svg");
        this.weatherCodeImgMap.set(1102, "/assets/static/img/mostly_cloudy.svg");
        this.weatherCodeImgMap.set(1101, "/assets/static/img/partly_cloudy_day.svg");
        this.weatherCodeImgMap.set(1100, "/assets/static/img/mostly_clear_day.svg");
        this.weatherCodeImgMap.set(1000, "/assets/static/img/clear_day.svg");
    }
    
    load(data:any) {
        this.progressBarShow = false;
        console.log("LOAD");
        console.log(data.code);
        if ('code' in data)
        {
            this.receivedData = false;
            console.log("NO DATA");
        }
        else {
            this.receivedData = true;
            console.log(data);
            this.dailyData = data.data.timelines[0].intervals;
            this.convertDate();
            this.readyToLoad = true;
            let i = 0;
            for (var val of this.dailyData) {
                let date = new Date(this.dailyDates[i]);
                this.toChart.push([date.getTime(), val.values.temperatureMin, val.values.temperatureMax]);
                i++;
            }
            console.log(this.toChart);
            console.log("called forecast load");
            this.toMeteogram = data.data.timelines[1];
            }
        
        
    }
    
    convertDate() {
        this.dailyDates = new Array();
        for (var val of this.dailyData) {
            var date = new Date(val.startTime);
            var dateStr = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
            this.dailyDates.push(dateStr);
        }
    }
    
    resetForecast() {
        this.progressBarShow = true;
        this.toChart = [];
        this.isResultsVisible = true;
        this.detailsVisited = false;
        this.notFav=true;
    }
    
    showTemp() {
        console.log("Showtemp pressed");
    }
    
    doThing(i:any) {
        console.log("pressed " + i);
        this.detailsVisited = true;
        this.isResultsVisible = !this.isResultsVisible;
        this.detailData = this.dailyData[i];
        console.log(this.detailData);
        let date = new Date(this.detailData.startTime);
        this.detailsDate = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
        var mapProperties = {
            center: new google.maps.LatLng(parseFloat(this.weatherData.lat), parseFloat(this.weatherData.long)),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProperties);
        var marker = new google.maps.Marker({
            position: mapProperties.center,
            map:this.map
        })
        this.openTwitter();
    }
    
    callDetails() {
        if (this.detailsVisited) {
            this.isResultsVisible = !this.isResultsVisible;
        }
    }
    
    getTime(dateStr: string) {
        var dateObj = new Date(dateStr);
        return dateObj.toTimeString();
    }
    
    openTwitter() {
        console.log("opening twitter");
        this.twitterText = "text="+"The weather in "+this.weatherData.tweetAddr+" on "+this.detailsDate+" is "+this.detailData.values.temperature+"%C2%B0F. The weather conditions are " + this.weatherCodeMap.get(this.detailData.values.weatherCode) + "&hashtags=CSCI571WeatherForecast";
    }
    
    addFavorite() {
        console.log("called addFavorite");
        this.notFav = !this.notFav;
        var fromStorage = localStorage.getItem(FAVKEY);
        if (fromStorage) {
            var favData = JSON.parse(fromStorage);
            favData.push({
                addr: this.weatherData.tweetAddr,
                lat: this.weatherData.lat,
                long: this.weatherData.long,
                favCity: this.weatherData.favCity,
                favState: this.weatherData.favState
            });
            console.log(favData);
            localStorage.setItem(FAVKEY, JSON.stringify(favData));
        }
        else {
            var favData : any = [{
                addr: this.weatherData.tweetAddr,
                lat: this.weatherData.lat,
                long: this.weatherData.long,
                favCity: this.weatherData.favCity,
                favState: this.weatherData.favState
            }];
            console.log(favData);
            localStorage.setItem(FAVKEY, JSON.stringify(favData));
        }
        
        
    }
    
    removeFav() {
        console.log("called removeFav");
        this.notFav = !this.notFav;
        var favData = localStorage.getItem(FAVKEY);
        if (favData){
            var favArr = JSON.parse(favData);
            var ind = favArr.findIndex((item:any) => item.addr == this.weatherData.tweetAddr);
            
            console.log(ind);
            favArr.splice(ind,1);
            if (favArr.length == 0) {
                localStorage.clear();
            }
            else {
                localStorage.setItem(FAVKEY, JSON.stringify(favArr));
            }
            
        }
    }
}