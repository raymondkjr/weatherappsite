import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let More =   require('highcharts/highcharts-more');
let Export = require('highcharts/modules/exporting');
let noData = require('highcharts/modules/no-data-to-display');
Export(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);


@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit, OnChanges{
    @Input() chartData: any = [];
    options : any = {
            chart: {
                type: 'arearange',
                zoomType: 'x',
                scrollablePlotArea: {
                    minWidth: 600,
                    scrollPositionX: 1
                }
            },

            title: {
                text: 'Temperature (Min, Max)'
            },

            xAxis: {
                type: 'datetime',
                accessibility: {
                    rangeDescription: ''
                }
            },

            yAxis: {
                title: {
                    text: 'Temperature'
                }
            },



            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '°F',
                xDateFormat: '%A, %b %e'
            },

            legend: {
                enabled: false
            },

            series: [{
                name: 'Temperatures',
                data: this.chartData
            }]

        };

    constructor() {
    
    }

    ngOnInit() {
        console.log("called chart load");
        console.log(this.chartData);
        console.log(this.options);
        this.options.series[0].data = this.chartData;
        Highcharts.chart('container', this.options);
    }
    
    ngOnChanges() {
        this.options.series[0].data = this.chartData;
        Highcharts.chart('container', this.options);
    }
    
    changeData(newData: any) {
        this.options.series[0].data = newData;
        Highcharts.chart('container', this.options);
    }
}