import { Component, OnInit, Input } from '@angular/core';
import { Signal } from '../models/signal';
import * as moment from 'moment';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() signal: Signal;
  options = {};

  constructor() {
    this.options = {
        chart: {
            height: 50,
            width: 150,
            type: 'area',
            backgroundColor: undefined,
            spacing: [0, 0, 0, 0],
        },
      xAxis: {
        visible: false,
        type: 'datetime'
      },
      yAxis: [{
        visible: false,
        alignTicks: false,
        startOnTick: false,
        endOnTick: false
      }],
      title: {
        text: undefined
      },
      legend: false,
        tooltip: {
            formatter: function () {
                return '<i>' + this.key + '</i><br><b>' + this.y + '%</b>';
            }
        },
        plotOptions: {
            area: {
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                animation: false
            }
        },
        series: []
    };
  }

  ngOnInit() {
  }

  saveInstance(chartInstance) {
    const prices = [];
    if (this.signal.price_history.length > 1000) {
      const delta = Math.ceil(this.signal.price_history.length / 1000);
      for (let i = 0; i < this.signal.price_history.length; i = i + delta) {
        prices.push(this.signal.price_history[i]);
      }
      this.signal.price_history = prices;
    }
    const serie = {
      name: this.signal.currency + this.signal.commodity,
      data: this.signal.price_history.map(pr => {
        const ms = moment(pr.date).diff(this.signal.creation_date);
        const time = moment.duration(ms).format('h [hrs], m [min], s [sec]');

        return {
          name: time,
          y: Math.floor((pr.price * 100 / this.signal.price - 100) * 100 ) / 100
        };
      }),
      fillOpacity: 0.15,
      marker: {
        enabled: false
      },
      color: '#2ecc71',
      negativeColor: '#e74c3c',
    };
    chartInstance.addSeries(serie);
  }
}
