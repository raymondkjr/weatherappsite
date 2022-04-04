import { Component, ViewChild } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { ResultsPaneComponent } from './resultspane/resultspane.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';
  @ViewChild(SearchComponent) search: SearchComponent;
  @ViewChild(ResultsPaneComponent) resPane: ResultsPaneComponent;
  
  loc :any;
  found:boolean = false;
  
  getLoc($event:any) {
    console.log("called getloc");
    this.loc = $event;
    this.found = true;
    this.resPane.keepHidden = false;
    this.resPane.results = true;
    this.resPane.favorites = false;
    this.resPane.showResults(this.loc);
  }
  
  clearForm($event:boolean) {
    this.resPane.results = false;
    this.resPane.favorites = false;
    this.resPane.keepHidden = true;
    this.resPane.resetComponent();
  }

}
