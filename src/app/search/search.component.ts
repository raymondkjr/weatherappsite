import { Component, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent {
    title = 'search-component';
    
    //@Input('matAutocomplete') autoCom : MatAutocomplete;
    
    checked = false;
    
    found : boolean = false;
    
    strJson: any;
    searchData:any;
    
    autoCompSearchData:any = [];
    
    s = '';
    
    loc : location = {lat:'',long:'',addr:'',tweetAddr:'',favCity:'',favState:''};
    
    formCity: string ='';
    formStreet: string ='';
    formState: string ='';
    
    formattedAddr : string = '';
    
    stateAbbr = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
    
    stateNames = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
    
    @Output() messageEvent = new EventEmitter<location>();
    @Output() clearEvent = new EventEmitter<boolean>();
    
    constructor (private http: HttpClient) {
    
    }
    
    changeChecked(){
        this.checked = !this.checked;
    }
    
    resetForm() {
        this.checked = false;
        this.found = false;
        this.clearEvent.emit(false);
        //this.messageEvent.emit(undefined);
    }
    
    submitForm() {
        if (this.checked)
        {
            this.http.get('https://ipinfo.io?token=43c4ef528bd7e4').subscribe(data => {
                this.strJson = JSON.stringify(data);
                this.searchData = JSON.parse(this.strJson);
                if (this.searchData.status == 'ZERO_RESULTS') {
                    this.found = false;
                }
                else {
                    this.found = true;
                    this.s = this.searchData.loc.split(',');
                    this.loc.lat = this.s[0];
                    this.loc.long = this.s[1];
                    this.loc.addr = this.searchData.city + ', ' + this.searchData.region;
                    this.loc.tweetAddr = this.searchData.city + ', ' + this.searchData.region;
                    this.loc.favCity = this.searchData.city;
                    this.loc.favState = this.searchData.region;
                    console.log(this.loc);
                    this.messageEvent.emit(this.loc);
                    
                }
               
            });
            
        }
        else
        {
            this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+this.formStreet+','+this.formCity+','+this.formState+'&key=AIzaSyBsW1YzNV-uMI5aLXoDt_J97GK_2_dCwX0').subscribe(data => {
                this.strJson = JSON.stringify(data);
                this.searchData = JSON.parse(this.strJson);
                this.found = true;
                this.loc.lat = this.searchData.results[0].geometry.location.lat;
                this.loc.long = this.searchData.results[0].geometry.location.lng;
                this.loc.addr = this.searchData.results[0].formatted_address;
                this.loc.tweetAddr = this.formStreet + ' ' + this.formCity + ' ' + this.stateNames[this.stateAbbr.indexOf(this.formState)];
                this.loc.favCity = this.formCity;
                this.loc.favState = this.stateNames[this.stateAbbr.indexOf(this.formState)];
                console.log(this.loc);
                this.messageEvent.emit(this.loc);
            })
        }
    }
    
    updateAutoComplete() {
        console.log(this.formCity);
        if(this.formCity.length < 3) {
            this.autoCompSearchData = [];
        }
        else {
            this.autoCompSearchData = [1,2,3,4,5];
        }
    }
}

export class location {
    addr:string = '';
    lat:string = '';
    long:string = '';
    tweetAddr:string='';
    favCity:string='';
    favState:string='';
}