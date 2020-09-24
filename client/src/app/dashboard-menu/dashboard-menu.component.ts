import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.css']
})
export class DashboardMenuComponent implements OnInit, OnChanges {
  @Input() stats: Stats;
  @Input() statsType: string;
  percent: number;
  circleText: string;
  circleSubtext: string;

  constructor() {}

  ngOnInit() {
    this.percent = 0;
    this.circleText = '0/0';
    this.circleSubtext = '0%';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stats']) {
      this.percent = this.stats.won * 100 / (this.stats.won + this.stats.lost);
      this.circleText = this.stats.won + '/' + (this.stats.won + this.stats.lost);
      this.circleSubtext = this.percent.toFixed(0) + '%';
    }
  }

}

export interface Stats {
  won: number;
  lost: number;
}
