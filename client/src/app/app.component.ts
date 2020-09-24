import { Component, OnInit } from '@angular/core';
import { DashboardMenuComponent } from './dashboard-menu/dashboard-menu.component';
import { SignalService } from './services/signal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  last24 = {};
  allTime = {};

  constructor(private signalService: SignalService) {}
  ngOnInit() {
    this.signalService.getStats()
      .subscribe(stats => {
        this.last24 = stats.last24;
        this.allTime = stats.alltime;
      });
  }
}
