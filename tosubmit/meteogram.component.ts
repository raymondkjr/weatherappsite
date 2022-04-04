import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let More =   require('highcharts/highcharts-more');
let Export = require('highcharts/modules/exporting');
let Wind = require('highcharts/modules/windbarb');
let Fill = require('highcharts/modules/pattern-fill');
let Data = require('highcharts/modules/data');
let noData = require('highcharts/modules/no-data-to-display');
Export(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
Wind(Highcharts);
noData(Highcharts);
Fill(Highcharts);
noData(Highcharts);
Data(Highcharts);
noData(Highcharts);

@Component({
    selector: 'app-meteogram',
    templateUrl: './meteogram.component.html',
    styleUrls: ['./meteogram.component.css']
})
export class MeteogramComponent implements OnInit, OnChanges {
    @Input() data: any = [];
    
        symbols:any = [];
        precipitations:any = [];
        precipitationsError:any = []; 
        winds:any = [];
        temperatures:any = [];
        pressures:any = [];
        hasPrecipitationError:any = false;
        container = 'meteogram-container';
        options:any;
        chart:any;
    
    ngOnInit () {
        this.parseYrData();   
    }
    
    constructor() {
        this.options = this.createOptions();
        
    }
    
    drawBlocksForWindArrows(chart:any) {
        const xAxis = chart.xAxis[0];

        for (
            let pos = xAxis.min, max = xAxis.max, i = 0;
            pos <= max + 36e5; pos += 36e5,
            i += 1
        ) {

       
            const isLast = pos === max + 36e5,
                x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

            const isLong = true;

            chart.renderer
                .path([
                    'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                    'L', x, chart.plotTop + chart.plotHeight + 32,
                    'Z'
                ])
                .attr({
                    stroke: chart.options.chart.plotBorderColor,
                    'stroke-width': 1
                })
                .add();
        }   

   
        chart.get('windbarbs').markerGroup.attr({
            translateX: chart.get('windbarbs').markerGroup.translateX + 8
        });
    
    }
    
    createOptions() {
        return {
        chart: {
            renderTo: this.container,
            marginBottom: 70,
            marginRight: 40,
            marginTop: 50,
            plotBorderWidth: 1,
            height: 400,
            alignTicks: false,
            scrollablePlotArea: {
                minWidth: 720
            }
        },

        title: {
            text: 'Hourly Weather (For Next 5 Days)',
            align: 'center',
            style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }
        },

        credits: {
            text: 'Forecast',
            href: '',
            position: {
                x: -40
            }
        },

        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat:
                '<small>{point.x:%A, %b %e, %H:%M}</small><br><br>'

        },

        xAxis: [{ 
            type: 'datetime',
            tickInterval: 2 * 36e5, // two hours
            minorTickInterval: 36e5, // one hour
            tickLength: 0,
            gridLineWidth: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: 30,
            showLastLabel: true,
            labels: {
                format: '{value:%H}'
            },
            crosshair: true
        }, { // Top X axis
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                align: 'left',
                x: 3,
                y: -5
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1
        }],

        yAxis: [{ // temperature axis
            title: {
                text: null
            },
            labels: {
                format: '{value}°',
                style: {
                    fontSize: '10px'
                },
                x: -3
            },
            plotLines: [{ // zero plane
                value: 0,
                color: '#BBBBBB',
                width: 1,
                zIndex: 2
            }],
            maxPadding: 0.3,
            minRange: 8,
            tickInterval: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)'

        }, { // precipitation axis
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 0,
            tickLength: 0,
            minRange: 10,
            min: 0

        }, { // Air pressure
            allowDecimals: false,
            title: { // Title on top of axis
                text: 'inHg',
                offset: 0,
                align: 'high',
                rotation: 0,
                style: {
                    fontSize: '10px',
                    color: '#8bbc21'
                },
                textAlign: 'left',
                x: 3
            },
            labels: {
                style: {
                    fontSize: '8px',
                    color: '#8bbc21'
                },
                y: 2,
                x: 3
            },
            gridLineWidth: 0,
            opposite: true,
            showLastLabel: false
        }],

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },


        series: [{
            name: 'Temperature',
            data: this.temperatures,
            type: 'spline',
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                valueSuffix: '°F'
                // pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                //     '{series.name}: <b>{point.value} F</b><br/>'
            },
            zIndex: 1,
            color: '#FF3333',
            negativeColor: '#48AFE8'
        }, {
            name: 'Humidity',
            data: this.precipitationsError,
            type: 'column',
            color: 'url(#precipitation-error)',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            tooltip: {
                valueSuffix: ' %',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                    '{series.name}: <b>{point.value} %</b><br/>'
            },
            grouping: false,
            dataLabels: {
                enabled: this.hasPrecipitationError,
                filter: {
                    operator: '>',
                    property: 'maxValue',
                    value: 0
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            }
        }, {
            name: 'Humidity',
            data: this.precipitations,
            type: 'column',
            color: '#68CFE8',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            grouping: false,
            dataLabels: {
                enabled: !this.hasPrecipitationError,
                filter: {
                    operator: '>',
                    property: 'y',
                    value: 0
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            },
            tooltip: {
                valueSuffix: ' %'
            }
        }, {
            name: 'Air pressure',
            color: '#8bbc21',
            data: this.pressures,
            marker: {
                enabled: false
            },
            shadow: false,
            tooltip: {
                valueSuffix: ' inHg'
            },
            dashStyle: 'shortdot',
            yAxis: 2
        }, {
            name: 'Wind',
            type: 'windbarb',
            id: 'windbarbs',
            color: '#0d233a',
            lineWidth: 1.5,
            data: this.winds,
            vectorLength: 10,
            yOffset: -15,
            tooltip: {
                valueSuffix: ' mph'
            }
        }]
    };
    }
    
    onChartLoad(chart:any) {
        this.drawBlocksForWindArrows(chart);
    }
    
    createChart() {
        this.chart = new (Highcharts.chart as any)(this.options);
        this.onChartLoad(this.chart);
        
    }
    
    parseYrData() {
         let pointStart;

  

    // Loop over hourly (or 6-hourly) forecasts
    for (var i = 0; i < this.data.intervals.length; i++) {

        var dateObj = new Date(this.data.intervals[i].startTime);
        const x = dateObj.getTime();
        /*
        const x = Date.parse(this.data.intervals[i].startTime),
            nextHours = node.data.next_1_hours || node.data.next_6_hours,
            symbolCode = nextHours && nextHours.summary.symbol_code,
            to = node.data.next_1_hours ? x + 36e5 : x + 6 * 36e5;

        if (to > pointStart + 48 * 36e5) {
            return;
        }
        */

        // Populate the parallel arrays
        //this.symbols.push(nextHours.summary.symbol_code);

        this.temperatures.push({
            x,
            y: this.data.intervals[i].values.temperature,
            // custom options used in the tooltip formatter
            //to
        });

        this.precipitations.push({
            x,
            y: Math.round(this.data.intervals[i].values.humidity)
        });

        if (i % 2 === 0) {
            this.winds.push({
                x,
                value: this.data.intervals[i].values.windSpeed,
                direction: this.data.intervals[i].values.windDirection
            });
        }

        this.pressures.push({
            x,
            y: Math.round(this.data.intervals[i].values.pressureSeaLevel)
        });

        // if (i === 0) {
        //     pointStart = (x + to) / 2;
        // }
    };

    // Create the chart when the data is loaded
    this.createChart();
    }
    
    ngOnChanges() {
    
    }
    
}