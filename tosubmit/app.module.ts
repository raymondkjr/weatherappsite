import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SearchComponent } from './search/search.component';
import { ResultsPaneComponent } from './resultspane/resultspane.component';
import { ForecastPaneComponent } from './forecast/forecastpane.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent } from './forecast/highcharts/chart.component';
import { MeteogramComponent } from './forecast/highcharts/meteogram.component';
import { SlidepaneComponent } from './slidepane/slidepane.component';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsPaneComponent,
    ForecastPaneComponent,
    ChartComponent,
    MeteogramComponent,
    SlidepaneComponent,
    FavoritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
    BrowserAnimationsModule,
    //MatFormFieldModule,
    //MatAutocompleteModule,
    //ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
